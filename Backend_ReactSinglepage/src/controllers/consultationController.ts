import { Request, Response } from 'express';
import { Prescription, User, Product } from '../models/schema.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { findExactMatch, findSimilarMedicines, parseMedicineName, normalizeDosageForComparison } from '../services/medicineMatchingService.js';
import { medicineMetadataService } from '../services/medicineMetadataService.js';

// Helper function to normalize for comparison (duplicate from medicineMatchingService for local use)
function normalizeForComparison(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, '') // Remove everything except lowercase letters and numbers
    .trim();
}
import { extractTextFromImage } from '../services/ocrService.js';

// Helper function to get match explanation
function getMatchExplanation(matchReason: string, confidence: number): string {
  const explanations: { [key: string]: string } = {
    'same_name_same_dosage': 'Cùng tên và cùng hàm lượng với thuốc trong đơn',
    'same_name_different_dosage': 'Cùng tên nhưng khác hàm lượng',
    'same_active_ingredient_same_dosage': 'Cùng hoạt chất và cùng hàm lượng',
    'same_active_ingredient_different_dosage': 'Cùng hoạt chất nhưng khác hàm lượng',
    'same_group_therapeutic': 'Cùng nhóm điều trị',
    'same_indication_same_dosage': 'Cùng công dụng và cùng hàm lượng',
    'same_indication_different_dosage': 'Cùng công dụng nhưng khác hàm lượng',
    'similar_name': 'Tên thuốc tương tự',
    'from_medicines_collection': 'Được đề xuất từ cơ sở dữ liệu thuốc',
    'similar': 'Thuốc tương tự'
  };
  
  return explanations[matchReason] || `Đề xuất dựa trên độ tương tự ${Math.round(confidence * 100)}%`;
}

// Helper function to normalize and compare medicine properties
// Chuẩn hóa và so sánh các thuộc tính thuốc một cách linh hoạt
function normalizeMedicineValue(value: string | null | undefined): string {
  if (!value) return '';
  return value.trim().toLowerCase();
}

// Helper function to check if two dosage forms are equivalent
// Sử dụng medicineMetadataService để đọc từ database, fallback về hardcode mapping
async function isDosageFormEquivalent(form1: string, form2: string): Promise<boolean> {
  const normalized1 = normalizeMedicineValue(form1);
  const normalized2 = normalizeMedicineValue(form2);
  
  if (normalized1 === normalized2) return true;
  
  // Bỏ qua nếu một trong hai là rỗng - database có thể thiếu dữ liệu
  if (!normalized1 || normalized1 === '') return true;
  if (!normalized2 || normalized2 === '') return true;
  
  // Kiểm tra nếu một chuỗi chứa từ khóa chính của chuỗi kia
  // Ví dụ: "Gel bôi" chứa "gel", nên match với "Gel"
  const keyWords1 = normalized1.split(/\s+/).filter(w => w.length > 2);
  const keyWords2 = normalized2.split(/\s+/).filter(w => w.length > 2);
  
  // Nếu một trong hai chuỗi chứa từ khóa chính của chuỗi kia
  for (const keyword of keyWords1) {
    if (normalized2.includes(keyword) && keyword.length > 2) {
      return true;
    }
  }
  for (const keyword of keyWords2) {
    if (normalized1.includes(keyword) && keyword.length > 2) {
      return true;
    }
  }
  
  // Ưu tiên: Sử dụng service để tìm từ database
  try {
    const result = await medicineMetadataService.areDosageFormsEquivalent(form1, form2);
    if (result) return true;
  } catch (error) {
    console.warn('⚠️ Error using medicineMetadataService for dosage form comparison, falling back to hardcode:', error);
  }
  
  // Fallback: Mapping các giá trị tương đương (hardcode)
  const equivalentForms: { [key: string]: string[] } = {
    'tablet': ['viên nén', 'tablet', 'viên', 'viên nén bao phim', 'tablet film-coated'],
    'capsule': ['nang', 'capsule', 'viên nang', 'viên con nhộng'],
    'gel': ['gel', 'kem gel', 'emulgel', 'gel bôi', 'gelboi'],
    'cream': ['cream', 'kem', 'kem bôi', 'kemboi'],
    'ointment': ['ointment', 'mỡ', 'thuốc mỡ', 'thuocmo'],
    'solution': ['dung dịch', 'solution'],
    'syrup': ['siro', 'syrup'],
    'injection': ['tiêm', 'injection', 'chích'],
    'tube': ['tuýp', 'tuyp', 'tube']
  };
  
  // Tìm group chứa form1 (kiểm tra exact match và partial match)
  for (const [key, group] of Object.entries(equivalentForms)) {
    if (group.some(f => normalizeMedicineValue(f) === normalized1) || normalized1.includes(key)) {
      return group.some(f => normalizeMedicineValue(f) === normalized2) || normalized2.includes(key);
    }
  }
  
  // Tìm group chứa form2 (kiểm tra ngược lại)
  for (const [key, group] of Object.entries(equivalentForms)) {
    if (group.some(f => normalizeMedicineValue(f) === normalized2) || normalized2.includes(key)) {
      return group.some(f => normalizeMedicineValue(f) === normalized1) || normalized1.includes(key);
    }
  }
  
  return false;
}

// Helper function to check if two subcategories are equivalent
// Sử dụng medicineMetadataService để đọc từ database, fallback về hardcode mapping
async function isSubcategoryEquivalent(sub1: string, sub2: string): Promise<boolean> {
  const normalized1 = normalizeMedicineValue(sub1);
  const normalized2 = normalizeMedicineValue(sub2);
  
  if (normalized1 === normalized2) return true;
  
  // Bỏ qua nếu một trong hai là "N/A" hoặc rỗng - cho phép match (database có thể thiếu dữ liệu)
  if (!normalized1 || normalized1 === 'n/a' || normalized1 === 'na' || normalized1 === '') return true;
  if (!normalized2 || normalized2 === 'n/a' || normalized2 === 'na' || normalized2 === '') return true;
  
  // Kiểm tra nếu một chuỗi chứa từ khóa của chuỗi kia (linh hoạt hơn)
  // Ví dụ: "NSAIDs điều trị xương khớp" chứa "nsaid", nên match với "NSAID"
  const keyWords1 = normalized1.split(/\s+/).filter(w => w.length > 2);
  const keyWords2 = normalized2.split(/\s+/).filter(w => w.length > 2);
  
  // Nếu một trong hai chuỗi chứa các từ khóa quan trọng của chuỗi kia
  for (const keyword of keyWords1) {
    if (normalized2.includes(keyword) && keyword.length > 3) {
      return true;
    }
  }
  for (const keyword of keyWords2) {
    if (normalized1.includes(keyword) && keyword.length > 3) {
      return true;
    }
  }
  
  // Ưu tiên: Sử dụng service để tìm từ database
  try {
    const result = await medicineMetadataService.areSubcategoriesEquivalent(sub1, sub2);
    if (result) return true;
  } catch (error) {
    console.warn('⚠️ Error using medicineMetadataService for subcategory comparison, falling back to hardcode:', error);
  }
  
  // Fallback: Mapping các giá trị tương đương (hardcode)
  const equivalentSubs: { [key: string]: string[] } = {
    'nsaid': ['nsaid', 'nsaids', 'kháng viêm', 'anti-inflammatory', 'non-steroidal anti-inflammatory', 'nonsteroidal anti-inflammatory', 'điều trị xương khớp'],
    'paracetamol': ['paracetamol', 'acetaminophen'],
    'corticosteroid': ['corticosteroid', 'cortico', 'steroid']
  };
  
  // Tìm group chứa sub1 (kiểm tra nếu sub1 chứa từ khóa của group)
  for (const [key, group] of Object.entries(equivalentSubs)) {
    if (group.some(s => normalizeMedicineValue(s) === normalized1) || normalized1.includes(key)) {
      return group.some(s => normalizeMedicineValue(s) === normalized2) || normalized2.includes(key);
    }
  }
  
  // Tìm group chứa sub2 (kiểm tra nếu sub2 chứa từ khóa của group)
  for (const [key, group] of Object.entries(equivalentSubs)) {
    if (group.some(s => normalizeMedicineValue(s) === normalized2) || normalized2.includes(key)) {
      return group.some(s => normalizeMedicineValue(s) === normalized1) || normalized1.includes(key);
    }
  }
  
  return false;
}

// Helper function to check if medicine matches all 4 conditions (with flexible comparison)
// Sử dụng medicineMetadataService để so sánh từ database
async function matchesAll4Conditions(
  medicine: any,
  targetCategory: string,
  targetSubcategory: string,
  targetDosageForm: string,
  targetRoute: string
): Promise<{ matches: boolean; details: { category: boolean; subcategory: boolean; dosageForm: boolean; route: boolean } }> {
  // Category: So sánh chính xác (có thể linh hoạt hơn nếu cần)
  const hasCategory = targetCategory && medicine.category && 
    normalizeMedicineValue(targetCategory) === normalizeMedicineValue(medicine.category);
  
  // Subcategory: So sánh linh hoạt (cho phép N/A, và các giá trị tương đương)
  // Sử dụng service để đọc từ database
  const hasSubcategory = await isSubcategoryEquivalent(targetSubcategory, medicine.subcategory || '');
  
  // DosageForm: So sánh linh hoạt (Viên nén = Tablet, v.v.)
  // Sử dụng service để đọc từ database
  const hasDosageForm = await isDosageFormEquivalent(targetDosageForm, medicine.dosageForm || '');
  
  // Route: So sánh linh hoạt (Bôi ngoài = Dùng ngoài, Uống = Oral, v.v.)
  const normalizedRoute1 = normalizeMedicineValue(targetRoute);
  const normalizedRoute2 = normalizeMedicineValue(medicine.route || '');
  
  let hasRoute = false;
  if (normalizedRoute1 && normalizedRoute2) {
    // Exact match
    if (normalizedRoute1 === normalizedRoute2) {
      hasRoute = true;
    } else {
      // Kiểm tra partial match (ví dụ: "Bôi ngoài" chứa "ngoài", match với "Dùng ngoài")
      const keyWords1 = normalizedRoute1.split(/\s+/).filter(w => w.length > 2);
      const keyWords2 = normalizedRoute2.split(/\s+/).filter(w => w.length > 2);
      
      for (const keyword of keyWords1) {
        if (normalizedRoute2.includes(keyword) && keyword.length > 2) {
          hasRoute = true;
          break;
        }
      }
      if (!hasRoute) {
        for (const keyword of keyWords2) {
          if (normalizedRoute1.includes(keyword) && keyword.length > 2) {
            hasRoute = true;
            break;
          }
        }
      }
      
      // Mapping các giá trị tương đương
      if (!hasRoute) {
        const equivalentRoutes: { [key: string]: string[] } = {
          'uống': ['uống', 'oral', 'đường uống', 'duong uong'],
          'ngoài': ['bôi ngoài', 'dùng ngoài', 'topical', 'boi ngoai', 'dung ngoai', 'ngoài'],
          'tiêm': ['tiêm', 'injection', 'chích', 'chich'],
          'nhỏ': ['nhỏ mắt', 'nhỏ mũi', 'eye drops', 'nasal drops']
        };
        
        for (const [key, routes] of Object.entries(equivalentRoutes)) {
          if (routes.some(r => normalizedRoute1.includes(normalizeMedicineValue(r))) || normalizedRoute1.includes(key)) {
            if (routes.some(r => normalizedRoute2.includes(normalizeMedicineValue(r))) || normalizedRoute2.includes(key)) {
              hasRoute = true;
              break;
            }
          }
        }
      }
    }
  }
  
  return {
    matches: hasCategory && hasSubcategory && hasDosageForm && hasRoute,
    details: { category: hasCategory, subcategory: hasSubcategory, dosageForm: hasDosageForm, route: hasRoute }
  };
}

// Helper function to check if a medicine is already in the prescription (foundMedicines)
// So sánh theo tên (normalized) và hoạt chất để tránh trùng lặp
function isMedicineAlreadyInPrescription(
  medicine: any,
  foundMedicines: any[]
): boolean {
  if (!medicine || foundMedicines.length === 0) return false;
  
  const medicineName = medicine.name || medicine.productName || '';
  const medicineActiveIngredient = (medicine.activeIngredient || medicine.genericName || '').toLowerCase();
  const normalizedMedicineName = normalizeForComparison(medicineName);
  
  return foundMedicines.some(found => {
    const foundName = found.originalText || found.productName || '';
    const normalizedFoundName = normalizeForComparison(foundName);
    
    // So sánh tên (normalized)
    if (normalizedMedicineName === normalizedFoundName) {
      return true;
    }
    
    // So sánh hoạt chất nếu có
    if (medicineActiveIngredient && medicineActiveIngredient.length > 3) {
      const foundActiveIngredient = (found.activeIngredient || '').toLowerCase();
      if (foundActiveIngredient && foundActiveIngredient.length > 3) {
        // So sánh hoạt chất chính (từ đầu, trước dấu phẩy)
        const mainMedicineActive = medicineActiveIngredient.split(/[,;]/)[0]?.trim();
        const mainFoundActive = foundActiveIngredient.split(/[,;]/)[0]?.trim();
        if (mainMedicineActive && mainFoundActive && mainMedicineActive === mainFoundActive) {
          return true;
        }
      }
    }
    
    return false;
  });
}

// Helper function to get contraindication from medicines collection
// Ưu tiên lấy từ database, chỉ fallback về hardcode nếu không tìm thấy
async function getContraindicationFromMedicines(
  medicineName: string,
  groupTherapeutic?: string,
  medicineInfo?: any
): Promise<string> {
  let contraindication = '';
  
  // Priority 1: Lấy từ medicineInfo nếu đã có (đã query từ medicines collection)
  if (medicineInfo) {
    contraindication = medicineInfo.contraindication || 
                      medicineInfo.chongChiDinh || 
                      medicineInfo.contraindications || 
                      '';
    
    if (contraindication && contraindication.trim()) {
      return contraindication.trim();
    }
  }
  
  // Priority 2: Query từ medicines collection nếu chưa có medicineInfo
  const db = mongoose.connection.db;
  if (db && medicineName && typeof medicineName === 'string') {
    try {
      const medicinesCollection = db.collection('medicines');
      // medicineName is guaranteed to be string here due to type guard above
      const searchName = medicineName.split('(')[0]!.trim();
      
      if (searchName) {
        const foundMedicine = await medicinesCollection.findOne({
          $or: [
            { name: { $regex: searchName, $options: 'i' } },
            { brand: { $regex: searchName, $options: 'i' } },
            { genericName: { $regex: searchName, $options: 'i' } },
            { activeIngredient: { $regex: searchName, $options: 'i' } }
          ]
        });
        
        if (foundMedicine) {
          contraindication = foundMedicine.contraindication || 
                            foundMedicine.chongChiDinh || 
                            foundMedicine.contraindications || 
                            '';
          
          if (contraindication && contraindication.trim()) {
            return contraindication.trim();
          }
          
          // Nếu không có chống chỉ định nhưng có groupTherapeutic, lưu lại để dùng cho fallback
          if (!groupTherapeutic && foundMedicine.groupTherapeutic) {
            groupTherapeutic = foundMedicine.groupTherapeutic;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching contraindication from medicines collection:', error);
    }
  }
  
  // Priority 3: Fallback về hardcode dựa trên nhóm thuốc (chỉ khi không tìm thấy trong database)
  if (!contraindication && groupTherapeutic) {
    const groupLower = groupTherapeutic.toLowerCase();
    const medicineNameLower = (medicineName || '').toLowerCase();
    const combinedText = `${medicineNameLower}`;
    
    // Kiểm tra nếu là NSAID
    const isNSAID = groupLower.includes('nsaid') || 
                    groupLower.includes('kháng viêm') ||
                    combinedText.includes('diclofenac') || 
                    combinedText.includes('nsaid') || 
                    medicineNameLower.includes('voltaren') || 
                    medicineNameLower.includes('ibuprofen') ||
                    medicineNameLower.includes('meloxicam') || 
                    medicineNameLower.includes('celecoxib') ||
                    medicineNameLower.includes('aspirin');
    
    if (isNSAID) {
      // Kiểm tra xem có phải dạng bôi không
      const isTopical = /%\/\s*g|\bgel\b|\bemulgel\b|\bcream\b|\bkem\b|\btuýp\b|\btuyp\b|\bthuốc\s*bôi\b|\bthuoc\s*boi\b|\bointment\b|\bmỡ\b|\bmo\b/.test(combinedText);
      
      if (isTopical) {
        // NSAID dạng bôi
        if (medicineNameLower.includes('diclofenac') || medicineNameLower.includes('voltaren')) {
          contraindication = 'Quá mẫn với Diclofenac hoặc các thuốc NSAID khác, không bôi lên vùng da bị tổn thương, vết thương hở, hoặc niêm mạc';
        } else if (medicineNameLower.includes('ibuprofen')) {
          contraindication = 'Quá mẫn với Ibuprofen, không bôi lên vùng da bị tổn thương, vết thương hở';
        } else if (medicineNameLower.includes('meloxicam')) {
          contraindication = 'Quá mẫn với Meloxicam, không bôi lên vùng da bị tổn thương, vết thương hở';
        } else {
          contraindication = 'Quá mẫn với thuốc NSAID, không bôi lên vùng da bị tổn thương, vết thương hở, hoặc niêm mạc';
        }
      } else {
        // NSAID dạng uống
        if (medicineNameLower.includes('celecoxib') || medicineNameLower.includes('coxib')) {
          contraindication = 'Người có bệnh tim mạch, suy tim, phụ nữ mang thai 3 tháng cuối, quá mẫn với Celecoxib hoặc các thuốc NSAID khác';
        } else if (medicineNameLower.includes('ibuprofen')) {
          contraindication = 'Người đau dạ dày, loét dạ dày, suy thận, phụ nữ mang thai 3 tháng cuối, quá mẫn với Ibuprofen';
        } else if (medicineNameLower.includes('meloxicam')) {
          contraindication = 'Người đau dạ dày, loét dạ dày, suy thận, phụ nữ mang thai 3 tháng cuối, quá mẫn với Meloxicam';
        } else if (medicineNameLower.includes('aspirin')) {
          contraindication = 'Người đau dạ dày, loét dạ dày, suy thận, phụ nữ mang thai 3 tháng cuối, quá mẫn với Aspirin';
        } else {
          contraindication = 'Người đau dạ dày, loét dạ dày, suy thận, phụ nữ mang thai 3 tháng cuối, quá mẫn với thuốc NSAID';
        }
      }
    } else if (groupLower.includes('kháng sinh')) {
      contraindication = 'Quá mẫn với kháng sinh, phụ nữ mang thai và cho con bú cần thận trọng';
    } else if (groupLower.includes('corticosteroid') || groupLower.includes('cortico')) {
      contraindication = 'Quá mẫn với corticosteroid, nhiễm trùng toàn thân chưa được điều trị, loét dạ dày tá tràng, phụ nữ mang thai cần thận trọng';
    } else if (medicineNameLower.includes('cetirizine') || medicineNameLower.includes('loratadine') || medicineNameLower.includes('fexofenadine')) {
      contraindication = 'Quá mẫn với thuốc kháng histamine, phụ nữ mang thai và cho con bú cần thận trọng';
    }
  }
  
  return contraindication.trim();
}

// Helper function to format professional suggestion text for "Thuốc đề xuất"
// Format: rõ ràng, chuẩn dược, không dài dòng
// Tách từng thông tin: tên – công dụng – hàm lượng – lý do đề xuất
// Function để AI phân tích tên thuốc và tìm ra 4 điều kiện: category, subcategory, dosageForm, route
async function analyzeMedicineWithAI(medicineName: string, dosage?: string): Promise<{
  category: string;
  subcategory: string;
  dosageForm: string;
  route: string;
  analysisText: string;
}> {
  // Default values
  let category = '';
  let subcategory = '';
  let dosageForm = '';
  let route = '';
  let analysisText = '';

  try {
    // Import AI service
    const { generateAIResponseWithGemini } = await import('../services/aiService.js');
    
    // Tạo prompt cho AI
    const prompt = `Bạn là chuyên gia dược học. Hãy phân tích tên thuốc sau và trả lời CHỈ bằng JSON format:

Tên thuốc: "${medicineName}"
${dosage ? `Hàm lượng: ${dosage}` : ''}

Yêu cầu: Phân tích và trả lời CHỈ bằng JSON với format sau (KHÔNG có text nào khác, CHỈ JSON):
{
  "category": "danh mục thuốc (ví dụ: Thuốc cơ xương khớp, Giảm đau hạ sốt, Thuốc da liễu)",
  "subcategory": "nhóm thuốc (ví dụ: NSAID, Paracetamol, Corticosteroid)",
  "dosageForm": "dạng bào chế (ví dụ: Viên nén, Gel, Cream, Ointment, Tablet, Capsule, Tube)",
  "route": "cách dùng (ví dụ: Uống, Dùng ngoài, Tiêm, Nhỏ mắt)",
  "analysis": "phân tích ngắn gọn về thuốc này"
}

Lưu ý quan trọng:
- Nếu tên thuốc có "1%/20g", "gel", "cream", "tuýp", "bôi" → route = "Dùng ngoài", dosageForm = "Gel" hoặc "Cream"
- Nếu tên thuốc có "viên", "tablet", "capsule" → route = "Uống", dosageForm = "Tablet" hoặc "Capsule"
- Phân tích dựa trên tên thuốc và hàm lượng để xác định chính xác 4 thông tin trên.`;

    const aiResponse = await generateAIResponseWithGemini({
      userMessage: prompt,
      conversationHistory: [],
      context: {}
    });

    if (aiResponse) {
      try {
        // Parse JSON response từ AI
        // Loại bỏ markdown code blocks nếu có
        let jsonText = aiResponse.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\n?/g, '');
        }
        
        const parsed = JSON.parse(jsonText);
        category = parsed.category || '';
        subcategory = parsed.subcategory || '';
        dosageForm = parsed.dosageForm || '';
        route = parsed.route || '';
        analysisText = parsed.analysis || '';

        console.log(`🤖 AI Analysis for "${medicineName}":`, { category, subcategory, dosageForm, route });
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback: thử extract từ text response
        const lowerResponse = aiResponse.toLowerCase();
        if (lowerResponse.includes('dùng ngoài') || lowerResponse.includes('bôi') || lowerResponse.includes('gel') || lowerResponse.includes('cream')) {
          route = 'Dùng ngoài';
        } else if (lowerResponse.includes('uống') || lowerResponse.includes('oral') || lowerResponse.includes('viên')) {
          route = 'Uống';
        }
      }
    }
  } catch (error) {
    console.error('Error in AI analysis:', error);
  }

  return { category, subcategory, dosageForm, route, analysisText };
}

async function formatSuggestionText(
  originalMedicineName: string,
  originalDosage: string | null,
  suggestedMedicines: any[], // Nhận array of suggestions
  aiAnalysis?: { category: string; subcategory: string; dosageForm: string; route: string; analysisText: string }
): Promise<string> {
  if (!suggestedMedicines || suggestedMedicines.length === 0) {
    return `Không tìm thấy chính xác tên thuốc "${originalMedicineName}" trong hệ thống. Vui lòng liên hệ dược sĩ để được tư vấn.`;
  }
  
  const db = mongoose.connection.db;
  let suggestionText = `Không tìm thấy chính xác tên thuốc trong đơn.\n\n`;
  
  // Thêm phần AI phân tích nếu có
  if (aiAnalysis && (aiAnalysis.category || aiAnalysis.subcategory || aiAnalysis.dosageForm || aiAnalysis.route)) {
    suggestionText += `📋 Phân tích thuốc "${originalMedicineName}":\n`;
    if (aiAnalysis.category) {
      suggestionText += `   - Danh mục: ${aiAnalysis.category}\n`;
    }
    if (aiAnalysis.subcategory) {
      suggestionText += `   - Nhóm thuốc: ${aiAnalysis.subcategory}\n`;
    }
    if (aiAnalysis.dosageForm) {
      suggestionText += `   - Dạng bào chế: ${aiAnalysis.dosageForm}\n`;
    }
    if (aiAnalysis.route) {
      suggestionText += `   - Cách dùng: ${aiAnalysis.route}\n`;
    }
    if (aiAnalysis.analysisText) {
      suggestionText += `   - Phân tích: ${aiAnalysis.analysisText}\n`;
    }
    suggestionText += `\n`;
  }
  
  // Format tất cả suggestions - rõ ràng, chuẩn dược, không dài dòng
  // Tách từng thông tin: tên – công dụng – hàm lượng – lý do đề xuất
  
  if (suggestedMedicines.length === 1) {
    // Chỉ có 1 thuốc - format đơn giản
    const med = suggestedMedicines[0];
    let groupTherapeutic = med.groupTherapeutic || '';
    let indication = med.indication || '';
    
    // Try to get groupTherapeutic, indication, and contraindication from medicines collection
    let contraindication = med.contraindication || '';
    let medicineInfo: any = null; // Declare outside if block for use in helper function
    
    if (db) {
      try {
        const medicinesCollection = db.collection('medicines');
        const medicineName = med.productName || med.name || '';
        const searchName = medicineName.split('(')[0].trim();
        
        if (searchName) {
          medicineInfo = await medicinesCollection.findOne({
            $or: [
              { name: { $regex: searchName, $options: 'i' } },
              { brand: { $regex: searchName, $options: 'i' } },
              { genericName: { $regex: searchName, $options: 'i' } },
              { activeIngredient: { $regex: searchName, $options: 'i' } }
            ]
          });
          
          if (medicineInfo) {
            if (medicineInfo.groupTherapeutic && !groupTherapeutic) {
              groupTherapeutic = medicineInfo.groupTherapeutic;
            }
            // Ưu tiên indication, nếu không có thì dùng description, uses, hoặc congDung
            if (!indication) {
              indication = medicineInfo.indication || 
                          medicineInfo.description || 
                          medicineInfo.uses || 
                          medicineInfo.congDung || 
                          '';
            }
            // Lấy chống chỉ định nếu có
            if (!contraindication) {
              contraindication = medicineInfo.contraindication || 
                                medicineInfo.chongChiDinh || 
                                medicineInfo.contraindications || 
                                '';
            }
          }
        }
      } catch (error) {
        console.error('Error fetching medicine info for suggestion:', error);
      }
    }
    
    // Nếu không có chống chỉ định từ database, sử dụng helper function để lấy (có fallback)
    if (!contraindication) {
      const medicineName = med.productName || med.name || '';
      contraindication = await getContraindicationFromMedicines(medicineName, groupTherapeutic, medicineInfo);
    }
    
    // Lưu chống chỉ định vào med object để frontend có thể sử dụng
    med.contraindication = contraindication;
    
    const suggestedName = med.productName || med.name || '';
    const suggestedDosage = med.dosage || originalDosage || '';
    const matchReason = med.matchExplanation || getMatchExplanation(med.matchReason || 'similar', med.confidence || 0.6);
    
    // Format: tên – công dụng – hàm lượng – lý do (ngắn gọn, rõ ràng)
    suggestionText += `Dựa trên hoạt chất và công dụng điều trị, hệ thống đề xuất ${suggestedName}`;
    if (suggestedDosage) {
      suggestionText += ` (${suggestedDosage})`;
    }
    suggestionText += `.`;
    
    if (indication) {
      // Hiển thị công dụng đầy đủ, không cắt quá ngắn để người mua dễ biết
      const fullIndication = indication.trim();
      suggestionText += `\nCông dụng: ${fullIndication}`;
    } else {
      // Nếu không có indication, hiển thị công dụng mặc định dựa trên nhóm
      if (groupTherapeutic) {
        if (groupTherapeutic.toLowerCase().includes('nsaid') || groupTherapeutic.toLowerCase().includes('kháng viêm')) {
          suggestionText += `\nCông dụng: Giảm đau, kháng viêm`;
        } else if (groupTherapeutic.toLowerCase().includes('kháng sinh')) {
          suggestionText += `\nCông dụng: Điều trị nhiễm khuẩn`;
        } else {
          suggestionText += `\nCông dụng: Điều trị theo chỉ định của bác sĩ`;
        }
      }
    }
    
    if (groupTherapeutic) {
      suggestionText += `\nNhóm: ${groupTherapeutic}`;
    }
    
    if (suggestedDosage) {
      suggestionText += `\nHàm lượng ${suggestedDosage} tương ứng với liều điều trị tiêu chuẩn.`;
    }
    
    suggestionText += `\nLý do đề xuất: ${matchReason}`;
    
    // Thêm chống chỉ định nếu có
    if (contraindication && contraindication.trim()) {
      suggestionText += `\n\n⚠️ Chống chỉ định: ${contraindication.trim()}`;
    }
  } else {
    // Có nhiều thuốc - format danh sách ngắn gọn
    suggestionText += `Dựa trên hoạt chất và công dụng điều trị, hệ thống đề xuất ${suggestedMedicines.length} thuốc:\n\n`;
    
    for (let i = 0; i < suggestedMedicines.length; i++) {
      const med = suggestedMedicines[i];
      let groupTherapeutic = med.groupTherapeutic || '';
      let indication = med.indication || '';
      
      // Try to get groupTherapeutic, indication, and contraindication from medicines collection
      // Ưu tiên lấy từ med object trước (đã được lấy từ similarMedicines)
      let contraindication = med.contraindication || '';
      let medicineInfo: any = null; // Declare outside if block for use in helper function
      
      if (db) {
        try {
          const medicinesCollection = db.collection('medicines');
          const medicineName = med.productName || med.name || '';
          const searchName = medicineName.split('(')[0].trim();
          
          if (searchName) {
            medicineInfo = await medicinesCollection.findOne({
              $or: [
                { name: { $regex: searchName, $options: 'i' } },
                { brand: { $regex: searchName, $options: 'i' } },
                { genericName: { $regex: searchName, $options: 'i' } },
                { activeIngredient: { $regex: searchName, $options: 'i' } }
              ]
            });
            
            if (medicineInfo) {
              if (medicineInfo.groupTherapeutic && !groupTherapeutic) {
                groupTherapeutic = medicineInfo.groupTherapeutic;
              }
              // Ưu tiên indication, nếu không có thì dùng description, uses, hoặc congDung
              if (!indication) {
                indication = medicineInfo.indication || 
                            medicineInfo.description || 
                            medicineInfo.uses || 
                            medicineInfo.congDung || 
                            '';
              }
              // Lấy chống chỉ định nếu có và chưa có trong med object
              if (!contraindication) {
                contraindication = medicineInfo.contraindication || 
                                  medicineInfo.chongChiDinh || 
                                  medicineInfo.contraindications || 
                                  '';
              }
            }
          }
        } catch (error) {
          console.error('Error fetching medicine info for suggestion:', error);
        }
      }
      
      // Nếu không có chống chỉ định từ database, sử dụng helper function để lấy (có fallback)
      if (!contraindication) {
        const medicineName = med.productName || med.name || '';
        const finalGroupTherapeutic = groupTherapeutic || med.groupTherapeutic || '';
        contraindication = await getContraindicationFromMedicines(medicineName, finalGroupTherapeutic, medicineInfo);
      }
      
      // Lưu chống chỉ định vào med object để frontend có thể sử dụng
      med.contraindication = contraindication;
      
      const suggestedName = med.productName || med.name || '';
      const suggestedDosage = med.dosage || originalDosage || '';
      const matchReason = med.matchExplanation || getMatchExplanation(med.matchReason || 'similar', med.confidence || 0.6);
      
      // Format: tên – công dụng – hàm lượng – lý do (ngắn gọn, rõ ràng)
      suggestionText += `${i + 1}. ${suggestedName}`;
      if (suggestedDosage) {
        suggestionText += ` (${suggestedDosage})`;
      }
      suggestionText += `\n`;
      
      if (indication) {
        // Hiển thị công dụng đầy đủ để người mua dễ biết, không cắt quá ngắn
        const fullIndication = indication.trim();
        suggestionText += `   Công dụng: ${fullIndication}\n`;
      } else {
        // Nếu không có indication, hiển thị công dụng mặc định dựa trên nhóm
        if (groupTherapeutic) {
          if (groupTherapeutic.toLowerCase().includes('nsaid') || groupTherapeutic.toLowerCase().includes('kháng viêm')) {
            suggestionText += `   Công dụng: Giảm đau, kháng viêm\n`;
          } else if (groupTherapeutic.toLowerCase().includes('kháng sinh')) {
            suggestionText += `   Công dụng: Điều trị nhiễm khuẩn\n`;
          } else {
            suggestionText += `   Công dụng: Điều trị theo chỉ định của bác sĩ\n`;
          }
        }
      }
      
      if (groupTherapeutic) {
        suggestionText += `   Nhóm: ${groupTherapeutic}\n`;
      }
      
      suggestionText += `   Lý do: ${matchReason}`;
      
      // Thêm chống chỉ định nếu có
      if (contraindication && contraindication.trim()) {
        suggestionText += `\n   ⚠️ Chống chỉ định: ${contraindication.trim()}`;
      }
      
      suggestionText += `\n\n`;
    }
  }
  
  return suggestionText.trim();
}

// Helper function to get description from medicines collection if product doesn't have it
async function getProductDescription(product: any): Promise<string> {
  // If product already has a valid description (not empty and not just dosage), return it
  if (product.description && 
      product.description.trim().length > 0 && 
      !/^\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?\s*$/i.test(product.description.trim())) {
    return product.description;
  }
  
  // Try to get description from medicines collection
  try {
    const db = mongoose.connection.db;
    if (!db) return product.description || product.strength || '';
    
    const medicinesCollection = db.collection('medicines');
    const productName = product.name || '';
    
    // Try exact match first
    let medicine = await medicinesCollection.findOne({ name: productName });
    
    // If not found, try case-insensitive regex
    if (!medicine) {
      const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      medicine = await medicinesCollection.findOne({
        name: { $regex: `^${escapedName}$`, $options: 'i' }
      });
    }
    
    // If still not found, try normalized name (remove spaces, underscores, etc.)
    if (!medicine) {
      const normalizedName = productName.replace(/[\s_+\-]/g, '').toLowerCase();
      const allMedicines = await medicinesCollection.find({}).toArray();
      const foundMedicine = allMedicines.find(med => {
        const medName = (med.name || '').replace(/[\s_+\-]/g, '').toLowerCase();
        return medName === normalizedName;
      });
      medicine = foundMedicine || null;
    }
    
    if (medicine) {
      // Priority: description > indication > genericName > strength
      const description = medicine.description || 
                         medicine.indication || 
                         medicine.genericName || 
                         medicine.strength || 
                         '';
      
      // Only return if it's not just dosage
      if (description && 
          description.trim().length > 0 && 
          !/^\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?\s*$/i.test(description.trim())) {
        return description.trim();
      }
    }
  } catch (error) {
    console.error('Error fetching description from medicines collection:', error);
  }
  
  // Fallback to product's description or strength
  return product.description || product.strength || '';
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/prescriptions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload prescription image middleware
export const uploadPrescriptionImage = upload.single('prescriptionImage');

// Create prescription order
export const createPrescriptionOrder = async (req: Request, res: Response) => {
  try {
    const { 
      prescriptionName, 
      hospitalName, 
      doctorName, 
      examinationDate, 
      notes, 
      customerName, 
      phoneNumber 
    } = req.body;

    // Get user ID from auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prescription image is required' 
      });
    }

    // Create prescription record
    const prescription = new Prescription({
      userId,
      doctorName: doctorName || 'Không xác định',
      hospitalName: hospitalName || 'Không xác định',
      prescriptionImage: req.file.path,
      status: 'pending',
      notes: notes || '',
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription order created successfully',
      data: {
        prescriptionId: prescription._id,
        status: prescription.status,
        imageUrl: req.file.path
      }
    });
    return;

  } catch (error) {
    console.error('Error creating prescription order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Save prescription
export const savePrescription = async (req: Request, res: Response) => {
  try {
    const { 
      prescriptionName, 
      hospitalName, 
      doctorName, 
      examinationDate, 
      notes, 
      customerName, 
      phoneNumber 
    } = req.body;

    // Get user ID from auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prescription image is required' 
      });
    }

    // Create prescription record for saving
    const prescription = new Prescription({
      userId,
      doctorName: doctorName || 'Không xác định',
      hospitalName: hospitalName || 'Không xác định',
      prescriptionImage: req.file.path,
      status: 'saved', // Different status for saved prescriptions
      notes: notes || '',
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription saved successfully',
      data: {
        prescriptionId: prescription._id,
        status: prescription.status,
        imageUrl: req.file.path
      }
    });
    return;

  } catch (error) {
    console.error('Error saving prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Get user's prescriptions
export const getUserPrescriptions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescriptions = await Prescription.find({ userId })
      .sort({ createdAt: -1 })
      .select('-prescriptionImage'); // Don't send image data in list

    res.status(200).json({
      success: true,
      data: prescriptions
    });
    return;

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOne({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
    return;

  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Update prescription
export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const updateData = req.body;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });
    return;

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Delete prescription
export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    // Delete the image file
    if (prescription.prescriptionImage && fs.existsSync(prescription.prescriptionImage)) {
      fs.unlinkSync(prescription.prescriptionImage);
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });
    return;

  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Get prescription image
export const getPrescriptionImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const prescription = await Prescription.findOne({ 
      _id: id, 
      userId 
    });

    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription not found' 
      });
    }

    if (!prescription.prescriptionImage || !fs.existsSync(prescription.prescriptionImage)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Prescription image not found' 
      });
    }

    res.sendFile(path.resolve(prescription.prescriptionImage));
    return;

  } catch (error) {
    console.error('Error fetching prescription image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// Get consultation history
export const getConsultationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Get consultation requests (prescriptions with status 'pending' or 'approved')
    const consultations = await Prescription.find({ 
      userId,
      status: { $in: ['pending', 'approved'] }
    })
    .sort({ createdAt: -1 })
    .select('-prescriptionImage');

    res.status(200).json({
      success: true,
      data: consultations
    });
    return;

  } catch (error) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
};

// AI-powered prescription analysis
export const analyzePrescription = async (req: Request, res: Response) => {
  try {
    let { prescriptionText, prescriptionImage } = req.body;

    if (!prescriptionText && !prescriptionImage) {
      return res.status(400).json({
        success: false,
        message: 'Prescription text or image is required',
      });
    }

    // If only image is provided, extract text from image
    if (!prescriptionText && prescriptionImage) {
      console.log('📷 Extracting text from prescription image...');
      console.log('📷 Image format:', prescriptionImage.substring(0, 100));
      try {
        const { extractTextFromImage } = await import('../services/ocrService.js');
        
        // Handle different image formats
        let imagePath: string | null = null;
        
        if (prescriptionImage.startsWith('data:image/')) {
          // Base64 image
          console.log('📷 Processing base64 image...');
          const matches = prescriptionImage.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
            const timestamp = Date.now();
            const filename = `temp_prescription_${timestamp}.${extension}`;
            
            const tempDir = path.join(process.cwd(), 'uploads', 'temp');
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
            
            imagePath = path.join(tempDir, filename);
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(imagePath, buffer);
            console.log('✅ Saved base64 image to:', imagePath);
          }
        } else if (prescriptionImage.startsWith('http://') || prescriptionImage.startsWith('https://')) {
          // URL - try to extract local path first, otherwise download
          console.log('📥 Processing URL image:', prescriptionImage);
          
          // Try to extract local path from URL (e.g., http://localhost:5000/uploads/prescriptions/file.jpg -> uploads/prescriptions/file.jpg)
          const urlMatch = prescriptionImage.match(/\/uploads\/prescriptions\/(.+)$/);
          if (urlMatch) {
            const localPath = path.join(process.cwd(), 'uploads', 'prescriptions', urlMatch[1]);
            if (fs.existsSync(localPath)) {
              console.log('✅ Found local file:', localPath);
              imagePath = localPath;
            } else {
              console.log('⚠️ Local file not found, downloading from URL...');
              // Download from URL
              const axios = (await import('axios')).default;
              const response = await axios.get(prescriptionImage, {
                responseType: 'arraybuffer',
                timeout: 30000,
              });
              
              const buffer = Buffer.from(response.data);
              const tempDir = path.join(process.cwd(), 'uploads', 'temp');
              if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
              }
              const timestamp = Date.now();
              const filename = `temp_prescription_${timestamp}.jpg`;
              imagePath = path.join(tempDir, filename);
              fs.writeFileSync(imagePath, buffer);
              console.log('✅ Downloaded and saved to:', imagePath);
            }
          } else {
            // Download from URL
            console.log('📥 Downloading from URL...');
            const axios = (await import('axios')).default;
            const response = await axios.get(prescriptionImage, {
              responseType: 'arraybuffer',
              timeout: 30000,
            });
            
            const buffer = Buffer.from(response.data);
            const tempDir = path.join(process.cwd(), 'uploads', 'temp');
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
            const timestamp = Date.now();
            const filename = `temp_prescription_${timestamp}.jpg`;
            imagePath = path.join(tempDir, filename);
            fs.writeFileSync(imagePath, buffer);
            console.log('✅ Downloaded and saved to:', imagePath);
          }
        } else if (prescriptionImage.startsWith('uploads/') || prescriptionImage.startsWith('/uploads/')) {
          // Relative file path
          console.log('📷 Processing relative file path...');
          const fullPath = path.join(process.cwd(), prescriptionImage.startsWith('/') ? prescriptionImage.substring(1) : prescriptionImage);
          if (fs.existsSync(fullPath)) {
            imagePath = fullPath;
            console.log('✅ Found file:', imagePath);
          } else {
            console.error('❌ Image file not found:', fullPath);
            return res.status(400).json({
              success: false,
              message: 'Prescription image file not found',
            });
          }
        } else {
          console.error('❌ Unknown image format:', prescriptionImage.substring(0, 50));
          return res.status(400).json({
            success: false,
            message: 'Invalid prescription image format. Please provide base64, file path, or URL.',
          });
        }
        
        // Extract text from image
        if (imagePath && fs.existsSync(imagePath)) {
          prescriptionText = await extractTextFromImage(imagePath);
          
          // Clean up temp file if it was created
          if (imagePath.includes('temp_prescription_')) {
            try {
              fs.unlinkSync(imagePath);
              console.log('✅ Cleaned up temp file');
            } catch (error) {
              console.error('Error deleting temp file:', error);
            }
          }
        } else {
          throw new Error('Image path is invalid or file does not exist');
        }
        console.log('✅ Extracted text from image, length:', prescriptionText?.length || 0);
        if (prescriptionText) {
          console.log('📄 First 500 chars of extracted text:', prescriptionText.substring(0, 500));
        }
      } catch (ocrError: any) {
        console.error('❌ Error extracting text from image:', ocrError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to extract text from prescription image',
          error: ocrError.message,
        });
      }
    }

    if (!prescriptionText) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from prescription image',
      });
    }

    console.log('🔍 Starting AI analysis with text length:', prescriptionText.length);
    // Mock AI analysis - in real implementation, integrate with AI service
    const analysisResult = await performAIAnalysis(prescriptionText, prescriptionImage);
    console.log('✅ AI analysis completed. Found medicines:', analysisResult.foundMedicines.length, 'Not found:', analysisResult.notFoundMedicines.length);

    res.json({
      success: true,
      data: analysisResult,
    });
    return;
  } catch (error) {
    console.error('Prescription analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};

// Mock AI analysis function
async function performAIAnalysis(prescriptionText?: string, prescriptionImage?: string): Promise<any> {
  // This is a mock implementation
  // In real scenario, integrate with AI service like OpenAI, Google Vision, etc.
  
  const foundMedicines: any[] = [];
  const notFoundMedicines: any[] = [];
  const analysisNotes: string[] = [];
  let totalEstimatedPrice = 0;
  let requiresConsultation = false;
  let confidence = 0.85; // Mock confidence score

  if (prescriptionText) {
    // Simple text analysis
    const lines = prescriptionText.split('\n').map(line => line.trim()).filter(line => line);
    
    console.log(`📝 Total lines to analyze: ${lines.length}`);
    console.log(`📝 First 10 lines:`, lines.slice(0, 10));
    
    // Tìm vị trí của "Thuốc điều trị" để chỉ quét từ đó trở xuống
    let medicineSectionStartIndex = -1;
    const medicineSectionKeywords = [
      'thuốc điều trị',
      'thuốc điều tri',
      'thuoc dieu tri',
      'thuoc dieu trị',
      'thuốc điều tri',
      'thuoc điều trị'
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lowerLine = line.toLowerCase();
      if (medicineSectionKeywords.some(keyword => lowerLine.includes(keyword))) {
        medicineSectionStartIndex = i;
        console.log(`✅ Found "Thuốc điều trị" at line ${i + 1}: "${line}"`);
        break;
      }
    }
    
    // Nếu không tìm thấy "Thuốc điều trị", tìm các pattern khác như "1)", "1.", v.v.
    if (medicineSectionStartIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        // Tìm dòng bắt đầu bằng số và dấu chấm hoặc ngoặc đơn (ví dụ: "1)", "1.", "1) Celecoxib")
        // Hoặc dòng chứa pattern thuốc (tên thuốc + hàm lượng)
        if (/^\d+[\.\)]\s*[A-ZÀ-Ỹ]/.test(line) || 
            /^\d+[\.\)]\s*[a-zA-ZÀ-ỹ]+.*\d+\s*(mg|g|ml|l|mcg|iu|ui|%)/i.test(line)) {
          medicineSectionStartIndex = i;
          console.log(`✅ Found medicine section at line ${i + 1} (starts with number): "${line}"`);
          break;
        }
      }
    }
    
    // Nếu vẫn không tìm thấy, bắt đầu từ dòng đầu tiên
    if (medicineSectionStartIndex === -1) {
      medicineSectionStartIndex = 0;
      console.log(`⚠️  Could not find "Thuốc điều trị" section, starting from line 1`);
    }
    
    // Xác định điểm dừng (khi gặp các phần không phải thuốc)
    // Lưu ý: KHÔNG match với "Sáng:", "Chiều:", "Tối:", "Trưa:" vì đây là thông tin cách dùng thuốc
    const stopKeywords = [
      'lời dặn',
      'lời dan',
      'loi dan',
      'loi dặn',
      'bác sĩ',
      'bác sy',
      'bac si',
      'bac sy',
      'y sĩ',
      'y sỹ',
      'y si',
      'y sy',
      'khám bệnh lại',
      'khám bệnh lai',
      'số điện thoại liên hệ',
      'so dien thoai lien he',
      'họ và tên người đưa trẻ',
      'ho va ten nguoi dua tre',
      'đã cấp thuốc',
      'da cap thuoc',
      'cộng khoản', // Tổng số thuốc
      'cong khoan'
    ];
    
    let medicineSectionEndIndex = lines.length;
    for (let i = medicineSectionStartIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lowerLine = line.toLowerCase();
      
      // Kiểm tra stop keyword nhưng bỏ qua nếu là thông tin cách dùng thuốc
      // Ví dụ: "Sáng: 1 Viên, Chiều: 1 Viên" - KHÔNG phải stop keyword
      // Chấp nhận lỗi OCR: "Chiêu" thay vì "Chiều", "Vién" thay vì "Viên", "ngdy" thay vì "ngày"
      const isUsageInfo = /(sáng|chiều|chiêu|tối|trưa)\s*:\s*\d+\s*(viên|vién|gói|vi|ml|mg)/i.test(line) ||
                          /\d+\s*(viên|vién|gói)\s*\/\s*(ngày|ngdy)/i.test(line) ||
                          /\[.*(viên|vién|gói).*\]/i.test(line) ||
                          /(viên|vién|gói)\s*\/\s*(ngày|ngdy)/i.test(line) ||
                          /(sáng|chiều|chiêu|tối|trưa).*:\s*\d+/i.test(line);
      
      // Nếu là thông tin cách dùng, tiếp tục quét (không dừng)
      if (isUsageInfo) {
        console.log(`   ℹ️  Skipped usage info line (not a stop keyword): "${line}"`);
        continue;
      }
      
      // Chỉ dừng khi gặp stop keyword thực sự (không phải thông tin cách dùng)
      if (stopKeywords.some(keyword => lowerLine.includes(keyword))) {
        // Kiểm tra lại xem có phải là thông tin cách dùng không
        // Nếu dòng chứa pattern cách dùng (sáng/chiều/tối/trưa + số + viên/gói), không dừng
        const hasUsagePattern = /(sáng|chiều|chiêu|tối|trưa).*:\s*\d+.*(viên|vién|gói)/i.test(line) ||
                                /\d+\s*(viên|vién|gói).*\//i.test(line);
        
        if (!hasUsagePattern) {
          medicineSectionEndIndex = i;
          console.log(`✅ Found stop keyword at line ${i + 1}: "${line}"`);
          break;
        } else {
          console.log(`   ℹ️  Line contains stop keyword but is usage info, continuing: "${line}"`);
        }
      }
    }
    
    console.log(`📋 Medicine section: lines ${medicineSectionStartIndex + 1} to ${medicineSectionEndIndex}`);
    
    // Debug: Log tất cả các dòng trong medicine section
    console.log(`📋 Lines in medicine section:`);
    for (let i = medicineSectionStartIndex; i < Math.min(medicineSectionEndIndex, medicineSectionStartIndex + 20); i++) {
      const line = lines[i];
      if (line) {
        console.log(`   Line ${i + 1}: "${line.substring(0, 100)}${line.length > 100 ? '...' : ''}"`);
      }
    }
    
    // Also try to split by medicine patterns if multiple medicines are on one line
    // Pattern: "1) MEDICINE ... 2) MEDICINE ..."
    const allMedicineMatches: Array<{ text: string; lineIndex: number }> = [];
    
    // CHỈ quét từ phần "Thuốc điều trị" trở xuống
    // Xử lý trường hợp thuốc bị tách thành nhiều dòng do OCR
    // Ghép các dòng liên tiếp lại nếu chúng là một thuốc (dòng sau không bắt đầu bằng số)
    const mergedLines: Array<{ text: string; lineIndex: number }> = [];
    let currentMedicineLine = '';
    let currentLineIndex = -1;
    
    for (let lineIndex = medicineSectionStartIndex; lineIndex < medicineSectionEndIndex; lineIndex++) {
      const line = lines[lineIndex];
      if (!line) continue;
      
      // Skip non-medicine lines (nhưng vẫn quét trong phần thuốc)
      if (line.includes('ĐƠN THUỐC') || 
          line.includes('Họ tên') || 
          line.includes('Tuổi') || 
          (line.includes('Chẩn đoán') && !line.match(/^\d+[\.\)]/))) {
        continue;
      }
      
      // Nếu dòng bắt đầu bằng số (1, 2, 3, 4...) thì đây là thuốc mới
      // Lưu dòng trước đó (nếu có) và bắt đầu dòng mới
      if (/^\d+[\.\)]?\s*[A-ZÀ-Ỹ]/.test(line) || /^\d+\s+[A-ZÀ-Ỹ]/.test(line)) {
        // Lưu dòng trước đó
        if (currentMedicineLine && currentLineIndex >= 0) {
          mergedLines.push({ text: currentMedicineLine.trim(), lineIndex: currentLineIndex });
        }
        // Bắt đầu dòng mới
        currentMedicineLine = line;
        currentLineIndex = lineIndex;
      } else if (currentMedicineLine) {
        // Nếu không bắt đầu bằng số và đang có dòng thuốc đang ghép, tiếp tục ghép
        // Ghép nếu:
        // 1. Dòng này có chữ cái (không phải chỉ số)
        // 2. Không phải thông tin cách dùng (Sáng:, Chiều:, v.v.)
        // 3. Có vẻ là phần tiếp theo của thuốc (bắt đầu bằng chữ cái thường hoặc có dấu +, hoặc chứa tên thuốc)
        const isUsageInfo = /^(sáng|chiều|tối|trưa|chiêu)\s*:/i.test(line.trim());
        
        // Kiểm tra xem dòng hiện tại có phải là phần tiếp theo của thuốc không
        // Các dấu hiệu:
        // 1. Bắt đầu bằng chữ cái thường (có thể là phần tiếp theo của tên thuốc bị tách)
        // 2. Chứa dấu + (như "+ acid clavulanic", "+125mg", "+ 0,3g")
        // 3. Chứa hàm lượng (số + đơn vị như "0,3g", "0.2g", "125mg")
        // 4. Chứa dấu ngoặc đóng ")" (có thể là phần cuối của brand name)
        // 5. Chứa tên thuốc phổ biến hoặc brand name
        const looksLikeMedicineContinuation = /[a-zA-ZÀ-ỹ]/.test(line) && 
          (!isUsageInfo) &&
          (
            // Bắt đầu bằng chữ cái thường (có thể là phần tiếp theo của tên thuốc bị tách)
            /^[a-zà-ỹ]/.test(line.trim()) ||
            // Hoặc chứa dấu + (như "+ acid clavulanic", "+125mg", "+ 0,3g")
            /^\s*\+/.test(line.trim()) ||
            // Hoặc chứa hàm lượng (số + đơn vị)
            /\d+[.,]?\d*\s*(mg|g|ml|viên|gói)/i.test(line) ||
            // Hoặc chứa dấu ngoặc đóng (có thể là phần cuối của brand name)
            /\)/.test(line) ||
            // Hoặc chứa tên thuốc phổ biến hoặc brand name
            /(mg|g|ml|viên|gói|acid|clavulanic|amoxicilin|paracetamol|acetyl|leucin|attapulgit|mezapulgit|hydroxyd|magnesi|carbonat)/i.test(line)
          );
        
        // Ngoài ra, nếu dòng trước có dấu mở ngoặc chưa đóng, hoặc kết thúc bằng dấu + hoặc -, thì dòng này chắc chắn là phần tiếp theo
        const hasUnclosedParenthesis = (currentMedicineLine.match(/\(/g) || []).length > (currentMedicineLine.match(/\)/g) || []).length;
        const endsWithPlusOrMinus = /[+\-]\s*$/.test(currentMedicineLine.trim());
        const definitelyContinuation = hasUnclosedParenthesis || endsWithPlusOrMinus;
        
        if (looksLikeMedicineContinuation || definitelyContinuation) {
          currentMedicineLine += ' ' + line;
        } else {
          // Nếu là thông tin cách dùng hoặc không phải phần tiếp theo, lưu dòng thuốc và bỏ qua dòng này
          if (currentMedicineLine && currentLineIndex >= 0) {
            mergedLines.push({ text: currentMedicineLine.trim(), lineIndex: currentLineIndex });
          }
          currentMedicineLine = '';
          currentLineIndex = -1;
        }
      } else {
        // Nếu không có dòng thuốc đang ghép và dòng này bắt đầu bằng chữ cái thường
        // Có thể là thuốc mới nhưng số thứ tự bị OCR mất (ví dụ: "oxicilin" thay vì "2 Amoxicilin")
        // Hoặc có thể là phần tiếp theo của thuốc từ dòng trước
        // Kiểm tra xem có phải là thuốc mới không
        const looksLikeMedicine = /[a-zA-ZÀ-ỹ]/.test(line) && 
          !/^(sáng|chiều|tối|trưa|chiêu)\s*:/i.test(line.trim()) &&
          (
            // Chứa tên thuốc phổ biến
            /(amoxicilin|paracetamol|acetyl|leucin|attapulgit|mezapulgit|acid|clavulanic|dopagan|gikanin)/i.test(line) ||
            // Chứa hàm lượng rõ ràng
            /\d+\s*(mg|g|ml|viên|gói)/i.test(line) ||
            // Chứa brand name trong ngoặc
            /\([A-Za-zÀ-ỹ]+/.test(line)
          );
        
        if (looksLikeMedicine) {
          // Kiểm tra xem có phải là phần tiếp theo của thuốc cuối cùng không
          // Nếu thuốc cuối cùng chưa có dấu đóng ngoặc hoặc chưa hoàn chỉnh, có thể đây là phần tiếp theo
          let isContinuation = false;
          if (mergedLines.length > 0) {
            const lastIndex = mergedLines.length - 1;
            const lastMedicineEntry = mergedLines[lastIndex];
            if (lastMedicineEntry && lastMedicineEntry.text) {
              const lastMedicine = lastMedicineEntry.text;
              // Nếu thuốc cuối cùng có dấu mở ngoặc nhưng chưa có dấu đóng, hoặc kết thúc bằng dấu +, có thể đây là phần tiếp theo
              const openParens = (lastMedicine.match(/\(/g) || []).length;
              const closeParens = (lastMedicine.match(/\)/g) || []).length;
              const trimmedLast = lastMedicine.trim();
              if (trimmedLast && (openParens > closeParens || trimmedLast.endsWith('+') || trimmedLast.endsWith('-'))) {
                // Có thể là phần tiếp theo, ghép vào thuốc cuối cùng
                lastMedicineEntry.text += ' ' + line;
                isContinuation = true;
                console.log(`   ℹ️  Merged continuation line to previous medicine: "${line}"`);
              }
            }
          }
          
          // Nếu không phải là phần tiếp theo, coi nó là thuốc mới (số thứ tự bị OCR mất)
          if (!isContinuation) {
            // Tự động thêm số thứ tự dựa trên số lượng thuốc đã tìm thấy
            const nextNumber = mergedLines.length + 1;
            // Thêm số thứ tự vào đầu dòng
            const medicineLineWithNumber = `${nextNumber} ${line}`;
            currentMedicineLine = medicineLineWithNumber;
            currentLineIndex = lineIndex;
            console.log(`   ℹ️  Auto-added number ${nextNumber} to medicine line: "${line}"`);
          }
        }
      }
    }
    
    // Lưu dòng cuối cùng (nếu có)
    if (currentMedicineLine && currentLineIndex >= 0) {
      mergedLines.push({ text: currentMedicineLine.trim(), lineIndex: currentLineIndex });
    }
    
    // Hàm helper để sửa các tên thuốc bị OCR thiếu chữ ở đầu
    const fixOcrMedicineNames = (text: string): string => {
      let fixed = text;
      
      // Sửa các tên thuốc phổ biến bị thiếu chữ ở đầu
      const commonFixes: Array<{ pattern: RegExp; replacement: string }> = [
        // "oxicilin" -> "Amoxicilin" (thiếu "Am")
        { pattern: /\boxicilin\b/gi, replacement: 'Amoxicilin' },
        // "moxicilin" -> "Amoxicilin" (thiếu "A")
        { pattern: /\bmoxicilin\b/gi, replacement: 'Amoxicilin' },
        // "cetyl" -> "Acetyl" (thiếu "A")
        { pattern: /\bcetyl\s+leucin\b/gi, replacement: 'Acetyl leucin' },
        // "cetaminophen" -> "Acetaminophen" (thiếu "A")
        { pattern: /\bcetaminophen\b/gi, replacement: 'Acetaminophen' },
        // "aracetamol" -> "Paracetamol" (thiếu "P")
        { pattern: /\baracetamol\b/gi, replacement: 'Paracetamol' },
        // "aracetamol" -> "Paracetamol" (thiếu "P")
        { pattern: /\bracetamol\b/gi, replacement: 'Paracetamol' },
      ];
      
      for (const fix of commonFixes) {
        fixed = fixed.replace(fix.pattern, fix.replacement);
      }
      
      return fixed;
    };
    
    // Hàm helper để làm sạch text OCR (sửa lỗi ký tự, số, khoảng trắng)
    const cleanOcrText = (text: string): string => {
      let cleaned = text;
      
      // Sửa lỗi OCR phổ biến:
      // 1. "l4" -> "14" (chữ "l" thường bị OCR nhầm với số "1")
      cleaned = cleaned.replace(/\bl(\d+)\b/gi, '1$1');
      // 2. "l" đứng trước số (không phải từ) -> "1"
      cleaned = cleaned.replace(/\bl(\d)/gi, '1$1');
      // 3. "I" (chữ I hoa) đứng trước số -> "1"
      cleaned = cleaned.replace(/\bI(\d)/g, '1$1');
      // 4. "|" (pipe) đứng trước số -> "1"
      cleaned = cleaned.replace(/\|(\d)/g, '1$1');
      // 5. Sửa "215g" -> "2,5g" (nếu có context Mezapulgit)
      if (/mezapulgit/i.test(cleaned) && /215g/i.test(cleaned)) {
        cleaned = cleaned.replace(/215g/gi, '2,5g');
      }
      // 6. Sửa format hàm lượng: "-2,5g" -> "- 2,5g" (thêm khoảng trắng sau dấu -)
      cleaned = cleaned.replace(/-(\d+[.,]?\d*\s*(?:mg|g|ml))/gi, '- $1');
      // 7. Sửa format hàm lượng: "+0,3g" -> "+ 0,3g" (thêm khoảng trắng sau dấu +)
      cleaned = cleaned.replace(/\+\s*(\d+[.,]?\d*\s*(?:mg|g|ml))/gi, '+ $1');
      // 8. Sửa "Viên)" -> "Viên" (nếu có dấu ngoặc đóng thừa)
      cleaned = cleaned.replace(/(\d+\s*(?:Viên|Gói|Vién))\)/gi, '$1');
      // 9. Loại bỏ khoảng trắng thừa
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      // 10. Sửa các pattern như "-215g +" -> "- 2,5g +" (nếu có context Mezapulgit)
      if (/mezapulgit/i.test(cleaned)) {
        cleaned = cleaned.replace(/-215g\s*\+/gi, '- 2,5g +');
        cleaned = cleaned.replace(/-2,5g\s*\+\s*0\.3g\s*\+\s*0\.2g/gi, '- 2,5g + 0,3g + 0,2g');
        cleaned = cleaned.replace(/-2,5g\s*\+\s*0,3g\s*\+\s*0,2g/gi, '- 2,5g + 0,3g + 0,2g');
      }
      // 11. Loại bỏ các ký tự lạ ở cuối (như "+" đơn độc không có gì sau, hoặc "-" đơn độc)
      // Nhưng chỉ loại bỏ nếu không có dấu ngoặc mở chưa đóng
      const openParens = (cleaned.match(/\(/g) || []).length;
      const closeParens = (cleaned.match(/\)/g) || []).length;
      if (openParens === closeParens) {
        cleaned = cleaned.replace(/\s*[+\-]\s*$/, '');
      }
      
      return cleaned;
    };
    
    // Áp dụng sửa lỗi OCR cho tất cả các dòng đã merge
    for (const lineEntry of mergedLines) {
      if (lineEntry && lineEntry.text) {
        const original = lineEntry.text;
        const fixed = fixOcrMedicineNames(original);
        if (fixed !== original) {
          console.log(`   🔧 Fixed OCR error: "${original.substring(0, 50)}..." -> "${fixed.substring(0, 50)}..."`);
          lineEntry.text = fixed;
        }
      }
    }
    
    console.log(`📋 Merged ${mergedLines.length} medicine lines from ${medicineSectionEndIndex - medicineSectionStartIndex} original lines`);
    
    // Sử dụng mergedLines thay vì quét trực tiếp từ lines
    for (const { text: line, lineIndex } of mergedLines) {
      
      // Find all medicine patterns in the line (support both "1." and "1)" formats)
      // Match pattern: number followed by . or ) followed by space and medicine name
      // Pattern should match: "1) SIMETHICON 80mg" or "1. SIMETHICON 80mg" hoặc "1 Acetyl leucin"
      // Also handle multiple medicines on same line: "1) MED1 ... 2) MED2 ..."
      // Use lookahead to stop at next medicine number or end of line
      const medicinePattern = /\d+[\.\)]?\s*((?:(?!\s*\d+[\.\)]).)+?)(?=\s*\d+[\.\)]|$)/g;
      let match;
      let foundAny = false;
      
      // Reset regex lastIndex to avoid issues
      medicinePattern.lastIndex = 0;
      
      while ((match = medicinePattern.exec(line)) !== null) {
        foundAny = true;
        const medicineText = match[1]?.trim();
        
        // Filter out numbers only (like "38") immediately
        if (medicineText && medicineText.length > 2) {
          // Check if it's just numbers
          const cleaned = medicineText.replace(/^[\.\s]+/, '').replace(/[\.\s]+$/, '').trim();
          if (!/^\d+$/.test(cleaned) && /[a-zA-ZÀ-ỹ]/.test(cleaned)) {
            allMedicineMatches.push({
              text: medicineText,
              lineIndex
            });
            console.log(`   Found medicine pattern: "${medicineText}"`);
          } else {
            console.log(`   ⚠️  Skipped invalid pattern (numbers only): "${medicineText}"`);
          }
        }
      }
      
      // If no pattern match found, try simple pattern at start of line
      // Hỗ trợ cả "1 Acetyl leucin" (không có dấu chấm/ngoặc)
      if (!foundAny) {
        const simpleMatch = line.match(/^\d+[\.\)]?\s*(.+)/);
        if (simpleMatch && simpleMatch[1]) {
          const medicineText = simpleMatch[1].trim();
          
          // Filter out numbers only (like "38") immediately
          if (medicineText && medicineText.length > 2) {
            const cleaned = medicineText.replace(/^[\.\s]+/, '').replace(/[\.\s]+$/, '').trim();
            if (!/^\d+$/.test(cleaned) && /[a-zA-ZÀ-ỹ]/.test(cleaned)) {
              allMedicineMatches.push({
                text: medicineText,
                lineIndex
              });
              console.log(`   Found medicine at start of line: "${medicineText}"`);
            } else {
              console.log(`   ⚠️  Skipped invalid pattern (numbers only): "${medicineText}"`);
            }
          }
        }
      }
      
      // Also try to detect medicine names without number prefix (for OCR errors)
      // Look for lines that start with common medicine name patterns
      // Pattern: Starts with capital letter followed by letters, possibly with parentheses
      // Examples: "Acetyl leucin (Gikanin 500mg)", "Paracetamol (Dopagan 500mg)"
      if (!foundAny && line.length > 10) {
        // Loại bỏ ngay các dòng header như "Thuốc điều trị: . x"
        const lowerLine = line.toLowerCase().trim();
        if (lowerLine.startsWith('thuốc điều trị') || lowerLine.startsWith('thuoc dieu tri') || 
            lowerLine.startsWith('thuốc điều tri') || lowerLine.startsWith('thuoc điều trị') ||
            lowerLine === 'thuốc điều trị' || lowerLine === 'thuoc dieu tri' ||
            /^thuốc\s+điều\s+trị\s*[:.]/.test(lowerLine)) {
          console.log(`   ⚠️  Skipped header line: "${line}"`);
          continue;
        }
        
        // Tìm pattern thuốc: tên thuốc (có thể có parentheses) + hàm lượng
        // Ví dụ: "Acetyl leucin (Gikanin 500mg - 500mg)" hoặc "Amoxicilin + acid clavulanic (Auclanityl 500/125mg)"
        // Hoặc chỉ cần có tên thuốc rõ ràng (bắt đầu bằng chữ hoa, có ít nhất 4 chữ cái)
        const medicineNamePattern = /^([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[a-zà-ỹ]+)*(?:\s*\+\s*[a-zà-ỹ]+(?:\s+[a-zà-ỹ]+)*)?(?:\s*\([^)]+\))*(?:\s*\([^)]+\))?)/;
        const nameMatch = line.match(medicineNamePattern);
        if (nameMatch && nameMatch[1]) {
          const potentialMedicine = nameMatch[1].trim();
          // Check if it looks like a medicine name (has letters, not just numbers)
          // Và có chứa hàm lượng hoặc tên thuốc rõ ràng
          const hasDosage = /\d+\s*(mg|g|ml|l|mcg|iu|ui|%)/i.test(line);
          const hasMedicineName = /[a-zA-ZÀ-ỹ]{4,}/.test(potentialMedicine);
          
          // Loại bỏ các dòng chỉ chứa thông tin cách dùng (không có tên thuốc)
          const isOnlyUsageInfo = /^(sáng|chiều|tối|trưa|uống|dùng)\s*:/i.test(line.trim()) &&
                                  !hasMedicineName;
          
          if (!isOnlyUsageInfo && potentialMedicine.length >= 5 && hasMedicineName && (hasDosage || potentialMedicine.length > 10)) {
            // Check if it's not a common non-medicine word
            const lowerText = potentialMedicine.toLowerCase();
            const nonMedicineWords = [
              'họ tên', 'tuổi', 'giới tính', 'địa chỉ', 'chẩn đoán', 'bác sĩ', 'bệnh viện',
              'thuốc điều trị', 'thuoc dieu tri', 'thuốc điều tri', 'thuoc điều trị',
              'sáng', 'chiều', 'tối', 'trưa', 'uống', 'dùng'
            ];
            if (!nonMedicineWords.some(word => lowerText.startsWith(word) || lowerText === word)) {
              allMedicineMatches.push({
                text: line, // Use full line for better context
                lineIndex
              });
              console.log(`   Found medicine without number prefix: "${potentialMedicine}"`);
              foundAny = true;
            }
          }
        } else {
          // Nếu không match pattern trên, thử tìm tên thuốc đơn giản hơn
          // Tìm dòng có chứa tên thuốc phổ biến hoặc pattern thuốc
          const simpleMedicinePattern = /([A-ZÀ-Ỹ][a-zà-ỹ]{3,}(?:\s+[a-zà-ỹ]+)*(?:\s*\+\s*[a-zà-ỹ]+)?)/;
          const simpleMatch = line.match(simpleMedicinePattern);
          if (simpleMatch && simpleMatch[1]) {
            const simpleMedicine = simpleMatch[1].trim();
            const hasDosage = /\d+\s*(mg|g|ml|l|mcg|iu|ui|%)/i.test(line);
            const lowerText = simpleMedicine.toLowerCase();
            
            // Loại bỏ các từ không phải thuốc
            const nonMedicineWords = ['sáng', 'chiều', 'tối', 'trưa', 'uống', 'dùng', 'viên', 'gói'];
            const isNotMedicine = nonMedicineWords.some(word => lowerText === word || lowerText.startsWith(word + ' '));
            
            if (!isNotMedicine && simpleMedicine.length >= 5 && (hasDosage || simpleMedicine.length > 8)) {
              allMedicineMatches.push({
                text: line,
                lineIndex
              });
              console.log(`   Found medicine with simple pattern: "${simpleMedicine}"`);
              foundAny = true;
            }
          }
        }
      }
    }
    
    console.log(`🔍 Found ${allMedicineMatches.length} medicine patterns in text`);
    
    // Filter out invalid medicine patterns (numbers only, BHYT codes, etc.)
    const isValidMedicineName = (text: string): boolean => {
      if (!text || typeof text !== 'string') return false;
      
      // Remove common prefixes/suffixes and clean
      const cleaned = text.trim()
        .replace(/^[\.\s]+/, '') // Remove leading dots/spaces
        .replace(/[\.\s]+$/, '') // Remove trailing dots/spaces
        .trim();
      
      if (cleaned.length < 3) return false;
      
      // STRICT: Check if it's just numbers (like "38", "81467", "38;", "38.")
      // Check if it's just numbers (like "38", "81467")
      if (/^\d+$/.test(cleaned)) return false;
      
      // Check if it's just numbers with separators (like "38;", "38.", "38,", "38 ")
      if (/^\d+[\.\s;,\-]*$/.test(cleaned)) return false;
      
      // Check if it's mostly numbers with only separators (like "38;", "38.", "38,", "38 ")
      // Remove all non-digits and separators, if result is same length as numbers, it's invalid
      const numbersOnly = cleaned.replace(/[^\d]/g, '');
      const withoutSeparators = cleaned.replace(/[^\d\.\s;,\-]/g, '');
      if (numbersOnly.length >= 2 && numbersOnly.length === withoutSeparators.length) {
        return false; // It's just numbers with separators
      }
      
      // Check if it starts with dot and numbers (like ". 81467 82196 Bs")
      if (/^\.\s*\d+/.test(cleaned)) return false;
      
      // Check if it contains at least one letter (medicine names should have letters)
      if (!/[a-zA-ZÀ-ỹ]/.test(cleaned)) return false;
      
      // Check if it's too short after cleaning
      const lettersOnly = cleaned.replace(/[^a-zA-ZÀ-ỹ]/g, '');
      if (lettersOnly.length < 3) return false;
      
      // Exclude common non-medicine patterns
      const lowerText = cleaned.toLowerCase();
      if (lowerText.includes('bs') && /^\d/.test(cleaned)) return false; // "Bs" with numbers
      if (lowerText.match(/^\d+\s*(bs|bác\s*sĩ)/i)) return false; // "81467 Bs"
      
      // Additional check: if the text is mostly numbers (more than 70% digits), reject it
      const digitCount = (cleaned.match(/\d/g) || []).length;
      if (digitCount > 0 && (digitCount / cleaned.length) > 0.7 && lettersOnly.length < 5) {
        return false;
      }
      
      return true;
    };
    
    // Filter valid medicines - Cải thiện filter để loại bỏ các dòng không phải thuốc
    const validMedicines = allMedicineMatches.filter(({ text }) => {
      if (!isValidMedicineName(text)) return false;
      
      // Loại bỏ các dòng không phải thuốc
      const lowerText = text.toLowerCase().trim();
      
      // Loại bỏ các từ khóa không phải thuốc (các từ khóa này thường xuất hiện trong đơn thuốc nhưng không phải tên thuốc)
      const nonMedicineKeywords = [
        'thuốc điều trị',
        'thuốc điều tri',
        'cách dùng',
        'cách dung',
        'uống',
        'dùng ngoài',
        'sáng',
        'chiều',
        'tối',
        'trưa',
        'sl:',
        'ghi chú',
        'lời dặn',
        'chẩn đoán',
        'họ tên',
        'tuổi',
        'giới tính',
        'địa chỉ',
        'điện thoại',
        'mã số',
        'bảo hiểm',
        'nơi thường trú',
        'nơi tạm trú',
        'bác sĩ',
        'bác sy',
        'y sĩ',
        'khám bệnh',
        'tên đơn vị',
        'cơ sở',
        'đơn thuốc',
        'đơn vị',
        'số định danh',
        'căn cước',
        'hộ chiếu',
        'người bệnh',
        'nếu có',
        'néu có',
        'ton thương',
        'tổn thương',
        'nông',
        'ở cô',
        'cổ',
        'tay',
        'bàn tay',
        'thoái hóa',
        'cột sống',
        'viêm khớp'
      ];
      
      // Loại bỏ các dòng chỉ chứa từ khóa không phải thuốc (không có tên thuốc thực sự)
      // Kiểm tra nếu text bắt đầu bằng từ khóa không phải thuốc và không có tên thuốc sau đó
      const startsWithKeyword = nonMedicineKeywords.some(keyword => {
        if (lowerText.startsWith(keyword + ':') || lowerText.startsWith(keyword + ' ')) {
          // Nếu sau từ khóa không có chữ cái (tên thuốc), thì loại bỏ
          const afterKeyword = text.substring(text.toLowerCase().indexOf(keyword) + keyword.length).trim();
          // Nếu sau từ khóa chỉ có số, dấu câu, hoặc quá ngắn (< 3 ký tự), loại bỏ
          // Hoặc nếu sau từ khóa là địa chỉ, số điện thoại, mã số, v.v. (không phải tên thuốc)
          // Đặc biệt: loại bỏ pattern "Thuốc điều trị: . x" hoặc "Thuốc điều trị: ."
          if (afterKeyword.length < 3 || 
              /^[\d\s:;,\-|\.x]+$/.test(afterKeyword) || // Bao gồm cả dấu chấm và chữ x
              /^\.\s*x?$/.test(afterKeyword) || // Pattern ". x" hoặc "."
              /^[\d\s:;,\-|]+$/.test(afterKeyword) ||
              /^\d+$/.test(afterKeyword) || // Chỉ có số
              /^[A-Z\s,]+$/.test(afterKeyword) && afterKeyword.length > 20) { // Địa chỉ dài (toàn chữ hoa)
            return true;
          }
        }
        // Kiểm tra nếu text chỉ là từ khóa (không có gì sau đó)
        if (lowerText === keyword || lowerText === keyword + ':' || 
            /^thuốc\s+điều\s+trị\s*[:.]\s*\.?\s*x?$/i.test(lowerText)) { // Pattern "Thuốc điều trị: . x"
          return true;
        }
        return false;
      });
      
      if (startsWithKeyword) {
        console.log(`   ⚠️  Skipped non-medicine text (starts with non-medicine keyword): "${text}"`);
        return false;
      }
      
      // Loại bỏ các dòng chứa "Bác sy", "Y sỹ", "khám bệnh" (thông tin bác sĩ, không phải thuốc)
      if (lowerText.includes('bác sy') || lowerText.includes('bác sĩ') || 
          lowerText.includes('y sỹ') || lowerText.includes('y sĩ') ||
          (lowerText.includes('khám bệnh') && !/[a-zA-ZÀ-ỹ]{5,}/.test(text))) {
        console.log(`   ⚠️  Skipped non-medicine text (doctor information): "${text}"`);
        return false;
      }
      
      // Kiểm tra nếu text chứa quá nhiều từ khóa không phải thuốc (>= 2) và không có tên thuốc rõ ràng
      const keywordCount = nonMedicineKeywords.filter(keyword => lowerText.includes(keyword)).length;
      if (keywordCount >= 2) {
        // Kiểm tra xem có tên thuốc thực sự không (có chữ cái, không chỉ là từ khóa)
        const hasMedicineName = /[a-zA-ZÀ-ỹ]{4,}/.test(text); // Ít nhất 4 chữ cái liên tiếp
        if (!hasMedicineName) {
          console.log(`   ⚠️  Skipped non-medicine text (contains ${keywordCount} non-medicine keywords, no medicine name): "${text}"`);
          return false;
        }
      }
      
      // Loại bỏ các dòng quá ngắn hoặc chỉ chứa dấu câu
      if (text.trim().length < 5 || /^[^\wÀ-ỹ]+$/.test(text.trim())) {
        console.log(`   ⚠️  Skipped invalid text (too short or only punctuation): "${text}"`);
        return false;
      }
      
      // Loại bỏ các dòng chỉ chứa chẩn đoán bệnh (thường có mã bệnh như M13, S60, v.v.)
      if (/^[A-Z]\d+\.?\d*/.test(text.trim()) && !/[a-zA-ZÀ-ỹ]{5,}/.test(text)) {
        console.log(`   ⚠️  Skipped diagnosis code (not medicine): "${text}"`);
        return false;
      }
      
      return true;
    });
    console.log(`✅ Filtered to ${validMedicines.length} valid medicine names (removed ${allMedicineMatches.length - validMedicines.length} invalid patterns)`);
    
    // Track các thuốc đã xử lý để tránh duplicate
    const processedMedicines = new Set<string>();
    
    // Process each found medicine
    for (const { text: medicineText, lineIndex } of validMedicines) {
      console.log(`\n📋 Processing medicine from line ${lineIndex + 1}: "${medicineText}"`);
      
      if (medicineText && medicineText.length > 2) {
        // Kiểm tra xem thuốc này đã được xử lý chưa (tránh duplicate)
        // Extract medicine name để so sánh (loại bỏ usage instructions và extract brand/generic name)
        let medicineNameForCheck = medicineText;
        const usagePatternsForCheck = [
          /\s*-\s*(?:Sáng|Tối|Trưa|Chiều|Ngày)/i,
          /\s*SL:\s*\d+/i,
          /\s*Ghi\s+chú:/i,
          /\s*Uống:/i,
          /\s*Cách\s+dùng:/i,
        ];
        for (const pattern of usagePatternsForCheck) {
          const match = medicineNameForCheck.match(pattern);
          if (match && match.index !== undefined) {
            medicineNameForCheck = medicineNameForCheck.substring(0, match.index).trim();
            break;
          }
        }
        
        // Extract brand name hoặc generic name để so sánh chính xác hơn
        // Ưu tiên brand name trong parentheses, sau đó mới đến generic name
        const allParenthesesForCheck = medicineNameForCheck.match(/\(([^)]+)\)/g) || [];
        let keyName = '';
        
        if (allParenthesesForCheck.length > 0) {
          // Lấy brand name từ parentheses cuối cùng
          const lastParenthesesMatch = allParenthesesForCheck[allParenthesesForCheck.length - 1];
          if (lastParenthesesMatch) {
            const lastParentheses = lastParenthesesMatch.replace(/[()]/g, '').trim();
            const brandMatch = lastParentheses.match(/^([A-Za-zÀ-ỹ]+(?:\s+[A-Za-zÀ-ỹ]+)?)/);
            if (brandMatch && brandMatch[1]) {
              keyName = brandMatch[1].trim();
            }
          }
        }
        
        // Nếu không có brand name, lấy generic name (từ đầu, trước parentheses đầu tiên)
        if (!keyName) {
          const beforeFirstParentheses = medicineNameForCheck.split('(')[0]?.trim();
          if (beforeFirstParentheses) {
            // Lấy từ đầu tiên hoặc 2 từ đầu (ví dụ: "Amoxicilin + acid" -> "Amoxicilin")
            const words = beforeFirstParentheses.split(/\s+/);
            keyName = (words[0] || beforeFirstParentheses) || '';
            // Nếu từ đầu có dấu +, lấy cả phần trước dấu +
            if (beforeFirstParentheses.includes('+')) {
              keyName = beforeFirstParentheses.split('+')[0]?.trim() || '';
            }
          }
        }
        
        // Nếu vẫn không có, dùng toàn bộ text (đã loại bỏ usage patterns)
        if (!keyName) {
          keyName = medicineNameForCheck.replace(/\([^)]+\)/g, '').trim();
        }
        
        const medicineKeyForCheck = normalizeForComparison(keyName);
        if (processedMedicines.has(medicineKeyForCheck)) {
          console.log(`ℹ️ Medicine already processed, skipping: "${medicineText}" (key: "${keyName}")`);
          continue;
        }
        processedMedicines.add(medicineKeyForCheck);
        console.log(`✅ Processing new medicine: "${medicineText}" (key: "${keyName}")`);
        
        // Loại bỏ các dòng không phải thuốc ngay từ đầu (TRƯỚC KHI xử lý)
        const lowerMedicineText = medicineText.toLowerCase().trim();
        
        // Kiểm tra nếu đây là dòng không phải thuốc (chẩn đoán, hướng dẫn, thông tin bệnh viện, v.v.)
        const nonMedicinePatterns = [
          /^thuốc\s+điều\s+trị\s*:?\s*$/i,
          /^cách\s+dùng\s*:?\s*/i,
          /^cách\s+dung\s*:?\s*/i,
          /^uống\s*:?\s*/i,
          /^dùng\s+ngoài\s*:?\s*/i,
          /^sáng\s+\d+/i,
          /^chiều\s+\d+/i,
          /^tối\s+\d+/i,
          /^trưa\s+\d+/i,
          /^ton\s+thương/i,
          /^tổn\s+thương/i,
          /^thoái\s+hóa/i,
          /^viêm\s+khớp/i,
          /^cột\s+sống/i,
          /^[a-z]\d+\.?\d*\s*-/i, // Mã chẩn đoán như "M13 -", "S60 -"
          /^\d{3,}\s*\d{3,}\s*\d{3,}/i, // Số điện thoại như "02733 827 458"
          /^điện\s+thoại\s*:?\s*\d+/i, // "Điện thoại: 02733 827 458"
          /^so\s+dien\s+thoai\s*:?\s*\d+/i, // "So dien thoai: 02733 827 458"
        ];
        
        // Kiểm tra các từ khóa không phải thuốc
        const nonMedicineKeywords = [
          'tên đơn vi',
          'tên đơn vị',
          'dia chỉ',
          'địa chỉ',
          'điện thoại',
          'so dien thoai',
          'số điện thoại',
          'số định danh',
          'mã sô bảo hiểm',
          'mã số bảo hiểm',
          'nơi thường trú',
          'bác sy',
          'bác sĩ',
          'y sỹ',
          'y sĩ',
          'khám bệnh'
        ];
        
        // Kiểm tra nếu text là số điện thoại (chỉ chứa số và khoảng trắng/dấu câu)
        const isPhoneNumber = /^[\d\s\-\(\)]+$/.test(medicineText.trim()) && 
                              medicineText.trim().replace(/\D/g, '').length >= 7 &&
                              medicineText.trim().replace(/\D/g, '').length <= 15;
        
        if (isPhoneNumber) {
          console.log(`   ⚠️  Skipped phone number: "${medicineText}"`);
          continue;
        }
        
        // Nếu text chỉ là từ khóa không phải thuốc, bỏ qua
        if (nonMedicinePatterns.some(pattern => pattern.test(medicineText))) {
          console.log(`   ⚠️  Skipped non-medicine line (matches non-medicine pattern): "${medicineText}"`);
          continue; // Bỏ qua dòng này
        }
        
        // Kiểm tra nếu text bắt đầu bằng từ khóa không phải thuốc và không có tên thuốc sau đó
        const isNonMedicineKeyword = nonMedicineKeywords.some(keyword => {
          if (lowerMedicineText.startsWith(keyword)) {
            const afterKeyword = medicineText.substring(medicineText.toLowerCase().indexOf(keyword) + keyword.length).trim();
            // Nếu sau từ khóa chỉ có số, dấu câu, hoặc quá ngắn (< 3 ký tự), hoặc là địa chỉ dài, loại bỏ
            if (afterKeyword.length < 3 || 
                /^[\d\s:;,\-|]+$/.test(afterKeyword) ||
                /^\d+$/.test(afterKeyword) ||
                (/^[A-Z\s,]+$/.test(afterKeyword) && afterKeyword.length > 20)) {
              return true;
            }
          }
          return false;
        });
        
        if (isNonMedicineKeyword) {
          console.log(`   ⚠️  Skipped non-medicine line (starts with non-medicine keyword): "${medicineText}"`);
          continue; // Bỏ qua dòng này
        }
        
        // Extract only medicine name (remove usage instructions, quantity info)
        // Pattern: medicine name ends before "- Sáng", "- Tối", "SL:", "Ghi chú:", "Uống:", etc.
        let medicineNameOnly = medicineText;
        
        // Find the first occurrence of usage instruction patterns
        const usagePatterns = [
          /\s*-\s*(?:Sáng|Tối|Trưa|Chiều|Ngày)/i,
          /\s*SL:\s*\d+/i,
          /\s*Ghi\s+chú:/i,
          /\s*Uống:/i,
          /\s*Cách\s+dùng:/i,
          /\s*Cách\s+dung:/i,
          /\s*Hướng\s+dẫn:/i,
          /\s*Dùng\s+ngoài\s*:/i,
        ];
        
        for (const pattern of usagePatterns) {
          const match = medicineNameOnly.match(pattern);
          if (match && match.index !== undefined) {
            medicineNameOnly = medicineNameOnly.substring(0, match.index).trim();
            break;
          }
        }
        
        // Nếu sau khi loại bỏ usage patterns, text quá ngắn hoặc không có tên thuốc, bỏ qua
        if (medicineNameOnly.length < 3 || !/[a-zA-ZÀ-ỹ]{3,}/.test(medicineNameOnly)) {
          console.log(`   ⚠️  Skipped invalid medicine name (too short or no letters): "${medicineNameOnly}"`);
          continue;
        }
        
        // Extract medicine name from complex formats
        // Format examples:
        // - "Acetyl leucin (Gikanin 500mg - 500mg)" -> extract "Gikanin" from parentheses
        // - "Amoxicilin + acid clavulanic (Auclanityl 500/125mg - 500mg +125mg)" -> extract "Auclanityl"
        // - "Paracetamol (acetaminophen) (Paracetamol 500mg) 500mg" -> extract "Paracetamol" and "500mg"
        // - "Attapulgit mormoiron hoạt hóa + hỗn hợp magnesi carbonat-nhôm hydroxyd (Mezapulgit - 2,5g + 0,3g + 0,2g)" -> extract "Mezapulgit"
        let cleanedText = medicineNameOnly;
        let brandNameFromParentheses: string | null = null;
        let genericName: string | null = null;
        let extractedDosage: string | null = null;
        
        // Extract all parentheses content (handle multiple parentheses)
        const allParentheses = medicineNameOnly.match(/\(([^)]+)\)/g) || [];
        console.log(`📋 Found ${allParentheses.length} parentheses groups:`, allParentheses);
        
        // Try to extract brand name from the LAST parentheses (usually contains brand + dosage)
        if (allParentheses.length > 0) {
          const lastParenthesesMatch = allParentheses[allParentheses.length - 1];
          if (!lastParenthesesMatch) continue;
          const lastParentheses = lastParenthesesMatch.replace(/[()]/g, '').trim();
          console.log(`📋 Last parentheses content: "${lastParentheses}"`);
          
          // Extract brand name (usually the first word before dosage)
          // Pattern: "Gikanin 500mg - 500mg" -> "Gikanin"
          // Pattern: "Paracetamol 500mg" -> "Paracetamol"
          // Pattern: "Auclanityl 500/125mg - 500mg +125mg" -> "Auclanityl"
          const brandMatch = lastParentheses.match(/^([A-Za-zÀ-ỹ]+(?:\s+[A-Za-zÀ-ỹ]+)?)/);
          if (brandMatch && brandMatch[1]) {
            brandNameFromParentheses = brandMatch[1].trim();
            console.log(`📋 Found brand name in last parentheses: "${brandNameFromParentheses}"`);
          }
          
          // Also extract dosage from last parentheses if it contains dosage info
          const dosageMatch = lastParentheses.match(/(\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?)/i);
          if (dosageMatch && dosageMatch[1]) {
            extractedDosage = dosageMatch[1].trim();
            console.log(`📋 Found dosage in last parentheses: "${extractedDosage}"`);
          }
        }
        
        // Extract generic name (first word before any parentheses)
        // Bỏ qua số ở đầu dòng (ví dụ: "1 Acetyl leucin" -> "Acetyl leucin")
        let beforeFirstParentheses = medicineNameOnly.split('(')[0]?.trim();
        if (beforeFirstParentheses) {
          // Bỏ qua số ở đầu (ví dụ: "1 Acetyl leucin" -> "Acetyl leucin")
          beforeFirstParentheses = beforeFirstParentheses.replace(/^\d+[\.\)]?\s*/, '').trim();
          // Lấy từ đầu tiên (hoặc nhiều từ đầu nếu cần)
          const words = beforeFirstParentheses.split(/\s+/);
          if (words.length > 0) {
            // Nếu có dấu +, lấy phần trước dấu + (ví dụ: "Amoxicilin + acid clavulanic" -> "Amoxicilin")
            if (beforeFirstParentheses.includes('+')) {
              genericName = beforeFirstParentheses.split('+')[0]?.trim() || words[0] || '';
            } else {
              // Luôn ưu tiên lấy 2 từ đầu nếu có để tránh match sai
              // Ví dụ: "Acetyl leucin" -> lấy cả 2 từ để tránh match với "Acetylcysteine"
              // Chỉ lấy 1 từ nếu từ đó đã đủ dài và rõ ràng (>= 10 ký tự) hoặc không có từ thứ 2
              if (words.length >= 2 && words[0] && words[1]) {
                // Lấy 2 từ đầu, trừ khi từ đầu đã đủ dài và rõ ràng (>= 10 ký tự)
                // Ví dụ: "Paracetamol" (10 ký tự) -> giữ nguyên
                // Nhưng "Acetyl" (6 ký tự) -> lấy "Acetyl leucin"
                if (words[0].length >= 10) {
                  genericName = words[0];
                } else {
                  genericName = `${words[0]} ${words[1]}`.trim();
                }
              } else if (words[0]) {
                genericName = words[0];
              } else {
                genericName = '';
              }
            }
          }
          console.log(`📋 Extracted generic name: "${genericName}"`);
        }
        
        // If no brand name in parentheses, try to extract from generic name
        // Remove all parentheses for generic name extraction
        const withoutParentheses = medicineNameOnly.replace(/\([^)]+\)/g, '').trim();
        
        // Clean medicine text (remove any remaining usage instructions, quantity info)
        cleanedText = withoutParentheses
          .replace(/sáng|tối|trưa|chiều|ngày|SL:\s*\d+/gi, '')
          .trim();
        
        // Extract dosage from cleaned text if not found in parentheses
        if (!extractedDosage) {
          const dosageMatch = cleanedText.match(/(\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|l|mcg|iu|ui|%)?)?)/i);
          if (dosageMatch && dosageMatch[1]) {
            extractedDosage = dosageMatch[1].trim();
            console.log(`📋 Found dosage in cleaned text: "${extractedDosage}"`);
          }
        }
        
        // Build search terms in priority order
        const searchTerms: string[] = [];
        
        // Priority 1: Brand name with dosage (if available)
        if (brandNameFromParentheses && extractedDosage) {
          searchTerms.push(`${brandNameFromParentheses} ${extractedDosage}`);
          searchTerms.push(`${brandNameFromParentheses}_${extractedDosage.replace(/\s+/g, '')}`);
        }
        
        // Priority 2: Brand name only
        if (brandNameFromParentheses) {
          searchTerms.push(brandNameFromParentheses);
        }
        
        // Priority 3: Generic name with dosage
        if (genericName && extractedDosage) {
          searchTerms.push(`${genericName} ${extractedDosage}`);
          searchTerms.push(`${genericName}_${extractedDosage.replace(/\s+/g, '')}`);
        }
        
        // Priority 4: Generic name only
        if (genericName) {
          searchTerms.push(genericName);
        }
        
        // Priority 5: Cleaned text
        if (cleanedText && !searchTerms.includes(cleanedText)) {
          searchTerms.push(cleanedText);
        }
        
        // Remove duplicates
        const uniqueSearchTerms = [...new Set(searchTerms.filter(t => t && t.length > 2))];
        
        console.log(`\n📋 ========== MEDICINE EXTRACTION SUMMARY ==========`);
        console.log(`📋 Original medicine text: "${medicineText}"`);
        console.log(`📋 Medicine name only: "${medicineNameOnly}"`);
        console.log(`📋 Generic name: "${genericName}"`);
        console.log(`📋 Brand name from parentheses: "${brandNameFromParentheses}"`);
        console.log(`📋 Extracted dosage: "${extractedDosage}"`);
        console.log(`📋 Cleaned text: "${cleanedText}"`);
        console.log(`📋 Search terms (priority order):`, uniqueSearchTerms);
        console.log(`📋 =================================================\n`);
        
        // Try to find exact match with all search terms in priority order
        let exactMatch: any = null;
        let matchedSearchTerm: string | null = null;
        // Keep similarMedicines scoped for this medicine across all fallback strategies
        let similarMedicines: any[] = [];
        // Initialize aiAnalysis to avoid undefined errors
        let aiAnalysis: { category: string; subcategory: string; dosageForm: string; route: string; analysisText: string } | null = null;
        // Khai báo biến ở scope cao nhất của vòng lặp để có thể sử dụng ở mọi nơi
        let hasAll4TargetConditions = false;
        
        for (const searchTerm of uniqueSearchTerms) {
          console.log(`🔍 [${uniqueSearchTerms.indexOf(searchTerm) + 1}/${uniqueSearchTerms.length}] Searching for exact match: "${searchTerm}"`);
          exactMatch = await findExactMatch(searchTerm, medicineNameOnly);
          
          if (exactMatch && exactMatch.product) {
            matchedSearchTerm = searchTerm;
            console.log(`✅ Found match with search term: "${searchTerm}"`);
            break;
          } else {
            console.log(`❌ No match with search term: "${searchTerm}"`);
          }
        }
        
        if (exactMatch && exactMatch.product) {
          console.log(`\n✅ ========== EXACT MATCH FOUND ==========`);
          console.log(`✅ Matched search term: "${matchedSearchTerm}"`);
          console.log(`✅ Product name: ${exactMatch.product.name}`);
          console.log(`✅ Match type: ${exactMatch.matchType}`);
          console.log(`✅ Confidence: ${exactMatch.confidence}`);
          console.log(`✅ ======================================\n`);
          
          // Found exact match!
          const product = exactMatch.product;
          const productId = product._id ? String(product._id) : (product.id ? String(product.id) : 'unknown');
          
          // Get description from medicines collection if product doesn't have it
          const description = await getProductDescription(product);
          
          const productData = {
            productId,
            productName: product.name || medicineText,
            price: product.price || 0,
            originalPrice: product.originalPrice || product.price || 0,
            unit: product.unit || 'đơn vị',
            inStock: product.inStock !== undefined ? product.inStock : (product.stockQuantity > 0),
            stockQuantity: product.stockQuantity || 0,
            requiresPrescription: product.isPrescription || false,
            imageUrl: product.imageUrl || '/medicine-images/default-medicine.jpg',
            description: description,
            brand: product.brand || '',
            confidence: exactMatch.confidence,
            matchType: exactMatch.matchType,
            originalText: cleanOcrText(medicineNameOnly), // Only medicine name, not usage instructions (cleaned)
            dosage: extractedDosage || parseMedicineName(cleanedText).dosage
          };
          
          foundMedicines.push(productData);
          totalEstimatedPrice += productData.price;
          
          console.log(`✅ Added to foundMedicines: ${productData.productName} (Total found: ${foundMedicines.length})`);
          
          if (productData.requiresPrescription) {
            analysisNotes.push(`⚠️ ${productData.productName} cần đơn bác sĩ`);
            requiresConsultation = true;
          }
          
          if (productData.stockQuantity < 10) {
            analysisNotes.push(`⚠️ ${productData.productName} sắp hết hàng (còn ${productData.stockQuantity} hộp)`);
          }
        } else {
          // No exact match found, find similar medicines
          console.log(`\n⚠️ ========== NO EXACT MATCH FOUND ==========`);
          console.log(`⚠️ Tried ${uniqueSearchTerms.length} search terms, none matched`);
          console.log(`⚠️ Searching for similar medicines...`);
          console.log(`⚠️ =========================================\n`);
          
          // BƯỚC 1: Sử dụng AI để phân tích tên thuốc và tìm ra 4 điều kiện
          console.log(`🤖 Using AI to analyze medicine: "${medicineNameOnly}"`);
          aiAnalysis = await analyzeMedicineWithAI(medicineNameOnly, extractedDosage || undefined);
          console.log(`🤖 AI Analysis Result:`, aiAnalysis);
          
          // Reset similarMedicines before running fallback strategies
          similarMedicines = [];
          
          // Try all search terms to find similar medicines
          for (const searchTerm of uniqueSearchTerms) {
            console.log(`🔍 Searching similar medicines with: "${searchTerm}"`);
            const similar = await findSimilarMedicines(searchTerm, medicineNameOnly, 5);
            if (similar.length > 0) {
              similarMedicines = similar;
              console.log(`✅ Found ${similar.length} similar medicines with: "${searchTerm}"`);
              break;
            }
          }
          
          console.log(`📦 Found ${similarMedicines.length} similar medicines by name`);
          
          // Khai báo biến ở scope cao hơn để có thể sử dụng ở nhiều nơi
          let targetMedicine = null;
          let targetGroupTherapeutic = '';
          let targetIndication = '';
          let targetActiveIngredient = '';
          let targetSubcategory = '';
          let targetCategory = '';
          let targetDosageForm = '';
          let targetRoute = '';
          
          // LUÔN tìm dựa trên indication/groupTherapeutic từ medicines collection để có kết quả tốt hơn
          // Không chỉ dựa trên tên, mà còn dựa trên công dụng và nhóm hoạt chất
          // Điều này giúp tìm được các thuốc phù hợp hơn ngay cả khi tên không khớp
          console.log(`🔍 Searching medicines collection by indication/groupTherapeutic/activeIngredient...`);
            
            const db = mongoose.connection.db;
            if (db) {
              const medicinesCollection = db.collection('medicines');
              
            // Tìm thuốc có cùng tên, generic name, hoặc activeIngredient để lấy indication
            const searchTerms = [
              genericName,
              cleanedText,
              brandNameFromParentheses,
              ...(cleanedText ? cleanedText.split(/\s+/).filter(w => w.length > 3) : [])
            ].filter(Boolean);
            
            // ƯU TIÊN: Sử dụng kết quả từ AI analysis nếu có
            if (aiAnalysis && aiAnalysis.category) {
              targetCategory = aiAnalysis.category;
              console.log(`   ✅ Using AI category: "${targetCategory}"`);
            }
            if (aiAnalysis && aiAnalysis.subcategory) {
              targetSubcategory = aiAnalysis.subcategory;
              console.log(`   ✅ Using AI subcategory: "${targetSubcategory}"`);
            }
            if (aiAnalysis && aiAnalysis.dosageForm) {
              targetDosageForm = aiAnalysis.dosageForm;
              console.log(`   ✅ Using AI dosageForm: "${targetDosageForm}"`);
            }
            if (aiAnalysis && aiAnalysis.route) {
              targetRoute = aiAnalysis.route;
              console.log(`   ✅ Using AI route: "${targetRoute}"`);
            }
            
            // Nếu AI fail hoặc không có đủ dữ liệu, parse từ prescription text TRƯỚC khi tìm trong DB
            // Điều này quan trọng để tránh bị ghi đè bởi dữ liệu sai từ DB
            // Sử dụng toàn bộ text bao gồm cả medicineNameOnly để có đầy đủ thông tin
            const originalTextLower = (medicineNameOnly || medicineText || cleanedText || '').toLowerCase();
            const isTopicalOriginal = /%\/\s*g|\bgel\b|\bemulgel\b|\bcream\b|\bkem\b|\bthuốc\s*bôi\b|\bthuoc\s*boi\b|\btuýp\b|\btuyp\b|\bointment\b|\bmỡ\b|\bmo\b/i
              .test(originalTextLower);
            // Sử dụng toàn bộ text để parse route và dosageForm
            const fullTextForRoute = ((medicineText || '') + ' ' + (cleanedText || '') + ' ' + (medicineNameOnly || '')).toLowerCase();
            const fullTextForDosageForm = ((medicineText || '') + ' ' + (cleanedText || '') + ' ' + (medicineNameOnly || '')).toLowerCase();
            
            // Parse route từ prescription text nếu AI không có
            if (!targetRoute) {
              if (/dùng\s+ngoài|dung\s+ngoai|topical/i.test(fullTextForRoute) || isTopicalOriginal) {
                targetRoute = 'Dùng ngoài';
                console.log(`   🔍 Parsed route from prescription text: "Dùng ngoài"`);
              } else if (/uống|uong|oral/i.test(fullTextForRoute)) {
                targetRoute = 'Uống';
                console.log(`   🔍 Parsed route from prescription text: "Uống"`);
              }
            }
            
            // Parse dosageForm từ prescription text nếu AI không có
            if (!targetDosageForm) {
              if (/gel|emulgel/i.test(fullTextForDosageForm)) {
                targetDosageForm = 'Gel';
                console.log(`   🔍 Parsed dosageForm from prescription text: "Gel"`);
              } else if (/cream|kem/i.test(fullTextForDosageForm)) {
                targetDosageForm = 'Cream';
                console.log(`   🔍 Parsed dosageForm from prescription text: "Cream"`);
              } else if (/ointment|mỡ|mo/i.test(fullTextForDosageForm)) {
                targetDosageForm = 'Ointment';
                console.log(`   🔍 Parsed dosageForm from prescription text: "Ointment"`);
              } else if (/tuýp|tuyp|tube/i.test(fullTextForDosageForm)) {
                if (isTopicalOriginal || targetRoute === 'Dùng ngoài') {
                  targetDosageForm = 'Gel';
                } else {
                  targetDosageForm = 'Tube';
                }
                console.log(`   🔍 Parsed dosageForm from prescription text: "${targetDosageForm}"`);
              } else if (/viên|vien|tablet/i.test(fullTextForDosageForm)) {
                targetDosageForm = 'Tablet';
                console.log(`   🔍 Parsed dosageForm from prescription text: "Tablet"`);
              } else if (/capsule|nang/i.test(fullTextForDosageForm)) {
                targetDosageForm = 'Capsule';
                console.log(`   🔍 Parsed dosageForm from prescription text: "Capsule"`);
              }
            }
            
            // Nếu vẫn chưa có route/dosageForm và có dấu hiệu dạng bôi, set mặc định
            if (!targetRoute && isTopicalOriginal) {
              targetRoute = 'Dùng ngoài';
              console.log(`   🔍 Set route to "Dùng ngoài" based on topical indicators`);
            }
            if (!targetDosageForm && isTopicalOriginal) {
              targetDosageForm = 'Gel';
              console.log(`   🔍 Set dosageForm to "Gel" based on topical indicators`);
            }
            
            // Tìm với nhiều pattern hơn - không chỉ firstWord
            for (const searchTerm of searchTerms) {
              if (searchTerm && searchTerm.length > 2) {
                // Escape các ký tự đặc biệt trong regex để tránh lỗi MongoDB
                const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                targetMedicine = await medicinesCollection.findOne({
                  $or: [
                    { name: { $regex: `^${escapedSearchTerm}`, $options: 'i' } },
                    { genericName: { $regex: `^${escapedSearchTerm}`, $options: 'i' } },
                    { name: { $regex: escapedSearchTerm, $options: 'i' } },
                    { genericName: { $regex: escapedSearchTerm, $options: 'i' } },
                    { activeIngredient: { $regex: escapedSearchTerm, $options: 'i' } },
                    { brand: { $regex: escapedSearchTerm, $options: 'i' } }
                  ]
                });
                
                if (targetMedicine) {
                  // Kiểm tra xem targetMedicine có đúng không (tên phải chứa searchTerm)
                  const targetNameLower = (targetMedicine.name || '').toLowerCase();
                  const targetGenericNameLower = (targetMedicine.genericName || '').toLowerCase();
                  const searchTermLower = searchTerm.toLowerCase();
                  
                  // Chỉ dùng targetMedicine nếu tên hoặc genericName chứa searchTerm (tránh match sai)
                  const isCorrectMatch = targetNameLower.includes(searchTermLower) || 
                                        targetGenericNameLower.includes(searchTermLower) ||
                                        (targetMedicine.activeIngredient || '').toLowerCase().includes(searchTermLower);
                  
                  if (isCorrectMatch) {
                    // CHỈ dùng dữ liệu từ medicines collection nếu AI chưa có hoặc không đầy đủ
                    // ƯU TIÊN: Dữ liệu từ AI analysis (đã được set ở trên)
                    if (!targetGroupTherapeutic) {
                      targetGroupTherapeutic = targetMedicine.groupTherapeutic || '';
                    }
                    if (!targetIndication) {
                      targetIndication = targetMedicine.indication || targetMedicine.description || targetMedicine.uses || targetMedicine.congDung || '';
                    }
                    if (!targetActiveIngredient) {
                      targetActiveIngredient = targetMedicine.activeIngredient || '';
                    }
                    // CHỈ ghi đè subcategory, category, dosageForm, route nếu AI chưa có
                    if (!targetSubcategory && targetMedicine.subcategory) {
                      targetSubcategory = targetMedicine.subcategory;
                    }
                    if (!targetCategory && targetMedicine.category) {
                      targetCategory = targetMedicine.category;
                    }
                    if (!targetDosageForm && targetMedicine.dosageForm) {
                      targetDosageForm = targetMedicine.dosageForm;
                    }
                    if (!targetRoute && targetMedicine.route) {
                      targetRoute = targetMedicine.route;
                    }
                    console.log(`🔍 Found target medicine in medicines collection: ${targetMedicine.name}`);
                    console.log(`   Indication: ${targetIndication}`);
                    console.log(`   GroupTherapeutic: ${targetGroupTherapeutic}`);
                    console.log(`   ActiveIngredient: ${targetActiveIngredient}`);
                    console.log(`   Subcategory: ${targetSubcategory || 'N/A'} ${aiAnalysis?.subcategory ? '(from AI)' : '(from DB)'}`);
                    console.log(`   Category: ${targetCategory || 'N/A'} ${aiAnalysis?.category ? '(from AI)' : '(from DB)'}`);
                    console.log(`   DosageForm: ${targetDosageForm || 'N/A'} ${aiAnalysis?.dosageForm ? '(from AI)' : '(from DB)'}`);
                    console.log(`   Route: ${targetRoute || 'N/A'} ${aiAnalysis?.route ? '(from AI)' : '(from DB)'}`);
                    break;
                  } else {
                    // Match sai - bỏ qua và tiếp tục tìm
                    console.log(`⚠️ Found incorrect match: ${targetMedicine.name} (doesn't contain "${searchTerm}"), continuing search...`);
                    targetMedicine = null; // Reset để tiếp tục tìm
                  }
                }
              }
            }
            
            // Sử dụng toàn bộ text thuốc gốc để xác định dạng dùng (uống / bôi)
            const medicineNameLower = (genericName || cleanedText || medicineNameOnly || '').toLowerCase();

            // LUÔN chạy hardcoded mapping để đảm bảo targetGroupTherapeutic được set đúng
            // Điều này quan trọng để tìm được các thuốc tương tự như Etoricoxib cho Celecoxib
            // Mapping các thuốc NSAID phổ biến (bao gồm cả COX-2 inhibitors như Celecoxib và Etoricoxib)
            const nsaidMedicines = ['celecoxib', 'etoricoxib', 'meloxicam', 'diclofenac', 'ibuprofen', 'naproxen', 'indomethacin', 'piroxicam', 'ketoprofen', 'rofecoxib', 'valdecoxib'];
            const isNSAID = nsaidMedicines.some(name => medicineNameLower.includes(name));
            
            if (isNSAID) {
              // Ưu tiên groupTherapeutic từ targetMedicine nếu có và đúng, nếu không dùng hardcoded
              if (!targetGroupTherapeutic || targetGroupTherapeutic.toLowerCase() !== 'nsaid') {
                targetGroupTherapeutic = 'NSAID';
                console.log(`🔍 Detected NSAID medicine: ${genericName || cleanedText}`);
                console.log(`   Setting targetGroupTherapeutic = 'NSAID' (hardcoded mapping)`);
              }
              // Ưu tiên indication từ targetMedicine nếu có và hợp lý, nếu không dùng hardcoded
              if (!targetIndication || targetIndication.length < 10 || (!targetIndication.toLowerCase().includes('đau') && !targetIndication.toLowerCase().includes('viêm'))) {
                targetIndication = 'Giảm đau, kháng viêm';
                console.log(`   Setting targetIndication = 'Giảm đau, kháng viêm' (hardcoded mapping)`);
              }
            }
            
            // Nếu không tìm thấy trong medicines collection, thử hardcoded mapping cho các thuốc phổ biến khác
            if (!targetMedicine || (!targetGroupTherapeutic && !targetIndication)) {
              
              // Mapping các thuốc Corticosteroid (Prednisolon, Prednisone, Dexamethasone, etc.)
              const corticosteroidMedicines = ['prednisolon', 'prednisone', 'dexamethasone', 'methylprednisolon', 'hydrocortisone', 'betamethasone'];
              const isCorticosteroid = corticosteroidMedicines.some(name => medicineNameLower.includes(name));
              
              if (isCorticosteroid) {
                targetGroupTherapeutic = 'Corticosteroid';
                targetIndication = 'Chống viêm, ức chế miễn dịch, điều trị các bệnh tự miễn';
                console.log(`🔍 Detected Corticosteroid medicine: ${genericName || cleanedText}`);
                console.log(`   Using default Corticosteroid groupTherapeutic and indication`);
              }
              
              // Mapping các thuốc kháng sinh phổ biến
              const antibioticMedicines = ['amoxicillin', 'amoxicilin', 'ampicillin', 'penicillin', 'cephalexin', 'cefuroxime', 'azithromycin', 'clarithromycin', 'erythromycin'];
              const isAntibiotic = antibioticMedicines.some(name => medicineNameLower.includes(name));
              
              if (isAntibiotic) {
                targetGroupTherapeutic = 'Kháng sinh';
                targetIndication = 'Điều trị nhiễm khuẩn';
                console.log(`🔍 Detected Antibiotic medicine: ${genericName || cleanedText}`);
                console.log(`   Using default Antibiotic groupTherapeutic and indication`);
              }
              
              // Nếu vẫn không tìm được, thử tìm trong medicines collection dựa trên từ khóa trong tên
              if (!targetGroupTherapeutic && !targetIndication && searchTerms.length > 0) {
                // Tìm các thuốc có tên tương tự hoặc chứa từ khóa
                const keywordSearch = searchTerms.find(term => term && term.length > 3);
                if (keywordSearch) {
                  // Escape ký tự đặc biệt trong regex
                  const escapedKeywordSearch = keywordSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const similarMedicinesInDB = await medicinesCollection.find({
                    $or: [
                      { name: { $regex: escapedKeywordSearch, $options: 'i' } },
                      { genericName: { $regex: escapedKeywordSearch, $options: 'i' } },
                      { activeIngredient: { $regex: escapedKeywordSearch, $options: 'i' } }
                    ]
                  }).limit(5).toArray();
                  
                  if (similarMedicinesInDB.length > 0) {
                    // Lấy thông tin từ thuốc đầu tiên tìm được
                    targetMedicine = similarMedicinesInDB[0];
                    if (targetMedicine) {
                      targetGroupTherapeutic = targetMedicine.groupTherapeutic || '';
                      targetIndication = targetMedicine.indication || targetMedicine.description || targetMedicine.uses || targetMedicine.congDung || '';
                      targetActiveIngredient = targetMedicine.activeIngredient || '';
                      console.log(`🔍 Found similar medicine in DB: ${targetMedicine.name}`);
                      console.log(`   Using its groupTherapeutic and indication`);
                    }
                  }
                }
              }
            }
            
            // QUAN TRỌNG: CHỈ tiếp tục nếu có ĐỦ 4 điều kiện (category, subcategory, dosageForm, route)
            // Đây là yêu cầu bắt buộc để đề xuất thuốc hợp lý và đúng nhất
            hasAll4TargetConditions = !!(targetCategory && targetSubcategory && targetDosageForm && targetRoute);
            
            if (!hasAll4TargetConditions) {
              console.log(`⚠️  THIẾU 4 ĐIỀU KIỆN BẮT BUỘC - Không thể đề xuất thuốc`);
              console.log(`   Category: ${targetCategory || 'N/A'}`);
              console.log(`   Subcategory: ${targetSubcategory || 'N/A'}`);
              console.log(`   DosageForm: ${targetDosageForm || 'N/A'}`);
              console.log(`   Route: ${targetRoute || 'N/A'}`);
              console.log(`   ⚠️  Yêu cầu: CẢ 4 điều kiện phải có đầy đủ để đề xuất thuốc`);
              // KHÔNG tiếp tục tìm kiếm nếu thiếu bất kỳ điều kiện nào
            } else {
              console.log(`✅ ĐỦ 4 ĐIỀU KIỆN - Sẽ chỉ đề xuất thuốc khớp CẢ 4 điều kiện`);
              console.log(`   Category: ${targetCategory}`);
              console.log(`   Subcategory: ${targetSubcategory}`);
              console.log(`   DosageForm: ${targetDosageForm}`);
              console.log(`   Route: ${targetRoute}`);
            
            // Chỉ tiếp tục tìm kiếm nếu có đủ 4 điều kiện
            if (hasAll4TargetConditions) {
                  
                  // BƯỚC 1: Ưu tiên tìm thuốc CÙNG HOẠT CHẤT (activeIngredient) trước
                  let medicinesWithSameActiveIngredient: any[] = [];
                  let activeIngredientToSearch = '';
                  
                  // Lấy hoạt chất từ targetMedicine nếu có
                  if (targetMedicine && targetMedicine.activeIngredient) {
                    activeIngredientToSearch = (targetMedicine.activeIngredient || '').toLowerCase();
                  } else if (genericName && genericName.length > 3) {
                    // Nếu không có targetMedicine, dùng genericName làm hoạt chất để tìm
                    activeIngredientToSearch = genericName.toLowerCase();
                    console.log(`🔍 No targetMedicine found, using genericName as activeIngredient: "${activeIngredientToSearch}"`);
                  }
                  
                  if (activeIngredientToSearch) {
                    // Tách hoạt chất chính (từ đầu, trước dấu phẩy hoặc dấu cách)
                    const mainActiveIngredient = activeIngredientToSearch.split(/[,;]/)[0]?.trim();
                    if (mainActiveIngredient && mainActiveIngredient.length > 3 && mainActiveIngredient) {
                      console.log(`🔍 Priority: Searching medicines with same activeIngredient: "${mainActiveIngredient}"`);
                      
                      // Tìm theo nhiều pattern: chính xác, chứa, và các biến thể
                      // Ví dụ: "diclofenac" sẽ tìm "Diclofenac", "Diclofenac diethylamine", "Diclofenac sodium", etc.
                  // Escape ký tự đặc biệt trong regex
                  const escapedMainActiveIngredient = mainActiveIngredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const searchCriteria: any = {
                        $or: [
                          // Tìm trong activeIngredient: chứa hoạt chất chính
                          { activeIngredient: { $regex: escapedMainActiveIngredient, $options: 'i' } },
                          // Tìm trong genericName
                          { genericName: { $regex: escapedMainActiveIngredient, $options: 'i' } },
                          // Tìm trong name (có thể có brand name chứa hoạt chất)
                          { name: { $regex: escapedMainActiveIngredient, $options: 'i' } }
                        ]
                      };
                      
                      if (targetMedicine) {
                        searchCriteria._id = { $ne: targetMedicine._id };
                      }
                      
                      medicinesWithSameActiveIngredient = await medicinesCollection.find(searchCriteria)
                        .limit(15) // Tăng limit để tìm nhiều hơn
                        .toArray();
                      console.log(`📦 Found ${medicinesWithSameActiveIngredient.length} medicines with same activeIngredient: "${mainActiveIngredient}"`);
                      
                      // Log để debug
                      if (medicinesWithSameActiveIngredient.length > 0) {
                        console.log(`   Medicines found:`, medicinesWithSameActiveIngredient.map(m => ({
                          name: m.name,
                          activeIngredient: m.activeIngredient || 'N/A',
                          genericName: m.genericName || 'N/A'
                        })));
                      } else {
                        console.log(`   ⚠️ No medicines found with activeIngredient containing "${mainActiveIngredient}"`);
                      }
                    }
                  }
                  
                  // Tìm thuốc dựa trên 4 điều kiện: category, subcategory, dosageForm, route
                  // ƯU TIÊN: Tìm thuốc có CẢ 4 điều kiện (nếu có đầy đủ), sau đó mới đến các điều kiện khác
                  const db = mongoose.connection.db;
                  if (db) {
                    const medicinesCollection = db.collection('medicines');
                  const searchCriteria: any = {};
                  if (targetMedicine) {
                    searchCriteria._id = { $ne: targetMedicine._id };
                  }
                  
                    // Tạo điều kiện AND cho 4 tiêu chí chính: category, subcategory, dosageForm, route
                    const andConditions: any[] = [];
                  const orConditions: any[] = [];
                  
                  // ƯU TIÊN 1: Tìm thuốc có CẢ 4 điều kiện (category, subcategory, dosageForm, route) - độ chính xác cao nhất
                  if (targetCategory && targetSubcategory && targetDosageForm && targetRoute) {
                    andConditions.push({ category: targetCategory });
                    andConditions.push({ subcategory: targetSubcategory });
                    andConditions.push({ dosageForm: targetDosageForm });
                    andConditions.push({ route: targetRoute });
                    console.log(`   Priority 1: Searching by ALL 4 conditions: category="${targetCategory}", subcategory="${targetSubcategory}", dosageForm="${targetDosageForm}", route="${targetRoute}"`);
                  } else {
                    // Nếu không có đầy đủ 4 điều kiện, tìm theo từng điều kiện có sẵn
                    if (targetCategory) {
                      andConditions.push({ category: targetCategory });
                      console.log(`   Priority 1a: Searching by category: "${targetCategory}"`);
                    }
                    if (targetSubcategory) {
                      andConditions.push({ subcategory: targetSubcategory });
                      console.log(`   Priority 1b: Searching by subcategory: "${targetSubcategory}"`);
                    }
                    if (targetDosageForm) {
                      andConditions.push({ dosageForm: targetDosageForm });
                      console.log(`   Priority 1c: Searching by dosageForm: "${targetDosageForm}"`);
                    }
                    if (targetRoute) {
                      andConditions.push({ route: targetRoute });
                      console.log(`   Priority 1d: Searching by route: "${targetRoute}"`);
                    }
                  }
                  
                  // ƯU TIÊN 2: Tìm cùng activeIngredient (nếu có) - thêm vào AND conditions
                  if (targetActiveIngredient) {
                    const mainActiveIngredient = targetActiveIngredient.split(/[,;]/)[0]?.trim();
                    if (mainActiveIngredient && mainActiveIngredient.length > 3) {
                      const escapedMainActiveIngredient = mainActiveIngredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      andConditions.push({ 
                        $or: [
                          { activeIngredient: { $regex: escapedMainActiveIngredient, $options: 'i' } },
                          { genericName: { $regex: escapedMainActiveIngredient, $options: 'i' } }
                        ]
                      });
                      console.log(`   Priority 2: Searching by activeIngredient: "${mainActiveIngredient}"`);
                    }
                  }
                  
                  // Fallback: Nếu không tìm thấy với AND conditions, thử tìm với OR conditions
                  // ƯU TIÊN 3: Tìm cùng groupTherapeutic (nếu có) - chỉ dùng khi không có đủ 4 điều kiện
                  if (targetGroupTherapeutic && andConditions.length === 0) {
                    orConditions.push({ groupTherapeutic: targetGroupTherapeutic });
                    const escapedTargetGroupTherapeutic = targetGroupTherapeutic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    orConditions.push({ groupTherapeutic: { $regex: escapedTargetGroupTherapeutic, $options: 'i' } });
                    const groupLower = targetGroupTherapeutic.toLowerCase();
                    if (groupLower.includes('nsaid') || groupLower.includes('anti-inflammatory') || groupLower.includes('kháng viêm')) {
                      orConditions.push({ 
                        groupTherapeutic: { 
                          $regex: /nsaid|anti-inflammatory|kháng viêm|giảm đau/i 
                        } 
                      });
                    } else if (groupLower.includes('corticosteroid') || groupLower.includes('cortico')) {
                      orConditions.push({ 
                        groupTherapeutic: { 
                          $regex: /corticosteroid|cortico|prednisolon|prednisone|dexamethasone/i 
                        } 
                      });
                    } else if (groupLower.includes('kháng sinh') || groupLower.includes('antibiotic')) {
                      orConditions.push({ 
                        groupTherapeutic: { 
                          $regex: /kháng sinh|antibiotic|amoxicillin|penicillin/i 
                        } 
                      });
                    }
                    console.log(`   Priority 3 (fallback): Searching by groupTherapeutic: "${targetGroupTherapeutic}"`);
                  }
                  
                  // ƯU TIÊN 4: Tìm cùng indication (nếu có) - chỉ dùng khi không có đủ 4 điều kiện
                  if (targetIndication && andConditions.length === 0) {
                    orConditions.push({ indication: targetIndication });
                    const escapedTargetIndication = targetIndication.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    orConditions.push({ indication: { $regex: escapedTargetIndication, $options: 'i' } });
                    
                    const indicationKeywords = targetIndication
                      .toLowerCase()
                      .split(/[,\s;]+/)
                      .filter(word => word.length > 3 && !['điều', 'trị', 'các', 'bệnh', 'và', 'cho'].includes(word));
                    
                    for (const keyword of indicationKeywords.slice(0, 5)) {
                      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      orConditions.push({ indication: { $regex: escapedKeyword, $options: 'i' } });
                      orConditions.push({ description: { $regex: escapedKeyword, $options: 'i' } });
                      orConditions.push({ uses: { $regex: escapedKeyword, $options: 'i' } });
                      orConditions.push({ congDung: { $regex: escapedKeyword, $options: 'i' } });
                    }
                    console.log(`   Priority 4 (fallback): Searching by indication: "${targetIndication}"`);
                  }
                  
                  // Áp dụng điều kiện tìm kiếm: ưu tiên AND (4 điều kiện), sau đó mới đến OR (fallback)
                  if (andConditions.length > 0) {
                    searchCriteria.$and = andConditions;
                    console.log(`   ✅ Using AND conditions (${andConditions.length} conditions)`);
                  } else if (orConditions.length > 0) {
                    searchCriteria.$or = orConditions;
                    console.log(`   ⚠️ Using OR conditions (fallback, ${orConditions.length} conditions)`);
                  }
                    
                    const medicinesWithSameIndication = await medicinesCollection.find(searchCriteria)
                      .limit(20) // Tăng limit để có nhiều kết quả hơn cho việc lọc
                      .toArray();
                    
                    console.log(`📦 Found ${medicinesWithSameIndication.length} medicines with search criteria`);
                    
                    // Tìm trực tiếp trong Products collection để tìm các thuốc như Etoricoxib
                    // ngay cả khi không có trong medicines collection hoặc không có groupTherapeutic
                    let additionalProductsFromDB: any[] = [];
                    // LUÔN tìm trong Products collection nếu là NSAID (kể cả khi targetGroupTherapeutic chưa được set)
                    // Sử dụng lại danh sách NSAID từ scope trên
                    const nsaidMedicinesList = ['celecoxib', 'etoricoxib', 'meloxicam', 'diclofenac', 'ibuprofen', 'naproxen', 'indomethacin', 'piroxicam', 'ketoprofen', 'rofecoxib', 'valdecoxib'];
                    const isNSAIDMedicine = targetGroupTherapeutic?.toLowerCase().includes('nsaid') || 
                                           nsaidMedicinesList.some(name => medicineNameLower.includes(name));
                    if (isNSAIDMedicine) {
                      console.log(`🔍 Searching directly in Products collection for NSAID medicines (including Etoricoxib)...`);
                      // Đảm bảo targetGroupTherapeutic được set
                      if (!targetGroupTherapeutic) {
                        targetGroupTherapeutic = 'NSAID';
                        console.log(`   Setting targetGroupTherapeutic = 'NSAID' for Products search`);
                      }
                      
                      // Tìm các thuốc NSAID phổ biến trong Products collection
                      // Ưu tiên các thuốc COX-2 inhibitors như Etoricoxib, Celecoxib vì chúng tương tự nhau
                      const nsaidProductNames = ['etoricoxib', 'celecoxib', 'meloxicam', 'diclofenac', 'ibuprofen', 'naproxen', 'indomethacin', 'piroxicam', 'ketoprofen'];
                      for (const nsaidName of nsaidProductNames) {
                        // Bỏ qua nếu đã tìm thấy trong medicines collection
                        const alreadyFound = medicinesWithSameIndication.some(m => 
                          (m.name || '').toLowerCase().includes(nsaidName) ||
                          (m.genericName || '').toLowerCase().includes(nsaidName)
                        );
                        
                        // Bỏ qua nếu đã có trong foundMedicines (đã match chính xác)
                        const alreadyInPrescription = foundMedicines.some(fm => 
                          (fm.productName || '').toLowerCase().includes(nsaidName)
                        );
                        
                        if (!alreadyFound && !alreadyInPrescription) {
                          const products = await Product.find({
                            name: { $regex: nsaidName, $options: 'i' },
                            inStock: true,
                            stockQuantity: { $gt: 0 }
                          }).limit(3);
                          
                          for (const product of products) {
                            // Kiểm tra xem đã có trong foundMedicines chưa
                            if (!isMedicineAlreadyInPrescription(product, foundMedicines)) {
                              additionalProductsFromDB.push({
                                product: product,
                                groupTherapeutic: 'NSAID',
                                indication: 'Giảm đau, kháng viêm',
                                isFromProducts: true // Đánh dấu là tìm từ Products collection
                              });
                            }
                          }
                        }
                      }
                      console.log(`📦 Found ${additionalProductsFromDB.length} additional NSAID products from Products collection`);
                    }
                    
                    // Lọc thuốc dựa trên 4 điều kiện: category, subcategory, dosageForm, route
                    // QUAN TRỌNG: CHỈ đề xuất thuốc có CẢ 4 điều kiện (bắt buộc)
                    const medicinesWithAll4Conditions: any[] = [];
                    
                    // Kiểm tra xem có đủ 4 điều kiện để tìm kiếm không
                    hasAll4TargetConditions = !!(targetCategory && targetSubcategory && targetDosageForm && targetRoute);
                    
                    if (!hasAll4TargetConditions) {
                      console.log(`⚠️  Missing target conditions - Category: ${targetCategory || 'N/A'}, Subcategory: ${targetSubcategory || 'N/A'}, DosageForm: ${targetDosageForm || 'N/A'}, Route: ${targetRoute || 'N/A'}`);
                      console.log(`   ⚠️  Cannot suggest medicines - need ALL 4 conditions: category, subcategory, dosageForm, route`);
                    } else {
                      console.log(`✅ All 4 target conditions available - will only suggest medicines matching ALL 4 conditions`);
                    }
                    
                    // BƯỚC 1: Lọc từ medicinesWithSameIndication
                    for (const m of medicinesWithSameIndication) {
                      // CHỈ lấy thuốc có CẢ 4 điều kiện khớp (sử dụng hàm helper để so sánh linh hoạt)
                      const matchResult = await matchesAll4Conditions(m, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                      
                      // CHỈ thêm vào nếu có CẢ 4 điều kiện
                      if (matchResult.matches) {
                        medicinesWithAll4Conditions.push(m);
                        console.log(`   ✅ Added medicine matching all 4 conditions: ${m.name || m.productName}`);
                      } else {
                        console.log(`   ⚠️ Medicine does not match all 4 conditions: ${m.name || m.productName}`);
                        console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${m.category || 'N/A'} vs ${targetCategory})`);
                        console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${m.subcategory || 'N/A'} vs ${targetSubcategory})`);
                        console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${m.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                        console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${m.route || 'N/A'} vs ${targetRoute})`);
                      }
                    }
                    
                    // BƯỚC 2: Kiểm tra các thuốc trong medicinesWithSameActiveIngredient (như Voltaren Emulgel)
                    // Các thuốc này có thể không có trong medicinesWithSameIndication nhưng vẫn phù hợp
                    for (const ai of medicinesWithSameActiveIngredient) {
                      // Kiểm tra xem đã có trong medicinesWithAll4Conditions chưa
                      const alreadyIncluded = medicinesWithAll4Conditions.some(m => String(m._id) === String(ai._id));
                      
                      if (!alreadyIncluded) {
                        // Kiểm tra 4 điều kiện
                        const matchResult = await matchesAll4Conditions(ai, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                        
                        if (matchResult.matches) {
                          medicinesWithAll4Conditions.push(ai);
                          console.log(`   ✅ Added medicine from same activeIngredient matching all 4 conditions: ${ai.name || ai.productName}`);
                        } else {
                          console.log(`   ⚠️ Medicine from same activeIngredient does not match all 4 conditions: ${ai.name || ai.productName}`);
                          console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${ai.category || 'N/A'} vs ${targetCategory})`);
                          console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${ai.subcategory || 'N/A'} vs ${targetSubcategory})`);
                          console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${ai.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                          console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${ai.route || 'N/A'} vs ${targetRoute})`);
                        }
                      }
                    }
                    
                    console.log(`📊 Filtered medicines by ALL 4 conditions: ${medicinesWithAll4Conditions.length} medicines found`);
                    
                    // CHỈ đề xuất thuốc có CẢ 4 điều kiện
                    // Filter async với Promise.all
                    const medicinesWithSameActiveIngredientAnd4Conditions = await Promise.all(
                      medicinesWithSameActiveIngredient.map(async (ai) => {
                        const m = medicinesWithSameIndication.find(med => String(med._id) === String(ai._id));
                        if (!m) return null;
                        const matchResult = await matchesAll4Conditions(m, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                        return matchResult.matches ? ai : null;
                      })
                    );
                    const filteredActiveIngredientMedicines = medicinesWithSameActiveIngredientAnd4Conditions.filter(m => m !== null) as any[];
                    
                    const allMedicinesToCheck = [
                      ...filteredActiveIngredientMedicines, // Ưu tiên 1: cùng hoạt chất VÀ có CẢ 4 điều kiện
                      ...medicinesWithAll4Conditions.filter(m => 
                        !medicinesWithSameActiveIngredient.some(ai => String(ai._id) === String(m._id))
                      ) // Ưu tiên 2: có cả 4 điều kiện (không trùng với cùng hoạt chất)
                    ];
                    
                    // Lọc và ưu tiên thuốc cùng hàm lượng
                    const normalizedInputDosage = extractedDosage ? normalizeDosageForComparison(extractedDosage) : null;
                    const medicinesWithSameDosage: any[] = [];
                    const medicinesDifferentDosage: any[] = [];
                    
                    // Xử lý các products tìm được trực tiếp từ Products collection (như Etoricoxib)
                    // QUAN TRỌNG: CHỈ thêm nếu có đủ 4 điều kiện (category, subcategory, dosageForm, route)
                    for (const additionalProductData of additionalProductsFromDB) {
                      const product = additionalProductData.product;
                      const alreadyAdded = similarMedicines.some(m => String(m._id) === String(product._id));
                      
                      if (!alreadyAdded) {
                        // Tìm thông tin đầy đủ từ medicines collection để kiểm tra 4 điều kiện
                        const db = mongoose.connection.db;
                        let medicineInfo: any = null;
                        
                        if (db) {
                          const medicinesCollection = db.collection('medicines');
                          const productNameForSearch = product.name?.split('(')[0].trim() || product.name || '';
                          
                          if (productNameForSearch) {
                            medicineInfo = await medicinesCollection.findOne({
                              $or: [
                                { name: { $regex: productNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                                { genericName: { $regex: productNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                                { brand: { $regex: productNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
                              ]
                            });
                          }
                        }
                        
                        // Kiểm tra 4 điều kiện: category, subcategory, dosageForm, route (sử dụng hàm helper)
                        if (hasAll4TargetConditions && medicineInfo) {
                          const matchResult = await matchesAll4Conditions(medicineInfo, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                          
                          // CHỈ thêm nếu có CẢ 4 điều kiện
                          if (!matchResult.matches) {
                            console.log(`   ⚠️ Skipping product from Products collection: ${product.name} - does not match all 4 conditions`);
                            console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${medicineInfo.category || 'N/A'} vs ${targetCategory})`);
                            console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${medicineInfo.subcategory || 'N/A'} vs ${targetSubcategory})`);
                            console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${medicineInfo.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                            console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${medicineInfo.route || 'N/A'} vs ${targetRoute})`);
                            continue; // Bỏ qua thuốc này
                          }
                        } else if (hasAll4TargetConditions) {
                          // Nếu không tìm thấy trong medicines collection nhưng yêu cầu 4 điều kiện, bỏ qua
                          console.log(`   ⚠️ Skipping product from Products collection: ${product.name} - not found in medicines collection`);
                          continue;
                        }
                        
                        // Parse dosage từ product name
                        const productParsed = parseMedicineName(product.name);
                        const normalizedProductDosage = productParsed.dosage ? normalizeDosageForComparison(productParsed.dosage) : null;
                        
                        // Xác định matchReason và confidence
                        let matchReason = 'same_group_therapeutic';
                        let confidence = 0.75; // Cùng nhóm điều trị nhưng khác hoạt chất
                        
                        if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                          confidence = 0.80; // Cùng nhóm và cùng hàm lượng
                        }
                        
                        // Lấy indication và contraindication
                        const finalIndication = medicineInfo?.indication || medicineInfo?.description || medicineInfo?.uses || medicineInfo?.congDung || additionalProductData.indication || 'Giảm đau, kháng viêm';
                        const finalContraindication = medicineInfo?.contraindication || medicineInfo?.chongChiDinh || medicineInfo?.contraindications || await getContraindicationFromMedicines(product.name, 'NSAID');
                        
                        const medicineData = {
                          ...product.toObject(),
                          indication: finalIndication,
                          contraindication: finalContraindication,
                          dosage: productParsed.dosage || '',
                          groupTherapeutic: medicineInfo?.groupTherapeutic || 'NSAID',
                          activeIngredient: medicineInfo?.activeIngredient || medicineInfo?.genericName || productParsed.baseName || '',
                          category: medicineInfo?.category || '',
                          subcategory: medicineInfo?.subcategory || '',
                          dosageForm: medicineInfo?.dosageForm || '',
                          route: medicineInfo?.route || '',
                          matchReason: matchReason,
                          matchExplanation: getMatchExplanation(matchReason, confidence),
                          confidence: confidence
                        };
                        
                        if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                          medicinesWithSameDosage.push(medicineData);
                        } else {
                          medicinesDifferentDosage.push(medicineData);
                        }
                        
                        console.log(`✅ Added product from Products collection: ${product.name} (${Math.round(confidence * 100)}% match) - matches all 4 conditions`);
                      }
                    }
                    
                    // Tìm products tương ứng và phân loại theo hàm lượng
                    for (const medicine of allMedicinesToCheck) {
                      // Tìm product theo nhiều cách: name, description, hoặc brand
                      const medicineNameForSearch = medicine.name?.split('(')[0].trim() || medicine.name || '';
                      const product = await Product.findOne({
                        $or: [
                          { name: { $regex: medicineNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                          { description: { $regex: medicineNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                          { brand: { $regex: medicineNameForSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                          // Nếu có brand trong medicine, tìm theo brand
                          ...(medicine.brand ? [{ name: { $regex: medicine.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }] : [])
                        ]
                      });
                      
                      if (product) {
                        // Kiểm tra xem thuốc này đã có trong đơn (foundMedicines) chưa
                        if (isMedicineAlreadyInPrescription(product, foundMedicines)) {
                          console.log(`   ⚠️ Skipping medicine already in prescription: ${product.name}`);
                          continue;
                        }
                        
                        const alreadyAdded = similarMedicines.some(m => String(m._id) === String(product._id));
                        if (!alreadyAdded) {
                          // Parse dosage từ product name
                          const productParsed = parseMedicineName(product.name);
                          const normalizedProductDosage = productParsed.dosage ? normalizeDosageForComparison(productParsed.dosage) : null;
                          
                          // Xác định matchReason: ưu tiên category > subcategory > activeIngredient > dosageForm > route > dosage > groupTherapeutic
                          const isSameCategory = targetCategory && medicine.category && 
                            targetCategory.toLowerCase() === medicine.category.toLowerCase();
                          const isSameSubcategory = targetSubcategory && medicine.subcategory && 
                            targetSubcategory.toLowerCase() === medicine.subcategory.toLowerCase();
                          const isSameActiveIngredient = medicinesWithSameActiveIngredient.some(ai => String(ai._id) === String(medicine._id));
                          const isSameDosageForm = targetDosageForm && medicine.dosageForm && 
                            targetDosageForm.toLowerCase() === medicine.dosageForm.toLowerCase();
                          const isSameRoute = targetRoute && medicine.route && 
                            targetRoute.toLowerCase() === medicine.route.toLowerCase();
                          const isSameDosage = normalizedInputDosage && normalizedProductDosage && 
                            normalizedInputDosage === normalizedProductDosage;
                            const isSameGroupTherapeutic = targetGroupTherapeutic && medicine.groupTherapeutic && 
                              (targetGroupTherapeutic.toLowerCase() === medicine.groupTherapeutic.toLowerCase() ||
                               (targetGroupTherapeutic.toLowerCase().includes('nsaid') && medicine.groupTherapeutic.toLowerCase().includes('nsaid')) ||
                               (targetGroupTherapeutic.toLowerCase().includes('kháng viêm') && medicine.groupTherapeutic.toLowerCase().includes('kháng viêm')));
                            
                          let matchReason = '';
                          let confidence = 0.70;
                          
                          // Ưu tiên theo thứ tự: category > subcategory > activeIngredient > dosageForm > route > dosage > groupTherapeutic
                          if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameRoute && isSameDosage) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_dosageForm_same_route_same_dosage';
                            confidence = 0.99; // Độ chính xác cao nhất
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameRoute) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_dosageForm_same_route';
                            confidence = 0.98;
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameDosage) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_dosageForm_same_dosage';
                            confidence = 0.96;
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameDosageForm) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_dosageForm';
                            confidence = 0.95;
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameRoute && isSameDosage) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_route_same_dosage';
                            confidence = 0.94;
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient && isSameDosage) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient_same_dosage';
                            confidence = 0.93;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameRoute && isSameDosage) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_dosageForm_same_route_same_dosage';
                            confidence = 0.92;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameDosage) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_dosageForm_same_dosage';
                            confidence = 0.91;
                          } else if (isSameCategory && isSameSubcategory && isSameActiveIngredient) {
                            matchReason = 'same_category_same_subcategory_same_activeIngredient';
                            confidence = 0.90;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameDosageForm && isSameRoute) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_dosageForm_same_route';
                            confidence = 0.89;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameDosageForm) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_dosageForm';
                            confidence = 0.88;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameRoute && isSameDosage) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_route_same_dosage';
                            confidence = 0.87;
                          } else if (isSameSubcategory && isSameActiveIngredient && isSameDosage) {
                            matchReason = 'same_subcategory_same_activeIngredient_same_dosage';
                            confidence = 0.86;
                          } else if (isSameCategory && isSameSubcategory) {
                            matchReason = 'same_category_same_subcategory';
                            confidence = 0.85;
                          } else if (isSameSubcategory && isSameDosageForm && isSameRoute) {
                            matchReason = 'same_subcategory_same_dosageForm_same_route';
                            confidence = 0.84;
                          } else if (isSameSubcategory && isSameDosageForm) {
                            matchReason = 'same_subcategory_same_dosageForm';
                            confidence = 0.83;
                          } else if (isSameActiveIngredient && isSameDosageForm && isSameRoute && isSameDosage) {
                            matchReason = 'same_activeIngredient_same_dosageForm_same_route_same_dosage';
                            confidence = 0.82;
                          } else if (isSameActiveIngredient && isSameDosageForm && isSameDosage) {
                            matchReason = 'same_activeIngredient_same_dosageForm_same_dosage';
                            confidence = 0.81;
                          } else if (isSameActiveIngredient && isSameDosage) {
                            matchReason = 'same_active_ingredient_same_dosage';
                                confidence = 0.80;
                          } else if (isSameSubcategory) {
                            matchReason = 'same_subcategory';
                                confidence = 0.75;
                          } else if (isSameActiveIngredient && isSameDosageForm && isSameRoute) {
                            matchReason = 'same_activeIngredient_same_dosageForm_same_route';
                            confidence = 0.74;
                          } else if (isSameActiveIngredient && isSameDosageForm) {
                            matchReason = 'same_activeIngredient_same_dosageForm';
                            confidence = 0.73;
                          } else if (isSameActiveIngredient) {
                            matchReason = 'same_active_ingredient_different_dosage';
                            confidence = 0.70;
                          } else if (isSameDosageForm && isSameRoute && isSameDosage) {
                            matchReason = 'same_dosageForm_same_route_same_dosage';
                            confidence = 0.69;
                          } else if (isSameDosageForm && isSameDosage) {
                            matchReason = 'same_dosageForm_same_dosage';
                            confidence = 0.68;
                          } else if (isSameGroupTherapeutic && isSameDosage) {
                            matchReason = 'same_group_therapeutic_same_dosage';
                            confidence = 0.75;
                          } else if (isSameGroupTherapeutic) {
                            matchReason = 'same_group_therapeutic';
                            confidence = 0.70;
                            } else {
                              // Không đề xuất nếu khác nhóm điều trị
                              console.log(`   ⚠️ Skipping medicine with different groupTherapeutic: ${product.name} (${medicine.groupTherapeutic} vs ${targetGroupTherapeutic})`);
                              continue;
                          }
                          
                          // Lấy indication đầy đủ từ medicine (ưu tiên indication, sau đó description, uses, congDung)
                          const fullIndication = medicine.indication || 
                                                 medicine.description || 
                                                 medicine.uses || 
                                                 medicine.congDung || 
                                                 '';
                          
                          // Lấy chống chỉ định từ medicine
                          let contraindication = medicine.contraindication || 
                                                medicine.chongChiDinh || 
                                                medicine.contraindications || 
                                                '';
                          
                          // Nếu không có chống chỉ định từ database, sử dụng helper function để lấy (có fallback)
                          if (!contraindication) {
                            const medicineName = medicine.name || product.name || '';
                            contraindication = await getContraindicationFromMedicines(medicineName, medicine.groupTherapeutic, medicine);
                          }
                          
                          // Đảm bảo có đầy đủ thông tin: indication, dosage, matchReason, contraindication
                          const productDosage = productParsed.dosage || extractedDosage || '';
                          
                          // Nếu không có indication, thêm mặc định
                          let finalIndication = fullIndication;
                          if (!finalIndication && medicine.groupTherapeutic) {
                            const groupLower = medicine.groupTherapeutic.toLowerCase();
                            if (groupLower.includes('nsaid') || groupLower.includes('kháng viêm')) {
                              finalIndication = 'Giảm đau, kháng viêm';
                            } else if (groupLower.includes('kháng sinh')) {
                              finalIndication = 'Điều trị nhiễm khuẩn';
                            } else {
                              finalIndication = 'Điều trị theo chỉ định của bác sĩ';
                            }
                          }
                          
                          // Nếu không có contraindication, sử dụng helper function để lấy (có fallback)
                          let finalContraindication = contraindication;
                          if (!finalContraindication) {
                            const medicineName = medicine.name || product.name || '';
                            finalContraindication = await getContraindicationFromMedicines(medicineName, medicine.groupTherapeutic, medicine);
                          }
                          
                          const medicineData = {
                            ...product.toObject(),
                            indication: finalIndication,
                            contraindication: finalContraindication,
                            dosage: productDosage, // Đảm bảo có dosage
                            groupTherapeutic: medicine.groupTherapeutic || '',
                            activeIngredient: medicine.activeIngredient || medicine.genericName || '',
                            category: medicine.category || '',
                            subcategory: medicine.subcategory || '',
                            dosageForm: medicine.dosageForm || '',
                            route: medicine.route || '',
                            matchReason: matchReason,
                            matchExplanation: getMatchExplanation(matchReason, confidence), // Đảm bảo có matchExplanation
                            confidence: confidence
                          };
                          
                          if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                            medicinesWithSameDosage.push(medicineData);
                          } else {
                            medicinesDifferentDosage.push(medicineData);
                          }
                        }
                      } else {
                        // Nếu không tìm thấy product, tạo từ medicine data
                        // Kiểm tra xem thuốc này đã có trong đơn (foundMedicines) chưa
                        if (isMedicineAlreadyInPrescription(medicine, foundMedicines)) {
                          console.log(`   ⚠️ Skipping medicine already in prescription: ${medicine.name}`);
                          continue;
                        }
                        
                        // QUAN TRỌNG: CHỈ đề xuất nếu có CẢ 4 điều kiện khớp (sử dụng hàm helper để so sánh linh hoạt)
                        // Đây là yêu cầu bắt buộc để đảm bảo thuốc đề xuất hợp lý và đúng nhất
                        const matchResult = await matchesAll4Conditions(medicine, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                        
                        // CHỈ thêm nếu có CẢ 4 điều kiện
                        if (!matchResult.matches) {
                          console.log(`   ⚠️ Skipping medicine - does not match all 4 conditions: ${medicine.name}`);
                          console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${medicine.category || 'N/A'} vs ${targetCategory})`);
                          console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${medicine.subcategory || 'N/A'} vs ${targetSubcategory})`);
                          console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${medicine.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                          console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${medicine.route || 'N/A'} vs ${targetRoute})`);
                          continue;
                        }
                        
                        const alreadyAdded = similarMedicines.some(m => 
                          String(m._id) === String(medicine._id) ||
                          (m.name && medicine.name && normalizeForComparison(m.name) === normalizeForComparison(medicine.name))
                        );
                        if (!alreadyAdded) {
                          let imageUrl = medicine.imageUrl || medicine.image || medicine.imagePath || '';
                          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                            imageUrl = `/medicine-images/${imageUrl}`;
                          }
                          if (!imageUrl || imageUrl === '') {
                            imageUrl = '/medicine-images/default-medicine.jpg';
                          }
                          
                          // Lấy indication đầy đủ từ medicine
                          const fullIndication = medicine.indication || 
                                                 medicine.description || 
                                                 medicine.uses || 
                                                 medicine.congDung || 
                                                 '';
                          
                          // Lấy chống chỉ định từ medicine
                          let contraindication = medicine.contraindication || 
                                                medicine.chongChiDinh || 
                                                medicine.contraindications || 
                                                '';
                          
                          // Nếu không có chống chỉ định từ database, sử dụng helper function để lấy (có fallback)
                          if (!contraindication) {
                            const medicineName = medicine.name || medicineText || '';
                            contraindication = await getContraindicationFromMedicines(medicineName, medicine.groupTherapeutic, medicine);
                          }
                          
                          // Đảm bảo có đầy đủ thông tin: indication, dosage, matchReason, contraindication
                          const medicineDosage = parseMedicineName(medicine.name || medicineText).dosage || extractedDosage || '';
                          
                          // Nếu không có indication, thêm mặc định
                          let finalIndication = fullIndication;
                          if (!finalIndication && medicine.groupTherapeutic) {
                            const groupLower = medicine.groupTherapeutic.toLowerCase();
                            if (groupLower.includes('nsaid') || groupLower.includes('kháng viêm')) {
                              finalIndication = 'Giảm đau, kháng viêm';
                            } else if (groupLower.includes('kháng sinh')) {
                              finalIndication = 'Điều trị nhiễm khuẩn';
                            } else {
                              finalIndication = 'Điều trị theo chỉ định của bác sĩ';
                            }
                          }
                          
                          similarMedicines.push({
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
                            indication: finalIndication,
                            contraindication: contraindication,
                            dosage: medicineDosage, // Đảm bảo có dosage
                            groupTherapeutic: medicine.groupTherapeutic || '',
                            category: medicine.category || '',
                            subcategory: medicine.subcategory || '',
                            dosageForm: medicine.dosageForm || '',
                            route: medicine.route || '',
                            matchReason: 'same_indication_different_dosage',
                            matchExplanation: getMatchExplanation('same_indication_different_dosage', 0.70), // Đảm bảo có matchExplanation
                            confidence: 0.70
                          });
                          console.log(`   ✅ Added medicine by indication (no product): ${medicine.name}`);
                        }
                      }
                    }
                    
                    // Ưu tiên thuốc cùng hàm lượng trước
                    // Bao gồm cả các products từ Products collection (như Etoricoxib)
                    let prioritizedMedicines = [...medicinesWithSameDosage, ...medicinesDifferentDosage];
                    
                    // Log để debug
                    console.log(`📊 Prioritized medicines before filtering: ${prioritizedMedicines.length} medicines`);
                    if (prioritizedMedicines.length > 0) {
                      console.log(`   Medicines:`, prioritizedMedicines.map(m => `${m.name || m.productName} (${Math.round((m.confidence || 0) * 100)}%)`));
                    }

                    // Hàm phụ để xác định thuốc dạng bôi (gel/cream/tuýp, %/g, mỡ, v.v.)
                    const isTopicalName = (name: string | undefined): boolean => {
                      if (!name) return false;
                      const lower = name.toLowerCase();
                      return /%\/\s*g|\bgel\b|\bemulgel\b|\bcream\b|\bkem\b|\btuýp\b|\btuyp\b|\bthuốc\s*bôi\b|\bthuoc\s*boi\b|\bointment\b|\bmỡ\b|\bmo\b/.test(lower);
                    };

                    // Nếu thuốc gốc là NSAID và dạng bôi: ưu tiên chỉ các thuốc NSAID dạng bôi
                    if (targetGroupTherapeutic === 'NSAID' && isTopicalOriginal) {
                      const topicalOnly = prioritizedMedicines.filter(m => isTopicalName(m.name || m.productName));
                      if (topicalOnly.length > 0) {
                        prioritizedMedicines = topicalOnly;
                      }
                    }

                    // Nếu thuốc gốc là NSAID và dạng uống: ưu tiên các thuốc NSAID KHÔNG phải dạng bôi
                    if (targetGroupTherapeutic === 'NSAID' && !isTopicalOriginal) {
                      const nonTopical = prioritizedMedicines.filter(m => !isTopicalName(m.name || m.productName));
                      if (nonTopical.length > 0) {
                        prioritizedMedicines = nonTopical;
                      }
                    }

                    // CHỈ thêm thuốc nếu có đủ 4 điều kiện (category, subcategory, dosageForm, route)
                    // QUAN TRỌNG: Đây là yêu cầu BẮT BUỘC - chỉ đề xuất khi có CẢ 4 điều kiện
                    for (const med of prioritizedMedicines) {
                      if (similarMedicines.length >= 5) break;
                      
                      // BẮT BUỘC: Kiểm tra 4 điều kiện - CHỈ thêm nếu có CẢ 4 điều kiện (sử dụng hàm helper)
                      const matchResult = await matchesAll4Conditions(med, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                        
                        // CHỈ thêm nếu có CẢ 4 điều kiện
                      if (!matchResult.matches) {
                          console.log(`   ⚠️ Skipping medicine: ${med.name || med.productName} - does not match all 4 conditions`);
                        console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${med.category || 'N/A'} vs ${targetCategory})`);
                        console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${med.subcategory || 'N/A'} vs ${targetSubcategory})`);
                        console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${med.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                        console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${med.route || 'N/A'} vs ${targetRoute})`);
                          continue; // Bỏ qua thuốc này
                      }
                      
                      similarMedicines.push(med);
                      console.log(`   ✅ Added by indication: ${med.name || med.productName} (${med.matchReason}, confidence: ${med.confidence}) - matches all 4 conditions`);
                    }
                    
                    // Nếu vẫn không tìm thấy và đây là NSAID VÀ có đủ 4 điều kiện, tìm trực tiếp trong products collection
                    // QUAN TRỌNG: CHỈ tìm khi có đủ 4 điều kiện - không có fallback
                    if (similarMedicines.length === 0 && hasAll4TargetConditions && targetGroupTherapeutic === 'NSAID') {
                      console.log(`⚠️ No medicines found in medicines collection, searching directly in products for NSAID medicines...`);
                      
                      let nsaidProductsRaw: any[] = [];
                      
                      // BƯỚC 1: Nếu có hoạt chất (ví dụ: diclofenac từ genericName), tìm trực tiếp trong products
                      if (activeIngredientToSearch) {
                        const mainActiveIngredient = activeIngredientToSearch.split(/[,;]/)[0]?.trim();
                        if (mainActiveIngredient && mainActiveIngredient.length > 3) {
                          console.log(`🔍 Priority: Searching products by activeIngredient: "${mainActiveIngredient}"`);
                          
                          // Tìm trong products theo name, description, brand chứa hoạt chất
                          // Escape ký tự đặc biệt trong regex
                          const escapedMainActiveIngredient = mainActiveIngredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                          nsaidProductsRaw = await Product.find({
                            $or: [
                              { name: { $regex: escapedMainActiveIngredient, $options: 'i' } },
                              { description: { $regex: escapedMainActiveIngredient, $options: 'i' } },
                              { brand: { $regex: escapedMainActiveIngredient, $options: 'i' } }
                            ],
                            inStock: true,
                            stockQuantity: { $gt: 0 }
                          }).limit(20);
                          
                          console.log(`📦 Found ${nsaidProductsRaw.length} products with activeIngredient "${mainActiveIngredient}"`);
                          
                          // Log để debug
                          if (nsaidProductsRaw.length > 0) {
                            console.log(`   Products found:`, nsaidProductsRaw.map(p => p.name));
                          }
                        }
                      }
                      
                      // BƯỚC 2: Nếu không tìm được theo hoạt chất, tìm theo tên thuốc NSAID phổ biến
                      if (nsaidProductsRaw.length === 0) {
                        const nsaidNames = [
                          'meloxicam',
                          'diclofenac',
                          'ibuprofen',
                          'naproxen',
                          'indomethacin',
                          'piroxicam',
                          'ketoprofen',
                          'etoricoxib',
                          'rofecoxib'
                        ];
                        
                        // Xây dựng điều kiện $or: khớp theo name HOẶC description chứa hoạt chất
                        const nsaidProductOrConditions = nsaidNames.flatMap(name => ([
                          { name: { $regex: name, $options: 'i' } },
                          { description: { $regex: name, $options: 'i' } }
                        ]));
                        
                        nsaidProductsRaw = await Product.find({
                          $or: nsaidProductOrConditions,
                          inStock: true,
                          stockQuantity: { $gt: 0 }
                        }).limit(20);
                        
                        console.log(`📦 Found ${nsaidProductsRaw.length} NSAID products by name`);
                      }

                      // Hàm phụ để xác định thuốc dạng bôi (kiểm tra cả name và description)
                      const isTopicalProduct = (product: any): boolean => {
                        const name = (product.name || '').toLowerCase();
                        const description = (product.description || '').toLowerCase();
                        const combined = `${name} ${description}`;
                        return /%\/\s*g|\bgel\b|\bemulgel\b|\bcream\b|\bkem\b|\btuýp\b|\btuyp\b|\bthuốc\s*bôi\b|\bthuoc\s*boi\b|\bointment\b|\bmỡ\b|\bmo\b/.test(combined);
                      };

                      // Ưu tiên dạng bôi nếu thuốc gốc là NSAID dùng ngoài
                      let nsaidProducts = nsaidProductsRaw;
                      if (isTopicalOriginal) {
                        const topicalOnly = nsaidProductsRaw.filter(p => isTopicalProduct(p));
                        if (topicalOnly.length > 0) {
                          nsaidProducts = topicalOnly;
                          console.log(`✅ Filtered to ${topicalOnly.length} topical NSAID products (gel/cream/emulgel)`);
                          console.log(`   Topical products:`, topicalOnly.map(p => p.name));
                        } else {
                          console.log(`⚠️ No topical NSAID products found, will use all NSAID products`);
                        }
                      } else {
                        // Thuốc gốc là NSAID dạng uống: ưu tiên các thuốc không phải dạng bôi
                        const nonTopical = nsaidProductsRaw.filter(p => !isTopicalProduct(p));
                        if (nonTopical.length > 0) {
                          nsaidProducts = nonTopical;
                          console.log(`✅ Filtered to ${nonTopical.length} non-topical NSAID products`);
                        }
                      }

                      // Thêm vào similarMedicines
                      for (const product of nsaidProducts) {
                        // Kiểm tra xem thuốc này đã có trong đơn (foundMedicines) chưa
                        if (isMedicineAlreadyInPrescription(product, foundMedicines)) {
                          console.log(`   ⚠️ Skipping NSAID product already in prescription: ${product.name}`);
                          continue;
                        }
                        
                        const alreadyAdded = similarMedicines.some(m => String(m._id) === String(product._id));
                        if (!alreadyAdded) {
                          // Tìm thông tin từ medicines collection nếu có
                          const medicineInfo = await medicinesCollection.findOne({
                            $or: [
                              { name: { $regex: product.name?.split('(')[0].trim(), $options: 'i' } },
                              { genericName: { $regex: product.name?.split('(')[0].trim(), $options: 'i' } }
                            ]
                          });
                          
                          const productParsed = parseMedicineName(product.name);
                          const normalizedProductDosage = productParsed.dosage ? normalizeDosageForComparison(productParsed.dosage) : null;
                          const normalizedInputDosage = extractedDosage ? normalizeDosageForComparison(extractedDosage) : null;
                          
                          // Xác định matchReason: ưu tiên cùng hoạt chất > cùng nhóm
                          const mainActiveIngredient = activeIngredientToSearch ? activeIngredientToSearch.split(/[,;]/)[0]?.trim() : '';
                          const isSameActiveIngredient = mainActiveIngredient && (
                            (product.name && product.name.toLowerCase().includes(mainActiveIngredient)) ||
                            (product.description && product.description.toLowerCase().includes(mainActiveIngredient))
                          );
                          
                          let matchReason = '';
                          let confidence = 0.70;
                          
                          if (isSameActiveIngredient) {
                            // Cùng hoạt chất
                            if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                              matchReason = 'same_active_ingredient_same_dosage';
                              confidence = 0.90;
                            } else {
                              matchReason = 'same_active_ingredient_different_dosage';
                              confidence = 0.85;
                            }
                          } else {
                            // Chỉ đề xuất nếu cùng nhóm điều trị (NSAID)
                            if (normalizedInputDosage && normalizedProductDosage && normalizedInputDosage === normalizedProductDosage) {
                              matchReason = 'same_group_therapeutic';
                              confidence = 0.80;
                            } else {
                              matchReason = 'same_group_therapeutic';
                              confidence = 0.75;
                            }
                          }
                          
                          // Lấy indication đầy đủ từ medicineInfo (ưu tiên indication, sau đó description, uses, congDung)
                          const fullIndication = medicineInfo?.indication || 
                                                 medicineInfo?.description || 
                                                 medicineInfo?.uses || 
                                                 medicineInfo?.congDung || 
                                                 targetIndication || 
                                                 'Giảm đau, kháng viêm';
                          
                          // Lấy chống chỉ định từ medicineInfo
                          let contraindication = medicineInfo?.contraindication || 
                                                 medicineInfo?.chongChiDinh || 
                                                 medicineInfo?.contraindications || 
                                                 '';
                          
                          // Nếu không có chống chỉ định từ database, sử dụng helper function để lấy (có fallback)
                          const finalGroupTherapeutic = medicineInfo?.groupTherapeutic || targetGroupTherapeutic || 'NSAID';
                          if (!contraindication) {
                            const medicineName = product.name || '';
                            contraindication = await getContraindicationFromMedicines(medicineName, finalGroupTherapeutic, medicineInfo);
                          }
                          
                          // Đảm bảo có đầy đủ thông tin: indication, dosage, matchReason, contraindication
                          const productDosage = parseMedicineName(product.name).dosage || extractedDosage || '';
                          
                          // Nếu không có indication, thêm mặc định
                          let finalIndication = fullIndication;
                          if (!finalIndication && finalGroupTherapeutic) {
                            const groupLower = finalGroupTherapeutic.toLowerCase();
                            if (groupLower.includes('nsaid') || groupLower.includes('kháng viêm')) {
                              finalIndication = 'Giảm đau, kháng viêm';
                            } else if (groupLower.includes('kháng sinh')) {
                              finalIndication = 'Điều trị nhiễm khuẩn';
                            } else {
                              finalIndication = 'Điều trị theo chỉ định của bác sĩ';
                            }
                          }
                          
                          // QUAN TRỌNG: BẮT BUỘC kiểm tra 4 điều kiện - CHỈ thêm nếu có CẢ 4 điều kiện (sử dụng hàm helper)
                          // Đây là yêu cầu bắt buộc để đảm bảo thuốc đề xuất hợp lý và đúng nhất
                          if (medicineInfo) {
                            const matchResult = await matchesAll4Conditions(medicineInfo, targetCategory, targetSubcategory, targetDosageForm, targetRoute);
                            
                            // CHỈ thêm nếu có CẢ 4 điều kiện - không có exception
                            if (!matchResult.matches) {
                              console.log(`   ⚠️ Skipping NSAID product: ${product.name} - does not match all 4 conditions`);
                              console.log(`      Category: ${matchResult.details.category ? '✅' : '❌'} (${medicineInfo.category || 'N/A'} vs ${targetCategory})`);
                              console.log(`      Subcategory: ${matchResult.details.subcategory ? '✅' : '❌'} (${medicineInfo.subcategory || 'N/A'} vs ${targetSubcategory})`);
                              console.log(`      DosageForm: ${matchResult.details.dosageForm ? '✅' : '❌'} (${medicineInfo.dosageForm || 'N/A'} vs ${targetDosageForm})`);
                              console.log(`      Route: ${matchResult.details.route ? '✅' : '❌'} (${medicineInfo.route || 'N/A'} vs ${targetRoute})`);
                              continue; // Bỏ qua thuốc này
                            }
                          } else {
                            // Nếu không có medicineInfo, không thể kiểm tra 4 điều kiện
                            console.log(`   ⚠️ Skipping NSAID product: ${product.name} - no medicineInfo found to check 4 conditions`);
                            continue;
                          }
                          
                          similarMedicines.push({
                            ...product.toObject(),
                            indication: finalIndication,
                            contraindication: contraindication,
                            dosage: productDosage, // Đảm bảo có dosage
                            groupTherapeutic: finalGroupTherapeutic,
                            activeIngredient: medicineInfo?.activeIngredient || medicineInfo?.genericName || activeIngredientToSearch || '',
                            category: medicineInfo?.category || '',
                            subcategory: medicineInfo?.subcategory || '',
                            dosageForm: medicineInfo?.dosageForm || '',
                            route: medicineInfo?.route || '',
                            matchReason: matchReason,
                            matchExplanation: getMatchExplanation(matchReason, confidence), // Đảm bảo có matchExplanation
                            confidence: confidence
                          });
                          console.log(`   ✅ Added NSAID product directly: ${product.name} (${matchReason}, confidence: ${confidence}) - matches all 4 conditions`);
                        }
                      }
                    }
                  } // Đóng if (orConditions.length > 0)
                  } // Đóng if (db)
                }
              } // Đóng if (hasAll4TargetConditions)
            } // Đóng else (nếu có đủ 4 điều kiện)
          
          // KHÔNG có fallback logic nữa - chỉ đề xuất khi có đủ 4 điều kiện
          // Nếu không có đủ 4 điều kiện, sẽ không có suggestions (trả về empty array)
          if (!hasAll4TargetConditions) {
            console.log(`⚠️ Không có đủ 4 điều kiện - KHÔNG đề xuất thuốc (không có fallback)`);
          }
          
          if (similarMedicines.length > 0) {
            console.log(`📋 Similar medicines:`, similarMedicines.map(m => ({ name: m.name, price: m.price, imageUrl: m.imageUrl })));
            // Convert to suggestion format
            // Loại bỏ thuốc đã có trong đơn khỏi suggestions trước khi convert
            const filteredSimilarMedicines = similarMedicines.filter(med => {
              return !isMedicineAlreadyInPrescription(med, foundMedicines);
            });
            
            if (filteredSimilarMedicines.length === 0) {
              console.log(`⚠️ All similar medicines are already in prescription, skipping suggestions`);
              // Vẫn thêm vào notFoundMedicines với empty suggestions
              const medicineKeyForNotFound = normalizeForComparison(medicineNameOnly);
              const alreadyInNotFound = notFoundMedicines.some(nfm => 
                normalizeForComparison(nfm.originalText || '') === medicineKeyForNotFound
              );
              if (!alreadyInNotFound) {
                notFoundMedicines.push({
                  originalText: cleanOcrText(medicineNameOnly),
                  originalDosage: extractedDosage || parseMedicineName(cleanedText).dosage,
                  suggestions: [],
                  aiAnalysis: aiAnalysis || null // Lưu kết quả AI analysis
                });
              }
            } else {
              console.log(`📋 Filtered similar medicines (removed ${similarMedicines.length - filteredSimilarMedicines.length} duplicates):`, filteredSimilarMedicines.map(m => ({ name: m.name, price: m.price, imageUrl: m.imageUrl })));
            }
            
            const suggestions = await Promise.all(filteredSimilarMedicines.map(async (med) => {
              // Normalize imageUrl
              let imageUrl = med.imageUrl || med.image || med.imagePath || '';
              if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
                imageUrl = `/medicine-images/${imageUrl}`;
              }
              if (!imageUrl || imageUrl === '') {
                imageUrl = '/medicine-images/default-medicine.jpg';
              }

              // Get description from medicines collection if med doesn't have it
              const description = await getProductDescription(med);

              // Get indication/description, groupTherapeutic, category, subcategory, dosageForm, route from medicines collection
              let indication = '';
              let groupTherapeutic = '';
              let category = '';
              let subcategory = '';
              let dosageForm = '';
              let route = '';
              let contraindication = med.contraindication || '';
              let medicineInfo: any = null; // Declare medicineInfo here
              
              if (med.indication) {
                indication = med.indication;
              } else if (med.description && med.description.length > 20) {
                indication = med.description;
              }
              
              if (med.groupTherapeutic) {
                groupTherapeutic = med.groupTherapeutic;
              }
              
              // Lấy từ med object trước (đã có từ similarMedicines)
              if (med.category) {
                category = med.category;
              }
              if (med.subcategory) {
                subcategory = med.subcategory;
              }
              if (med.dosageForm) {
                dosageForm = med.dosageForm;
              }
              if (med.route) {
                route = med.route;
              }
              
              // Try to get from medicines collection if not found
                const db = mongoose.connection.db;
                if (db) {
                  const medicinesCollection = db.collection('medicines');
                  medicineInfo = await medicinesCollection.findOne({
                    $or: [
                      { name: { $regex: med.name?.split('(')[0].trim() || '', $options: 'i' } },
                      { brand: { $regex: med.name?.split('(')[0].trim() || '', $options: 'i' } },
                      { genericName: { $regex: med.name?.split('(')[0].trim() || '', $options: 'i' } }
                    ]
                  });
                if (medicineInfo) {
                  if (medicineInfo.indication && !indication) {
                    indication = medicineInfo.indication;
                  }
                  if (medicineInfo.groupTherapeutic && !groupTherapeutic) {
                    groupTherapeutic = medicineInfo.groupTherapeutic;
                  }
                  // Lấy category, subcategory, dosageForm, route từ medicines collection
                  if (medicineInfo.category && !category) {
                    category = medicineInfo.category;
                  }
                  if (medicineInfo.subcategory && !subcategory) {
                    subcategory = medicineInfo.subcategory;
                  }
                  if (medicineInfo.dosageForm && !dosageForm) {
                    dosageForm = medicineInfo.dosageForm;
                  }
                  if (medicineInfo.route && !route) {
                    route = medicineInfo.route;
                  }
                  // Lấy chống chỉ định từ medicines collection
                  if (!contraindication) {
                    contraindication = medicineInfo.contraindication || 
                                      medicineInfo.chongChiDinh || 
                                      medicineInfo.contraindications || 
                                      '';
                  }
                }
              }
              
              // Nếu vẫn không có chống chỉ định, sử dụng helper function để lấy (có fallback)
              if (!contraindication) {
                const medicineName = med.name || med.productName || '';
                const finalGroupTherapeutic = groupTherapeutic || med.groupTherapeutic || '';
                contraindication = await getContraindicationFromMedicines(medicineName, finalGroupTherapeutic, medicineInfo);
              }

              return {
                productId: med._id ? String(med._id) : (med.id ? String(med.id) : 'unknown'),
                productName: med.name || medicineNameOnly,
                price: Number(med.price || 0),
                originalPrice: Number(med.originalPrice || med.price || 0),
                unit: med.unit || 'đơn vị',
                inStock: med.inStock !== undefined ? med.inStock : (Number(med.stockQuantity || 0) > 0),
                stockQuantity: Number(med.stockQuantity || 0),
                requiresPrescription: med.isPrescription || false,
                imageUrl: imageUrl,
                description: description,
                brand: med.brand || '',
                confidence: Number(med.confidence || 0.6),
                matchReason: med.matchReason || 'similar',
                dosage: parseMedicineName(med.name || '').dosage,
                indication: indication, // Thêm indication để giải thích tại sao đề xuất
                groupTherapeutic: groupTherapeutic, // Thêm groupTherapeutic để giải thích nhóm thuốc
                category: category, // Thêm category (danh mục)
                subcategory: subcategory, // Thêm subcategory (nhóm thuốc)
                dosageForm: dosageForm, // Thêm dosageForm (dạng bào chế)
                route: route, // Thêm route (cách dùng)
                contraindication: contraindication, // Thêm chống chỉ định
                matchExplanation: getMatchExplanation(med.matchReason || 'similar', med.confidence || 0.6) // Giải thích tại sao đề xuất
              };
            }));

            // Kiểm tra xem thuốc này đã được thêm vào notFoundMedicines chưa
            const medicineKeyForNotFound = normalizeForComparison(medicineNameOnly);
            const alreadyInNotFound = notFoundMedicines.some(nfm => 
              normalizeForComparison(nfm.originalText || '') === medicineKeyForNotFound
            );
            
            if (!alreadyInNotFound) {
            notFoundMedicines.push({
              originalText: cleanOcrText(medicineNameOnly), // Only medicine name, not usage instructions (cleaned)
              originalDosage: extractedDosage || parseMedicineName(cleanedText).dosage,
              suggestions,
              aiAnalysis: aiAnalysis || null // Lưu kết quả AI analysis
            });
          } else {
              console.log(`ℹ️ Medicine already in notFoundMedicines, skipping: "${medicineNameOnly}"`);
            }
          } else {
            // No similar medicines found - KHÔNG có fallback logic nữa
            // CHỈ đề xuất khi có đủ 4 điều kiện (category, subcategory, dosageForm, route)
            console.log(`⚠️ No similar medicines found - KHÔNG có fallback (yêu cầu đủ 4 điều kiện)`);
            if (!hasAll4TargetConditions) {
              console.log(`   ⚠️ Thiếu điều kiện - không thể đề xuất thuốc`);
                        } else {
              console.log(`   ℹ️ Có đủ 4 điều kiện nhưng không tìm thấy thuốc phù hợp`);
            }
          }
              
            // Kiểm tra xem thuốc này đã được thêm vào notFoundMedicines chưa
          if (similarMedicines.length === 0) {
            const medicineKeyForNotFound = normalizeForComparison(medicineNameOnly);
            const alreadyInNotFound = notFoundMedicines.some(nfm => 
              normalizeForComparison(nfm.originalText || '') === medicineKeyForNotFound
            );
            
            if (!alreadyInNotFound) {
            // Kiểm tra xem thuốc này đã được thêm vào notFoundMedicines chưa
            const medicineKeyForNotFound = normalizeForComparison(medicineNameOnly);
            const alreadyInNotFound = notFoundMedicines.some(nfm => 
              normalizeForComparison(nfm.originalText || '') === medicineKeyForNotFound
            );
            
            if (!alreadyInNotFound) {
              // Vẫn thêm vào notFoundMedicines với empty suggestions để hiển thị thông báo
              notFoundMedicines.push({
                originalText: cleanOcrText(medicineNameOnly), // Cleaned OCR text
                originalDosage: extractedDosage || parseMedicineName(cleanedText).dosage,
                suggestions: [],
                aiAnalysis: aiAnalysis || null // Lưu kết quả AI analysis
              });
            } else {
              console.log(`ℹ️ Medicine already in notFoundMedicines, skipping empty: "${medicineNameOnly}"`);
            }
          }
          }
          
          requiresConsultation = true;
        } // Đóng else block (no exact match found)
      } // Đóng for loop (validMedicines)
    } // Đóng if (prescriptionText)

  // Summary logging
  console.log(`\n📊 ========== ANALYSIS SUMMARY ==========`);
  console.log(`📊 Found medicines (in database): ${foundMedicines.length}`);
  console.log(`📊 Not found medicines (need suggestions): ${notFoundMedicines.length}`);
  console.log(`📊 Total estimated price: ${totalEstimatedPrice.toLocaleString('vi-VN')} ₫`);
  console.log(`📊 ======================================\n`);
  
  if (foundMedicines.length === 0) {
    analysisNotes.push("Không tìm thấy thuốc nào trong đơn. Vui lòng liên hệ tư vấn viên.");
    requiresConsultation = true;
    confidence = 0.3;
  } else if (notFoundMedicines.length > 0) {
    analysisNotes.push(`Tìm thấy ${foundMedicines.length} thuốc, ${notFoundMedicines.length} thuốc cần tư vấn thêm`);
    confidence = 0.7;
  } else {
    analysisNotes.push(`✅ Tìm thấy tất cả ${foundMedicines.length} thuốc trong đơn`);
    confidence = 0.95;
  }

  // Collect all prescription medicines (from OCR) - for "Thuốc đề xuất" section
  const prescriptionMedicines: any[] = [];
  const prescriptionMedicinesKeys = new Set<string>(); // Track để tránh duplicate
  
  // Add found medicines with their original text from prescription
  foundMedicines.forEach(med => {
    const medKey = normalizeForComparison(med.originalText || med.productName || '');
    if (!prescriptionMedicinesKeys.has(medKey)) {
      prescriptionMedicinesKeys.add(medKey);
    prescriptionMedicines.push({
      originalText: med.originalText,
      originalDosage: med.dosage,
      matchedProduct: med, // The matched product
      hasMatch: true
    });
    }
  });
  
  // Add not found medicines - Thêm tất cả, kể cả khi không có suggestions
  // Add formatted suggestion text for each not-found medicine
  for (const med of notFoundMedicines) {
    // Bỏ qua những items không phải là thuốc (như số, địa chỉ, v.v.)
    if (!med.originalText || med.originalText.length < 3 || /^\d+$/.test(med.originalText.trim())) {
      continue;
    }

    // Nếu thuốc này đã có match chính xác trong foundMedicines thì KHÔNG tạo block "Thuốc đề xuất" nữa
    // Ví dụ: Paracetamol 500mg đã tìm thấy đúng thuốc trong kho thì chỉ hiển thị ở "Thuốc có trong đơn"
    // So sánh chính xác hơn: so sánh cả tên và hàm lượng
    const normalizedOriginal = normalizeForComparison(med.originalText);
    const originalDosageNormalized = med.originalDosage ? normalizeDosageForComparison(med.originalDosage) : null;
    
    const hasExactMatchInFound = foundMedicines.some(found => {
      const foundOriginal = found.originalText || found.productName || '';
      const foundDosageNormalized = found.dosage ? normalizeDosageForComparison(found.dosage) : null;
      
      // So sánh tên thuốc (normalized)
      const nameMatch = normalizeForComparison(foundOriginal) === normalizedOriginal;
      
      // Nếu có hàm lượng, so sánh cả hàm lượng
      if (originalDosageNormalized && foundDosageNormalized) {
        return nameMatch && originalDosageNormalized === foundDosageNormalized;
      }
      
      // Nếu không có hàm lượng, chỉ so sánh tên
      return nameMatch;
    });

    if (hasExactMatchInFound) {
      console.log(`ℹ️ Skipping suggestion block for medicine with exact match: "${med.originalText}" (${med.originalDosage || 'no dosage'})`);
      continue;
    }
    
    // Kiểm tra xem thuốc này đã được thêm vào prescriptionMedicines chưa (tránh duplicate)
    const medKey = normalizeForComparison(med.originalText || '');
    if (prescriptionMedicinesKeys.has(medKey)) {
      console.log(`ℹ️ Medicine already in prescriptionMedicines, skipping: "${med.originalText}"`);
      continue;
    }
    prescriptionMedicinesKeys.add(medKey);
    
    if (med.suggestions && med.suggestions.length > 0) {
      // Get the best suggestion (first one, usually highest confidence)
      const bestSuggestion = med.suggestions[0];
      
      // Format professional suggestion text - truyền tất cả suggestions và AI analysis
      const suggestionText = await formatSuggestionText(
        med.originalText,
        med.originalDosage,
        med.suggestions,
        med.aiAnalysis // Truyền kết quả AI analysis
      );
      
      prescriptionMedicines.push({
        originalText: med.originalText,
        originalDosage: med.originalDosage,
        matchedProduct: null,
        suggestions: med.suggestions,
        hasMatch: false,
        suggestionText: suggestionText // Thêm formatted text cho "Thuốc đề xuất"
      });
    } else {
      // Vẫn thêm vào prescriptionMedicines ngay cả khi không có suggestions
      // Để hiển thị thông báo "cần tư vấn thêm"
      prescriptionMedicines.push({
        originalText: med.originalText,
        originalDosage: med.originalDosage,
        matchedProduct: null,
        suggestions: [],
        hasMatch: false,
        suggestionText: `Không tìm thấy chính xác tên thuốc "${med.originalText}" trong hệ thống. Vui lòng liên hệ dược sĩ để được tư vấn về thuốc này.`
      });
    }
  }

  // Find related medicines (same category or similar description) - for "Thuốc có sẵn" section
  // CHỈ tìm related medicines khi ĐÃ CÓ ít nhất 1 match (foundMedicines.length > 0)
  const relatedMedicines: any[] = [];
  const seenRelatedIds = new Set<string>();
  
  // Nếu KHÔNG có match nào VÀ không có suggestions từ notFoundMedicines
  // Thì thêm các thuốc có công dụng tương tự vào prescriptionMedicines
  if (foundMedicines.length === 0 && prescriptionMedicines.length === 0) {
    // Tìm các thuốc có công dụng tương tự dựa trên các thuốc không tìm thấy
    try {
      // Lấy tên các thuốc không tìm thấy để tìm thuốc tương tự
      const notFoundNames = notFoundMedicines.map(m => m.originalText).filter(name => name && name.length > 3);
      
      // Tìm các thuốc có tên tương tự hoặc cùng category
      let relatedProducts: any[] = [];
      
      if (notFoundNames.length > 0) {
        // Tìm thuốc có tên chứa từ khóa từ các thuốc không tìm thấy
        const searchTerms = notFoundNames.map(name => {
          // Lấy từ đầu tiên của tên thuốc
          const firstWord = name.split(/\s+/)[0];
          return firstWord && firstWord.length > 3 ? firstWord : null;
        }).filter(term => term !== null) as string[];
        
        if (searchTerms.length > 0) {
          relatedProducts = await Product.find({
            $or: searchTerms.map(term => {
              // Escape ký tự đặc biệt trong regex
              const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              return { name: { $regex: escapedTerm, $options: 'i' } };
            }),
            inStock: true,
            stockQuantity: { $gt: 0 }
          })
          .limit(10)
          .sort({ isHot: -1, createdAt: -1 });
        }
      }
      
      // Nếu không tìm thấy, lấy các thuốc phổ biến
      if (relatedProducts.length === 0) {
        relatedProducts = await Product.find({
          inStock: true,
          stockQuantity: { $gt: 0 }
        })
        .limit(10)
        .sort({ isHot: -1, createdAt: -1 });
      }
      
      // Nhóm các thuốc theo từng thuốc không tìm thấy
      for (let i = 0; i < notFoundMedicines.length && i < relatedProducts.length; i++) {
        const notFoundMed = notFoundMedicines[i];
        const product = relatedProducts[i];
        if (!notFoundMed || !product) continue;
        const productId = String(product._id);
        
        if (!seenRelatedIds.has(productId)) {
          seenRelatedIds.add(productId);
          
          // Normalize imageUrl
          let imageUrl = product.imageUrl || '';
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
            imageUrl = `/medicine-images/${imageUrl}`;
          }
          if (!imageUrl || imageUrl === '') {
            imageUrl = '/medicine-images/default-medicine.jpg';
          }

          // Get description from medicines collection if product doesn't have it
          const description = await getProductDescription(product);
          
          // Thêm vào prescriptionMedicines như suggestions
          prescriptionMedicines.push({
            originalText: notFoundMed.originalText,
            originalDosage: notFoundMed.originalDosage,
            matchedProduct: null,
            suggestions: [{
              productId: productId,
              productName: product.name || '',
              price: Number(product.price || 0),
              originalPrice: Number(product.originalPrice || product.price || 0),
              unit: product.unit || 'đơn vị',
              inStock: product.inStock !== undefined ? product.inStock : (Number(product.stockQuantity || 0) > 0),
              stockQuantity: Number(product.stockQuantity || 0),
              requiresPrescription: product.isPrescription || false,
              imageUrl: imageUrl,
              description: description,
              brand: product.brand || '',
              dosage: parseMedicineName(product.name || '').dosage,
              confidence: 0.5,
              matchReason: 'related'
            }],
            hasMatch: false
          });
        }
      }
    } catch (error) {
      console.error('Error finding related medicines for suggestions:', error);
    }
  }
  
  // CHỈ tìm relatedMedicines cho "Thuốc có sẵn" khi ĐÃ CÓ ít nhất 1 match
  if (foundMedicines.length > 0) {
    // Collect unique category IDs from found medicines
    const categoryIds = new Set<string>();
    try {
      // Get all found product IDs to fetch their categoryIds
      const foundProductIds = foundMedicines.map(m => m.productId).filter(id => id && id !== 'unknown');
      
      if (foundProductIds.length > 0) {
        // Fetch found products to get their categoryIds
        const foundProducts = await Product.find({
          _id: { $in: foundProductIds.map(id => new mongoose.Types.ObjectId(id)) }
        }).select('categoryId');
        
        foundProducts.forEach(product => {
          if (product.categoryId) {
            categoryIds.add(String(product.categoryId));
          }
        });
      }
    } catch (error) {
      console.error('Error fetching category IDs:', error);
    }

    // Find products in the same categories as found medicines
    try {
      // Get all found product IDs to exclude them from related medicines
      const foundProductIds = foundMedicines.map(m => m.productId).filter(id => id && id !== 'unknown');
      
      let relatedProducts: any[] = [];
      
      // If we have category IDs, find products in those categories
      if (categoryIds.size > 0) {
        relatedProducts = await Product.find({
          _id: { $nin: foundProductIds.map(id => new mongoose.Types.ObjectId(id)) },
          categoryId: { $in: Array.from(categoryIds).map(id => new mongoose.Types.ObjectId(id)) },
          inStock: true,
          stockQuantity: { $gt: 0 }
        })
        .limit(10)
        .sort({ isHot: -1, createdAt: -1 });
      }
      
      // If not enough products, add more from general medicine categories
      if (relatedProducts.length < 10) {
        const additionalProducts = await Product.find({
          _id: { 
            $nin: [
              ...foundProductIds.map(id => new mongoose.Types.ObjectId(id)),
              ...relatedProducts.map(p => p._id)
            ]
          },
          inStock: true,
          stockQuantity: { $gt: 0 }
        })
        .limit(10 - relatedProducts.length)
        .sort({ isHot: -1, createdAt: -1 });
        
        relatedProducts = [...relatedProducts, ...additionalProducts];
      }
      
      for (const product of relatedProducts) {
        const productId = String(product._id);
        if (!seenRelatedIds.has(productId)) {
          seenRelatedIds.add(productId);
          
          // Normalize imageUrl
          let imageUrl = product.imageUrl || '';
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
            imageUrl = `/medicine-images/${imageUrl}`;
          }
          if (!imageUrl || imageUrl === '') {
            imageUrl = '/medicine-images/default-medicine.jpg';
          }

          // Get description from medicines collection if product doesn't have it
          const description = await getProductDescription(product);

          relatedMedicines.push({
            productId: productId,
            productName: product.name || '',
            price: Number(product.price || 0),
            originalPrice: Number(product.originalPrice || product.price || 0),
            unit: product.unit || 'đơn vị',
            inStock: product.inStock !== undefined ? product.inStock : (Number(product.stockQuantity || 0) > 0),
            stockQuantity: Number(product.stockQuantity || 0),
            requiresPrescription: product.isPrescription || false,
          imageUrl: imageUrl,
          description: description,
          brand: product.brand || '',
          dosage: parseMedicineName(product.name || '').dosage
          });
        }
      }
    } catch (error) {
      console.error('Error finding related medicines:', error);
    }
  }

  return {
    prescriptionMedicines, // All medicines from prescription (for "Thuốc đề xuất")
    relatedMedicines, // Medicines with related uses (for "Thuốc có sẵn")
    foundMedicines, // Keep for backward compatibility
    notFoundMedicines, // Keep for backward compatibility
    totalEstimatedPrice,
    requiresConsultation,
    analysisNotes,
    confidence,
    analysisTimestamp: new Date(),
    aiModel: 'pharmacy-v1.0' // Mock model name
  };
}

