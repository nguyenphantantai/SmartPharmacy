import { Product } from '../models/schema.js';
import mongoose from 'mongoose';

/**
 * Parse dosage/strength from medicine name
 * Examples:
 * - "MALTAGIT_2500mg_500mg" -> { baseName: "MALTAGIT", dosage: "2500mg/500mg" }
 * - "Paracetamol 500mg" -> { baseName: "Paracetamol", dosage: "500mg" }
 * - "Amoxicillin 250mg/5ml" -> { baseName: "Amoxicillin", dosage: "250mg/5ml" }
 * - "SIMETHICON B 80mg" -> { baseName: "SIMETHICON B", dosage: "80mg" }
 * - "SIMETHICON_B_80mg" -> { baseName: "SIMETHICON B", dosage: "80mg" }
 */
export function parseMedicineName(medicineName: string): {
  baseName: string;
  dosage: string | null;
} {
  if (!medicineName || typeof medicineName !== 'string') {
    return { baseName: medicineName || '', dosage: null };
  }

  // Pattern to match dosage: numbers followed by units (mg, g, ml, l, mcg, iu, ui, etc.)
  // Also match patterns like "2500mg+500mg" or "2500mg 500mg"
  const dosagePattern = /(\d+(?:\.\d+)?(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?(?:mg|g|ml|l|mcg|iu|ui|%)?)?)/gi;
  const dosages = medicineName.match(dosagePattern);

  if (dosages && dosages.length > 0) {
    // Extract base name by removing dosage and common separators
    // First, normalize separators to spaces
    let baseName = medicineName
      .replace(/_/g, ' ')
      .replace(/\+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Remove dosage from name (need to handle both + and / formats)
    for (const dosage of dosages) {
      // Escape special regex characters in dosage
      const escapedDosage = dosage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Also try with + replaced by space or nothing
      const dosageVariants = [
        escapedDosage,
        escapedDosage.replace(/\\\+/g, '\\s*[+\\s]*'),
        escapedDosage.replace(/\\\+/g, ''),
      ];
      
      for (const variant of dosageVariants) {
        baseName = baseName.replace(new RegExp(variant, 'gi'), '').trim();
      }
    }

    // Remove common packaging info in parentheses: "(1 hộp x 6 viên)", "(1 hộp x 10 viên)", etc.
    // Pattern: (number + unit + x + number + unit) or variations
    baseName = baseName.replace(/\([^)]*\d+\s*(?:hộp|viên|ống|chai|gói|tuýp|tuyp)\s*x\s*\d+\s*(?:hộp|viên|ống|chai|gói|tuýp|tuyp)[^)]*\)/gi, '').trim();
    
    // Remove any remaining empty parentheses
    baseName = baseName.replace(/\(\s*\)/g, '').trim();

    // Clean up separators and extra spaces
    baseName = baseName
      .replace(/[_\-\/\+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Normalize dosage format (replace + with / for consistency, but keep original for comparison)
    const dosage = dosages.map(d => d.replace(/\s*\+\s*/g, '/')).join('/');
    return { baseName: baseName || medicineName, dosage };
  }

  // No dosage found, return cleaned name (remove underscores, normalize spaces)
  return {
    baseName: medicineName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim(),
    dosage: null
  };
}

/**
 * Normalize dosage for comparison
 * Examples:
 * - "2500mg" and "2.5g" should match
 * - "500mg" and "0.5g" should match
 */
function normalizeDosage(dosage: string): {
  value: number;
  unit: string;
}[] {
  if (!dosage) return [];

  const parts = dosage.split('/');
  return parts.map(part => {
    const match = part.match(/(\d+(?:\.\d+)?)\s*(mg|g|ml|l|mcg|iu|ui|%)/i);
    if (!match) return { value: 0, unit: '' };

    let value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    // Convert to mg for comparison (standardize)
    if (unit === 'g') {
      value = value * 1000; // g to mg
    } else if (unit === 'mcg') {
      value = value / 1000; // mcg to mg
    }

    return { value, unit: 'mg' }; // Normalize to mg
  });
}

/**
 * Check if two dosages match (within tolerance)
 */
function dosagesMatch(dosage1: string | null, dosage2: string | null, tolerance: number = 0.1): boolean {
  if (!dosage1 || !dosage2) return false;

  const norm1 = normalizeDosage(dosage1);
  const norm2 = normalizeDosage(dosage2);

  if (norm1.length !== norm2.length) return false;

  for (let i = 0; i < norm1.length; i++) {
    const diff = Math.abs(norm1[i].value - norm2[i].value);
    const avg = (norm1[i].value + norm2[i].value) / 2;
    if (avg > 0 && diff / avg > tolerance) {
      return false;
    }
  }

  return true;
}

/**
 * Normalize medicine name for comparison - ONLY KEEP LETTERS (a-z, A-Z)
 * Remove all numbers, spaces, underscores, special chars
 * This makes matching easier: "SIMETHICON B 80mg" matches "SIMETHICON_B_80mg"
 * Also handles cases where OCR misses a letter: "SIMETHICON 80mg" matches "SIMETHICON B 80mg"
 * Examples:
 * - "SIMETHICON B 80mg" -> "simethiconb"
 * - "SIMETHICON_B_80mg" -> "simethiconb"
 * - "SIMETHICON 80mg" -> "simethicon" (missing B, but will still match)
 * - "MALTAGIT 2500mg+500mg" -> "maltagit"
 * - "MALTAGIT_2500mg_500mg" -> "maltagit"
 */
function normalizeForComparison(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  // Only keep letters (a-z, A-Z), remove everything else
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, '') // Remove everything except lowercase letters
    .trim();
}

/**
 * Check if two normalized names are similar enough (allowing for 1-2 missing letters)
 * This helps match "SIMETHICON" with "SIMETHICONB" (OCR might miss a letter)
 */
function namesAreSimilar(normalized1: string, normalized2: string): boolean {
  if (normalized1 === normalized2) return true;
  
  // If one is a substring of the other (allowing for 1-2 missing letters)
  // Example: "simethicon" should match "simethiconb" (missing 'b')
  if (normalized1.length >= 3 && normalized2.length >= 3) {
    const shorter = normalized1.length < normalized2.length ? normalized1 : normalized2;
    const longer = normalized1.length >= normalized2.length ? normalized1 : normalized2;
    
    // Check if shorter is a prefix of longer (allowing 1-2 missing letters at the end)
    if (longer.startsWith(shorter) && (longer.length - shorter.length) <= 2) {
      return true;
    }
    
    // Check if they're very similar (Levenshtein distance <= 2)
    const diff = Math.abs(normalized1.length - normalized2.length);
    if (diff <= 2) {
      // Simple similarity check: if most letters match
      let matches = 0;
      const minLen = Math.min(normalized1.length, normalized2.length);
      for (let i = 0; i < minLen; i++) {
        if (normalized1[i] === normalized2[i]) matches++;
      }
      // If at least 80% of letters match, consider them similar
      if (matches / minLen >= 0.8) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Normalize dosage for comparison - keep numbers and units, normalize separators
 * Examples:
 * - "2500mg+500mg" -> "2500mg500mg" (normalize + to nothing)
 * - "2500mg/500mg" -> "2500mg500mg" (normalize / to nothing)
 * - "2500mg 500mg" -> "2500mg500mg" (normalize space to nothing)
 * - "80mg" -> "80mg"
 * 
 * This ensures "2500mg+500mg" matches "2500mg/500mg" or "2500mg 500mg"
 */
export function normalizeDosageForComparison(dosage: string | null): string {
  if (!dosage || typeof dosage !== 'string') return '';
  
  // Normalize: remove spaces, underscores, +, -, /, but keep numbers and units (mg, g, ml, etc.)
  return dosage
    .toLowerCase()
    .replace(/[_\s+\-\/]/g, '') // Remove spaces, underscores, +, -, /
    .replace(/[^a-z0-9]/g, '') // Remove all special chars except letters and numbers
    .trim();
}

/**
 * Find exact match: same name and same dosage
 */
export async function findExactMatch(
  medicineName: string,
  medicineText: string
): Promise<{
  product: any;
  matchType: 'exact' | 'name_only' | null;
  confidence: number;
} | null> {
  const { baseName, dosage } = parseMedicineName(medicineName);
  const normalizedBaseName = normalizeForComparison(baseName);
  const normalizedInputDosage = normalizeDosageForComparison(dosage);
  
  console.log(`🔍 findExactMatch - Input: "${medicineName}"`);
  console.log(`   Parsed: baseName="${baseName}", dosage="${dosage}"`);
  console.log(`   Normalized: baseName="${normalizedBaseName}", dosage="${normalizedInputDosage}"`);

  // Create search patterns - more flexible (include all variations)
  const searchPatterns = [
    baseName,
    baseName.replace(/\s+/g, '_'),
    baseName.replace(/\s+/g, ''),
    baseName.replace(/\s+/g, '+'),
    medicineName,
    medicineName.replace(/\s+/g, '_'),
    medicineName.replace(/\s+/g, ''),
    medicineName.replace(/\s+/g, '+'),
    // Also try first word only for broader search
    baseName.split(/\s+/)[0],
    medicineName.split(/\s+/)[0],
  ];

  // Remove empty patterns and duplicates
  const validPatterns = [...new Set(searchPatterns.filter(p => p && p.length >= 2))];

  // Search in Products collection
  // First, try to find products with normalized name matching
  // We'll search with multiple patterns and also do a broader search
  const allProducts: any[] = [];
  const seenIds = new Set<string>();
  
  for (const pattern of validPatterns) {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search with various separators (space, underscore, plus, etc.)
    const flexiblePattern = pattern.replace(/[\s_+]/g, '[\\s_+]*');
    const escapedFlexiblePattern = flexiblePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const products = await Product.find({
      $or: [
        { name: { $regex: `^${escapedPattern}`, $options: 'i' } },
        { name: { $regex: escapedPattern, $options: 'i' } },
        { name: { $regex: `^${escapedFlexiblePattern}`, $options: 'i' } },
        { name: { $regex: escapedFlexiblePattern, $options: 'i' } },
      ]
    }).limit(50); // Increase limit to check more products
    
    // Add unique products
    for (const product of products) {
      const productId = String(product._id);
      if (!seenIds.has(productId)) {
        seenIds.add(productId);
        allProducts.push(product);
      }
    }
  }
  
  // If still not enough, do a broader search by first word
  if (allProducts.length < 10) {
    const firstWord = baseName.split(/\s+/)[0];
    if (firstWord && firstWord.length > 2) {
      const escapedFirstWord = firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const moreProducts = await Product.find({
        name: { $regex: `^${escapedFirstWord}`, $options: 'i' }
      }).limit(30);
      
      for (const product of moreProducts) {
        const productId = String(product._id);
        if (!seenIds.has(productId)) {
          seenIds.add(productId);
          allProducts.push(product);
        }
      }
    }
  }
  
  // Check each product for exact match
  for (const product of allProducts) {
    const productParsed = parseMedicineName(product.name);
    const normalizedProductBaseName = normalizeForComparison(productParsed.baseName);
    const normalizedProductDosage = normalizeDosageForComparison(productParsed.dosage);
    
    console.log(`   Checking product: "${product.name}"`);
    console.log(`     Parsed: baseName="${productParsed.baseName}", dosage="${productParsed.dosage}"`);
    console.log(`     Normalized: baseName="${normalizedProductBaseName}", dosage="${normalizedProductDosage}"`);
    
    // Check if base names match (normalized comparison - ONLY LETTERS, no numbers/spaces/special chars)
    // Also check for similarity (allowing for 1-2 missing letters from OCR errors)
    // Special case: if product baseName contains input baseName (e.g., "paracetamolhpxvin" contains "paracetamol")
    // This handles cases like "Paracetamol_500mg (1 hộp x 6 viên )" where baseName becomes "paracetamolhpxvin"
    const baseNameMatch = normalizedProductBaseName === normalizedBaseName || 
                          namesAreSimilar(normalizedProductBaseName, normalizedBaseName) ||
                          (normalizedBaseName.length >= 5 && normalizedProductBaseName.includes(normalizedBaseName)) ||
                          (normalizedProductBaseName.length >= 5 && normalizedBaseName.includes(normalizedProductBaseName));

    if (baseNameMatch) {
      // Check dosage match (normalized comparison - only numbers and units)
      if (normalizedInputDosage && normalizedProductDosage) {
        // Both have dosage - compare normalized versions
        if (normalizedInputDosage === normalizedProductDosage) {
          // Exact match: same name and same dosage
          console.log(`   ✅ EXACT MATCH FOUND: ${product.name}`);
          return {
            product,
            matchType: 'exact',
            confidence: 0.95
          };
        } else {
          // Name matches but dosage different - still good match
          console.log(`   ✅ NAME MATCH (dosage different): ${product.name}`);
          return {
            product,
            matchType: 'name_only',
            confidence: 0.80
          };
        }
      } else if (!normalizedInputDosage || !normalizedProductDosage) {
        // One or both don't have dosage info - still good match
        console.log(`   ✅ NAME MATCH (no dosage info): ${product.name}`);
        return {
          product,
          matchType: 'name_only',
          confidence: 0.85
        };
      }
    }
  }

  return null;
}

/**
 * Find similar medicines (same base name but different dosage, or same category/description)
 */
export async function findSimilarMedicines(
  medicineName: string,
  medicineText: string,
  limit: number = 5
): Promise<any[]> {
  const { baseName, dosage } = parseMedicineName(medicineName);
  const normalizedBaseName = normalizeForComparison(baseName);

  // First, try to find products with same base name but different dosage
  const searchPatterns = [
    baseName,
    baseName.replace(/\s+/g, '_'),
    baseName.replace(/\s+/g, ''),
    baseName.replace(/\s+/g, '+'),
  ].filter(p => p && p.length >= 2);

  const similarProducts: any[] = [];
  console.log(`🔍 Finding similar medicines for baseName: "${baseName}", normalized: "${normalizedBaseName}"`);

  const allProducts: any[] = [];
  const seenIds = new Set<string>();
  
  for (const pattern of searchPatterns) {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search with various separators (space, underscore, plus, etc.)
    const flexiblePattern = pattern.replace(/[\s_+]/g, '[\\s_+]*');
    const escapedFlexiblePattern = flexiblePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const products = await Product.find({
      $or: [
        { name: { $regex: `^${escapedPattern}`, $options: 'i' } },
        { name: { $regex: escapedPattern, $options: 'i' } },
        { name: { $regex: `^${escapedFlexiblePattern}`, $options: 'i' } },
        { name: { $regex: escapedFlexiblePattern, $options: 'i' } },
      ]
    }).limit(limit * 5); // Increase limit to find more matches

    console.log(`  Pattern "${pattern}": Found ${products.length} products`);

    // Add unique products
    for (const product of products) {
      const productId = String(product._id);
      if (!seenIds.has(productId)) {
        seenIds.add(productId);
        allProducts.push(product);
      }
    }

    if (allProducts.length >= limit * 3) break;
  }
  
  // Check each product for similarity
  for (const product of allProducts) {
    const productParsed = parseMedicineName(product.name);
    const normalizedProductBaseName = normalizeForComparison(productParsed.baseName);
    const normalizedProductDosage = normalizeDosageForComparison(productParsed.dosage);
    const normalizedInputDosage = normalizeDosageForComparison(dosage);
    
    // Check if base names match (normalized comparison - ONLY LETTERS, no numbers/spaces/special chars)
    // Also check for similarity (allowing for 1-2 missing letters from OCR errors)
    const baseNameMatch = normalizedProductBaseName === normalizedBaseName || 
                          namesAreSimilar(normalizedProductBaseName, normalizedBaseName);
    console.log(`    Product: "${product.name}" -> baseName: "${productParsed.baseName}", normalized: "${normalizedProductBaseName}", match: ${baseNameMatch}`);

    if (baseNameMatch) {
      // Same base name - add it as similar medicine
      // Check if already added
      const alreadyAdded = similarProducts.some(p => 
        String(p._id) === String(product._id)
      );
      
      if (!alreadyAdded) {
        // Check if dosage also matches (normalized)
        const dosageMatches = normalizedInputDosage && normalizedProductDosage 
          ? normalizedInputDosage === normalizedProductDosage
          : false;
        
        similarProducts.push({
          ...product.toObject(),
          matchReason: dosageMatches ? 'same_name_same_dosage' : 'same_name_different_dosage',
          confidence: dosageMatches ? 0.90 : 0.75
        });
        console.log(`    ✅ Added: ${product.name} (dosage match: ${dosageMatches})`);
      }
    }
    
    if (similarProducts.length >= limit) break;
  }

  // If not enough results, search by first word (broader search)
  if (similarProducts.length < limit) {
    const firstWord = baseName.split(/\s+/)[0];
    if (firstWord && firstWord.length > 2) {
      const escapedFirstWord = firstWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const moreProducts = await Product.find({
        $or: [
          { name: { $regex: `^${escapedFirstWord}`, $options: 'i' } },
          { name: { $regex: escapedFirstWord, $options: 'i' } },
          { description: { $regex: escapedFirstWord, $options: 'i' } },
        ]
      })
      .limit((limit - similarProducts.length) * 2);

      for (const product of moreProducts) {
        // Avoid duplicates
        const alreadyAdded = similarProducts.some(p => 
          String(p._id) === String(product._id)
        );
        
        if (!alreadyAdded) {
          const productParsed = parseMedicineName(product.name);
          const normalizedProductBaseName = normalizeForComparison(productParsed.baseName);
          
          // Only add if it's somewhat similar (at least first word matches)
          if (normalizedProductBaseName.startsWith(normalizeForComparison(firstWord))) {
            similarProducts.push({
              ...product.toObject(),
              matchReason: 'similar_name',
              confidence: 0.6
            });
          }
        }
      }
    }
  }

  // Also search in medicines collection if available - Tìm thuốc cùng công dụng và hàm lượng
  const db = mongoose.connection.db;
  if (db && similarProducts.length < limit) {
    const medicinesCollection = db.collection('medicines');
    
    // First, try to find medicine with same base name to get indication/groupTherapeutic
    const firstWord = baseName.split(/\s+/)[0];
    let targetMedicine = null;
    
    if (firstWord && firstWord.length > 2) {
      // Tìm thuốc có cùng tên để lấy thông tin công dụng
      targetMedicine = await medicinesCollection.findOne({
        $or: [
          { name: { $regex: `^${firstWord}`, $options: 'i' } },
          { genericName: { $regex: `^${firstWord}`, $options: 'i' } },
          { name: { $regex: firstWord, $options: 'i' } }
        ]
      });
      
      // Nếu tìm thấy thuốc, tìm thuốc cùng công dụng và hàm lượng
      if (targetMedicine && (targetMedicine.indication || targetMedicine.groupTherapeutic)) {
        console.log(`🔍 Found target medicine: ${targetMedicine.name}, indication: ${targetMedicine.indication}, groupTherapeutic: ${targetMedicine.groupTherapeutic}`);
        
        // Tìm thuốc cùng công dụng (indication hoặc groupTherapeutic) và cùng hàm lượng
        const searchCriteria: any = {
          _id: { $ne: targetMedicine._id }
        };
        
        // Thêm điều kiện tìm cùng công dụng
        const orConditions: any[] = [];
        if (targetMedicine.indication) {
          orConditions.push({ indication: targetMedicine.indication });
        }
        if (targetMedicine.groupTherapeutic) {
          orConditions.push({ groupTherapeutic: targetMedicine.groupTherapeutic });
        }
        if (targetMedicine.activeIngredient) {
          orConditions.push({ activeIngredient: targetMedicine.activeIngredient });
        }
        
        if (orConditions.length > 0) {
          searchCriteria.$or = orConditions;
        }
        
        // Tìm thuốc cùng công dụng
        const medicinesWithSameIndication = await medicinesCollection.find(searchCriteria)
          .limit(20)
          .toArray();
        
        console.log(`📦 Found ${medicinesWithSameIndication.length} medicines with same indication/groupTherapeutic`);
        
        // Lọc và ưu tiên thuốc cùng hàm lượng
        const normalizedInputDosage = normalizeDosageForComparison(dosage);
        const medicinesWithSameDosage: any[] = [];
        const medicinesDifferentDosage: any[] = [];
        
        for (const medicine of medicinesWithSameIndication) {
          // Tìm product tương ứng
          const product = await Product.findOne({
            $or: [
              { name: { $regex: medicine.name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
              { description: { $regex: medicine.name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
            ]
          });
          
          if (product) {
            const productParsed = parseMedicineName(product.name);
            const normalizedProductDosage = normalizeDosageForComparison(productParsed.dosage);
            
            // Kiểm tra đã thêm chưa
            const alreadyAdded = similarProducts.some(p => 
              String(p._id) === String(product._id)
            );
            
            if (!alreadyAdded) {
              const medicineData = {
                ...product.toObject(),
                matchReason: normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage
                  ? 'same_indication_same_dosage'
                  : 'same_indication_different_dosage',
                confidence: normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage ? 0.85 : 0.70
              };
              
              if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                medicinesWithSameDosage.push(medicineData);
              } else {
                medicinesDifferentDosage.push(medicineData);
              }
            }
          }
        }
        
        // Ưu tiên thuốc cùng hàm lượng
        const prioritizedMedicines = [...medicinesWithSameDosage, ...medicinesDifferentDosage];
        for (const med of prioritizedMedicines) {
          if (similarProducts.length >= limit) break;
          similarProducts.push(med);
          console.log(`    ✅ Added by indication: ${med.name} (${med.matchReason})`);
        }
      }
    }
    
    // Fallback: Tìm theo tên nếu chưa đủ
    if (similarProducts.length < limit && firstWord && firstWord.length > 2) {
      const similarMedicines = await medicinesCollection.find({
        name: { $regex: firstWord, $options: 'i' }
      })
      .limit(limit - similarProducts.length)
      .toArray();

      for (const medicine of similarMedicines) {
        // Check if already in similarProducts
        const existing = similarProducts.some(p => 
          String(p._id) === String(medicine._id) ||
          normalizeForComparison(p.name || '') === normalizeForComparison(medicine.name || '')
        );

        if (!existing) {
          // Try to find corresponding product
          const product = await Product.findOne({
            $or: [
              { name: { $regex: medicine.name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
              { description: { $regex: medicine.name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
            ]
          });

          if (product) {
            // Check if already added
            const alreadyAdded = similarProducts.some(p => 
              String(p._id) === String(product._id)
            );
            
            if (!alreadyAdded) {
              similarProducts.push({
                ...product.toObject(),
                matchReason: 'from_medicines_collection',
                confidence: 0.65
              });
            }
          } else {
            // Create product-like object from medicine
            // Normalize imageUrl
            let imageUrl = medicine.imageUrl || medicine.image || medicine.imagePath || '';
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `/medicine-images/${imageUrl}`;
            }
            if (!imageUrl || imageUrl === '') {
              imageUrl = '/medicine-images/default-medicine.jpg';
            }

            similarProducts.push({
              _id: medicine._id,
              name: medicine.name || medicineText,
              price: Number(medicine.price || medicine.salePrice || 0),
              originalPrice: Number(medicine.originalPrice || medicine.price || medicine.salePrice || 0),
              unit: medicine.unit || 'đơn vị',
              inStock: medicine.stock !== undefined ? medicine.stock > 0 : true,
              stockQuantity: Number(medicine.stock || 0),
              isPrescription: medicine.isPrescription || false,
              imageUrl: imageUrl,
              description: medicine.description || medicine.strength || '',
              brand: medicine.brand || medicine.manufacturer || '',
              matchReason: 'from_medicines_collection',
              confidence: 0.65
            });
          }
        }
      }
    }
  }

  return similarProducts.slice(0, limit);
}

