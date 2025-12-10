import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product, Category } from '../models/schema.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { SupabaseStorageService } from '../services/supabaseService.js';

export function toProductDto(p: any) {
  return {
    id: String(p._id),
    name: p.name,
    description: p.description,
    price: typeof p.price === 'number' ? p.price.toString() : p.price,
    originalPrice: p.originalPrice != null ? (typeof p.originalPrice === 'number' ? p.originalPrice.toString() : p.originalPrice) : undefined,
    discountPercentage: p.discountPercentage ?? 0,
    imageUrl: p.imageUrl,
    brand: p.brand,
    unit: p.unit ?? 'Hộp',
    inStock: !!p.inStock,
    stockQuantity: p.stockQuantity ?? 0,
    isHot: !!p.isHot,
    isNewProduct: !!p.isNewProduct,
    isPrescription: !!p.isPrescription,
    // Expiration tracking fields
    expirationDate: p.expirationDate,
    batchNumber: p.batchNumber,
    manufacturingDate: p.manufacturingDate,
    supplierId: p.supplierId ? String(p.supplierId) : undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    categoryId: p.categoryId ? String(p.categoryId) : undefined,
  } as any;
}

export class ProductController {
  // Get all products with pagination and filters
  static async getProducts(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category,
        categoryName, // Filter by categoryName from medicines collection
        brand,
        minPrice,
        maxPrice,
        inStock,
        isHot,
        isNew,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      const conditions: any = {};

      // Search by name or description
      // Nếu có search và user đã đăng nhập, sử dụng smartSearch
      if (search) {
        const searchTerm = String(search).trim();
        const userId = (req as AuthenticatedRequest).user?.id;
        
        // Nếu có userId, sử dụng smartSearch với ranking
        if (userId && searchTerm.length > 0) {
          try {
            const { RecommendationService } = await import('../services/recommendationService.js');
            const smartResults = await RecommendationService.smartSearch(
              searchTerm,
              userId,
              Number(limit) * Number(page) // Lấy đủ để paginate
            );
            
            // Nếu có kết quả từ smartSearch, trả về luôn
            if (smartResults.length > 0) {
              const offset = (Number(page) - 1) * Number(limit);
              const paginatedResults = smartResults.slice(offset, offset + Number(limit));
              
              const productsDto = paginatedResults.map(p => toProductDto(p));
              
              return res.json({
                success: true,
                data: {
                  products: productsDto,
                  pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: smartResults.length,
                    pages: Math.ceil(smartResults.length / Number(limit)),
                  },
                },
              });
            }
          } catch (error) {
            console.error('Error in smartSearch, falling back to normal search:', error);
            // Fallback to normal search
          }
        }
        
        // Normal search (fallback hoặc không có userId)
        conditions.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      // Filter by category
      if (category) {
        conditions.categoryId = category;
      }

      // Filter by category slug
      if (req.query.categorySlug) {
        const categoryDoc = await Category.findOne({ slug: req.query.categorySlug });
        if (categoryDoc) {
          conditions.categoryId = categoryDoc._id;
        }
      }

      // Filter by brand
      if (brand) {
        conditions.brand = { $regex: String(brand), $options: 'i' };
      }

      // Filter by price range
      if (minPrice || maxPrice) {
        conditions.price = {} as any;
        if (minPrice) (conditions.price as any).$gte = Number(minPrice);
        if (maxPrice) (conditions.price as any).$lte = Number(maxPrice);
      }

      // Filter by stock status
      if (inStock !== undefined) {
        conditions.inStock = inStock === 'true';
      }

      // Filter by hot products
      if (isHot !== undefined) {
        conditions.isHot = isHot === 'true';
      }

      // Filter by new products
      if (isNew !== undefined) {
        conditions.isNewProduct = isNew === 'true';
      }

      // Build query
      // Nếu sort theo createdAt nhưng có products không có createdAt, cần xử lý đặc biệt
      let sort: Record<string, 1 | -1> | any = {};
      if (sortBy === 'createdAt') {
        // Sort theo createdAt DESC, nhưng nếu createdAt null thì sort theo _id DESC
        sort = {
          createdAt: sortOrder === 'asc' ? 1 : -1,
          _id: sortOrder === 'asc' ? 1 : -1, // Fallback nếu createdAt null
        };
      } else {
        sort = { [String(sortBy)]: sortOrder === 'asc' ? 1 : -1 };
      }

      // Nếu có filter categoryName, cần query medicines collection trước để lấy danh sách tên medicines
      // Sau đó query products với điều kiện name match với medicines đó
      // Nếu không có filter categoryName, có thể paginate trực tiếp
      let productsDocs: any[];
      let shouldFilterAfter = false;
      let medicineNamesForCategory: string[] = []; // Danh sách tên medicines có categoryName
      
      if (categoryName) {
        const categoryNameFilter = String(categoryName).trim();
        console.log(`🔍 Filtering by categoryName "${categoryNameFilter}": Querying medicines first...`);
        
        // Query medicines collection để lấy danh sách tên medicines có categoryName đó
        const db = mongoose.connection.db;
        const medicinesCollection = db?.collection('medicines');
        
        if (medicinesCollection) {
          try {
            const medicinesWithCategory = await medicinesCollection.find(
              {
                name: { $exists: true, $ne: null },
                $or: [
                  { category: { $regex: categoryNameFilter, $options: 'i' } },
                  { mainCategory: { $regex: categoryNameFilter, $options: 'i' } }
                ]
              },
              {
                projection: { name: 1 },
                limit: 10000 // Giới hạn tối đa
              }
            ).toArray();
            
            medicineNamesForCategory = medicinesWithCategory
              .map(m => m.name?.trim())
              .filter(name => name && name.length > 0);
            
            console.log(`✅ Found ${medicineNamesForCategory.length} medicines with category "${categoryNameFilter}"`);
            
            // Nếu có medicines, query products với điều kiện name match
            if (medicineNamesForCategory.length > 0) {
              // Tạo regex patterns để match tên products với tên medicines
              // Match exact name hoặc clean name (loại bỏ phần trong ngoặc)
              const namePatterns = medicineNamesForCategory.map(name => {
                const cleanName = name.split('(')[0].trim();
                return {
                  exact: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
                  clean: cleanName !== name ? new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') : null
                };
              });
              
              // Query products với điều kiện name match với bất kỳ pattern nào
              const nameConditions = namePatterns.map(pattern => {
                if (pattern.clean) {
                  return {
                    $or: [
                      { name: { $regex: pattern.exact } },
                      { name: { $regex: pattern.clean } }
                    ]
                  };
                }
                return { name: { $regex: pattern.exact } };
              });
              
              // Combine với conditions hiện tại
              // Nếu conditions đã có $or, cần combine đúng cách
              let combinedConditions: any = { ...conditions };
              
              if (conditions.$or && Array.isArray(conditions.$or)) {
                // Nếu đã có $or, thêm nameConditions vào
                combinedConditions.$or = [
                  ...conditions.$or,
                  ...nameConditions
                ];
              } else {
                // Nếu chưa có $or, tạo mới
                combinedConditions.$or = nameConditions;
              }
              
              // Query products với pagination
              productsDocs = await Product.find(combinedConditions)
                .sort(sort)
                .skip(offset)
                .limit(Number(limit))
                .lean();
              
              console.log(`✅ Loaded ${productsDocs.length} products matching medicines with category "${categoryNameFilter}"`);
            } else {
              // Không có medicines với category này, trả về empty
              productsDocs = [];
              console.log(`⚠️ No medicines found with category "${categoryNameFilter}"`);
            }
          } catch (error) {
            console.error('❌ Error querying medicines for category filter:', error);
            // Fallback: Load nhiều products và filter sau
            const fetchLimit = Math.min(Number(limit) * 10, 2000); // Tăng lên 2000 products
        productsDocs = await Product.find(conditions)
          .sort(sort)
              .limit(fetchLimit)
          .lean();
        shouldFilterAfter = true;
            console.log(`🔍 Fallback: Loaded ${productsDocs.length} products for filtering`);
          }
        } else {
          // Không có medicines collection, fallback
          const fetchLimit = Math.min(Number(limit) * 10, 2000);
          productsDocs = await Product.find(conditions)
            .sort(sort)
            .limit(fetchLimit)
            .lean();
          shouldFilterAfter = true;
          console.log(`🔍 Fallback: Loaded ${productsDocs.length} products for filtering`);
        }
      } else {
        // Không có filter categoryName, paginate trực tiếp
        productsDocs = await Product.find(conditions)
          .sort(sort)
          .skip(offset)
          .limit(Number(limit))
          .lean();
      }
      
      // Lấy category từ medicines collection - tạo map để tối ưu performance
      const db = mongoose.connection.db;
      const medicinesCollection = db?.collection('medicines');
      const medicineCategoryMap = new Map<string, string>(); // Map từ product name -> category
      
      if (medicinesCollection && productsDocs.length > 0) {
        try {
          console.log(`🔍 Fetching medicines for category mapping (${productsDocs.length} products)...`);
          const startTime = Date.now();
          
          // Tối ưu: Chỉ lấy name và category fields, không cần tất cả fields
          // Và chỉ lấy medicines có name và category
          const medicinesCursor = medicinesCollection.find(
            { 
              name: { $exists: true, $ne: null },
              $or: [
                { category: { $exists: true, $ne: null } },
                { mainCategory: { $exists: true, $ne: null } }
              ]
            },
            { 
              projection: { name: 1, category: 1, mainCategory: 1 },
              limit: 10000 // Giới hạn tối đa 10000 medicines để tránh quá tải
            }
          );
          
          // Tạo map từ medicine name -> category (chỉ exact match và clean name match)
          const medicineNameToCategory = new Map<string, string>();
          const medicineCleanNameToCategory = new Map<string, string>(); // Map cho clean names
          
          let medicineCount = 0;
          for await (const medicine of medicinesCursor) {
            if (!medicine.name) continue;
            
            const medName = medicine.name.trim();
            const medNameLower = medName.toLowerCase();
              const category = medicine.category || medicine.mainCategory;
            
              if (category) {
              // Exact match map
              medicineNameToCategory.set(medNameLower, category);
              
              // Clean name map (loại bỏ phần trong ngoặc)
              const cleanMedName = medNameLower.split('(')[0].trim();
              if (cleanMedName && cleanMedName !== medNameLower) {
                // Chỉ lưu clean name nếu khác với name gốc
                if (!medicineCleanNameToCategory.has(cleanMedName)) {
                  medicineCleanNameToCategory.set(cleanMedName, category);
                }
              }
            }
            medicineCount++;
          }
          
          const fetchTime = Date.now() - startTime;
          console.log(`✅ Loaded ${medicineCount} medicines in ${fetchTime}ms`);
          
          // Match products với medicines - tối ưu chỉ match exact và clean name
          const matchStartTime = Date.now();
          productsDocs.forEach(product => {
            if (!product.name) return;
            
            const productName = product.name.trim();
            const productNameLower = productName.toLowerCase();
            
            // 1. Thử exact match (case-insensitive) - O(1)
            let category = medicineNameToCategory.get(productNameLower);
            
            // 2. Nếu không tìm thấy, thử clean name match - O(1)
            if (!category) {
              const cleanProductName = productNameLower.split('(')[0].trim();
              category = medicineCleanNameToCategory.get(cleanProductName);
            }
            
            // Lưu category vào map nếu tìm thấy
            if (category) {
              medicineCategoryMap.set(productName, category);
            }
          });
          
          const matchTime = Date.now() - matchStartTime;
          console.log(`📊 Category mapping: ${medicineCategoryMap.size}/${productsDocs.length} products matched in ${matchTime}ms`);
          
          // Log một vài ví dụ để debug (chỉ log nếu có matches)
          if (medicineCategoryMap.size > 0 && medicineCategoryMap.size <= 20) {
            const sampleEntries = Array.from(medicineCategoryMap.entries()).slice(0, 5);
            console.log('📝 Sample category mappings:');
            sampleEntries.forEach(([name, cat]) => {
              console.log(`   "${name}" → "${cat}"`);
            });
          }
        } catch (error) {
          console.error('❌ Error fetching medicines for category mapping:', error);
          // Không throw error, tiếp tục với products không có category
        }
      }
      
      // Map products và thêm categoryName từ medicines - đã được match ở trên
      let productsList = productsDocs.map(product => {
        const dto = toProductDto(product);
        
        // Debug: Log imageUrl để kiểm tra
        if (product.imageUrl) {
          const isSupabaseUrl = product.imageUrl.startsWith('https://') && product.imageUrl.includes('supabase');
          if (isSupabaseUrl) {
            console.log(`✅ Product "${product.name}" has Supabase URL: ${product.imageUrl.substring(0, 80)}...`);
          } else {
            console.log(`⚠️  Product "${product.name}" has non-Supabase URL: ${product.imageUrl}`);
          }
        } else {
          console.log(`❌ Product "${product.name}" has no imageUrl`);
        }
        
        // Lấy category từ map (đã được match từ medicines collection ở trên)
        const productName = product.name?.trim() || '';
        const categoryFromMedicine = medicineCategoryMap.get(productName);
        
        if (categoryFromMedicine) {
          (dto as any).categoryName = categoryFromMedicine;
          (dto as any).category = categoryFromMedicine;
        } else {
          // Nếu không tìm thấy, để undefined để frontend có thể xử lý
          (dto as any).categoryName = undefined;
          (dto as any).category = undefined;
        }
        
        return dto;
      });
      
      // Khai báo totalCount và totalPages trước khi sử dụng
      let totalCount: number;
      let totalPages: number;
      
      // Filter by categoryName nếu có query parameter
      // Lưu ý: Nếu đã query bằng medicine names (medicineNamesForCategory.length > 0), 
      // thì products đã được filter ở database level, không cần filter lại ở đây
      if (categoryName && shouldFilterAfter) {
        // Chỉ filter nếu đang dùng fallback method (load nhiều products và filter sau)
        const categoryNameFilter = String(categoryName).trim();
        const originalLength = productsList.length;
        productsList = productsList.filter((p: any) => {
          const productCategory = p.categoryName || p.category || '';
          if (!productCategory) return false;
          
          // Case-insensitive match
          return productCategory.toLowerCase().includes(categoryNameFilter.toLowerCase()) ||
                 categoryNameFilter.toLowerCase().includes(productCategory.toLowerCase());
        });
        
        console.log(`🔍 Filtered by categoryName "${categoryNameFilter}": ${originalLength} → ${productsList.length} products`);
        
        // Paginate sau khi filter
          const totalFiltered = productsList.length;
          const startIndex = offset;
          const endIndex = offset + Number(limit);
          productsList = productsList.slice(startIndex, endIndex);
          
          // Cập nhật total count và pages
          totalCount = totalFiltered;
          totalPages = Math.ceil(totalFiltered / Number(limit));
      } else if (categoryName && !shouldFilterAfter) {
        // Đã query bằng medicine names, products đã được filter ở database
        // Chỉ cần đảm bảo totalCount đã được tính (đã tính ở phần trên)
        // Không cần filter lại
        console.log(`✅ Products already filtered by medicine names query, no need to filter again`);
      }
      
      // Log để kiểm tra các products có category "Thuốc ngừa thai"
      const contraceptivesInResponse = productsList.filter((p: any) => 
        p.categoryName === "Thuốc ngừa thai" || p.category === "Thuốc ngừa thai"
      );
      if (contraceptivesInResponse.length > 0) {
        console.log(`\n✅ Products with "Thuốc ngừa thai" in response: ${contraceptivesInResponse.length}`);
        contraceptivesInResponse.forEach((p: any) => {
          console.log(`   - "${p.name}" (categoryName: "${p.categoryName}")`);
        });
      } else if (categoryName && categoryName.toString().toLowerCase().includes('ngừa thai')) {
        console.log(`\n⚠️ No products with "Thuốc ngừa thai" found after filtering`);
      }

      // Get total count - nếu có filter categoryName, đã được tính ở trên
      // Nếu không có filter categoryName, dùng count từ database
      if (!categoryName) {
        totalCount = await Product.countDocuments(conditions);
        totalPages = Math.ceil(totalCount / Number(limit));
      } else {
        // Nếu có filter categoryName và đã query bằng medicine names, cần count lại
        if (medicineNamesForCategory.length > 0 && !shouldFilterAfter) {
          // Đã query trực tiếp bằng medicine names, cần count với cùng điều kiện
          const categoryNameFilter = String(categoryName).trim();
          const db = mongoose.connection.db;
          const medicinesCollection = db?.collection('medicines');
          
          if (medicinesCollection) {
            try {
              const medicinesWithCategory = await medicinesCollection.find(
                {
                  name: { $exists: true, $ne: null },
                  $or: [
                    { category: { $regex: categoryNameFilter, $options: 'i' } },
                    { mainCategory: { $regex: categoryNameFilter, $options: 'i' } }
                  ]
                },
                { projection: { name: 1 } }
              ).toArray();
              
              const medicineNames = medicinesWithCategory
                .map(m => m.name?.trim())
                .filter(name => name && name.length > 0);
              
              if (medicineNames.length > 0) {
                const namePatterns = medicineNames.map(name => {
                  const cleanName = name.split('(')[0].trim();
                  return {
                    exact: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
                    clean: cleanName !== name ? new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') : null
                  };
                });
                
                const nameConditions = namePatterns.map(pattern => {
                  if (pattern.clean) {
                    return {
                      $or: [
                        { name: { $regex: pattern.exact } },
                        { name: { $regex: pattern.clean } }
                      ]
                    };
                  }
                  return { name: { $regex: pattern.exact } };
                });
                
                let combinedConditions: any = { ...conditions };
                if (conditions.$or && Array.isArray(conditions.$or)) {
                  combinedConditions.$or = [
                    ...conditions.$or,
                    ...nameConditions
                  ];
                } else {
                  combinedConditions.$or = nameConditions;
                }
                
                totalCount = await Product.countDocuments(combinedConditions);
        totalPages = Math.ceil(totalCount / Number(limit));
              } else {
                totalCount = 0;
                totalPages = 0;
              }
            } catch (error) {
              console.error('❌ Error counting products for category filter:', error);
              // Fallback: totalCount đã được tính ở trên khi filter
            }
          }
        } else {
          // Nếu đã filter sau, totalCount đã được tính ở trên
          // Không cần làm gì
        }
      }

      res.json({
        success: true,
        data: {
          products: productsList,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: totalCount,
            pages: totalPages,
          },
        },
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get single product by ID - lấy từ medicines collection
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('🔍 [ProductController] getProductById called');
      console.log('📦 [ProductController] Product ID from params:', id);
      console.log('📦 [ProductController] Product ID type:', typeof id);
      console.log('📦 [ProductController] Product ID length:', id?.length);

      // Validate MongoDB ObjectId format
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      console.log('📦 [ProductController] Is valid MongoDB ObjectId:', isValidObjectId);

      if (!isValidObjectId) {
        console.log('❌ [ProductController] Invalid MongoDB ObjectId format');
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
      }

      // Lấy từ medicines collection trước
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      const medicinesCollection = db.collection('medicines');
      console.log('🔎 [ProductController] Searching in medicines collection by ID...');
      let medicine = await medicinesCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
      console.log('📦 [ProductController] Medicine found by ID:', medicine ? 'YES' : 'NO');

      // Declare productDoc at function scope
      let productDoc: any = null;

      // Nếu không tìm thấy bằng ID, thử tìm bằng các cách khác
      if (!medicine) {
        console.log('🔎 [ProductController] Not found by ID, trying other methods...');
        
        // Thử tìm trong products để lấy name
        productDoc = await Product.findById(id).lean();
        console.log('📦 [ProductController] Product found:', productDoc ? 'YES' : 'NO');
        
        if (productDoc && productDoc.name) {
          console.log('🔎 [ProductController] Product name:', productDoc.name);
          
          // Tìm medicine bằng name (exact match)
          medicine = await medicinesCollection.findOne({ name: productDoc.name });
          console.log('📦 [ProductController] Medicine found by exact name:', medicine ? 'YES' : 'NO');
          
          if (!medicine) {
            // Tìm bằng clean name (loại bỏ phần trong ngoặc đơn)
            const cleanName = productDoc.name.split('(')[0].trim();
            console.log('🔎 [ProductController] Trying clean name:', cleanName);
            medicine = await medicinesCollection.findOne({ name: cleanName });
            console.log('📦 [ProductController] Medicine found by clean name:', medicine ? 'YES' : 'NO');
          }
          
          if (!medicine) {
            // Tìm bằng regex (case insensitive, partial match)
            const cleanName = productDoc.name.split('(')[0].trim();
            const escapedName = cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            medicine = await medicinesCollection.findOne({ 
              name: { $regex: new RegExp(escapedName, 'i') } 
            });
            console.log('📦 [ProductController] Medicine found by regex:', medicine ? 'YES' : 'NO');
          }
        }
        
        // Nếu vẫn không tìm thấy, thử tìm tất cả medicines và log để debug
        if (!medicine) {
          console.log('⚠️ [ProductController] Medicine not found, listing all medicines...');
          const allMedicines = await medicinesCollection.find({}).limit(5).toArray();
          console.log('📦 [ProductController] Sample medicines:', allMedicines.map(m => ({
            _id: String(m._id),
            name: m.name
          })));
        }
      }

      // Lấy productDoc nếu chưa có
      if (!productDoc && !medicine) {
        productDoc = await Product.findById(id).lean();
      }

      // Nếu medicine được tìm thấy nhưng productDoc chưa có, lấy để lấy category
      if (medicine && !productDoc) {
        productDoc = await Product.findById(id).lean();
      }

      if (!medicine && !productDoc) {
        console.log('❌ [ProductController] Product not found in both medicines and products');
        console.log('📦 [ProductController] Searched ID:', id);
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      
      // Ưu tiên dùng medicine, nếu không có thì mới dùng product
      if (!medicine) {
        console.log('⚠️ [ProductController] Medicine not found, will use product data');
      }

      // Nếu có medicine, dùng dữ liệu từ medicine
      if (medicine) {
        console.log('✅ [ProductController] Medicine found successfully');
        console.log('📦 [ProductController] Medicine object keys:', Object.keys(medicine));
        console.log('📦 [ProductController] Medicine full object:', JSON.stringify(medicine, null, 2));
        console.log('📦 [ProductController] Medicine name:', medicine.name);
        console.log('📦 [ProductController] Medicine brand:', medicine.brand);
        console.log('📦 [ProductController] Medicine manufacturer:', medicine.manufacturer);
        console.log('📦 [ProductController] Medicine productCode:', medicine.productCode);
        console.log('📦 [ProductController] Medicine description:', medicine.description);
        console.log('📦 [ProductController] Medicine activeIngredient:', medicine.activeIngredient);
        console.log('📦 [ProductController] Medicine indications:', medicine.indications);
        console.log('📦 [ProductController] Medicine uses:', medicine.uses);
        console.log('📦 [ProductController] Medicine strength:', medicine.strength);
        console.log('📦 [ProductController] Medicine category:', medicine.category);

        // Lấy category từ product nếu có
        const productFromDb = productDoc || await Product.findById(id).lean();
        const category = productFromDb ? await Category.findById(productFromDb.categoryId).lean() : null;
        console.log('📦 [ProductController] Category from product:', category?.name);

        // Tra tên nhà sản xuất từ manufacturers collection
        let manufacturerName = '';
        if (medicine.manufacturerId) {
          try {
            const db = mongoose.connection.db;
            if (db) {
              const manufacturersCollection = db.collection('manufacturers');
              // manufacturerId có thể là string hoặc ObjectId
              const manufacturerId = typeof medicine.manufacturerId === 'string' 
                ? new mongoose.Types.ObjectId(medicine.manufacturerId)
                : medicine.manufacturerId;
              
              const manufacturer = await manufacturersCollection.findOne({ _id: manufacturerId });
              if (manufacturer && manufacturer.name) {
                manufacturerName = manufacturer.name;
                console.log('📦 [ProductController] Manufacturer name found:', manufacturerName);
              } else {
                console.log('⚠️ [ProductController] Manufacturer not found for ID:', medicine.manufacturerId);
                manufacturerName = medicine.manufacturer || medicine.brand || '';
              }
            }
          } catch (error: any) {
            console.error('❌ [ProductController] Error looking up manufacturer:', error.message);
            manufacturerName = medicine.manufacturer || medicine.brand || '';
          }
        } else {
          manufacturerName = medicine.manufacturer || medicine.brand || '';
        }

        // Xử lý imageUrl - normalize để đảm bảo format đúng
        let imageUrl = medicine.image || medicine.imageUrl || medicine.imagePath || '';
        
        // Nếu imageUrl là empty hoặc null, dùng default
        if (!imageUrl || imageUrl.trim() === '') {
          imageUrl = '/medicine-images/default-medicine.jpg';
        } 
        // Nếu là base64 data (data:image/...), upload lên Supabase và cập nhật database
        else if (imageUrl.startsWith('data:image/')) {
          try {
            // Extract base64 data và mime type
            const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1]; // jpeg, png, etc.
              const base64Data = matches[2];
              
              // Tạo tên file từ medicine name
              const medId = medicine._id ? String(medicine._id) : String(medicine.id);
              const safeName = (medicine.name || 'medicine')
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toLowerCase();
              const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
              const filename = `${safeName}_${medId}.${extension}`;
              const supabasePath = `medicines/${filename}`;
              
              // Kiểm tra xem file đã tồn tại trên Supabase chưa
              const fileExists = await SupabaseStorageService.fileExists('medicine-images', supabasePath);
              
              // Upload lên Supabase nếu chưa tồn tại
              if (!fileExists) {
                try {
                  const { url } = await SupabaseStorageService.uploadBase64Image(
                    'medicine-images',
                    supabasePath,
                    imageUrl
                  );
                  imageUrl = url;
                  console.log(`📷 Uploaded base64 image to Supabase for ${medicine.name} -> ${url}`);
                  
                  // CẬP NHẬT DATABASE: Thay thế base64 bằng URL trong medicines collection
                  const db = mongoose.connection.db;
                  if (db) {
                    const medicinesCollection = db.collection('medicines');
                    await medicinesCollection.updateOne(
                      { _id: medicine._id },
                      { $set: { imageUrl: url, image: url, imagePath: url } }
                    );
                    console.log(`✅ Updated database with Supabase URL for ${medicine.name}`);
                  }
                } catch (supabaseError: any) {
                  console.error(`❌ Error uploading to Supabase:`, supabaseError.message);
                  // Không fallback, chỉ log lỗi và dùng default
                  imageUrl = '/medicine-images/default-medicine.jpg';
                }
              } else {
                // File đã tồn tại, lấy public URL
                imageUrl = SupabaseStorageService.getPublicUrl('medicine-images', supabasePath);
                console.log(`📷 Using existing Supabase image for ${medicine.name} -> ${imageUrl}`);
              }
            } else {
              console.log(`⚠️ Invalid base64 format for ${medicine.name}, using default`);
              imageUrl = '/medicine-images/default-medicine.jpg';
            }
          } catch (error: any) {
            console.error(`❌ Error processing base64 image for ${medicine.name}:`, error.message);
            imageUrl = '/medicine-images/default-medicine.jpg';
          }
        }
        // Nếu là full URL (http/https), giữ nguyên
        else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          // Giữ nguyên full URL
        } 
        // Nếu là relative path nhưng không bắt đầu bằng /, thêm /medicine-images/
        else if (!imageUrl.startsWith('/')) {
          imageUrl = `/medicine-images/${imageUrl}`;
        }
        // Nếu đã là relative path bắt đầu bằng /, giữ nguyên
        else {
          // Giữ nguyên
        }

        // Tạo DTO từ medicine data - mapping đúng với cấu trúc thực tế
        const medicineDto = {
          id: String(medicine._id),
          _id: String(medicine._id),
          name: medicine.name || '',
          description: medicine.uses || medicine.description || medicine.strength || '',
          price: String(medicine.salePrice || medicine.price || 0),
          originalPrice: medicine.originalPrice ? String(medicine.originalPrice) : (medicine.purchasePrice ? String(Math.round((medicine.salePrice || medicine.price || 0) * 1.15)) : undefined),
          discountPercentage: medicine.discountPercentage || 0,
          imageUrl: imageUrl,
          brand: medicine.brand || '',
          manufacturer: manufacturerName, // Tên nhà sản xuất từ manufacturers collection
          manufacturerId: medicine.manufacturerId ? String(medicine.manufacturerId) : undefined,
          genericName: medicine.genericName || '',
          productCode: medicine.productCode || medicine.code || String(medicine._id).substring(0, 5).toUpperCase(),
          unit: medicine.unit || 'Hộp',
          inStock: (medicine.stock || medicine.stockQuantity || 0) > 0,
          stockQuantity: medicine.stock || medicine.stockQuantity || 0,
          minStock: medicine.minStock || 0,
          isHot: medicine.isHot || false,
          isNewProduct: medicine.isNew || false,
          isPrescription: medicine.isPrescription || false,
          expirationDate: medicine.expiryDate || medicine.expirationDate,
          expiryDate: medicine.expiryDate || medicine.expirationDate,
          batchNumber: medicine.batchNumber,
          manufacturingDate: medicine.manufacturingDate,
          categoryId: productFromDb?.categoryId ? String(productFromDb.categoryId) : undefined,
          categoryName: medicine.category || medicine.mainCategory || category?.name || 'Thuốc', // Ưu tiên category từ medicines
          category: medicine.category || medicine.mainCategory || category?.name || 'Thuốc', // Thêm trường category
          mainCategory: medicine.mainCategory || medicine.category || 'Thuốc',
          // Thông tin chi tiết từ medicines - mapping đúng với cấu trúc thực tế
          activeIngredient: medicine.genericName || medicine.activeIngredient || medicine.activeIngredients || medicine.ingredients || medicine.ingredient || '',
          genericName: medicine.genericName || '',
          strength: medicine.strength || '',
          indications: medicine.uses || medicine.indications || medicine.indication || medicine.congDung || medicine.description || '',
          uses: medicine.uses || medicine.indications || medicine.indication || medicine.congDung || '',
          dosageForm: medicine.dosageForm || medicine.form || medicine.dosage || '',
          packaging: medicine.packaging || medicine.pack || medicine.unit || '',
          registrationNumber: medicine.registrationNumber || medicine.regNumber || medicine.registration || '',
          purchasePrice: medicine.purchasePrice ? Number(medicine.purchasePrice) : undefined,
          salePrice: medicine.salePrice ? Number(medicine.salePrice) : Number(medicine.price || 0),
        };

        console.log('📦 [ProductController] Medicine DTO created:');
        console.log('  - categoryName:', medicineDto.categoryName);
        console.log('  - manufacturer:', medicineDto.manufacturer);
        console.log('  - activeIngredient:', medicineDto.activeIngredient);
        console.log('  - indications:', medicineDto.indications);

        return res.json({
          success: true,
          data: medicineDto,
        });
      }

      // Nếu chỉ có product, dùng dữ liệu từ product
      if (!productDoc) {
        console.log('❌ [ProductController] Product not found');
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      console.log('✅ [ProductController] Product found successfully');
      console.log('📦 [ProductController] Product name:', productDoc.name);
      console.log('📦 [ProductController] Product brand:', productDoc.brand);

      const productDto = toProductDto(productDoc);
      console.log('📦 [ProductController] Product DTO created successfully');

      res.json({
        success: true,
        data: productDto,
      });
    } catch (error: any) {
      console.error('❌ [ProductController] Get product by ID error:', error);
      console.error('❌ [ProductController] Error name:', error?.name);
      console.error('❌ [ProductController] Error message:', error?.message);
      console.error('❌ [ProductController] Error stack:', error?.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Create new product (Admin only)
  static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const productData = req.body;

      const newProduct = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: toProductDto(newProduct.toObject()),
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Update product (Admin only)
  static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingProduct = await Product.findById(id);

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct ? toProductDto(updatedProduct.toObject()) : null,
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Delete product (Admin only)
  static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const existingProduct = await Product.findById(id);

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      await Product.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get hot products
  static async getHotProducts(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const hotProducts = await Product.find({ isHot: true, inStock: true })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();
      const mapped = hotProducts.map(toProductDto);

      res.json({
        success: true,
        data: mapped,
      });
    } catch (error) {
      console.error('Get hot products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get new products
  static async getNewProducts(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const newProducts = await Product.find({ isNewProduct: true, inStock: true })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();
      const mapped = newProducts.map(toProductDto);

      res.json({
        success: true,
        data: mapped,
      });
    } catch (error) {
      console.error('Get new products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get all distinct brands
  static async getBrands(req: Request, res: Response) {
    try {
      // Get all distinct brands from products, excluding null/empty values
      const brands = await Product.distinct('brand', { 
        brand: { $exists: true, $ne: null, $ne: '' } 
      });

      // Helper function to check if a string looks like an ObjectId (24 hex characters)
      const isObjectId = (str: string): boolean => {
        return /^[0-9a-fA-F]{24}$/.test(str);
      };

      // Helper function to check if a string is a valid brand name
      const isValidBrandName = (brand: any): boolean => {
        // Must be a string
        if (typeof brand !== 'string') return false;
        
        const trimmed = brand.trim();
        
        // Must not be empty
        if (trimmed === '') return false;
        
        // Must not be an ObjectId (24 hex characters)
        if (isObjectId(trimmed)) return false;
        
        // Must not be just numbers
        if (/^\d+$/.test(trimmed)) return false;
        
        // Must have at least one letter
        if (!/[a-zA-ZÀ-ỹ]/.test(trimmed)) return false;
        
        return true;
      };

      // Filter and clean brands
      const validBrands = brands
        .filter(isValidBrandName)
        .map(brand => String(brand).trim())
        .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
        .sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));

      res.json({
        success: true,
        data: validBrands,
      });
    } catch (error) {
      console.error('Get brands error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

