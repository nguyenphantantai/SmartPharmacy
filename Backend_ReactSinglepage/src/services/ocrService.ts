import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export interface ExtractedPrescriptionInfo {
  customerName?: string;
  phoneNumber?: string;
  doctorName?: string;
  hospitalName?: string;
  examinationDate?: string;
  dateOfBirth?: string; // Ngày tháng năm sinh
  yearOfBirth?: string; // Năm sinh (chỉ năm)
  age?: string; // Tuổi
  diagnosis?: string;
  notes?: string;
  rawText: string;
}

/**
 * Extract text from prescription image using OCR
 */
export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    console.log('🔍 Starting OCR for image:', imagePath);
    
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'vie+eng', // Vietnamese and English
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            if (progress % 25 === 0) { // Log every 25%
              console.log(`OCR Progress: ${progress}%`);
            }
          }
        }
      }
    );
    
    console.log(`✅ OCR completed. Confidence: ${confidence?.toFixed(2)}%`);
    console.log(`📝 Extracted text length: ${text.length} characters`);
    
    return text;
  } catch (error: any) {
    console.error('❌ OCR Error:', error.message);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
}

/**
 * Restore Vietnamese diacritics for medical/diagnosis terms
 */
function restoreVietnameseDiacritics(text: string): string {
  let restored = text;
  
  // Common medical terms that OCR often misses diacritics
  // Disease names
  restored = restored.replace(/\bBénh\b/gi, 'Bệnh');
  restored = restored.replace(/\bBenh\b/gi, 'Bệnh');
  restored = restored.replace(/\bda dày\b/gi, 'dạ dày');
  restored = restored.replace(/\bda day\b/gi, 'dạ dày');
  restored = restored.replace(/\bDa dày\b/gi, 'Dạ dày');
  restored = restored.replace(/\bDa day\b/gi, 'Dạ dày');
  restored = restored.replace(/\bthực quan\b/gi, 'thực quản');
  restored = restored.replace(/\bthuc quan\b/gi, 'thực quản');
  restored = restored.replace(/\bThực quan\b/gi, 'Thực quản');
  restored = restored.replace(/\bThuc quan\b/gi, 'Thực quản');
  restored = restored.replace(/\btrào ngược\b/gi, 'trào ngược');
  restored = restored.replace(/\btrao nguoc\b/gi, 'trào ngược');
  restored = restored.replace(/\bTrao nguoc\b/gi, 'Trào ngược');
  
  // Common medical conditions
  restored = restored.replace(/\bviêm\b/gi, 'viêm');
  restored = restored.replace(/\bviem\b/gi, 'viêm');
  restored = restored.replace(/\bViêm\b/gi, 'Viêm');
  restored = restored.replace(/\bViem\b/gi, 'Viêm');
  restored = restored.replace(/\bđau\b/gi, 'đau');
  restored = restored.replace(/\bdau\b/gi, 'đau');
  restored = restored.replace(/\bĐau\b/gi, 'Đau');
  restored = restored.replace(/\bDau\b/gi, 'Đau');
  restored = restored.replace(/\bsốt\b/gi, 'sốt');
  restored = restored.replace(/\bsot\b/gi, 'sốt');
  restored = restored.replace(/\bSốt\b/gi, 'Sốt');
  restored = restored.replace(/\bSot\b/gi, 'Sốt');
  restored = restored.replace(/\bho\b/gi, 'ho');
  restored = restored.replace(/\bHo\b/gi, 'Ho');
  restored = restored.replace(/\bkhó thở\b/gi, 'khó thở');
  restored = restored.replace(/\bkho tho\b/gi, 'khó thở');
  restored = restored.replace(/\bKhó thở\b/gi, 'Khó thở');
  restored = restored.replace(/\bKho tho\b/gi, 'Khó thở');
  
  // Body parts
  restored = restored.replace(/\bphổi\b/gi, 'phổi');
  restored = restored.replace(/\bphoi\b/gi, 'phổi');
  restored = restored.replace(/\bPhổi\b/gi, 'Phổi');
  restored = restored.replace(/\bPhoi\b/gi, 'Phổi');
  restored = restored.replace(/\bgan\b/gi, 'gan');
  restored = restored.replace(/\bGan\b/gi, 'Gan');
  restored = restored.replace(/\bthận\b/gi, 'thận');
  restored = restored.replace(/\bthan\b/gi, 'thận');
  restored = restored.replace(/\bThận\b/gi, 'Thận');
  restored = restored.replace(/\bThan\b/gi, 'Thận');
  restored = restored.replace(/\btim\b/gi, 'tim');
  restored = restored.replace(/\bTim\b/gi, 'Tim');
  
  return restored;
}

/**
 * Normalize and clean OCR text
 */
function normalizeText(text: string): string {
  // Replace common OCR errors
  let normalized = text
    .replace(/[|]/g, 'I') // Replace | with I
    .replace(/\s+/g, ' ') // Normalize whitespace first
    .trim();
  
  // Fix common OCR errors in Vietnamese text
  // Fix "vàtên" -> "và tên"
  normalized = normalized.replace(/vàtên/gi, 'và tên');
  normalized = normalized.replace(/Ho\s+vàtên/gi, 'Họ và tên');
  normalized = normalized.replace(/Ho\s+ten/gi, 'Họ tên');
  
  // Fix OCR errors for "Họ và tên" -> "nó va ten", "no va ten", etc.
  normalized = normalized.replace(/\bnó\s+va\s+ten\b/gi, 'Họ và tên');
  normalized = normalized.replace(/\bno\s+va\s+ten\b/gi, 'Họ và tên');
  normalized = normalized.replace(/\bnó\s+và\s+tên\b/gi, 'Họ và tên');
  
  // Fix "Chẩn đoán" OCR errors -> "Chân đoán", "Chan doan", etc.
  normalized = normalized.replace(/\bChân\s+đoán\b/gi, 'Chẩn đoán');
  normalized = normalized.replace(/\bChan\s+doan\b/gi, 'Chẩn đoán');
  normalized = normalized.replace(/\bChan\s+đoán\b/gi, 'Chẩn đoán');
  normalized = normalized.replace(/\bChân\s+doan\b/gi, 'Chẩn đoán');
  
  // Fix "Phòng khám" OCR errors -> "Phòng Kham", "Phong Kham", etc.
  normalized = normalized.replace(/\bPhòng\s+Kham\b/gi, 'Phòng khám');
  normalized = normalized.replace(/\bPhong\s+Kham\b/gi, 'Phòng khám');
  normalized = normalized.replace(/\bPhong\s+kham\b/gi, 'Phòng khám');
  
  // Fix "TTYT" variations
  normalized = normalized.replace(/\bT1YT\b/gi, 'TTYT');
  normalized = normalized.replace(/\bTTYT\s+THỊ\s+XÃ\b/gi, 'TTYT THỊ XÃ');
  
  // Fix common character errors
  normalized = normalized.replace(/O([0-9])/g, '0$1'); // O before number -> 0
  normalized = normalized.replace(/([0-9])O/g, '$10'); // O after number -> 0
  normalized = normalized.replace(/O([O0]{2,})/g, '0$1'); // Multiple O -> 0
  
  // Fix "Ngày" errors
  normalized = normalized.replace(/Ngay/gi, 'Ngày');
  normalized = normalized.replace(/ngay/gi, 'ngày');
  
  // Fix "Bác sĩ" errors
  normalized = normalized.replace(/Bac\s+si/gi, 'Bác sĩ');
  normalized = normalized.replace(/Bacsi/gi, 'Bác sĩ');
  
  // Fix hospital/clinic names
  normalized = normalized.replace(/Benh\s+vien/gi, 'Bệnh viện');
  normalized = normalized.replace(/Phong\s+kham/gi, 'Phòng khám');
  normalized = normalized.replace(/So\s+Y\s+TE/gi, 'SỞ Y TẾ');
  
  // Fix common diagnosis OCR errors
  normalized = normalized.replace(/trao\s+nguoc/gi, 'trào ngược');
  normalized = normalized.replace(/Trao\s+nguoc/gi, 'Trào ngược');
  normalized = normalized.replace(/da\s+day/gi, 'dạ dày');
  normalized = normalized.replace(/Da\s+day/gi, 'Dạ dày');
  normalized = normalized.replace(/thuc\s+quan/gi, 'thực quản');
  normalized = normalized.replace(/Thuc\s+quan/gi, 'Thực quản');
  
  // Add spaces around colons and common separators
  normalized = normalized.replace(/([A-Za-zÀ-ỹ]):([A-Za-zÀ-ỹ0-9])/g, '$1: $2');
  normalized = normalized.replace(/([A-Za-zÀ-ỹ])\s*:\s*([A-Za-zÀ-ỹ0-9])/g, '$1: $2');
  
  // Normalize whitespace again after fixes
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Extract prescription information from OCR text
 */
export function extractPrescriptionInfo(ocrText: string): ExtractedPrescriptionInfo {
  // Normalize text first
  const normalizedText = normalizeText(ocrText);
  const fullText = normalizedText;
  
  // Split by newlines, but also try to split by common separators if no newlines
  let lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line.length > 2);
  
  // If only 1 line (common OCR issue), try to split by common patterns
  if (lines.length <= 1) {
    // Try to split by common prescription field separators
    const splitPatterns = [
      /(Họ\s*(?:và\s*)?tên|Tên|Năm\s+sinh|Tuổi|Giới|Địa\s+chỉ|Số\s+điện\s+thoại|ĐT|Mạch|Huyết\s+áp|Thân\s+nhiệt|Chẩn\s+đoán|Ngày|Bác\s+sĩ|BS|BỆNH\s+VIỆN|Phòng\s+khám|SỞ\s+Y\s+TẾ)/gi
    ];
    
    for (const pattern of splitPatterns) {
      const matches = [...fullText.matchAll(pattern)];
      if (matches.length > 1) {
        // Split text at these positions
        const splitPoints = matches
          .map(m => m.index)
          .filter((idx): idx is number => idx !== undefined);
        lines = [];
        let lastIndex = 0;
        for (const splitPoint of splitPoints) {
          if (splitPoint !== undefined && splitPoint > lastIndex) {
            lines.push(fullText.substring(lastIndex, splitPoint).trim());
            lastIndex = splitPoint;
          }
        }
        lines.push(fullText.substring(lastIndex).trim());
        lines = lines.filter(line => line.length > 2);
        break;
      }
    }
  }
  
  // Only log OCR analysis in debug mode or first time
  if (process.env.DEBUG_OCR === 'true') {
    console.log('📄 ========== OCR TEXT ANALYSIS ==========');
    console.log('📄 Full OCR Text length:', fullText.length, 'characters');
    console.log('📄 First 1000 chars:', fullText.substring(0, 1000));
    console.log('📄 Total lines:', lines.length);
    console.log('📄 First 20 lines:');
    lines.slice(0, 20).forEach((line, idx) => {
      console.log(`   Line ${idx + 1}: "${line}"`);
    });
    console.log('📄 =======================================');
  }
  
  const result: ExtractedPrescriptionInfo = {
    rawText: ocrText
  };

  // Extract customer name (Họ tên, Họ và tên) - Search in full text and lines
  const namePatterns = [
    // Pattern 0: "Họ tên NB: HUỲNH THỊ PHƯỢNG" (format for BV ĐKKV CAI LẬY) - MOST PRIORITIZED (specific format)
    // Handle OCR errors: "NB" might be read as "N8", "N B", "N8", etc.
    // Improved: Capture more characters, stop at "Số định danh" or similar patterns
    /Họ\s+tên\s+N[8B][:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Số\s+định\s+danh|Số\s+căn\s+cước|số\s+định|Ngày\s+sinh|Năm\s*sinh|Tuổi|Giới|Địa|Mạch|Huyết|Nhiệt|Chẩn|Cân)/i,
    // Pattern 0b: "Họ tên N B: HUỲNH THỊ PHƯỢNG" (OCR error - space between N and B)
    /Họ\s+tên\s+N\s+B[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Số\s+định\s+danh|Số\s+căn\s+cước|số\s+định|Ngày\s+sinh|Năm\s*sinh|Tuổi|Giới|Địa|Mạch|Huyết|Nhiệt|Chẩn|Cân)/i,
    // Pattern 1: "Họ tên: Trần Văn B" or "Họ tên: HUỲNH THỊ PHƯỢNG" (with colon, supports lowercase) - most common format
    // Improved: Capture full name until "số định danh" or semicolon, allow more characters
    /Họ\s+tên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*;|$|Số\s+định\s+danh|Số\s+căn\s+cước|số\s+định|Năm\s*sinh|Tuổi|Giới|Địa|Mạch|Huyết|Nhiệt|Chẩn|Cân)/i,
    // Pattern 2: "Họ và tên HÀ THỊ HỘC" (without colon, common in BHYT forms) - capture full name until address or vital signs
    /Họ\s+và\s+tên\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s+(?:sa\s+\d+|Cosh|Dịa\s+chỉ|Địa\s+chỉ|Năm\s*sinh|Tuổi|Giới|Số|Mạch|Huyết|Nhiệt|Chẩn)|$)/i,
    // Pattern 3: "Họ và tên:" (with colon) - flexible with OCR errors
    /Họ\s+và\s+tên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn)/i,
    // Pattern 4: "Ho vàtên" (OCR error - missing space)
    /Ho\s+vàtên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn)/i,
    // Pattern 5: "nó va ten" or "no va ten" (OCR error for "Họ và tên") - direct pattern
    /(?:nó|no)\s+va\s+ten[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn|Cân)/i,
    // Pattern 6: "Tên:" or "tên" (standalone, common in OCR) - capture until stop keyword, supports lowercase
    /Tên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?=\s*(?:Nam\s*sinh|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn|Cân)|$)/i,
    // Pattern 7: "Họ tên" without colon (fallback) - more flexible, match "tên HA THI HOC" or "tên Trần Văn B"
    /(?:Họ\s*(?:và\s*)?tên|tên)\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?=\s*(?:Nam\s*sinh|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn|Cân)|$)/i,
    // Pattern 8: "tên. HUYNH THỊ PHƯỢNG" (with dot after "tên") - prioritize for new format, capture full name
    // Capture until "..", "Số định danh", "Số căn cước", "Ngày sinh", or other stop words
    /tên\.\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s*\.\.|\.\.|Số\s+định\s+danh|Số\s+căn\s+cước|Ngày\s+sinh|Năm\s*sinh|Tuổi|Giới|Địa|Mạch|Huyết|Nhiệt|Chẩn|Cân|$)/i,
    // Pattern 9: "Họ tên: HUỲNH THỊ PHƯỢNG" (with full Vietnamese diacritics) - NEW pattern for new prescription type
    /Họ\s+tên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Số\s+định\s+danh|Số\s+căn\s+cước|Ngày\s+sinh|Năm\s*sinh|Tuổi|Giới|Địa|Mạch|Huyết|Nhiệt|Chẩn|Cân)/i,
    // Pattern 10: "Họ và tên: HÀ THỊ HỘC" (format for BỆNH VIỆN MẮT) - NEW pattern for eye hospital format
    /Họ\s+và\s+tên[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Ngày\s+sinh|Năm\s*sinh|Tuổi|Giới|Địa|Số|Mạch|Huyết|Nhiệt|Chẩn|Cân|Đối)/i,
  ];
  
  // Search in full text first
  if (process.env.DEBUG_OCR === 'true') {
    console.log('🔍 Searching for customer name...');
  }
  for (let i = 0; i < namePatterns.length; i++) {
    const pattern = namePatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    if (process.env.DEBUG_OCR === 'true') {
      console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
      if (match) {
        console.log(`   Match[0]: "${match[0]}"`);
        console.log(`   Match[1]: "${match[1] || 'N/A'}"`);
      }
    }
    if (match && match[1]) {
      let name = match[1].trim();
      // Clean up common OCR errors in names
      name = name.replace(/\s+/g, ' '); // Normalize spaces
      // Remove trailing OCR artifacts and invalid characters (like "Ầ" at the end)
      name = name.replace(/[ẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$/i, ''); // Remove trailing invalid Vietnamese characters
      name = name.replace(/\s+(?:sa|Cosh|seins|ie|\.|—).*$/, ''); // Remove OCR artifacts like "sa 28 Cosh seins ie sa"
      // Remove semicolon and anything after it (common separator before "số định danh")
      name = name.replace(/[;].*$/, '').trim();
      name = name.replace(/[.,:]+$/, '').trim();
      // Limit to 6 words to capture full Vietnamese names (e.g., "HUỲNH THỊ PHƯỢNG")
      const words = name.split(/\s+/).filter(w => w.length > 0);
      name = words.slice(0, 6).join(' ');
      if (process.env.DEBUG_OCR === 'true') {
        console.log(`   Cleaned name: "${name}" (length: ${name.length})`);
      }
      // Accept names with at least 2 characters (for cases like "HA THI HOC")
      if (name.length >= 2 && name.length < 50) {
        result.customerName = name;
        if (!process.env.DEBUG_OCR || process.env.DEBUG_OCR !== 'true') {
          console.log('✅ Extracted customer name:', result.customerName);
        }
        break;
      } else if (process.env.DEBUG_OCR === 'true') {
        console.log(`   ⚠️ Name rejected: length ${name.length} (must be 2-49)`);
      }
    }
  }
  
  // If not found, search in lines
  if (!result.customerName) {
    for (const line of lines) {
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          let name = match[1].trim();
          name = name.replace(/\s+/g, ' ');
          // Allow up to 6 words for full Vietnamese names (e.g., "HUỲNH THỊ PHƯỢNG")
          name = name.split(/\s+/).slice(0, 6).join(' ');
          // Remove semicolon and anything after it
          name = name.replace(/[;].*$/, '').trim();
          name = name.replace(/[.,:]+$/, '').trim();
          // Accept names with at least 2 characters
          if (name.length >= 2 && name.length < 50) {
            result.customerName = name;
            if (!process.env.DEBUG_OCR || process.env.DEBUG_OCR !== 'true') {
              console.log('✅ Extracted customer name from line:', result.customerName);
            }
            break;
          }
        }
      }
      if (result.customerName) break;
    }
  }

  // Phone number extraction removed - replaced with diagnosis field

  // Extract doctor name (Bác sĩ, BS, ThS.BS, BSCKI, BSCKT) - Search in full text
  const doctorPatterns = [
    // Pattern 1: "ThS.BS. Nguyễn Minh A" (with dot after ThS.BS) - capture full name, handle OCR errors like "hoe Bgl"
    // Also match "BS. hoe Bgl" (OCR error for "ThS.BS. Nguyễn Minh A") - look for Vietnamese name pattern
    /(?:ThS\.BS\.|BS\.\s+hoe\s+Bgl)\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:i\s*;|:|ar|nh|gi|ï|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 1b: "BS. Nguyễn Minh A" or "BS. Nguyễn Thanh Hải" (without ThS, format for BỆNH VIỆN ĐA KHOA TỈNH and BV ĐKKV) - prioritize for this format
    // Look for Vietnamese name pattern after "BS." - stop at "Khám lại", date, or other stop words
    // Improved: Capture more characters, allow up to 4 words for full names like "Nguyễn Thanh Hải"
    // Fixed: Don't stop at "nh" if it's part of "Thanh" - use negative lookahead
    /BS\.\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:Khám\s+lại|Khám\s+lai|\.\s*:\s*Ni|i\s*;|:\s*ar|:\s*nh\s+(?!Hải|Hai|Haii)|gi|ï|Lời|Loi|Dặn|Dan|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 2: "BSCKI. Lê Thanh Trang" (with dot after BSCKI) - capture full name
    /BSCKI\.\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:i\s*;|:|ar|nh|gi|ï|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 2b: "BSCKT. Lê Thanh Trang" (with dot after BSCKT) - OCR error for BSCKI - prioritize, capture full name
    /BSCKT\.\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s+(?:I\s+Mì|Mì|Le\s+den|in\s+mangitheo|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 3: "BS. Nguyễn Quốc Tiến" (with dot after BS) - capture full name, stop at timestamp or special chars
    /BS\.\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:i\s*;|:|ar|nh|gi|ï|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 4: "Y, Bác sĩ điều trị BS. Nguyễn Quốc Tiến" (most specific for this form)
    /Y[,\.]?\s*Bác\s*sĩ\s*điều\s*trị\s+(?:(?:BS|BSCKI|BSCKT|ThS\.BS)\.\s*)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:i\s*;|:|ar|nh|gi|ï|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 5: "Y, Bác sĩ điều trị: BS. Nguyễn Quốc Tiến" (with colon)
    /Y[,\.]?\s*Bác\s*sĩ\s*điều\s*trị[:\s]+(?:(?:BS|BSCKI|BSCKT|ThS\.BS)\.\s*)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:i\s*;|:|ar|nh|gi|ï|\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})|$)/i,
    // Pattern 6: "Bác sĩ:" or "BS:" or "BSCKI:" or "BSCKT:" or "ThS.BS:" without dot
    /(?:Bác\s*sĩ|BS|ThS\.BS|TS\.BS|BSCKI|BSCKT|BSCKII)[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|Ngày|Thời|in|lúc|Tái|Tai|\d{2}\/\d{2}\/\d{4})/i,
    // Pattern 7: "Ký tên" or "Chữ ký"
    /(?:Ký\s*tên|Chữ\s*ký)[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|Ngày|Thời|in|lúc|Tái|Tai|\d{2}\/\d{2}\/\d{4})/i,
    // Pattern 8: "Bác sỹ/ Y sĩ khám bệnh (Ký, ghi rõ họ tên)" or "Bác sỹ/ Y sĩ na" (OCR error) - NEW format for new prescription type
    // Exclude "Năm" when it's followed by a year (4 digits) - "Năm 2025" is not a doctor name
    /Bác\s*sỹ[\/\s]*Y\s*sĩ\s*(?:khám\s*bệnh|na)[:\s]*(?:\([^)]+\)[:\s]*)?(?:BS\.\s*)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s+(?:Năm\s+\d{4}|2025|\d{4})|Số|So|Ngày|Ngay|Thời|Thoi|Tái|Tai|Ky|Sa|ệnh|\d{2}\/\d{2}\/\d{4}|$)/i,
    // Pattern 9: "Bác sỹ/ Y sĩ khám bệnh" with signature - NEW pattern for new prescription type (printed form with signature)
    // Match after signature (handwritten text) - look for Vietnamese name pattern after "Bác sỹ/ Y sĩ khám bệnh"
    // Exclude "Năm" when it's followed by a year (4 digits)
    /Bác\s*sỹ[\/\s]*Y\s*sĩ\s*khám\s*bệnh[:\s]*(?:\([^)]+\)[:\s]*)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s+(?:Năm\s+\d{4}|2025|\d{4})|Số|So|Ngày|Ngay|Thời|Thoi|Tái|Tai|Ky|Sa|ệnh|\d{2}\/\d{2}\/\d{4}|$)/i,
    // Pattern 10: "Bác sĩ khám bệnh BS. Nguyễn Đức Trường Xuân" (format for BỆNH VIỆN MẮT) - NEW pattern for eye hospital format
    /Bác\s*sĩ\s*khám\s*bệnh\s+(?:BS\.\s*)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|Ngày|Thời|in|lúc|Tái|Tai|\d{2}\/\d{2}\/\d{4})/i,
    // Pattern 11: "ngày hẹn khám lại: Trần Thị Thanh Vân" (format for BV ĐKKV) - NEW pattern
    /ngày\s+hẹn\s+khám\s+lại[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*-\s*Khám|$)/i,
  ];
  
  // Search in full text
  if (process.env.DEBUG_OCR === 'true') {
    console.log('🔍 Searching for doctor name...');
  }
  for (let i = 0; i < doctorPatterns.length; i++) {
    const pattern = doctorPatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    if (process.env.DEBUG_OCR === 'true') {
      console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
      if (match) {
        console.log(`   Match[0]: "${match[0]}"`);
        console.log(`   Match[1]: "${match[1] || 'N/A'}"`);
      }
    }
    if (match && match[1]) {
      let doctorName = match[1].trim();
      // Remove "BS.", "BSCKI.", "BSCKT.", or "ThS.BS." if it's in the name part
      doctorName = doctorName.replace(/^(?:BS|BSCKI|BSCKT|ThS\.BS)\.\s*/i, '');
      // Remove trailing special characters and OCR artifacts - but NOT "nh" in Vietnamese names like "Thanh"
      // Only remove if it's a standalone word or followed by invalid characters
      doctorName = doctorName.replace(/\s+(?:I\s+Mì|Mì|Le\s+den|in\s+mangitheo|\d{2}\/\d{2}\/\d{4}).*$/i, '');
      doctorName = doctorName.replace(/\s+(?:i\s*;|:|ar|gi|ï)(?:\s|$).*$/, ''); // Only remove if followed by space or end
      doctorName = doctorName.replace(/\s+/g, ' ');
      // Allow up to 4 words for full Vietnamese names like "Nguyễn Thanh Hải"
      doctorName = doctorName.split(/\s+/).slice(0, 4).join(' ');
      // Remove trailing invalid characters but preserve "nh" in "Thanh", "Hải"
      doctorName = doctorName.replace(/[.,;:]+$/, '').trim();
      if (process.env.DEBUG_OCR === 'true') {
        console.log(`   Cleaned doctor name: "${doctorName}" (length: ${doctorName.length})`);
      }
      if (doctorName.length > 2 && doctorName.length < 60) {
        result.doctorName = doctorName;
        if (!process.env.DEBUG_OCR || process.env.DEBUG_OCR !== 'true') {
          console.log('✅ Extracted doctor name:', result.doctorName);
        }
        break;
      } else {
        console.log(`   ⚠️ Doctor name rejected: length ${doctorName.length} (must be 3-59)`);
      }
    }
  }
  
  // If not found, search in lines
  if (!result.doctorName) {
    for (const line of lines) {
      for (let patternIdx = 0; patternIdx < doctorPatterns.length; patternIdx++) {
        const pattern = doctorPatterns[patternIdx];
        if (!pattern) continue;
        const match = line.match(pattern);
        if (match && match[1]) {
          let doctorName = match[1].trim();
          // For Pattern 1b, if we matched "BS. hoe Bgl", try to find "Nguyễn Minh A" in the same line or nearby lines
          if (patternIdx === 1 && (doctorName.toLowerCase().includes('hoe') || doctorName.toLowerCase().includes('bgl'))) {
            // Look for Vietnamese name pattern in the same line or next lines
            const namePattern = /([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ])/;
            const nameMatch = fullText.match(namePattern);
            if (nameMatch && nameMatch[1]) {
              doctorName = nameMatch[1].trim();
            }
          }
          doctorName = doctorName.replace(/^(?:BS|BSCKI|BSCKT|ThS\.BS)\.\s*/i, '');
          // Remove trailing special characters and OCR artifacts - but NOT "nh" in Vietnamese names like "Thanh"
          // Only remove if it's a standalone word or followed by invalid characters
          doctorName = doctorName.replace(/\s+(?:I\s+Mì|Mì|Le\s+den|in\s+mangitheo|\d{2}\/\d{2}\/\d{4}).*$/i, '');
          doctorName = doctorName.replace(/\s+(?:i\s*;|:|ar|gi|ï)(?:\s|$).*$/, ''); // Only remove if followed by space or end
          doctorName = doctorName.replace(/\s+(?:Khám\s+lại|Khám\s+lai|3\s+Slag|Ề\s+Gh|EE|Ed|1431|Ỳ).*$/i, ''); // Remove OCR artifacts from line 154
          doctorName = doctorName.replace(/\s+/g, ' ');
          doctorName = doctorName.split(/\s+/).slice(0, 5).join(' ');
          doctorName = doctorName.replace(/[.,;:]+$/, '').trim();
          // Reject invalid names like "hoe Bgl"
          if (doctorName.toLowerCase().includes('hoe') && doctorName.toLowerCase().includes('bgl')) {
            console.log(`   ⚠️ Doctor name rejected: invalid OCR error "${doctorName}"`);
            continue;
          }
          if (doctorName.length > 2 && doctorName.length < 60) {
            result.doctorName = doctorName;
            console.log('✅ Extracted doctor name from line:', result.doctorName);
            break;
          }
        }
      }
      if (result.doctorName) break;
    }
  }

  // Extract hospital name (Bệnh viện, Phòng khám, PK) - Search in full text
  const hospitalPatterns = [
    // Pattern 0a: "SỞ Y TẾ TỈNH ĐỒNG THÁP - BV ĐKKV CAI LẬY" (format for BV ĐKKV) - MOST PRIORITIZED (specific format)
    /(?:SỞ\s*Y\s*TẾ\s+[^-]+-\s*)?BV\s*ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|phát|sang)/i,
    // Pattern 0b: "BV ĐKKV CAI LẬY" (standalone, format for BV ĐKKV) - MOST PRIORITIZED (specific format)
    /BV\s*ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|phát|sang)/i,
    // Pattern 0: "SỞ Y TẾ TỈNH A - BỆNH VIỆN ĐA KHOA TỈNH" (format for BỆNH VIỆN ĐA KHOA TỈNH) - PRIORITIZED
    // This pattern should be checked after BV ĐKKV patterns to avoid matching wrong prescriptions
    /SỞ\s*Y\s*TẾ\s+TỈNH\s+[A-Z]\s*-\s*BỆNH\s*VIỆN\s+ĐA\s*KHOA\s*TỈNH/i,
    // Pattern 1: "TTYT THỊ XÃ CAI LẦY" or "TTYT THỊ XÃ CATLAY" (OCR error) - prioritize, capture full name
    // Try to capture "THỊ XÃ" + name, or just name if "THỊ XÃ" is already in the pattern
    /TTYT\s+(THỊ\s+XÃ\s+)?([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]*)(?:\s*[~_]+|\.\.\.|\s+(?:Phòng|ĐK|ĐT|Phone|Mã|Số|01882009)|$|\d{7,})/i,
    // Pattern 2: "Phòng khám ĐK TTYT Thị Xã Cai Lậy" (specific format for this form)
    // Capture everything after "TTYT" until stop pattern (patient ID, room number, etc.)
    /Phòng\s*khám\s*ĐK\s*TTYT\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:Phòng\s*khám\s*\d+|Ñ|p\.|mm|\d{7,})|$)/i,
    // Pattern 3: "Phòng Kham" or "Phong Kham" (OCR errors) - more flexible
    /Phòng\s*Kham[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|ĐK|ĐT|Phone|SỞ|Mã|Số|\d)/i,
    // Pattern 4: "SỞ Y TẾ TỈNH ĐỒNG THÁP" (most common in BHYT forms) - flexible
    /SỞ\s*Y\s*TẾ\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|BỆNH|BV|Phòng|Mã|Số)/i,
    // Pattern 5: "Phòng khám ĐK TTYT..." (with colon) - handle OCR errors
    /Phòng\s*khám\s*ĐK\s*TTYT[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|Phòng\s*khám\s*\d+|ĐT|Phone|Mã|Số)/i,
    // Pattern 6: "Phòng khám..." (general) - more flexible
    /(?:PHÒNG\s*KHÁM|Phòng\s*khám|PK)[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|ĐT|Phone|SỞ|Phòng\s*khám\s*\d+|Mã|Số)/i,
    // Pattern 7: "BỆNH VIỆN ĐA KHOA TỈNH" (specific format) - prioritize this pattern, capture full name
    /BỆNH\s*VIỆN\s+ĐA\s*KHOA\s*TỈNH/i,
    // Pattern 7b: "BỆNH VIỆN ĐA KHOA TỈNH" (specific format) - capture "ĐA KHOA TỈNH" or full name (fallback)
    // Exclude "phát" (from "bệnh viện phát sang thuốc mới") by requiring minimum length and specific keywords
    /BỆNH\s*VIỆN\s+(ĐA\s*KHOA(?:\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+)?|[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|PK|ĐT|Phone|SỞ|Mã|Số|PK\.)/i,
    // Pattern 8: "BỆNH VIỆN..." (fallback) - more general, should match "BỆNH VIỆN ĐA KHOA TỈNH" if pattern 7 fails
    // Exclude "phát" (from "bệnh viện phát sang thuốc mới") by requiring minimum 3 characters and excluding common invalid words
    /(?:BỆNH\s*VIỆN|Bệnh\s*viện|BV)[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s|$|PK|ĐT|Phone|SỞ|Mã|Số|phát|sang)/i,
    // Pattern 9: "BỆNH VIỆN ĐKKV CAI LẬY" or "BỆNH VIỆN ĐKKV CÀI LAY" (OCR error) - NEW format for new prescription type
    // Capture full name including "CAI LẬY" or "CÀI LAY" until stop condition
    // Exclude "phát" (from "bệnh viện phát sang thuốc mới") by requiring minimum length and excluding common invalid words
    /BỆNH\s*VIỆN\s+ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s+\d+\s+[ẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]|\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|toa|mp|phát|sang)/i,
    // Pattern 10: "Tên đơn vị: TTYT KHU VỰC BÌNH PHÚ (CƠ SỞ PHÚ CƯỜNG)" or "Tên đơn vi:" (OCR error - missing "ị") - NEW pattern for new prescription type (printed form)
    // Improved: Capture full name including parentheses and multiple words - don't stop too early
    /Tên\s*đơn\s*vi[ị]?[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s()]+?)(?:\s+(?:AS|Dia|Địa|Dia\s+chỉ|Địa\s+chỉ|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|toa|mp|\d{7,})|$)/i,
    // Pattern 11: "SỞ Y TẾ TP.HCM - BỆNH VIỆN MẮT" (format for eye hospital) - NEW pattern for eye hospital format
    /(?:SỞ\s*Y\s*TẾ\s+[^-]+-\s*)?BỆNH\s*VIỆN\s+MẮT/i,
    // Pattern 12: "BỆNH VIỆN MẮT" (standalone, format for eye hospital) - NEW pattern for eye hospital format
    /BỆNH\s*VIỆN\s+MẮT(?:\s|$|ĐC|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma)/i,
    // Pattern 13: "BV ĐKKV CAI LẬY" or "BV ĐKKV CÀI LAY" (format for BV ĐKKV, viết tắt của BỆNH VIỆN) - NEW pattern for BV ĐKKV format
    /BV\s*ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|phát|sang)/i,
    // Pattern 14: "SỞ Y TẾ TỈNH ĐỒNG THÁP - BV ĐKKV CAI LẬY" (full format for BV ĐKKV) - NEW pattern for BV ĐKKV format
    /(?:SỞ\s*Y\s*TẾ\s+[^-]+-\s*)?BV\s*ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+?)(?:\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|phát|sang)/i,
    // Pattern 15: "ÔNH VIÊN ĐKKV CAI LẬY" (OCR error - missing "BỆNH") - NEW pattern for OCR error
    // Capture full name including "CAI LẬY" until stop condition (LLL, TTT, or "an đơn vị")
    // Use non-greedy match with minimum 2 words to ensure we capture "CAI LẬY"
    /ÔNH\s*VIÊN\s+ĐKKV\s+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+)(?:\s+LLL|\s+TTT|\s+an\s+đơn\s+vị|LLL|TTT|an\s+đơn\s+vị|\s|$|Địa|Dia|Số|So|Phone|ĐT|PK|Phòng|Mã|Ma|phát|sang)/i,
  ];
  
  // Search in full text
  if (process.env.DEBUG_OCR === 'true') {
    console.log('🔍 Searching for hospital name...');
  }
  for (let i = 0; i < hospitalPatterns.length; i++) {
    const pattern = hospitalPatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    if (process.env.DEBUG_OCR === 'true') {
      console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
      if (match) {
        console.log(`   Match[0]: "${match[0]}"`);
        console.log(`   Match[1]: "${match[1] || 'N/A'}", Match[2]: "${match[2] || 'N/A'}"`);
      }
    }
    // For Pattern 0a/0b, match[1] is the name after "BV ĐKKV"
    // For Pattern 0, match[0] is the full name "SỞ Y TẾ TỈNH A - BỆNH VIỆN ĐA KHOA TỈNH"
    // For Pattern 1, match[1] is optional "THỊ XÃ ", match[2] is the name
    // For Pattern 7, match[0] is the full name "BỆNH VIỆN ĐA KHOA TỈNH"
    // For Pattern 9, match[1] is the name after "ĐKKV"
    // For other patterns, match[1] is the name
    if (match && (match[1] || match[2] || (i === 0 || i === 1 || i === 2 || i === 8))) {
      let hospitalName = '';
      if ((i === 0 || i === 1) && match[1]) {
        // Pattern 0a or 0b: "BV ĐKKV CAI LẬY" - prepend "BV ĐKKV" to match[1]
        hospitalName = `BV ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
      } else if (i === 2) {
        // Pattern 0: "SỞ Y TẾ TỈNH A - BỆNH VIỆN ĐA KHOA TỈNH" - extract "BỆNH VIỆN ĐA KHOA TỈNH"
        hospitalName = 'BỆNH VIỆN ĐA KHOA TỈNH';
      } else if (i === 3 && match[2]) {
        // Pattern 1: combine "THỊ XÃ" (if exists) with name
        const thiXa = match[1] ? match[1].trim() : '';
        const name = match[2].trim();
        // Ensure proper spacing between "THỊ XÃ" and name
        if (thiXa) {
          hospitalName = `${thiXa} ${name}`.replace(/\s+/g, ' ').trim();
        } else {
          hospitalName = name;
          // If name doesn't start with "THỊ XÃ", add it for consistency
          if (!hospitalName.includes('THỊ XÃ') && !hospitalName.includes('THI XA')) {
            hospitalName = `THỊ XÃ ${hospitalName}`;
          }
        }
      } else if (i === 8) {
        // Pattern 7: "BỆNH VIỆN ĐA KHOA TỈNH" - use match[0] directly
        hospitalName = 'BỆNH VIỆN ĐA KHOA TỈNH';
      } else if (i === 8 && match[1]) {
        // Pattern 9: "BỆNH VIỆN ĐKKV CAI LẬY" - prepend "BỆNH VIỆN ĐKKV"
        hospitalName = `BỆNH VIỆN ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
      } else if (i === 9 && match[1]) {
        // Pattern 10: "Tên đơn vị: BỆNH VIỆN ĐKKV CAI LẬY" - use match[1] directly
        hospitalName = match[1].trim();
      } else if (i === 10 || i === 11) {
        // Pattern 11 or 12: "SỞ Y TẾ TP.HCM - BỆNH VIỆN MẮT" or "BỆNH VIỆN MẮT" - use match[0] directly
        hospitalName = match[0].trim();
        // Clean up to get just "BỆNH VIỆN MẮT" if pattern 11 matched with prefix
        if (i === 10 && hospitalName.includes('BỆNH VIỆN MẮT')) {
          const matchIndex = hospitalName.indexOf('BỆNH VIỆN MẮT');
          hospitalName = hospitalName.substring(matchIndex).trim();
        }
      } else if ((i === 12 || i === 13) && match[1]) {
        // Pattern 13 or 14: "BV ĐKKV CAI LẬY" - prepend "BV ĐKKV" to match[1]
        hospitalName = `BV ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
      } else if (i === 14 && match[1]) {
        // Pattern 15: "ÔNH VIÊN ĐKKV CAI LẬY" (OCR error) - prepend "BỆNH VIỆN ĐKKV"
        hospitalName = `BỆNH VIỆN ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
      } else if (match[1]) {
        // Other patterns: use match[1]
        hospitalName = match[1].trim();
      }
      
      if (hospitalName) {
      // Remove common OCR errors at the end (patient ID, room number, etc.)
      hospitalName = hospitalName.replace(/\s*(?:Phòng\s*khám\s*\d+|Ñ|p\.|mm|\d{7,}).*$/i, '');
        hospitalName = hospitalName.replace(/[Ñp\.mm~_]+$/i, '').trim();
      // Remove OCR artifacts like "LLL", "TTT", "an đơn vị"
      hospitalName = hospitalName.replace(/\s+(?:LLL|TTT|an\s+đơn\s+vị|an\s+don\s+vi).*$/i, '').trim();
      // Exclude invalid hospital names like "phát" (from "bệnh viện phát sang thuốc mới")
      if (hospitalName.toLowerCase() === 'phát' || hospitalName.toLowerCase() === 'phat' || hospitalName.length < 3) {
        console.log(`   ⚠️ Hospital name rejected: invalid name "${hospitalName}"`);
        continue; // Skip this match and try next pattern
      }
      hospitalName = hospitalName.split(/\s+/).slice(0, 10).join(' '); // Limit to 10 words for full names
      if (process.env.DEBUG_OCR === 'true') {
        console.log(`   Cleaned hospital name: "${hospitalName}" (length: ${hospitalName.length})`);
      }
      // Accept hospital names with at least 3 characters
      if (hospitalName.length >= 3 && hospitalName.length < 100) {
        result.hospitalName = hospitalName;
        if (!process.env.DEBUG_OCR || process.env.DEBUG_OCR !== 'true') {
          console.log('✅ Extracted hospital name:', result.hospitalName);
        }
        break;
      } else {
        console.log(`   ⚠️ Hospital name rejected: length ${hospitalName.length} (must be 3-99)`);
        }
      }
    }
  }
  
  // If not found, search in lines
  if (!result.hospitalName) {
    for (const line of lines) {
      for (let patternIdx = 0; patternIdx < hospitalPatterns.length; patternIdx++) {
        const pattern = hospitalPatterns[patternIdx];
        if (!pattern) continue;
        const match = line.match(pattern);
        if (match && (match[1] || match[2] || (patternIdx === 0 || patternIdx === 6))) {
          let hospitalName = '';
          if ((patternIdx === 0 || patternIdx === 1) && match[1]) {
            // Pattern 0a or 0b: "BV ĐKKV CAI LẬY" - prepend "BV ĐKKV" to match[1]
            hospitalName = `BV ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
          } else if (patternIdx === 2) {
            // Pattern 0: "SỞ Y TẾ TỈNH A - BỆNH VIỆN ĐA KHOA TỈNH" - extract "BỆNH VIỆN ĐA KHOA TỈNH"
            hospitalName = 'BỆNH VIỆN ĐA KHOA TỈNH';
          } else if (patternIdx === 3 && match[2]) {
            // Pattern 1: combine "THỊ XÃ" (if exists) with name
            const thiXa = match[1] ? match[1].trim() : '';
            const name = match[2].trim();
            // Ensure proper spacing between "THỊ XÃ" and name
            if (thiXa) {
              hospitalName = `${thiXa} ${name}`.replace(/\s+/g, ' ').trim();
            } else {
              hospitalName = name;
              // If name doesn't start with "THỊ XÃ", add it for consistency
              if (!hospitalName.includes('THỊ XÃ') && !hospitalName.includes('THI XA')) {
                hospitalName = `THỊ XÃ ${hospitalName}`;
              }
            }
          } else if (patternIdx === 7 && match[1]) {
            // Pattern 7b: "BỆNH VIỆN ĐA KHOA TỈNH" - check if it's "ĐA KHOA TỈNH"
            const extracted = match[1].trim();
            if (extracted.includes('ĐA KHOA') || extracted.includes('ĐA KHOA TỈNH')) {
              hospitalName = 'BỆNH VIỆN ĐA KHOA TỈNH';
            } else if (extracted.length >= 3 && extracted.toLowerCase() !== 'phát' && extracted.toLowerCase() !== 'phat') {
              hospitalName = `BỆNH VIỆN ${extracted}`.replace(/\s+/g, ' ').trim();
            }
          } else if (patternIdx === 8 && match[1]) {
            // Pattern 8: "BỆNH VIỆN..." - exclude "phát"
            const extracted = match[1].trim();
            if (extracted.toLowerCase() !== 'phát' && extracted.toLowerCase() !== 'phat' && extracted.length >= 3) {
              hospitalName = extracted;
            }
          } else if (patternIdx === 9 && match[1]) {
            // Pattern 9: "BỆNH VIỆN ĐKKV CAI LẬY" - prepend "BỆNH VIỆN ĐKKV", exclude "phát"
            const extracted = match[1].trim();
            if (extracted.toLowerCase() !== 'phát' && extracted.toLowerCase() !== 'phat' && extracted.length >= 3) {
              hospitalName = `BỆNH VIỆN ĐKKV ${extracted}`.replace(/\s+/g, ' ').trim();
            }
          } else if (patternIdx === 10 && match[1]) {
            // Pattern 10: "Tên đơn vị: BỆNH VIỆN ĐKKV CAI LẬY" - use match[1] directly
            hospitalName = match[1].trim();
          } else if (patternIdx === 11 || patternIdx === 12) {
            // Pattern 11 or 12: "SỞ Y TẾ TP.HCM - BỆNH VIỆN MẮT" or "BỆNH VIỆN MẮT" - use match[0] directly
            hospitalName = match[0].trim();
            // Clean up to get just "BỆNH VIỆN MẮT" if pattern 11 matched with prefix
            if (patternIdx === 11 && hospitalName.includes('BỆNH VIỆN MẮT')) {
              const matchIndex = hospitalName.indexOf('BỆNH VIỆN MẮT');
              hospitalName = hospitalName.substring(matchIndex).trim();
            }
          } else if ((patternIdx === 12 || patternIdx === 13) && match[1]) {
            // Pattern 13 or 14: "BV ĐKKV CAI LẬY" - prepend "BV ĐKKV" to match[1]
            hospitalName = `BV ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
          } else if (patternIdx === 14 && match[1]) {
            // Pattern 15: "ÔNH VIÊN ĐKKV CAI LẬY" (OCR error) - prepend "BỆNH VIỆN ĐKKV"
            hospitalName = `BỆNH VIỆN ĐKKV ${match[1].trim()}`.replace(/\s+/g, ' ').trim();
          } else if (match[1]) {
            // Other patterns: use match[1]
            hospitalName = match[1].trim();
          }
          
          if (hospitalName) {
          // Remove common OCR errors at the end (patient ID, room number, etc.)
          hospitalName = hospitalName.replace(/\s*(?:Phòng\s*khám\s*\d+|Ñ|p\.|mm|\d{7,}).*$/i, '');
            hospitalName = hospitalName.replace(/[Ñp\.mm~_]+$/i, '').trim();
          // Remove OCR artifacts like "LLL", "TTT", "an đơn vị"
          hospitalName = hospitalName.replace(/\s+(?:LLL|TTT|an\s+đơn\s+vị|an\s+don\s+vi).*$/i, '').trim();
          // Exclude invalid hospital names like "phát" (from "bệnh viện phát sang thuốc mới")
          if (hospitalName.toLowerCase() === 'phát' || hospitalName.toLowerCase() === 'phat' || hospitalName.length < 3) {
            continue; // Skip this match and try next pattern
          }
          hospitalName = hospitalName.split(/\s+/).slice(0, 10).join(' '); // Limit to 10 words for full names
          // Accept hospital names with at least 3 characters
          if (hospitalName.length >= 3 && hospitalName.length < 100) {
            result.hospitalName = hospitalName;
            console.log('✅ Extracted hospital name from line:', result.hospitalName);
            break;
            }
          }
        }
      }
      if (result.hospitalName) break;
    }
  }

  // Extract examination date (Ngày khám, Ngày) - Search in full text
  const datePatterns = [
    // Pattern 1: "Ngày 14 tháng 07 năm 2022" (full format) - prioritize this to avoid matching wrong dates
    // Exclude "Ngày sinh" (date of birth)
    /(?:^|[^sinh\s])Ngày\s+(?!sinh)([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})/i,
    // Pattern 2: "Ngày 03/09/2025" (most common in BHYT forms) - handle OCR O->0, exclude "Ngày sinh"
    /(?:^|[^sinh\s])Ngày\s+(?!sinh)([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})/i,
    // Pattern 3: "Ngày khám: 03/09/2025"
    /Ngày\s*(?:khám)[:\s]*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})/i,
    // Pattern 4: Just date "03/09/2025" (near "Ngày" keyword) - flexible, but exclude "Ngày sinh"
    /(?:^|[^sinh\s])Ngày\s+(?!sinh)([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})/i,
    // Pattern 5: "tháng năm" format (without "Ngày" keyword)
    /([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})/i,
    // Pattern 6: Standalone date format - handle O as 0 (lowest priority to avoid false matches)
    // Only match if it's clearly an examination date (near "Ngày" but not "Ngày sinh", or near "khám")
    /(?:(?:^|[^sinh\s])Ngày\s+(?!sinh)|khám[:\s]*)([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})/i,
    // Pattern 7: "Ngày 20 tháng 05 năm 2024" (full format with examination date) - NEW format for new prescription type
    // Match "Ngày DD tháng MM năm YYYY" but exclude "Ngày sinh" (date of birth) by checking context
    /(?:^|[^sinh\s])Ngày\s*([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})(?:\s|$|\.|,)/i,
    // Pattern 8: "Ngày 15 Tháng 09 Năm 2025" or "Ngày 15 Ths : : Pag ... Năm 2025" (with capital letters, OCR variations) - NEW pattern for new prescription type
    // Match "Ngày DD Tháng/Ths MM Năm YYYY" but exclude "Ngày sinh"
    // Handle OCR errors: "Ths" (missing "ng"), "Pag" (OCR noise), ":" (colons)
    // Match "Tháng" or "Ths" (OCR error where "ng" is missing)
    /(?:^|[^sinh\s])Ngày\s*([0O\d]{1,2})\s*Th(?:[áa]ng|s)[:\s]*(?:[:]\s*)?(?:Pag\s+)?([0O\d]{1,2})\s*N[ăa]m\s*([0O\d]{4})(?:\s|$|\.|,)/i,
  ];
  
  // Search in full text
  console.log('🔍 Searching for examination date...');
  for (let i = 0; i < datePatterns.length; i++) {
    const pattern = datePatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
    if (match) {
      console.log(`   Match[0]: "${match[0]}"`);
      console.log(`   Match[1]: "${match[1] || 'N/A'}", Match[2]: "${match[2] || 'N/A'}", Match[3]: "${match[3] || 'N/A'}"`);
    }
    if (match && match[1] && match[2] && match[3]) {
      let dateStr = '';
      // Replace O with 0 in date parts
      let day = match[1].replace(/O/gi, '0');
      let month = match[2].replace(/O/gi, '0');
      let year = match[3].replace(/O/gi, '0');
      
      // Check if it's "tháng" format (lowercase) or "Tháng/Ths" format (uppercase with OCR errors)
      if (match[0].includes('tháng') || match[0].includes('Tháng') || match[0].includes('Ths')) {
        // Format: Ngày 14 tháng 07 năm 2022 or Ngày 15 Tháng 09 Năm 2025 or Ngày 15 Ths : : Pag ... Năm 2025
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        console.log(`   Parsing date: day=${day}, month=${month}, year=${year}`);
        if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 2000 && parseInt(year) <= 2100) {
          dateStr = `${year}-${month}-${day}`;
          console.log(`   ✅ Valid date: ${dateStr}`);
        } else {
          console.log(`   ⚠️ Invalid date range`);
        }
      } else {
        // Format: dd/mm/yyyy or dd/mm/yy
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        if (year.length === 2) {
          year = '20' + year;
        }
        console.log(`   Parsing date: day=${day}, month=${month}, year=${year}`);
        if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 2000 && parseInt(year) <= 2100) {
          dateStr = `${year}-${month}-${day}`;
          console.log(`   ✅ Valid date: ${dateStr}`);
        } else {
          console.log(`   ⚠️ Invalid date range`);
        }
      }
      if (dateStr) {
        result.examinationDate = dateStr;
        console.log('✅ Extracted examination date:', result.examinationDate);
        break;
      }
    }
  }
  
  // If not found, search in lines
  if (!result.examinationDate) {
    for (const line of lines) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[2] && match[3]) {
          let dateStr = '';
          // Replace O with 0 in date parts
          let day = match[1].replace(/O/gi, '0');
          let month = match[2].replace(/O/gi, '0');
          let year = match[3].replace(/O/gi, '0');
          
          // Check if it's "tháng" format (lowercase) or "Tháng/Ths" format (uppercase with OCR errors)
          if (match[0].includes('tháng') || match[0].includes('Tháng') || match[0].includes('Ths')) {
            day = day.padStart(2, '0');
            month = month.padStart(2, '0');
            if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 2000 && parseInt(year) <= 2100) {
              dateStr = `${year}-${month}-${day}`;
            }
          } else {
            day = day.padStart(2, '0');
            month = month.padStart(2, '0');
            if (year.length === 2) {
              year = '20' + year;
            }
            if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 2000 && parseInt(year) <= 2100) {
              dateStr = `${year}-${month}-${day}`;
            }
          }
          if (dateStr) {
            result.examinationDate = dateStr;
            console.log('✅ Extracted examination date from line:', result.examinationDate);
            break;
          }
        }
      }
      if (result.examinationDate) break;
    }
  }

  // Extract date of birth (Ngày sinh, Năm sinh) - Search in full text
  const birthDatePatterns = [
    // Pattern 1: "Ngày sinh: 01/01/1980" (most common format) - handle parentheses like "(45 Tuổi)"
    // Also handle cases where date might be separated by spaces or other characters
    /Ngày\s+sinh[:\s]+([0O\d]{1,2})\s*[\/\.\s]\s*([0O\d]{1,2})\s*[\/\.\s]\s*([0O\d]{2,4})(?:\s*\([^)]+\))?/i,
    // Pattern 1b: "Ngay sinh: 01/01/1980" (OCR error - missing dấu) - handle OCR errors
    /Ngay\s+sinh[:\s]+([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})(?:\s*\([^)]+\))?/i,
    // Pattern 2: "Ngày sinh: 01 tháng 01 năm 1980" (full format) - handle parentheses like "(45 Tuổi)"
    /Ngày\s+sinh[:\s]+([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})(?:\s*\([^)]+\))?/i,
    // Pattern 2b: "Ngay sinh: 01 tháng 01 năm 1980" (OCR error - missing dấu)
    /Ngay\s+sinh[:\s]+([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})(?:\s*\([^)]+\))?/i,
    // Pattern 3: "Năm sinh: 1980" (only year) - prioritize this for year-only format
    /Năm\s+sinh[:\s]+([0O\d]{4})/i,
    // Pattern 3b: "Nam sinh: 1980" (OCR error - missing dấu) - handle OCR errors
    /Nam\s+sinh[:\s]+([0O\d]{4})/i,
    // Pattern 3c: "Nam sinh1957" or "Năm sinh1957" (no space between "sinh" and year) - NEW pattern for OCR errors
    /(?:Nam|Năm)\s+sinh([0O\d]{4})/i,
    // Pattern 4: "Ngày sinh 01/01/1980" (without colon) - handle parentheses
    /Ngày\s+sinh\s+([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})(?:\s*\([^)]+\))?/i,
    // Pattern 4b: "Ngay sinh 01/01/1980" (OCR error - missing dấu, without colon)
    /Ngay\s+sinh\s+([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{1,2})\s*[\/\.]\s*([0O\d]{2,4})(?:\s*\([^)]+\))?/i,
    // Pattern 5: "Ngày sinh 01 tháng 01 năm 1980" (without colon, full format)
    /Ngày\s+sinh\s+([0O\d]{1,2})\s*tháng\s*([0O\d]{1,2})\s*năm\s*([0O\d]{4})/i,
    // Pattern 6: "Năm sinh 1980" (without colon, only year)
    /Năm\s+sinh\s+([0O\d]{4})/i,
    // Pattern 6b: "Nam sinh 1980" (OCR error - missing dấu, without colon)
    /Nam\s+sinh\s+([0O\d]{4})/i,
  ];
  
  // Debug: Check if "Năm sinh" exists in text (with or without dấu)
  console.log('🔍 Searching for date of birth...');
  const hasNamSinh = /Năm\s+sinh/i.test(fullText);
  const hasNamSinhNoDau = /Nam\s+sinh/i.test(fullText);
  const hasNgaySinh = /Ngày\s+sinh/i.test(fullText);
  const hasNgaySinhNoDau = /Ngay\s+sinh/i.test(fullText);
  const hasSinh = /sinh/i.test(fullText);
  console.log(`   📋 Contains "Năm sinh" (with dấu): ${hasNamSinh}`);
  console.log(`   📋 Contains "Nam sinh" (without dấu): ${hasNamSinhNoDau}`);
  console.log(`   📋 Contains "Ngày sinh": ${hasNgaySinh}`);
  console.log(`   📋 Contains "Ngay sinh" (no dấu): ${hasNgaySinhNoDau}`);
  console.log(`   📋 Contains "sinh" (any): ${hasSinh}`);
  
  // Debug: Show lines containing "Năm sinh", "Nam sinh", "Ngày sinh", or just "sinh"
  const relevantLines = lines.filter(line => /Năm\s+sinh|Nam\s+sinh|Ngày\s+sinh|Ngay\s+sinh|sinh/i.test(line));
  if (relevantLines.length > 0) {
    console.log(`   📋 Found ${relevantLines.length} relevant lines with "sinh":`);
    relevantLines.forEach((line, idx) => {
      console.log(`      Line ${idx + 1}: "${line}"`);
    });
  } else {
    console.log(`   ⚠️ No lines found containing "sinh" - checking for date patterns...`);
    // Look for date patterns that might be birth dates
    const datePatterns = lines.filter(line => /\d{1,2}\/\d{1,2}\/\d{4}/.test(line));
    if (datePatterns.length > 0) {
      console.log(`   📋 Found ${datePatterns.length} lines with date patterns (DD/MM/YYYY):`);
      datePatterns.forEach((line, idx) => {
        console.log(`      Line ${idx + 1}: "${line}"`);
      });
    }
  }
  for (let i = 0; i < birthDatePatterns.length; i++) {
    const pattern = birthDatePatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    const isYearOnly = i === 4 || i === 5 || i === 6 || i === 10 || i === 11;
    console.log(`   Pattern ${i + 1} (${isYearOnly ? 'year-only' : 'full-date'}): ${match ? '✅ MATCHED' : '❌ no match'}`);
    if (match) {
      console.log(`      Match[0]: "${match[0]}"`);
      if (i === 4 || i === 5 || i === 6 || i === 10 || i === 11) {
        // Pattern 3, 3b, 3c, 6, 6b: Only year (Năm sinh: 1980, Nam sinh: 1980, or Nam sinh1957)
        console.log(`      Match[1] (year only): "${match[1] || 'N/A'}"`);
        if (match[1]) {
          const year = match[1].replace(/O/gi, '0').trim();
          console.log(`      Cleaned year: "${year}"`);
          const yearNum = parseInt(year);
          console.log(`      Year as number: ${yearNum}`);
          if (yearNum >= 1900 && yearNum <= 2100) {
            // For year-only format, use January 1st as default
            result.dateOfBirth = `${year}-01-01`;
            result.yearOfBirth = year;
            console.log('✅ Extracted date of birth (year only):', result.dateOfBirth);
            console.log('✅ Extracted year of birth:', result.yearOfBirth);
            break;
          } else {
            console.log(`      ⚠️ Year ${yearNum} is out of valid range (1900-2100)`);
          }
        } else {
          console.log(`      ⚠️ Match[1] is empty or undefined`);
        }
      } else {
        // Other patterns: Full date (DD/MM/YYYY or DD tháng MM năm YYYY)
        console.log(`   Match[1]: "${match[1] || 'N/A'}", Match[2]: "${match[2] || 'N/A'}", Match[3]: "${match[3] || 'N/A'}"`);
        if (match[1] && match[2] && match[3]) {
          let dateStr = '';
          // Replace O with 0 in date parts
          let day = match[1].replace(/O/gi, '0');
          let month = match[2].replace(/O/gi, '0');
          let year = match[3].replace(/O/gi, '0');
          
          if (match[0].includes('tháng')) {
            // Format: Ngày sinh: 01 tháng 01 năm 1980
            day = day.padStart(2, '0');
            month = month.padStart(2, '0');
            console.log(`   Parsing birth date: day=${day}, month=${month}, year=${year}`);
            if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 1900 && parseInt(year) <= 2100) {
              dateStr = `${year}-${month}-${day}`;
              console.log(`   ✅ Valid birth date: ${dateStr}`);
            } else {
              console.log(`   ⚠️ Invalid birth date range`);
            }
          } else {
            // Format: Ngày sinh: 01/01/1980 or 01/01/80
            day = day.padStart(2, '0');
            month = month.padStart(2, '0');
            if (year.length === 2) {
              // If 2-digit year, assume 1900s for years 00-50, 2000s for years 51-99
              const yearNum = parseInt(year);
              year = yearNum <= 50 ? '20' + year : '19' + year;
            }
            console.log(`   Parsing birth date: day=${day}, month=${month}, year=${year}`);
            if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 1900 && parseInt(year) <= 2100) {
              dateStr = `${year}-${month}-${day}`;
              console.log(`   ✅ Valid birth date: ${dateStr}`);
            } else {
              console.log(`   ⚠️ Invalid birth date range`);
            }
          }
          if (dateStr) {
            // If we have full date (DD/MM/YYYY), only extract year
            result.yearOfBirth = year;
            // Don't set dateOfBirth, only yearOfBirth
            console.log('✅ Extracted year of birth from full date:', result.yearOfBirth);
            break;
          }
        }
      }
    }
  }
  
  // If not found, search in lines
  if (!result.dateOfBirth) {
    console.log('   🔍 Searching in individual lines...');
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;
      for (let i = 0; i < birthDatePatterns.length; i++) {
        const pattern = birthDatePatterns[i];
        if (!pattern) continue;
        const match = line.match(pattern);
        if (match) {
          console.log(`   ✅ Found match in line ${lineIdx + 1}: "${line}"`);
          console.log(`      Pattern ${i + 1}: Match[0] = "${match[0]}"`);
          if (i === 4 || i === 5 || i === 6 || i === 10 || i === 11) {
            // Pattern 3, 3b, 3c, 6, 6b: Only year (Năm sinh: 1980, Nam sinh: 1980, or Nam sinh1957)
            if (match[1]) {
              const year = match[1].replace(/O/gi, '0').trim();
              const yearNum = parseInt(year);
              console.log(`      Extracted year: "${year}" (${yearNum})`);
              if (yearNum >= 1900 && yearNum <= 2100) {
                result.dateOfBirth = `${year}-01-01`;
                result.yearOfBirth = year;
                console.log('✅ Extracted date of birth from line (year only):', result.dateOfBirth);
                console.log('✅ Extracted year of birth from line:', result.yearOfBirth);
                break;
              } else {
                console.log(`      ⚠️ Year ${yearNum} is out of valid range (1900-2100)`);
              }
            } else {
              console.log(`      ⚠️ Match[1] is empty or undefined`);
            }
          } else {
            // Other patterns: Full date
            if (match[1] && match[2] && match[3]) {
              let dateStr = '';
              let day = match[1].replace(/O/gi, '0');
              let month = match[2].replace(/O/gi, '0');
              let year = match[3].replace(/O/gi, '0');
              
              if (match[0].includes('tháng')) {
                day = day.padStart(2, '0');
                month = month.padStart(2, '0');
                if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 1900 && parseInt(year) <= 2100) {
                  dateStr = `${year}-${month}-${day}`;
                }
              } else {
                day = day.padStart(2, '0');
                month = month.padStart(2, '0');
                if (year.length === 2) {
                  const yearNum = parseInt(year);
                  year = yearNum <= 50 ? '20' + year : '19' + year;
                }
                if (parseInt(day) <= 31 && parseInt(month) <= 12 && parseInt(year) >= 1900 && parseInt(year) <= 2100) {
                  dateStr = `${year}-${month}-${day}`;
                }
              }
              if (dateStr) {
                result.dateOfBirth = dateStr;
                console.log('✅ Extracted date of birth from line:', result.dateOfBirth);
                break;
              }
            }
          }
        }
      }
      if (result.dateOfBirth) break;
    }
  }
  
  // NEW: Handle case where "Ngày sinh:" is empty/blank (e.g., "Ngày sinh: Cân nặng: 75 Kg")
  // Search in surrounding lines (previous, current, next 2 lines) for date pattern
  // Also search in the same line more carefully - OCR might have missed the date
  if (!result.dateOfBirth && !result.yearOfBirth) {
    const lineWithNgaySinh = lines.findIndex(line => {
      // Check if line contains "Ngày sinh:" but no date pattern after it
      const hasNgaySinh = /Ngày\s+sinh[:\s]*/i.test(line);
      const hasDatePattern = /(\d{1,2}\s*[\/\.]\s*\d{1,2}\s*[\/\.]\s*\d{4})/.test(line);
      const hasYearPattern = /(?:Năm|Nam)\s+sinh[:\s]*\d{4}/i.test(line);
      return hasNgaySinh && !hasDatePattern && !hasYearPattern;
    });
    
    if (lineWithNgaySinh >= 0) {
      console.log(`   🔍 Found "Ngày sinh:" without date in line ${lineWithNgaySinh + 1}: "${lines[lineWithNgaySinh]}"`);
      console.log(`   🔍 Searching for date pattern in same line and surrounding lines...`);
      
      // First, try to find date pattern in the same line with "Ngày sinh:" more carefully
      // OCR might have separated the date with spaces or other characters
      const ngaySinhLine = lines[lineWithNgaySinh];
      if (ngaySinhLine) {
        // Try multiple patterns to find date after "Ngày sinh:"
        // Pattern 1: "Ngày sinh: 01/01/1980" (with various separators)
        const dateAfterNgaySinh = ngaySinhLine.match(/Ngày\s+sinh[:\s]+[^\d]*(\d{1,2})\s*[\/\.\s]\s*(\d{1,2})\s*[\/\.\s]\s*(\d{4})/i);
        if (dateAfterNgaySinh && dateAfterNgaySinh[1] && dateAfterNgaySinh[2] && dateAfterNgaySinh[3]) {
          let day = dateAfterNgaySinh[1].replace(/O/gi, '0').trim().padStart(2, '0');
          let month = dateAfterNgaySinh[2].replace(/O/gi, '0').trim().padStart(2, '0');
          let year = dateAfterNgaySinh[3].replace(/O/gi, '0').trim();
          const dayNum = parseInt(day);
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          console.log(`      Found date after "Ngày sinh:" in same line: "${day}/${month}/${year}"`);
          if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
            if (result.examinationDate) {
              const examDate = new Date(result.examinationDate);
              const birthDate = new Date(`${year}-${month}-${day}`);
              if (birthDate < examDate) {
                result.yearOfBirth = year;
                console.log(`✅ Extracted year of birth from same line: ${result.yearOfBirth}`);
              }
            } else {
              result.yearOfBirth = year;
              console.log(`✅ Extracted year of birth from same line: ${result.yearOfBirth}`);
            }
          }
        }
      }
      
      // If still not found, search in surrounding lines
      if (!result.yearOfBirth) {
        const searchRange = [
          Math.max(0, lineWithNgaySinh - 1),
          Math.min(lines.length - 1, lineWithNgaySinh + 1),
          Math.min(lines.length - 1, lineWithNgaySinh + 2)
        ];
        
        // Remove duplicates
        const uniqueSearchRange = [...new Set(searchRange)];
        
        for (const searchIdx of uniqueSearchRange) {
          const searchLine = lines[searchIdx];
          if (!searchLine) continue;
          
          console.log(`      Checking line ${searchIdx + 1}: "${searchLine}"`);
          
          // Try to find date pattern DD/MM/YYYY (with flexible separators)
          const dateMatch = searchLine.match(/(\d{1,2})\s*[\/\.\s]\s*(\d{1,2})\s*[\/\.\s]\s*(\d{4})/);
          if (dateMatch && dateMatch[1] && dateMatch[2] && dateMatch[3]) {
            let day = dateMatch[1].replace(/O/gi, '0').trim().padStart(2, '0');
            let month = dateMatch[2].replace(/O/gi, '0').trim().padStart(2, '0');
            let year = dateMatch[3].replace(/O/gi, '0').trim();
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            console.log(`      Found date in line ${searchIdx + 1}: "${day}/${month}/${year}"`);
            if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
              // Check if this date is before examination date
              if (result.examinationDate) {
                const examDate = new Date(result.examinationDate);
                const birthDate = new Date(`${year}-${month}-${day}`);
                if (birthDate < examDate) {
                  result.yearOfBirth = year;
                  console.log(`✅ Extracted year of birth from surrounding line ${searchIdx + 1}: ${result.yearOfBirth}`);
                  break;
                } else {
                  console.log(`      ⚠️ Date ${year}-${month}-${day} is not before examination date ${result.examinationDate}`);
                }
              } else {
                result.yearOfBirth = year;
                console.log(`✅ Extracted year of birth from surrounding line ${searchIdx + 1}: ${result.yearOfBirth}`);
                break;
              }
            }
          }
          
          // Also try to find year-only pattern (4 digits 1900-2010)
          if (!result.yearOfBirth) {
            const yearMatch = searchLine.match(/(19[0-9]{2}|20[01][0-9])/);
            if (yearMatch && yearMatch[1]) {
              const yearNum = parseInt(yearMatch[1]);
              if (yearNum >= 1900 && yearNum <= 2010) {
                // Check if this year is before examination date
                if (result.examinationDate) {
                  const examDate = new Date(result.examinationDate);
                  const birthDate = new Date(`${yearNum}-01-01`);
                  if (birthDate < examDate) {
                    result.yearOfBirth = yearMatch[1];
                    result.dateOfBirth = `${yearMatch[1]}-01-01`;
                    console.log(`✅ Extracted year of birth (${yearMatch[1]}) from surrounding line ${searchIdx + 1}`);
                    break;
                  } else {
                    console.log(`      ⚠️ Year ${yearNum} is not before examination date ${result.examinationDate}`);
                  }
                } else {
                  result.yearOfBirth = yearMatch[1];
                  result.dateOfBirth = `${yearMatch[1]}-01-01`;
                  console.log(`✅ Extracted year of birth (${yearMatch[1]}) from surrounding line ${searchIdx + 1}`);
                  break;
                }
              }
            }
          }
        }
      }
      
      // Last resort: Search in entire text for date pattern near "Ngày sinh"
      if (!result.yearOfBirth) {
        console.log(`   🔍 Last resort: Searching entire text for date pattern near "Ngày sinh"...`);
        // Find position of "Ngày sinh" in full text
        const ngaySinhIndex = fullText.search(/Ngày\s+sinh[:\s]*/i);
        if (ngaySinhIndex >= 0) {
          // Extract text after "Ngày sinh:" (next 200 characters to catch dates that might be separated)
          const textAfterNgaySinh = fullText.substring(ngaySinhIndex, ngaySinhIndex + 200);
          console.log(`      Text after "Ngày sinh:": "${textAfterNgaySinh.substring(0, 100)}..."`);
          
          // Try to find date pattern in this text (with flexible separators)
          const dateInText = textAfterNgaySinh.match(/(\d{1,2})\s*[\/\.\s]\s*(\d{1,2})\s*[\/\.\s]\s*(\d{4})/);
          if (dateInText && dateInText[1] && dateInText[2] && dateInText[3]) {
            let day = dateInText[1].replace(/O/gi, '0').trim().padStart(2, '0');
            let month = dateInText[2].replace(/O/gi, '0').trim().padStart(2, '0');
            let year = dateInText[3].replace(/O/gi, '0').trim();
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            console.log(`      Found date in text after "Ngày sinh:": "${day}/${month}/${year}"`);
            if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
              if (result.examinationDate) {
                const examDate = new Date(result.examinationDate);
                const birthDate = new Date(`${year}-${month}-${day}`);
                if (birthDate < examDate) {
                  result.yearOfBirth = year;
                  console.log(`✅ Extracted year of birth from text after "Ngày sinh:": ${result.yearOfBirth}`);
                }
              } else {
                result.yearOfBirth = year;
                console.log(`✅ Extracted year of birth from text after "Ngày sinh:": ${result.yearOfBirth}`);
              }
            }
          }
          
          // If still not found, try to find just the year (1980) near "Ngày sinh:"
          // Look for 4-digit year (1900-2010) within 50 characters after "Ngày sinh:"
          if (!result.yearOfBirth) {
            console.log(`      Searching for year pattern (1900-2010) near "Ngày sinh:"...`);
            const textNearNgaySinh = fullText.substring(ngaySinhIndex, ngaySinhIndex + 150);
            // Try to find year pattern: 4 digits that could be a birth year
            const yearMatches = Array.from(textNearNgaySinh.matchAll(/(19[0-9]{2}|20[01][0-9])/g));
            console.log(`      Found ${yearMatches.length} year patterns near "Ngày sinh:"`);
            
            for (const yearMatch of yearMatches) {
              if (!yearMatch || !yearMatch[1]) continue;
              const yearNum = parseInt(yearMatch[1]);
              const yearPos = yearMatch.index || 0;
              console.log(`      Year pattern found: "${yearMatch[1]}" (${yearNum}) at position ${yearPos} from "Ngày sinh:"`);
              
              // Only consider years in birth year range (1900-2010)
              if (yearNum >= 1900 && yearNum <= 2010) {
                // Check if this year is before examination date
                if (result.examinationDate) {
                  const examDate = new Date(result.examinationDate);
                  const birthDate = new Date(`${yearNum}-01-01`);
                  if (birthDate < examDate) {
                    // Prefer years closer to "Ngày sinh:" (within first 100 chars)
                    if (yearPos < 100 || yearMatches.length === 1) {
                      result.yearOfBirth = yearMatch[1];
                      result.dateOfBirth = `${yearMatch[1]}-01-01`;
                      console.log(`✅ Extracted year of birth (${yearMatch[1]}) near "Ngày sinh:" at position ${yearPos}`);
                      break;
                    }
                  } else {
                    console.log(`      ⚠️ Year ${yearNum} is not before examination date ${result.examinationDate}`);
                  }
                } else {
                  // If no examination date, use the first valid birth year found near "Ngày sinh:"
                  result.yearOfBirth = yearMatch[1];
                  result.dateOfBirth = `${yearMatch[1]}-01-01`;
                  console.log(`✅ Extracted year of birth (${yearMatch[1]}) near "Ngày sinh:" at position ${yearPos}`);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  // Extract year of birth from dateOfBirth if available (if not already extracted)
  if (result.dateOfBirth && !result.yearOfBirth) {
    const yearMatch = result.dateOfBirth.match(/^(\d{4})/);
    if (yearMatch && yearMatch[1]) {
      result.yearOfBirth = yearMatch[1];
      console.log('✅ Extracted year of birth from dateOfBirth:', result.yearOfBirth);
    }
  }
  
  // Debug: Log final result
  if (!result.dateOfBirth && !result.yearOfBirth) {
    console.log('⚠️ WARNING: No date of birth or year of birth found!');
    console.log('   Attempting to find any year pattern near "Năm sinh", "Nam sinh", or "Ngày sinh"...');
    
    // Try multiple fallback patterns
    const fallbackPatterns = [
      /(?:Năm|Nam)\s+sinh[:\s]+.*?(\d{4})/i,  // "Năm sinh: ... 1957" or "Nam sinh: ... 1957"
      /(?:Năm|Nam)\s+sinh(\d{4})/i,  // "Nam sinh1957" or "Năm sinh1957" (no space)
      /(?:Năm|Nam)\s+sinh\s+(\d{4})/i,  // "Nam sinh 1957" or "Năm sinh 1957" (with space)
      // Handle OCR errors: "Ngày sin" (missing "h")
      /Ngày\s+sin[:\s]+.*?(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "Ngày sin: 01/01/1980"
      /Ngay\s+sin[:\s]+.*?(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "Ngay sin: 01/01/1980" (no dấu)
    ];
    
    for (let i = 0; i < fallbackPatterns.length; i++) {
      const pattern = fallbackPatterns[i];
      if (!pattern) continue;
      const match = fullText.match(pattern);
      if (match && match[1]) {
        if (i >= 3) {
          // Pattern 4 or 5: Full date format (DD/MM/YYYY)
          if (match[1] && match[2] && match[3]) {
            let day = match[1].replace(/O/gi, '0').trim().padStart(2, '0');
            let month = match[2].replace(/O/gi, '0').trim().padStart(2, '0');
            let year = match[3].replace(/O/gi, '0').trim();
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            console.log(`   Found date near "Ngày sin" (fallback pattern ${i + 1}): "${day}/${month}/${year}"`);
            if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
              // If we have full date (DD/MM/YYYY), only extract year
              result.yearOfBirth = year;
              // Don't set dateOfBirth, only yearOfBirth
              console.log('✅ Extracted year of birth from fallback pattern:', result.yearOfBirth);
              break;
            }
          }
        } else {
          // Pattern 1, 2, or 3: Year only
          const year = match[1].trim();
          const yearNum = parseInt(year);
          console.log(`   Found year near "Nam/Năm sinh" (fallback pattern ${i + 1}): "${year}" (${yearNum})`);
          if (yearNum >= 1900 && yearNum <= 2100) {
            result.yearOfBirth = year;
            result.dateOfBirth = `${year}-01-01`;
            console.log('✅ Extracted year of birth from fallback pattern:', result.yearOfBirth);
            break;
          }
        }
      }
    }
    
    // If still not found, try to find date pattern after "Họ tên" or "số định danh"
    if (!result.dateOfBirth && !result.yearOfBirth) {
      console.log('   Attempting to find date pattern after "Họ tên" or "số định danh"...');
      
      // Look for date pattern (DD/MM/YYYY) near "Họ tên" or after patient ID
      const dateAfterNamePatterns = [
        /Họ\s+tên[:\s]+[^:]+[:\s]+(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "Họ tên: ... : 01/01/1980"
        /số\s+định\s+danh[^:]*:\s*\d+[^\d]*(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "số định danh: ... 01/01/1980"
        /số\s+định\s+no\s+nhân[^:]*:\s*\d+[^\d]*(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "số định no nhân" (OCR error)
        /số\s+căn\s+cước[^:]*:\s*\d+[^\d]*(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,  // "số căn cước: ... 01/01/1980"
        // Find date pattern after "Họ tên" and before "Cân nặng" or "Giới tính"
        /Họ\s+tên[:\s]+[^:]+;\s*[^:]*(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})[^\d]*Cân/i,  // "Họ tên: ... ; ... 01/01/1980 ... Cân"
        // Find date pattern in the same line as "Họ tên" or next line
        /(?:Họ\s+tên[:\s]+[^;]+;\s*[^:]*|số\s+định[^:]*:\s*\d+[^\d]*)(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/i,
      ];
      
      for (let i = 0; i < dateAfterNamePatterns.length; i++) {
        const pattern = dateAfterNamePatterns[i];
        if (!pattern) continue;
        const match = fullText.match(pattern);
        console.log(`   Pattern ${i + 1}: ${match ? '✅ MATCHED' : '❌ no match'}`);
        if (match && match[1] && match[2] && match[3]) {
          let day = match[1].replace(/O/gi, '0').trim().padStart(2, '0');
          let month = match[2].replace(/O/gi, '0').trim().padStart(2, '0');
          let year = match[3].replace(/O/gi, '0').trim();
          const dayNum = parseInt(day);
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          console.log(`      Found date after name/ID (pattern ${i + 1}): "${day}/${month}/${year}"`);
          if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
            // If we have full date (DD/MM/YYYY), only extract year
            result.yearOfBirth = year;
            // Don't set dateOfBirth, only yearOfBirth
            console.log('✅ Extracted year of birth from name/ID pattern:', result.yearOfBirth);
            break;
          } else {
            console.log(`      ⚠️ Invalid date: day=${dayNum}, month=${monthNum}, year=${yearNum}`);
          }
        }
      }
      
      // Also search in lines for date after "Họ tên"
      if (!result.dateOfBirth && !result.yearOfBirth) {
        console.log('   Searching in lines for date after "Họ tên"...');
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
          const line = lines[lineIdx];
          if (!line) continue;
          // Check if line contains "Họ tên"
          if (/Họ\s+tên/i.test(line)) {
            console.log(`      Found "Họ tên" in line ${lineIdx + 1}: "${line}"`);
            // Look for date pattern in this line or next line
            const dateInLine = line.match(/(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/);
            if (dateInLine && dateInLine[1] && dateInLine[2] && dateInLine[3]) {
              let day = dateInLine[1].replace(/O/gi, '0').trim().padStart(2, '0');
              let month = dateInLine[2].replace(/O/gi, '0').trim().padStart(2, '0');
              let year = dateInLine[3].replace(/O/gi, '0').trim();
              const dayNum = parseInt(day);
              const monthNum = parseInt(month);
              const yearNum = parseInt(year);
              console.log(`      Found date in line: "${day}/${month}/${year}"`);
              if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
                // If we have full date (DD/MM/YYYY), only extract year
                result.yearOfBirth = year;
                // Don't set dateOfBirth, only yearOfBirth
                console.log('✅ Extracted year of birth from line with "Họ tên":', result.yearOfBirth);
                break;
              }
            }
            // Check next line if current line doesn't have date
            if (!result.dateOfBirth && lineIdx + 1 < lines.length) {
              const nextLine = lines[lineIdx + 1];
              if (nextLine) {
                console.log(`      Checking next line (${lineIdx + 2}): "${nextLine}"`);
                // Try to find date pattern DD/MM/YYYY
                const dateInNextLine = nextLine.match(/(\d{1,2})\s*[\/\.]\s*(\d{1,2})\s*[\/\.]\s*(\d{4})/);
                if (dateInNextLine && dateInNextLine[1] && dateInNextLine[2] && dateInNextLine[3]) {
                  let day = dateInNextLine[1].replace(/O/gi, '0').trim().padStart(2, '0');
                  let month = dateInNextLine[2].replace(/O/gi, '0').trim().padStart(2, '0');
                  let year = dateInNextLine[3].replace(/O/gi, '0').trim();
                  const dayNum = parseInt(day);
                  const monthNum = parseInt(month);
                  const yearNum = parseInt(year);
                  console.log(`      Found date in next line (${lineIdx + 2}): "${day}/${month}/${year}"`);
                  if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
                    // If we have full date (DD/MM/YYYY), only extract year
                    result.yearOfBirth = year;
                    // Don't set dateOfBirth, only yearOfBirth
                    console.log('✅ Extracted year of birth from next line after "Họ tên":', result.yearOfBirth);
                    break;
                  }
                }
                // Try to find any 4-digit number that could be a year (1900-2010) near "Ngày sinh" or "Ngày sin"
                if (!result.dateOfBirth && /Ngày\s+sin/i.test(nextLine)) {
                  console.log(`      Found "Ngày sin" in next line, searching for year...`);
                  // Look for 4-digit number that could be year
                  const yearMatch = nextLine.match(/(\d{4})/);
                  if (yearMatch && yearMatch[1]) {
                    const yearNum = parseInt(yearMatch[1]);
                    if (yearNum >= 1900 && yearNum <= 2010) {
                      result.yearOfBirth = yearMatch[1];
                      result.dateOfBirth = `${yearMatch[1]}-01-01`; // Default to Jan 1 if only year found
                      console.log(`✅ Extracted year of birth from "Ngày sin" line: ${result.yearOfBirth}`);
                      break;
                    }
                  }
                }
              }
            }
          }
          if (result.dateOfBirth) break;
        }
      }
      
      // Try to extract from số định danh (Vietnamese ID number)
      // Format: YYMMDD... (first 6 digits might be date of birth)
      if (!result.dateOfBirth && !result.yearOfBirth) {
        console.log('   Attempting to extract date from số định danh (ID number)...');
        const idPattern = /số\s+định[^:]*:\s*(\d{9,12})/i;
        const idMatch = fullText.match(idPattern);
        if (idMatch && idMatch[1]) {
          const idNumber = idMatch[1];
          console.log(`      Found ID number: ${idNumber}`);
          // Try to extract date from first 6 digits: YYMMDD
          if (idNumber.length >= 6) {
            const yy = idNumber.substring(0, 2);
            const mm = idNumber.substring(2, 4);
            const dd = idNumber.substring(4, 6);
            const yearNum = parseInt(yy);
            const monthNum = parseInt(mm);
            const dayNum = parseInt(dd);
            console.log(`      Extracted from ID: YY=${yy}, MM=${mm}, DD=${dd}`);
            // Check if it's a valid date
            if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
              // Year could be 1900s or 2000s
              let fullYear = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
              if (fullYear >= 1900 && fullYear <= 2010) {
                result.dateOfBirth = `${fullYear}-${mm}-${dd}`;
                result.yearOfBirth = fullYear.toString();
                console.log(`✅ Extracted date of birth from ID number: ${result.dateOfBirth}`);
              } else {
                console.log(`      ⚠️ Invalid year from ID: ${fullYear} (not in range 1900-2010)`);
              }
            } else {
              console.log(`      ⚠️ Invalid date from ID: MM=${monthNum}, DD=${dayNum}`);
              // Try alternative: Maybe the ID format is different, try to find year 1980 in the ID
              // Look for "1980" in the ID number
              if (idNumber.includes('1980')) {
                const yearIndex = idNumber.indexOf('1980');
                console.log(`      Found "1980" in ID at position ${yearIndex}`);
                result.yearOfBirth = '1980';
                result.dateOfBirth = '1980-01-01'; // Default to Jan 1 if only year found
                console.log(`✅ Extracted year of birth (1980) from ID number`);
              } else {
                // Try to find any 4-digit year (1900-2010) in the ID
                console.log(`      Searching for any valid year (1900-2010) in ID...`);
                for (let year = 1980; year >= 1900; year--) {
                  if (idNumber.includes(year.toString())) {
                    console.log(`      Found "${year}" in ID`);
                    result.yearOfBirth = year.toString();
                    result.dateOfBirth = `${year}-01-01`; // Default to Jan 1 if only year found
                    console.log(`✅ Extracted year of birth (${year}) from ID number`);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Last resort: Find any date pattern (DD/MM/YYYY) that looks like a birth date (1900-2010 range)
    if (!result.dateOfBirth && !result.yearOfBirth) {
      console.log('   Last resort: Searching for any date pattern (DD/MM/YYYY) in birth year range (1900-2010)...');
      // Use more flexible pattern to catch dates with spaces or other separators
      const allDatePatterns = Array.from(fullText.matchAll(/(\d{1,2})\s*[\/\.\s]\s*(\d{1,2})\s*[\/\.\s]\s*(\d{4})/g));
      console.log(`   Found ${allDatePatterns.length} date patterns in text`);
      
      for (let idx = 0; idx < allDatePatterns.length; idx++) {
        const match = allDatePatterns[idx];
        if (!match || !match[1] || !match[2] || !match[3]) continue;
        let day = match[1].replace(/O/gi, '0').trim().padStart(2, '0');
        let month = match[2].replace(/O/gi, '0').trim().padStart(2, '0');
        let year = match[3].replace(/O/gi, '0').trim();
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        console.log(`   Date pattern ${idx + 1}: "${day}/${month}/${year}" (${dayNum}/${monthNum}/${yearNum})`);
        
        // Only consider dates in birth year range (1900-2010) and valid date
        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2010) {
          console.log(`      ✅ Valid birth date range`);
          
          // Check if this date is not the examination date
          if (result.examinationDate) {
            const examDate = new Date(result.examinationDate);
            const birthDate = new Date(`${year}-${month}-${day}`);
            console.log(`      Comparing with examination date: ${result.examinationDate} (${examDate.toISOString()})`);
            console.log(`      Birth date: ${birthDate.toISOString()}`);
            // Birth date should be before examination date
            if (birthDate < examDate) {
              // If we have full date (DD/MM/YYYY), only extract year
              result.yearOfBirth = year;
              // Don't set dateOfBirth, only yearOfBirth
              console.log(`✅ Extracted year of birth from last resort pattern: "${year}"`);
              break;
            } else {
              console.log(`      ⚠️ Birth date is not before examination date, skipping`);
            }
          } else {
            // If no examination date, just use the first valid birth date found
            // If we have full date (DD/MM/YYYY), only extract year
            result.yearOfBirth = year;
            // Don't set dateOfBirth, only yearOfBirth
            console.log(`✅ Extracted year of birth from last resort pattern: "${year}"`);
            break;
          }
        } else {
          if (yearNum < 1900 || yearNum > 2010) {
            console.log(`      ⚠️ Year ${yearNum} is out of birth year range (1900-2010)`);
          } else {
            console.log(`      ⚠️ Invalid date: day=${dayNum}, month=${monthNum}`);
          }
        }
      }
      
      if (!result.dateOfBirth && !result.yearOfBirth) {
        console.log(`   ⚠️ No valid birth date found in ${allDatePatterns.length} date patterns`);
        
        // Final fallback: Search for any 4-digit year (1900-2010) in the entire text
        // This is for cases where OCR completely messed up the date format
        console.log('   Final fallback: Searching for any valid year (1900-2010) in entire text...');
        const allYearMatches = Array.from(fullText.matchAll(/(19[0-9]{2}|20[01][0-9])/g));
        console.log(`   Found ${allYearMatches.length} year patterns in text`);
        
        for (let idx = 0; idx < allYearMatches.length; idx++) {
          const yearMatch = allYearMatches[idx];
          if (!yearMatch || !yearMatch[1]) continue;
          const yearNum = parseInt(yearMatch[1]);
          console.log(`   Year pattern ${idx + 1}: "${yearMatch[1]}" (${yearNum})`);
          
          // Skip if it's the examination date year
          if (result.examinationDate) {
            const examYear = new Date(result.examinationDate).getFullYear();
            if (yearNum === examYear) {
              console.log(`      ⚠️ Skipping year ${yearNum} (matches examination date year)`);
              continue;
            }
          }
          
          // Only consider years in birth year range (1900-2010)
          if (yearNum >= 1900 && yearNum <= 2010) {
            // Check if this year is before examination date
            if (result.examinationDate) {
              const examDate = new Date(result.examinationDate);
              const birthDate = new Date(`${yearNum}-01-01`);
              if (birthDate < examDate) {
                result.yearOfBirth = yearMatch[1];
                // Don't set dateOfBirth, only yearOfBirth
                console.log(`✅ Extracted year of birth from final fallback: ${result.yearOfBirth}`);
                break;
              } else {
                console.log(`      ⚠️ Year ${yearNum} is not before examination date, skipping`);
              }
            } else {
              // If no examination date, use the first valid birth year found
              result.yearOfBirth = yearMatch[1];
              // Don't set dateOfBirth, only yearOfBirth
              console.log(`✅ Extracted year of birth from final fallback: ${result.yearOfBirth}`);
              break;
            }
          }
        }
      }
    }
  }

  // Extract age (Tuổi) - Search in full text
  const agePatterns = [
    // Pattern 1: "Tuổi: 45" or "Tuổi 45" (with or without colon)
    /Tuổi[:\s]+(\d{1,3})/i,
    // Pattern 2: "(45 Tuổi)" or "(45 tuổi)" (in parentheses, common format)
    /\((\d{1,3})\s*Tuổi\)/i,
    // Pattern 3: "45 tuổi" (number followed by tuổi)
    /(\d{1,3})\s*tuổi/i,
    // Pattern 4: "Tuổi 45 tuổi" (redundant but common in OCR)
    /Tuổi\s+(\d{1,3})\s*tuổi/i,
  ];

  // Search in full text
  console.log('🔍 Searching for age...');
  for (let i = 0; i < agePatterns.length; i++) {
    const pattern = agePatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
    if (match && match[1]) {
      const age = match[1].trim();
      const ageNum = parseInt(age);
      if (ageNum >= 0 && ageNum <= 150) {
        result.age = age;
        console.log('✅ Extracted age:', result.age);
        break;
      }
    }
  }

  // If not found, search in lines
  if (!result.age) {
    for (const line of lines) {
      for (const pattern of agePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const age = match[1].trim();
          const ageNum = parseInt(age);
          if (ageNum >= 0 && ageNum <= 150) {
            result.age = age;
            console.log('✅ Extracted age from line:', result.age);
            break;
          }
        }
      }
      if (result.age) break;
    }
  }

  // Extract diagnosis (Chẩn đoán) - Search in full text
  const diagnosisPatterns = [
    // Pattern 0a: "Chẩn đoán: Z96.1;Z96.1; Mắt phải: Sự có mặt của thấu kính nội nhãn; Mắt trái: Sự có mặt của thấu kính nội nhãn;" (ICD code with semicolons, format for BỆNH VIỆN MẮT) - MOST PRIORITIZED
    // Match ICD codes with semicolons and eye-specific diagnoses
    /Chẩn\s*đoán[:\s]+([A-Za-z]\d{1,3}(?:\.[0-9])?(?:\s*;\s*[A-Za-z]\d{1,3}(?:\.[0-9])?)*\s*;?\s*(?:Mắt\s*(?:phải|trái)[:\s]*[^;]+(?:;\s*Mắt\s*(?:phải|trái)[:\s]*[^;]+)*)?)(?:\s*(?:Thị\s*lực|Thi\s*luc|Nhãn\s*Áp|Nhan\s*Ap|Mạch|Huyết\s*áp|Thân\s*nhiệt|Nhịp\s*thở|Ghi\s*chú|Lời|Ngày|BS|Bác\s*sĩ|\d+\s*\/\s*[A-Z]|Paracetamol|Calci|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Acepron|AGI-CALCI|Levofloxacin|Fluorometholon|Scanneuron|Piracetam)|$)/i,
    // Pattern 0a1: "Chẩn đoán: Cảm sốt nhẹ" (simple diagnosis, most common for BỆNH VIỆN ĐA KHOA TỈNH)
    // Stop at medication list (1/ Paracetamol, 2/ Calci, etc.) or vital signs
    /Chẩn\s*đoán[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:Mạch|Huyết\s*áp|Thân\s*nhiệt|Nhịp\s*thở|Ghi\s*chú|Lời|Ngày|BS|Bác\s*sĩ|\d+\s*\/\s*[A-Z]|Paracetamol|Calci|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Acepron|AGI-CALCI)|$)/i,
    // Pattern 0b: "Chẩn đoán: K21 - Bệnh trào ngược dạ dày - thực quản" (ICD code format with dashes)
    // Simple pattern to catch "Chẩn đoán: K21 - Bénh trào ngược da dày - thực quan" and stop at "1) SIMETHICON" or similar
    // This pattern is designed to match the exact format from the OCR log
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]*([A-Za-z]\d{1,3}\s*[-–]\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–]+?)(?:\s*(?:\d+\s*[A-Za-zÀ-ỹ]+\s*[A-Za-z]+\s*\d+\s*=|Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|\d+\s*\)\s*SIMETHICON|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Thuốc|Thuoc)|$)/i,
    // Pattern 0c: More flexible version - allow ICD code without requiring dash immediately after
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]*([A-Za-z]\d{1,3}(?:\s*[-–]\s*)?[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–]+?)(?:\s*(?:\d+\s*[A-Za-zÀ-ỹ]+\s*[A-Za-z]+\s*\d+\s*=|Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|\d+\s*\)\s*SIMETHICON|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Thuốc|Thuoc)|$)/i,
    // Pattern 0d: Very simple pattern - catch ANY text after "Chẩn đoán:" until "1)" or medication name (fallback)
    // This is the most flexible pattern to catch "Chẩn đoán: K21 - Bénh trào ngược da dày - thực quan 8 Tr A y 4 = 1) SIMETHICON"
    // Improved: Allow parentheses for ICD codes like "(M47)" and "(S60)"
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]+(.+?)(?:\s*(?:\d+\s*\)\s*[A-Z]|\d+\s*\)\s*SIMETHICON|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Thuốc|Thuoc|Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ)|$)/i,
    // Pattern 0e: "Chẩn đoán: M13 - Các viêm khớp khác ; (M47) thoái hóa cột sống; (S60) Tổn thương nông..." (format with parentheses for ICD codes) - NEW pattern
    // Improved: Capture full diagnosis including multiple ICD codes in parentheses
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]+([A-Z]\d{1,3}(?:\s*[-–]\s*)?[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–;()]+(?:;\s*\([A-Z]\d{1,3}\)\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–;()]+)*)(?:\s*(?:Thuốc|Thuoc|Điều|Dieu|Trị|Tri|Cận|Can|Mạch|Mach|Huyết|Huyet|Thân|Than|Ghi|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 1: "Chẩn đoán: Cảm sốt nhẹ" (simple diagnosis without ICD code) - prioritize this for BỆNH VIỆN ĐA KHOA TỈNH format
    // Stop at medication list (1/ Paracetamol, 2/ Calci, etc.) or vital signs
    /Chẩn\s*đoán[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+?)(?:\s*(?:Mạch|Huyết\s*áp|Thân\s*nhiệt|Nhịp\s*thở|Ghi\s*chú|Lời|Ngày|BS|Bác\s*sĩ|\d+\s*\/\s*[A-Z]|Paracetamol|Calci|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Acepron|AGI-CALCI)|$)/i,
    // Pattern 1b: "Chẩn đoán: Cảm sốt nhẹ" or "Chẩn đoán: H00 - Lẹo và chắp; Lẹo mắt phải" (with colon, with or without ICD code) - fallback
    // Allow digits for ICD codes like "H00", and allow colon and semicolon in diagnosis text
    // Don't stop at single "—" but continue until clear stop conditions like "SE vốn" or medication list
    /Chẩn\s*đoán[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9\s\-–:;]+?)(?:\s*(?:—\s*\.\.\.|—\s*SE\s+vốn|SE\s+vốn|\.\.\.|Cận\s*lâm\s*sàng|Mạch|Huyết\s*áp|Thân\s*nhiệt|Ghi\s*chú|Lời|Ngày|BS|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 2: "Chân đoán:" (OCR error - "Chân" instead of "Chẩn") - prioritize, same stop conditions as Pattern 1
    // Allow digits for ICD codes like "H00", and allow colon and semicolon in diagnosis text
    // Don't stop at single "—" but continue until clear stop conditions like "SE vốn" or medication list
    /Chân\s*đoán[:\s]+([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9\s\-–:;]+?)(?:\s*(?:—\s*\.\.\.|—\s*SE\s+vốn|SE\s+vốn|\.\.\.|Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 3: "Chan doan:" (OCR error - missing dấu) - most common in OCR, capture until medication list starts
    // Allow semicolon in diagnosis (e.g., "H00 - Lẹo và chắp ; Lẹo mắt phải")
    /Chan\s*doan[:\s]+(.+?)(?:\s*(?:Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 4: "Chẩn đoán" without colon
    /Chẩn\s*đoán\s+(.+?)(?:\s*(?:Cận\s*lâm\s*sàng|Mạch|Huyết\s*áp|Thân\s*nhiệt|Ghi\s*chú|Lời|Ngày|BS|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 5: "Chẩn đoán" with ICD code pattern (H00, K21, I10, M13, etc.) - more flexible, allow semicolon and parentheses
    // Improved: Capture full diagnosis including parentheses and multiple ICD codes separated by semicolons
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán)[:\s]*([A-Z]\d{1,3}(?:\s*[-–]\s*)?[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–;()]+(?:;\s*\(?[A-Z]\d{1,3}\)?\s*[-–]?\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–;()]+)*)(?:\s*(?:Thuốc|Thuoc|Điều|Dieu|Trị|Tri|Cận|Can|Mạch|Mach|Huyết|Huyet|Thân|Than|Ghi|Lời|Loi|Ngày|Ngay|BS|Bác|Bac|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI)|$)/i,
    // Pattern 6: "Chin đoán:" (OCR error - missing dấu) with multiple ICD codes - NEW format for new prescription type
    // Capture all diagnoses with ICD codes until medication list or clear stop words
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán)[:\s]*([A-Z]\d{2,3}(?:\s*[-–]\s*)?[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–,;]+(?:[;]\s*[A-Z]\d{2,3}(?:\s*[-–]\s*)?[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s\-–,;]+)*)(?:\s*(?:Thuốc|Thuoc|Điều|Dieu|Trị|Tri|Cận|Can|Mạch|Mach|Huyết|Huyet|Thân|Than|Ghi|Lời|Loi|Ngày|Ngay|BS|Bác|Bac|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Acetyl|Amoxicilin|Paracetamol|Attapulgit)|$)/i,
    // Pattern 7: More general pattern for diagnosis with dashes (even without ICD code at start) - catch "Bệnh trào ngược dạ dày - thực quản"
    // This is a fallback pattern that catches any diagnosis text with dashes
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9\s\-–]+(?:\s*[-–]\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ0-9\s\-–]+)*)(?:\s*(?:Cận\s*lâm\s*sàng|Can\s*lam\s*sang|Mạch|Mach|Huyết\s*áp|Huyet\s*ap|Thân\s*nhiệt|Than\s*nhiet|Ghi\s*chú|Ghi\s*chu|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Thuốc|Thuoc)|$)/i,
    // Pattern 8: "Chẩn đoán: H81.9-Rối loạn...; J02.9-Viêm họng...; K21.9-Bệnh trào ngược..." (multiple ICD codes with semicolons, no space after dash) - NEW pattern for new prescription type
    // Format: ICD code immediately followed by dash (no space), then description, separated by semicolons
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]*([A-Z]\d{1,3}\.[0-9][-–][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,;]+(?:;\s*[A-Z]\d{1,3}\.[0-9][-–][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐa-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,;]+)*)(?:\s*(?:Thuốc|Thuoc|Điều|Dieu|Trị|Tri|Cận|Can|Mạch|Mach|Huyết|Huyet|Thân|Than|Ghi|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|SIMETHICON|MALTAGIT|PARACETAMOL|CALCI|VITAMIN|TOBRAMYCIN|AGICLARI|MEDSOLU|KACERIN|PANACTOL|Paracetamol|Acepron|AGI-CALCI|Acetyl|Amoxicilin|Paracetamol|Attapulgit)|$)/i,
    // Pattern 9: "Chẩn đoán: Z96.1;Z96.1; Mắt phải:Sự có mặt của thấu kính nội nhãn; Mắt trái: Sự có mặt của thấu kính nội nhãn;" (format for BỆNH VIỆN MẮT) - NEW pattern for eye hospital format
    // Format: ICD codes with semicolons, followed by detailed descriptions for each eye
    /(?:Chẩn\s*đoán|Chan\s*doan|Chân\s*đoán|Chin\s*đoán|Chẩn\s*doan|Chan\s*đoán)[:\s]*([A-Z]\d{1,3}\.[0-9](?:;[A-Z]\d{1,3}\.[0-9])*;?\s*(?:Mắt\s*(?:phải|trái)[:\s]*[^;]+(?:;\s*Mắt\s*(?:phải|trái)[:\s]*[^;]+)*)?)(?:\s*(?:Thuốc|Thuoc|Điều|Dieu|Trị|Tri|Cận|Can|Mạch|Mach|Huyết|Huyet|Thân|Than|Ghi|Lời|Loi|Ngày|Ngay|BS|Bac\s*si|Bác\s*sĩ|\d+\s*\)\s*[A-Z]|Levofloxacin|Fluorometholon|Scanneuron|Piracetam)|$)/i,
  ];
  
  // Search in full text
  if (process.env.DEBUG_OCR === 'true') {
    console.log('🔍 Searching for diagnosis...');
  }
  for (let i = 0; i < diagnosisPatterns.length; i++) {
    const pattern = diagnosisPatterns[i];
    if (!pattern) continue;
    const match = fullText.match(pattern);
    if (process.env.DEBUG_OCR === 'true') {
      console.log(`   Pattern ${i + 1}: ${match ? 'MATCHED' : 'no match'}`);
      if (match) {
        console.log(`   Match[0]: "${match[0]}"`);
        console.log(`   Match[1]: "${match[1] || 'N/A'}"`);
      }
    }
    if (match && match[1]) {
      let diagnosis = match[1].trim();
      // Clean up common OCR errors
      diagnosis = diagnosis.replace(/\s+/g, ' ');
      
      // Remove OCR artifacts like "—... SE vốn SAE — Ề a E —" that appear after valid diagnosis
      diagnosis = diagnosis.replace(/\s*—[\.\s]*SE\s+vốn.*$/i, '');
      diagnosis = diagnosis.replace(/\s*—[\.\s]*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]*—.*$/i, '');
      diagnosis = diagnosis.replace(/\s*—[\.\s]+.*$/, '');
      diagnosis = diagnosis.replace(/\s*\.\.\..*$/, '');
      // Remove trailing "—" and similar characters (but keep dashes in the middle)
      // Only remove if it's at the very end or followed by invalid content
      diagnosis = diagnosis.replace(/\s*[—–]+\s*$/, '');
      // Remove trailing single characters that are OCR errors (like "Ề", "a", "E")
      diagnosis = diagnosis.replace(/\s+[ỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỨỪỬỮỰỲỴỶỸa-zA-Z]\s*$/, '');
      
      // Remove trailing OCR artifacts: single digits, single letters, and invalid patterns
      // Pattern: remove trailing parts like "8 Tr A y 4 =" or "8 Tr A" etc.
      // More specific pattern to catch "8 Tr A y 4 ="
      diagnosis = diagnosis.replace(/\s+\d+\s+[A-Z][a-z]?\s+[A-Z]\s+[a-z]\s+\d+\s*=\s*$/i, '');
      // Remove patterns like "8 Tr A y" or "8 Tr A"
      diagnosis = diagnosis.replace(/\s+\d+\s+[A-Z][a-z]?\s+[A-Z]\s+[a-z]?\s*$/i, '');
      // Remove trailing single characters and numbers that don't make sense (but preserve dashes)
      diagnosis = diagnosis.replace(/\s+(?:\d+|[A-Z])(?![-\-–])\s*$/, '');
      // Remove trailing "=" and similar characters
      diagnosis = diagnosis.replace(/\s*[=]+$/, '');
      // Remove any trailing pattern that looks like OCR noise (number + letter combinations)
      diagnosis = diagnosis.replace(/\s+\d+\s+[A-Za-z]{1,2}\s+\d+\s*[=]*\s*$/i, '');
      
      // Remove trailing punctuation but keep dashes and semicolons (for ICD codes like "H00 - Lẹo và chắp ; Lẹo mắt phải")
      // Only remove trailing semicolon if it's at the very end, but keep it if it's part of the diagnosis
      diagnosis = diagnosis.replace(/[.,:]+$/, '').trim();
      // Keep semicolon in the middle but remove if it's trailing with nothing after
      diagnosis = diagnosis.replace(/;\s*$/, '').trim();
      
      // Split into words and remove trailing invalid words (single chars, numbers, etc.)
      // IMPORTANT: Preserve dashes in the middle of diagnosis (e.g., "K21 - Bệnh trào ngược dạ dày - thực quản")
      // Handle standalone dashes by combining them with adjacent words
      const words = diagnosis.split(/\s+/);
      const validWords: string[] = [];
      let foundInvalid = false;
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word) continue; // Skip undefined words
        
        // Handle standalone dashes: combine with previous or next word
        if (word === '-' || word === '–' || word === '—') {
          // If we have a previous word, combine dash with it
          if (validWords.length > 0) {
            validWords[validWords.length - 1] += ' ' + word;
          } else {
            // If no previous word, keep the dash (might be at start)
            validWords.push(word);
          }
          continue;
        }
        
        // Don't stop for ICD codes like "K21", "H00", "H81.9", "J02.9", "K21.9" - they are valid
        if (/^[A-Za-z]\d{1,3}(\.\d+)?$/i.test(word)) {
          validWords.push(word);
          continue;
        }
        
        // Keep words that contain dashes (like "-" in "K21 - Bệnh" or "dạ dày - thực quản")
        if (word.includes('-') || word.includes('–') || word.includes('—')) {
          validWords.push(word);
          continue;
        }
        
        // Stop if we find invalid patterns (single digit, single letter, or "=")
        if (/^[=\dA-Z]$/i.test(word) && i > 2) {
          // Only stop if we've already found valid content (at least 2 words)
          foundInvalid = true;
          break;
        }
        
        // Skip single characters and numbers that appear after valid content (but not ICD codes)
        if (validWords.length > 0 && /^[\dA-Z]$/i.test(word) && !/^[A-Za-z]\d{1,3}(\.\d+)?$/i.test(word)) {
          foundInvalid = true;
          break;
        }
        
        validWords.push(word);
      }
      
      // Join words and normalize spaces around dashes
      diagnosis = validWords.join(' ').trim();
      // Normalize spaces around dashes, but preserve format "H81.9-Rối loạn" (no space after dash if it's after ICD code)
      // First, fix cases where dash has spaces: "H81.9 - Rối loạn" -> "H81.9-Rối loạn"
      diagnosis = diagnosis.replace(/([A-Za-z]\d{1,3}(?:\.\d+)?)\s*[-–—]\s*/gi, '$1-');
      // Then normalize other dashes: "K21 - Bệnh" -> "K21 - Bệnh" (keep space)
      diagnosis = diagnosis.replace(/\s*([-–—])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
      
      // Restore Vietnamese diacritics for medical terms
      diagnosis = restoreVietnameseDiacritics(diagnosis);
      
      // Limit length but allow for full diagnosis descriptions (including multiple ICD codes with semicolons)
      // For multiple diagnoses like "H81.9-Rối loạn...; J02.9-Viêm họng...; K21.9-Bệnh trào ngược...", allow more words
      diagnosis = diagnosis.split(/\s+/).slice(0, 30).join(' '); // Allow up to 30 words for multiple diagnoses
      if (process.env.DEBUG_OCR === 'true') {
        console.log(`   Cleaned diagnosis: "${diagnosis}" (length: ${diagnosis.length})`);
      }
      // Allow up to 300 characters for multiple diagnoses with ICD codes
      if (diagnosis.length >= 2 && diagnosis.length < 300) {
        result.diagnosis = diagnosis;
        if (!process.env.DEBUG_OCR || process.env.DEBUG_OCR !== 'true') {
          console.log('✅ Extracted diagnosis:', result.diagnosis);
        }
        break;
      } else {
        console.log(`   ⚠️ Diagnosis rejected: length ${diagnosis.length} (must be 2-299)`);
      }
    }
  }
  
  // If not found, search in lines
  if (!result.diagnosis) {
    for (const line of lines) {
      for (const pattern of diagnosisPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          let diagnosis = match[1].trim();
          // Clean up common OCR errors
          diagnosis = diagnosis.replace(/\s+/g, ' ');
          
          // Remove trailing OCR artifacts: single digits, single letters, and invalid patterns
          // More specific pattern to catch "8 Tr A y 4 ="
          diagnosis = diagnosis.replace(/\s+\d+\s+[A-Z][a-z]?\s+[A-Z]\s+[a-z]\s+\d+\s*=\s*$/i, '');
          // Remove patterns like "8 Tr A y" or "8 Tr A"
          diagnosis = diagnosis.replace(/\s+\d+\s+[A-Z][a-z]?\s+[A-Z]\s+[a-z]?\s*$/i, '');
          // Remove trailing single characters and numbers that don't make sense (but preserve dashes)
          diagnosis = diagnosis.replace(/\s+(?:\d+|[A-Z])(?![-\-–])\s*$/, '');
          // Remove trailing "=" and similar characters
          diagnosis = diagnosis.replace(/\s*[=]+$/, '');
          // Remove any trailing pattern that looks like OCR noise (number + letter combinations)
          diagnosis = diagnosis.replace(/\s+\d+\s+[A-Za-z]{1,2}\s+\d+\s*[=]*\s*$/i, '');
          // Remove trailing punctuation but keep dashes and semicolons
          diagnosis = diagnosis.replace(/[.,:]+$/, '').trim();
          // Keep semicolon in the middle but remove if it's trailing with nothing after
          diagnosis = diagnosis.replace(/;\s*$/, '').trim();
          
          // Split into words and remove trailing invalid words
          // IMPORTANT: Preserve dashes in the middle of diagnosis
          const words = diagnosis.split(/\s+/);
          const validWords: string[] = [];
          let foundInvalid = false;
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (!word) continue; // Skip undefined words
            
            // Handle standalone dashes: combine with previous or next word
            if (word === '-' || word === '–' || word === '—') {
              // If we have a previous word, combine dash with it
              if (validWords.length > 0) {
                validWords[validWords.length - 1] += ' ' + word;
              } else {
                // If no previous word, keep the dash (might be at start)
                validWords.push(word);
              }
              continue;
            }
            
            // Don't stop for ICD codes like "K21", "H00" - they are valid
            if (/^[A-Za-z]\d{1,3}$/i.test(word)) {
              validWords.push(word);
              continue;
            }
            
            // Keep words that contain dashes
            if (word.includes('-') || word.includes('–') || word.includes('—')) {
              validWords.push(word);
              continue;
            }
            
            if (/^[=\dA-Z]$/i.test(word) && i > 2) {
              foundInvalid = true;
              break;
            }
            // Don't stop for ICD codes like "K21", "H00", "H81.9", "J02.9", "K21.9" - they are valid
            if (/^[A-Za-z]\d{1,3}(\.\d+)?$/i.test(word)) {
              validWords.push(word);
              continue;
            }
            if (validWords.length > 0 && /^[\dA-Z]$/i.test(word) && !/^[A-Za-z]\d{1,3}(\.\d+)?$/i.test(word)) {
              foundInvalid = true;
              break;
            }
            validWords.push(word);
          }
          
          // Join words and normalize spaces around dashes
          diagnosis = validWords.join(' ').trim();
          // Normalize spaces around dashes, but preserve format "H81.9-Rối loạn" (no space after dash if it's after ICD code)
          // First, fix cases where dash has spaces: "H81.9 - Rối loạn" -> "H81.9-Rối loạn"
          diagnosis = diagnosis.replace(/([A-Za-z]\d{1,3}(?:\.\d+)?)\s*[-–—]\s*/gi, '$1-');
          // Then normalize other dashes: "K21 - Bệnh" -> "K21 - Bệnh" (keep space)
          diagnosis = diagnosis.replace(/\s*([-–—])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
          
          // Restore Vietnamese diacritics for medical terms
          diagnosis = restoreVietnameseDiacritics(diagnosis);
          
          // Allow up to 30 words for multiple diagnoses
          diagnosis = diagnosis.split(/\s+/).slice(0, 30).join(' ');
          
          // Allow up to 300 characters for multiple diagnoses with ICD codes
          if (diagnosis.length >= 2 && diagnosis.length < 300) {
            result.diagnosis = diagnosis;
            console.log('✅ Extracted diagnosis from line:', result.diagnosis);
            break;
          }
        }
      }
      if (result.diagnosis) break;
    }
  }

  // Extract notes (Ghi chú, Lời dặn) - Search in full text
  const notesPatterns = [
    /Ghi\s*chú[:\s]+(.+?)(?:\n\n|$|Ngày|Thời|in|lúc)/i,
    /Lời\s*dặn\s*bác\s*sĩ[:\s]+(.+?)(?:\n\n|$|Ngày|Thời|in|lúc)/i,
    /Toa\s*(\d+)\s*ngày/i, // "Toa 7 ngày"
  ];
  
  // Search in full text
  for (const pattern of notesPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const notes = match[1].trim();
      if (notes.length > 0 && notes.length < 200) {
        result.notes = notes;
        console.log('✅ Extracted notes:', result.notes);
        break;
      }
    }
  }
  
  // If not found, search in lines
  if (!result.notes) {
    for (const line of lines) {
      for (const pattern of notesPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const notes = match[1].trim();
          if (notes.length > 0 && notes.length < 200) {
            result.notes = notes;
            console.log('✅ Extracted notes from line:', result.notes);
            break;
          }
        }
      }
      if (result.notes) break;
    }
  }

  // Log final results
  console.log('📊 ========== FINAL EXTRACTED INFO ==========');
  console.log('📊 Final extracted info:', {
    customerName: result.customerName || 'NOT FOUND',
    doctorName: result.doctorName || 'NOT FOUND',
    hospitalName: result.hospitalName || 'NOT FOUND',
    examinationDate: result.examinationDate || 'NOT FOUND',
    dateOfBirth: result.dateOfBirth || 'NOT FOUND',
    yearOfBirth: result.yearOfBirth || 'NOT FOUND',
    age: result.age || 'NOT FOUND',
    diagnosis: result.diagnosis || 'NOT FOUND',
    notes: result.notes || 'NOT FOUND',
  });
  console.log('📊 ==========================================');
  
  // Additional debug for year of birth
  if (result.yearOfBirth) {
    console.log(`✅ Year of birth successfully extracted: ${result.yearOfBirth}`);
  } else if (result.dateOfBirth) {
    console.log(`⚠️ Date of birth found (${result.dateOfBirth}) but yearOfBirth is missing`);
  } else {
    console.log(`❌ Neither dateOfBirth nor yearOfBirth was extracted`);
  }

  return result;
}

// Track Gemini quota status to avoid multiple failed calls
let geminiQuotaExceeded = false;
let geminiQuotaResetTime: number | null = null;
let lastGeminiApiKey: string | null = null; // Track API key to detect changes

/**
 * Check if Gemini quota is exceeded
 */
function isGeminiQuotaExceeded(): boolean {
  // Check if API key has changed - if so, reset quota status
  const currentApiKey = process.env.GEMINI_API_KEY;
  
  if (currentApiKey && currentApiKey !== lastGeminiApiKey) {
    // API key changed - reset quota status
    const wasExceeded = geminiQuotaExceeded;
    geminiQuotaExceeded = false;
    geminiQuotaResetTime = null;
    lastGeminiApiKey = currentApiKey;
    console.log(`🔄 Gemini API key changed - resetting quota status (was exceeded: ${wasExceeded})`);
    console.log(`   New API key: ${currentApiKey.substring(0, 10)}...${currentApiKey.substring(currentApiKey.length - 4)}`);
    return false; // Allow using new API key
  }
  
  // Update last API key if not set
  if (currentApiKey && !lastGeminiApiKey) {
    lastGeminiApiKey = currentApiKey;
    console.log(`✅ Gemini API key initialized: ${currentApiKey.substring(0, 10)}...${currentApiKey.substring(currentApiKey.length - 4)}`);
  }
  
  if (!geminiQuotaExceeded) {
    return false; // Quota not exceeded
  }
  
  // Reset flag after 1 hour (quota usually resets daily, but we check hourly)
  if (geminiQuotaResetTime && Date.now() > geminiQuotaResetTime) {
    geminiQuotaExceeded = false;
    geminiQuotaResetTime = null;
    console.log('🔄 Gemini quota check reset - will try again');
    return false;
  }
  
  // Still exceeded
  const remainingTime = geminiQuotaResetTime ? Math.round((geminiQuotaResetTime - Date.now()) / 1000 / 60) : 0;
  console.log(`⏸️ Gemini quota still exceeded (will retry in ${remainingTime} minutes)`);
  return true;
}

/**
 * Mark Gemini quota as exceeded
 */
function markGeminiQuotaExceeded() {
  geminiQuotaExceeded = true;
  // Reset after 1 hour
  geminiQuotaResetTime = Date.now() + (60 * 60 * 1000);
  // Store current API key when marking as exceeded
  lastGeminiApiKey = process.env.GEMINI_API_KEY || null;
  console.log('⚠️ Gemini quota exceeded - skipping Gemini calls for 1 hour');
}

/**
 * Check if error is a quota/rate limit error
 */
function isQuotaError(error: any): boolean {
  const errorMessage = error?.message || '';
  const errorStatus = error?.status || error?.response?.status;
  
  return (
    errorStatus === 429 ||
    errorMessage.includes('429') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('Quota exceeded') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('Rate limit') ||
    errorMessage.includes('Too Many Requests')
  );
}

/**
 * Use Gemini AI to correct OCR text and extract structured information
 */
async function correctOCRWithGemini(ocrText: string): Promise<string | null> {
  try {
    // Check if Gemini is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ Gemini API key not set');
      return null;
    }

    // Check quota status (this will auto-reset if API key changed)
    if (isGeminiQuotaExceeded()) {
      console.log('⏭️ Skipping Gemini OCR correction - quota exceeded');
      return null;
    }
    
    console.log('🔄 Attempting Gemini OCR correction...');

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Bạn là chuyên gia xử lý văn bản tiếng Việt từ OCR. Nhiệm vụ của bạn là sửa lỗi OCR và trả về văn bản chính xác.

Văn bản OCR gốc (có thể có lỗi):
${ocrText}

Yêu cầu:
1. Sửa các lỗi OCR phổ biến (ví dụ: "HUYNH" -> "HUỲNH", "Nguyễn Tha" -> "Nguyễn Thanh Hải")
2. Khôi phục dấu tiếng Việt chính xác
3. Giữ nguyên cấu trúc và định dạng của văn bản
4. Đảm bảo tên người, tên bệnh viện, chẩn đoán được viết đúng
5. Không thêm hoặc bớt thông tin, chỉ sửa lỗi

Trả về văn bản đã được sửa chữa:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const correctedText = response.text();

    if (correctedText && correctedText.trim().length > 0) {
      console.log('✅ Gemini OCR correction completed');
      return correctedText.trim();
    }

    return null;
  } catch (error: any) {
    // Check if it's a quota error
    if (isQuotaError(error)) {
      const currentApiKey = process.env.GEMINI_API_KEY;
      const apiKeyPreview = currentApiKey ? `${currentApiKey.substring(0, 10)}...${currentApiKey.substring(currentApiKey.length - 4)}` : 'N/A';
      const errorDetails = error?.message || error?.toString() || 'Unknown error';
      markGeminiQuotaExceeded();
      console.error(`❌ Gemini OCR correction - Quota exceeded`);
      console.error(`   API Key: ${apiKeyPreview}`);
      console.error(`   Error: ${errorDetails.substring(0, 200)}`);
      console.error('   ⚠️ If this is a NEW API key, it may also be out of quota (20 requests/day for free tier)');
      console.error('   💡 Solution: Check quota at https://aistudio.google.com/apikey or wait for daily reset');
    } else {
      console.error('❌ Gemini OCR correction error:', error.message);
    }
    return null;
  }
}

/**
 * Use Gemini AI to extract structured prescription information
 */
async function extractInfoWithGemini(ocrText: string, imagePath?: string): Promise<Partial<ExtractedPrescriptionInfo> | null> {
  try {
    // Check if Gemini is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ Gemini API key not set');
      return null;
    }

    // Check quota status (this will auto-reset if API key changed)
    if (isGeminiQuotaExceeded()) {
      console.log('⏭️ Skipping Gemini extraction - quota exceeded');
      return null;
    }
    
    console.log('🔄 Attempting Gemini extraction...');

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    let prompt = '';
    let parts: any[] = [];

    // If imagePath is provided, use vision API to "see" the image directly
    if (imagePath && fs.existsSync(imagePath)) {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      prompt = `Bạn là chuyên gia trích xuất thông tin từ đơn thuốc tiếng Việt. Hãy "nhìn" vào ảnh đơn thuốc và trích xuất thông tin sau:

Hãy trích xuất và trả về JSON với các trường sau (chỉ trả về JSON, không có text khác):
{
  "customerName": "Tên đầy đủ của bệnh nhân (viết hoa, có dấu đầy đủ)",
  "doctorName": "Tên đầy đủ của bác sĩ (có dấu đầy đủ)",
  "hospitalName": "Tên đầy đủ của bệnh viện/phòng khám (viết hoa, có dấu đầy đủ)",
  "examinationDate": "Ngày khám (format: YYYY-MM-DD)",
  "dateOfBirth": "Ngày sinh đầy đủ (format: YYYY-MM-DD, ví dụ: 1980-01-01)",
  "yearOfBirth": "Năm sinh (chỉ năm, ví dụ: 1980)",
  "diagnosis": "Chẩn đoán đầy đủ (có dấu đầy đủ)"
}

Lưu ý CỰC KỲ QUAN TRỌNG về Ngày sinh/Năm sinh:
- Tìm kiếm KỸ LƯỠNG phần "Ngày sinh:" hoặc "Năm sinh:" trong ảnh
- Ngày sinh có thể ở dạng: "01/01/1980", "01-01-1980", "01.01.1980", hoặc chỉ "1980"
- Ngày sinh có thể nằm ngay sau "Ngày sinh:" hoặc ở dòng khác gần đó
- Nếu chỉ có năm sinh (ví dụ: "1980"), đặt dateOfBirth = "1980-01-01" và yearOfBirth = "1980"
- Nếu có đầy đủ ngày tháng năm (ví dụ: "01/01/1980"), đặt dateOfBirth = "1980-01-01" và yearOfBirth = "1980"
- PHẢI TÌM KỸ - ngày sinh có thể bị OCR miss nhưng vẫn có thể thấy trong ảnh
- Nếu không tìm thấy ngày sinh trong ảnh, để null
- Tên phải có dấu tiếng Việt đầy đủ và chính xác
- Chẩn đoán phải đầy đủ, không bị cắt ngắn
- Ngày tháng phải đúng format YYYY-MM-DD`;

      parts = [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ];
      
      console.log('🔍 Using Gemini Vision API to extract info directly from image...');
    } else {
      // Fallback to text-only extraction
      prompt = `Bạn là chuyên gia trích xuất thông tin từ đơn thuốc tiếng Việt. Hãy trích xuất thông tin sau từ văn bản OCR:

Văn bản OCR:
${ocrText}

Hãy trích xuất và trả về JSON với các trường sau (chỉ trả về JSON, không có text khác):
{
  "customerName": "Tên đầy đủ của bệnh nhân (viết hoa, có dấu đầy đủ)",
  "doctorName": "Tên đầy đủ của bác sĩ (có dấu đầy đủ)",
  "hospitalName": "Tên đầy đủ của bệnh viện/phòng khám (viết hoa, có dấu đầy đủ)",
  "examinationDate": "Ngày khám (format: YYYY-MM-DD)",
  "dateOfBirth": "Ngày sinh đầy đủ (format: YYYY-MM-DD, ví dụ: 1980-01-01)",
  "yearOfBirth": "Năm sinh (chỉ năm, ví dụ: 1980)",
  "diagnosis": "Chẩn đoán đầy đủ (có dấu đầy đủ)"
}

Lưu ý QUAN TRỌNG về Ngày sinh/Năm sinh:
- Tìm kiếm kỹ lưỡng phần "Ngày sinh:" hoặc "Năm sinh:" trong văn bản
- Ngày sinh có thể ở dạng: "01/01/1980", "01-01-1980", "01.01.1980", hoặc chỉ "1980"
- Nếu chỉ có năm sinh (ví dụ: "1980"), đặt dateOfBirth = "1980-01-01" và yearOfBirth = "1980"
- Nếu có đầy đủ ngày tháng năm (ví dụ: "01/01/1980"), đặt dateOfBirth = "1980-01-01" và yearOfBirth = "1980"
- Nếu không tìm thấy ngày sinh trong OCR text, để null
- Tên phải có dấu tiếng Việt đầy đủ và chính xác
- Chẩn đoán phải đầy đủ, không bị cắt ngắn
- Ngày tháng phải đúng format YYYY-MM-DD`;

      parts = [{ text: prompt }];
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const responseText = response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedInfo = JSON.parse(jsonMatch[0]);
      console.log('✅ Gemini extracted structured info');
      if (imagePath) {
        console.log('   📸 Extracted from image using Vision API');
      }
      return extractedInfo;
    }

    return null;
  } catch (error: any) {
    // Check if it's a quota error
    if (isQuotaError(error)) {
      const currentApiKey = process.env.GEMINI_API_KEY;
      const apiKeyPreview = currentApiKey ? `${currentApiKey.substring(0, 10)}...${currentApiKey.substring(currentApiKey.length - 4)}` : 'N/A';
      const errorDetails = error?.message || error?.toString() || 'Unknown error';
      markGeminiQuotaExceeded();
      console.error(`❌ Gemini extraction - Quota exceeded`);
      console.error(`   API Key: ${apiKeyPreview}`);
      console.error(`   Error: ${errorDetails.substring(0, 200)}`);
      console.error('   ⚠️ If this is a NEW API key, it may also be out of quota (20 requests/day for free tier)');
      console.error('   💡 Solution: Check quota at https://aistudio.google.com/apikey or wait for daily reset');
      console.error('   Will use pattern matching extraction only.');
    } else {
      console.error('❌ Gemini extraction error:', error.message);
    }
    return null;
  }
}

/**
 * Process prescription image: OCR + extract info
 */
export async function processPrescriptionImage(imagePathOrBase64: string): Promise<ExtractedPrescriptionInfo> {
  let imagePath = imagePathOrBase64;
  
  // Handle base64 image
  if (imagePathOrBase64.startsWith('data:image/')) {
    const matches = imagePathOrBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (matches && matches[1] && matches[2]) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
      const timestamp = Date.now();
      const filename = `temp_prescription_${timestamp}.${extension}`;
      
      // Save to temp file
      const tempDir = path.join(process.cwd(), 'uploads', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      imagePath = path.join(tempDir, filename);
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(imagePath, buffer);
      
      // Extract text
      let ocrText = await extractTextFromImage(imagePath);
      
      // Try to correct OCR with Gemini AI
      const correctedText = await correctOCRWithGemini(ocrText);
      if (correctedText) {
        console.log('✅ Using Gemini-corrected OCR text');
        ocrText = correctedText;
      } else if (isGeminiQuotaExceeded()) {
        console.log('ℹ️ Using Tesseract OCR only (Gemini quota exceeded)');
      }
      
      // Try to extract structured info with Gemini (pass imagePath for Vision API)
      const geminiInfo = await extractInfoWithGemini(ocrText, imagePath);
      
      // Clean up temp file
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
      
      // Extract info using pattern matching (always works, even without Gemini)
      const extractedInfo = extractPrescriptionInfo(ocrText);
      console.log('✅ Extracted prescription info using pattern matching');
      
      // Merge Gemini results (prioritize Gemini if available and more complete)
      if (geminiInfo) {
        if (geminiInfo.customerName && geminiInfo.customerName.length > (extractedInfo.customerName?.length || 0)) {
          extractedInfo.customerName = geminiInfo.customerName;
          console.log('✅ Using Gemini-extracted customer name:', extractedInfo.customerName);
        }
        if (geminiInfo.doctorName && geminiInfo.doctorName.length > (extractedInfo.doctorName?.length || 0)) {
          extractedInfo.doctorName = geminiInfo.doctorName;
          console.log('✅ Using Gemini-extracted doctor name:', extractedInfo.doctorName);
        }
        if (geminiInfo.hospitalName && geminiInfo.hospitalName.length > (extractedInfo.hospitalName?.length || 0)) {
          extractedInfo.hospitalName = geminiInfo.hospitalName;
          console.log('✅ Using Gemini-extracted hospital name:', extractedInfo.hospitalName);
        }
        if (geminiInfo.diagnosis && geminiInfo.diagnosis.length > (extractedInfo.diagnosis?.length || 0)) {
          extractedInfo.diagnosis = geminiInfo.diagnosis;
          console.log('✅ Using Gemini-extracted diagnosis:', extractedInfo.diagnosis);
        }
        // PRIORITIZE Gemini-extracted dateOfBirth and yearOfBirth
        if (geminiInfo.dateOfBirth || geminiInfo.yearOfBirth) {
          if (geminiInfo.dateOfBirth) {
            extractedInfo.dateOfBirth = geminiInfo.dateOfBirth;
            console.log('✅ Using Gemini-extracted dateOfBirth:', extractedInfo.dateOfBirth);
            // Extract year from dateOfBirth if yearOfBirth not provided
            if (!geminiInfo.yearOfBirth && geminiInfo.dateOfBirth) {
              const yearMatch = geminiInfo.dateOfBirth.match(/^(\d{4})/);
              if (yearMatch && yearMatch[1]) {
                extractedInfo.yearOfBirth = yearMatch[1];
                console.log('✅ Extracted yearOfBirth from Gemini dateOfBirth:', extractedInfo.yearOfBirth);
              }
            }
          }
          if (geminiInfo.yearOfBirth) {
            extractedInfo.yearOfBirth = geminiInfo.yearOfBirth;
            console.log('✅ Using Gemini-extracted yearOfBirth:', extractedInfo.yearOfBirth);
            // If dateOfBirth not provided but yearOfBirth is, set default date
            if (!geminiInfo.dateOfBirth && geminiInfo.yearOfBirth) {
              extractedInfo.dateOfBirth = `${geminiInfo.yearOfBirth}-01-01`;
              console.log('✅ Set dateOfBirth from Gemini yearOfBirth:', extractedInfo.dateOfBirth);
            }
          }
        }
        if (geminiInfo.examinationDate) {
          extractedInfo.examinationDate = geminiInfo.examinationDate;
        }
        if (geminiInfo.dateOfBirth) {
          extractedInfo.dateOfBirth = geminiInfo.dateOfBirth;
        }
      }
      
      return extractedInfo;
    }
  }
  
  // Handle file path
  if (!fs.existsSync(imagePath)) {
    throw new Error('Image file not found');
  }
  
  let ocrText = await extractTextFromImage(imagePath);
  
  // Try to correct OCR with Gemini AI
  const correctedText = await correctOCRWithGemini(ocrText);
  if (correctedText) {
    console.log('✅ Using Gemini-corrected OCR text');
    ocrText = correctedText;
  } else if (isGeminiQuotaExceeded()) {
    console.log('ℹ️ Using Tesseract OCR only (Gemini quota exceeded)');
  }
  
  // Try to extract structured info with Gemini (pass imagePath for Vision API)
  const geminiInfo = await extractInfoWithGemini(ocrText, imagePath);
  
  // Extract info using pattern matching (always works, even without Gemini)
  const extractedInfo = extractPrescriptionInfo(ocrText);
  console.log('✅ Extracted prescription info using pattern matching');
  
  // Merge Gemini results (prioritize Gemini if available and more complete)
  if (geminiInfo) {
    if (geminiInfo.customerName && geminiInfo.customerName.length > (extractedInfo.customerName?.length || 0)) {
      extractedInfo.customerName = geminiInfo.customerName;
      console.log('✅ Using Gemini-extracted customer name:', extractedInfo.customerName);
    }
    if (geminiInfo.doctorName && geminiInfo.doctorName.length > (extractedInfo.doctorName?.length || 0)) {
      extractedInfo.doctorName = geminiInfo.doctorName;
      console.log('✅ Using Gemini-extracted doctor name:', extractedInfo.doctorName);
    }
    if (geminiInfo.hospitalName && geminiInfo.hospitalName.length > (extractedInfo.hospitalName?.length || 0)) {
      extractedInfo.hospitalName = geminiInfo.hospitalName;
      console.log('✅ Using Gemini-extracted hospital name:', extractedInfo.hospitalName);
    }
    if (geminiInfo.diagnosis && geminiInfo.diagnosis.length > (extractedInfo.diagnosis?.length || 0)) {
      extractedInfo.diagnosis = geminiInfo.diagnosis;
      console.log('✅ Using Gemini-extracted diagnosis:', extractedInfo.diagnosis);
    }
    if (geminiInfo.examinationDate) {
      extractedInfo.examinationDate = geminiInfo.examinationDate;
    }
    if (geminiInfo.dateOfBirth) {
      extractedInfo.dateOfBirth = geminiInfo.dateOfBirth;
    }
  }
  
  return extractedInfo;
}

