import { Request, Response } from 'express';
import { Product, Order, OrderItem } from '../models/schema.js';
import mongoose from 'mongoose';
import { extractTextFromImage } from '../services/ocrService.js';
import { findExactMatch, findSimilarMedicines, parseMedicineName } from '../services/medicineMatchingService.js';
import path from 'path';
import fs from 'fs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Symptom to specific medicine mapping (Semantic Search) - Expanded
const symptomToMedicines: { [key: string]: { keywords: string[]; medicineNames: string[] } } = {
  'tiêu chảy': {
    keywords: ['tiêu chảy', 'đi ngoài', 'rối loạn tiêu hóa', 'đau bụng tiêu chảy'],
    medicineNames: ['Loperamide', 'Oresol', 'Smecta', 'Loperamid', 'Diosmectite', 'ORS', 'Diarstop']
  },
  'nổi mề đay': {
    keywords: ['nổi mề đay', 'mề đay', 'ngứa', 'dị ứng da', 'phát ban', 'mẩn đỏ'],
    medicineNames: ['Clorpheniramin', 'Cetirizine', 'Loratadine', 'Chlorpheniramine', 'Cetirizin', 'Loratadin', 'Fexofenadine']
  },
  'ngứa': {
    keywords: ['ngứa', 'dị ứng', 'mẩn ngứa', 'ngứa da', 'ngứa da tại chỗ', 'ngứa do côn trùng đốt', 'ngứa da nhẹ'],
    medicineNames: ['Clorpheniramin', 'Cetirizine', 'Loratadine', 'Chlorpheniramine', 'Fexofenadine']
  },
  'ngứa da tại chỗ': {
    keywords: ['ngứa da tại chỗ', 'ngứa do côn trùng đốt', 'ngứa da nhẹ', 'viêm da dị ứng nhẹ', 'dị ứng mỹ phẩm'],
    medicineNames: ['Thuốc chống ngứa ngoài da', 'Corticoid bôi ngoài da nhẹ']
  },
  'dị ứng da': {
    keywords: ['dị ứng da', 'dị ứng da do thức ăn', 'dị ứng da do côn trùng đốt', 'mẩn đỏ da', 'phát ban dị ứng'],
    medicineNames: ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Clorpheniramin', 'Thuốc chống ngứa ngoài da']
  },
  'dị ứng đường hô hấp': {
    keywords: ['hắt hơi nhiều', 'sổ mũi trong', 'nghẹt mũi', 'ngứa mũi', 'viêm mũi dị ứng theo mùa'],
    medicineNames: ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Rhinocort']
  },
  'cảm cúm': {
    keywords: ['cảm cúm', 'cảm', 'cúm', 'sốt', 'đau đầu', 'nhức đầu'],
    medicineNames: [
      'Paracetamol', 'Decolgen', 'Tiffy', 'Panadol', 'Efferalgan', 'Hapacol',
      'Terpin Codein', 'Terpin-codein', 'Coldacmin',
      'Natri Clorid 0.9%', 'Xịt mũi muối biển', 'Otrivin', 'Naphazoline', 'Rhinocort',
      'Acetylcysteine', 'Bromhexine', 'Dextromethorphan', 'Pseudoephedrine'
    ]
  },
  'cảm': {
    keywords: ['cảm', 'cảm lạnh', 'cảm thông thường'],
    medicineNames: [
      'Paracetamol', 'Decolgen', 'Tiffy', 'Panadol', 'Efferalgan', 'Hapacol',
      'Terpin Codein', 'Terpin-codein', 'Coldacmin', 'Loratadine', 'Cetirizine',
      'Natri Clorid 0.9%', 'Xịt mũi muối biển', 'Otrivin', 'Naphazoline', 'Rhinocort',
      'Acetylcysteine', 'Bromhexine', 'Dextromethorphan', 'Pseudoephedrine'
    ]
  },
  'sốt': {
    keywords: ['sốt', 'nóng sốt', 'sốt cao'],
    medicineNames: ['Paracetamol', 'Panadol', 'Efferalgan', 'Ibuprofen', 'Hapacol']
  },
  'nhức đầu': {
    keywords: ['nhức đầu', 'đau đầu', 'đau đầu không sốt'],
    medicineNames: ['Paracetamol', 'Panadol', 'Efferalgan', 'Ibuprofen']
  },
  'ho': {
    keywords: ['ho', 'ho khan', 'ho có đờm', 'ho nhẹ'],
    medicineNames: ['Terpin Codein', 'Bromhexin', 'Acetylcysteine', 'Ambroxol', 'Prospan', 'Eugica']
  },
  'ho có đờm': {
    keywords: ['ho có đờm', 'ho đờm', 'long đờm'],
    medicineNames: ['Bromhexin', 'Acetylcysteine', 'Ambroxol', 'Prospan', 'Mucosolvan']
  },
  'đau họng': {
    keywords: ['đau họng', 'viêm họng'],
    medicineNames: ['Strepsils', 'Betadine', 'Lysopaine', 'Prospan', 'Dorithricin']
  },
  'nghẹt mũi': {
    keywords: ['nghẹt mũi', 'tắc mũi'],
    medicineNames: ['Natri Clorid 0.9%', 'Xịt mũi muối biển', 'Otrivin', 'Naphazoline', 'Rhinocort']
  },
  'sổ mũi': {
    keywords: ['sổ mũi', 'chảy nước mũi'],
    medicineNames: ['Natri Clorid 0.9%', 'Xịt mũi muối biển', 'Otrivin']
  },
  'dạ dày': {
    keywords: ['dạ dày', 'đau dạ dày', 'viêm dạ dày', 'đau bao tử'],
    medicineNames: ['Omeprazole', 'Esomeprazole', 'Pantoprazole', 'Gaviscon', 'Gastropulgite']
  },
  'đau bụng': {
    keywords: ['đau bụng', 'co thắt dạ dày', 'đầy bụng', 'khó tiêu'],
    medicineNames: ['Buscopan', 'Spasmaverine', 'Duspatalin', 'Domperidone', 'Men tiêu hóa']
  },
  'đầy bụng': {
    keywords: ['đầy bụng', 'khó tiêu', 'men tiêu hóa'],
    medicineNames: ['Domperidone', 'Men tiêu hóa', 'Enzym', 'Pancreatin']
  },
  'khó tiêu': {
    keywords: ['khó tiêu', 'khó tiêu hóa', 'tiêu hóa kém', 'ăn không tiêu', 'đầy bụng', 'chướng bụng', 'đi ngoài phân sống', 'rối loạn tiêu hóa nhẹ'],
    medicineNames: ['Men tiêu hóa', 'Enzym', 'Pancreatin', 'Neopeptine', 'Festal', 'Domperidone', 'Simethicone', 'Air-X', 'Espumisan']
  },
  'ăn không tiêu': {
    keywords: ['ăn không tiêu', 'đầy bụng', 'chướng bụng', 'khó tiêu', 'đi ngoài phân sống', 'rối loạn tiêu hóa nhẹ', 'trẻ em ăn uống kém'],
    medicineNames: ['Men tiêu hóa', 'Enzym', 'Pancreatin', 'Neopeptine', 'Festal']
  },
  'ợ chua': {
    keywords: ['ợ chua', 'ợ nóng', 'nóng rát vùng thượng vị', 'đau dạ dày nhẹ', 'khó tiêu do tăng acid', 'trào ngược nhẹ'],
    medicineNames: ['Gaviscon', 'Gastropulgite', 'Antacid', 'Maalox', 'Tums']
  },
  'đau dạ dày nhiều': {
    keywords: ['đau dạ dày nhiều', 'đau thượng vị kéo dài', 'trào ngược thường xuyên', 'ợ chua kéo dài', 'đau tăng về đêm', 'tiền sử viêm loét dạ dày'],
    medicineNames: ['Omeprazole', 'Esomeprazole', 'Pantoprazole', 'Ranitidine', 'Famotidine', 'Lansoprazole']
  },
  'tiêu hóa': {
    keywords: ['tiêu hóa', 'rối loạn tiêu hóa', 'vấn đề tiêu hóa', 'bệnh tiêu hóa'],
    medicineNames: ['Men tiêu hóa', 'Enzym', 'Pancreatin', 'Neopeptine', 'Festal', 'Loperamide', 'Smecta', 'Gaviscon', 'Gastropulgite', 'Omeprazole', 'Esomeprazole', 'Pantoprazole', 'Duphalac', 'Forlax']
  },
  'táo bón': {
    keywords: ['táo bón', 'khó đi ngoài'],
    medicineNames: ['Duphalac', 'Forlax', 'Microlax']
  },
  'dị ứng': {
    keywords: ['dị ứng', 'mẩn đỏ', 'dị ứng nhẹ'],
    medicineNames: ['Clorpheniramin', 'Cetirizine', 'Loratadine', 'Fexofenadine']
  },
  'say nắng': {
    keywords: ['say nắng', 'say nóng'],
    medicineNames: ['Oresol', 'Natri Clorid 0.9%', 'Vitamin C', 'Paracetamol']
  },
  'thiếu canxi': {
    keywords: ['thiếu canxi', 'tụt canxi', 'mỏi chân', 'chuột rút'],
    medicineNames: ['Canxi', 'Calcium', 'Canxi D3', 'Osteocare']
  },
  'viêm mũi dị ứng': {
    keywords: ['viêm mũi dị ứng', 'dị ứng mũi'],
    medicineNames: ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Rhinocort']
  },
  'đau nhức toàn thân': {
    keywords: ['đau nhức toàn thân', 'đau cơ', 'đau mỏi'],
    medicineNames: ['Ibuprofen', 'Diclofenac', 'Paracetamol', 'Meloxicam']
  },
  'thiếu máu': {
    keywords: ['thiếu máu', 'bổ sung sắt'],
    medicineNames: ['Sắt', 'Iron', 'Ferrovit', 'Tardyferon']
  },
  'viêm': {
    keywords: ['viêm', 'sưng viêm', 'kháng viêm'],
    medicineNames: ['Ibuprofen', 'Diclofenac', 'Meloxicam', 'Celecoxib']
  }
};

// Medicine recommendation mapping (based on purchase history)
const medicineRecommendations: { [key: string]: string[] } = {
  'Paracetamol': ['Natri Clorid 0.9%', 'Vitamin C', 'Xịt mũi muối biển', 'Oresol', 'Decolgen'],
  'Decolgen': ['Natri Clorid 0.9%', 'Vitamin C', 'Xịt mũi muối biển', 'Oresol', 'Paracetamol'],
  'Panadol': ['Natri Clorid 0.9%', 'Vitamin C', 'Xịt mũi muối biển'],
  'Efferalgan': ['Natri Clorid 0.9%', 'Vitamin C', 'Oresol'],
  'Loperamide': ['Oresol', 'Smecta', 'Men vi sinh'],
  'Oresol': ['Smecta', 'Men vi sinh', 'Loperamide'],
  'Smecta': ['Oresol', 'Men vi sinh', 'Loperamide'],
  'Clorpheniramin': ['Cetirizine', 'Loratadine', 'Kem bôi dị ứng'],
  'Cetirizine': ['Loratadine', 'Clorpheniramin', 'Kem bôi dị ứng'],
  'Loratadine': ['Cetirizine', 'Clorpheniramin', 'Kem bôi dị ứng'],
  'ho trẻ em': ['Prospan', 'Eugica', 'Xịt mũi muối biển', 'Natri Clorid 0.9%'],
  'vitamin': ['Vitamin C', 'Vitamin D3', 'Kẽm', 'Canxi', 'Multivitamin']
};

// Medicine dosage reference (safe reference only, not prescription)
const medicineDosageReference: { [key: string]: string } = {
  'Paracetamol': 'Liều tham khảo: Người lớn 500-1000mg mỗi 4-6 giờ, tối đa 4g/ngày. Trẻ em: 10-15mg/kg/lần, tối đa 4 lần/ngày. ⚠️ Chỉ là tham khảo, cần tư vấn dược sĩ.',
  'Clorpheniramin': 'Liều tham khảo: Người lớn 4mg x 2-3 lần/ngày. Trẻ em: 0.1mg/kg/ngày chia 2-3 lần. ⚠️ Có thể gây buồn ngủ. Chỉ là tham khảo, cần tư vấn dược sĩ.',
  'Vitamin C': 'Liều tham khảo: Người lớn 500-1000mg/ngày. Trẻ em: 50-100mg/ngày. ⚠️ Chỉ là tham khảo, cần tư vấn dược sĩ.',
  'Ibuprofen': 'Liều tham khảo: Người lớn 200-400mg x 3-4 lần/ngày. Trẻ em: 5-10mg/kg/lần, tối đa 4 lần/ngày. ⚠️ Chỉ là tham khảo, cần tư vấn dược sĩ.',
  'Oresol': 'Pha 1 gói với 200ml nước sôi để nguội, uống từng ngụm nhỏ. Trẻ em: 50-100ml/kg trong 4-6 giờ đầu. ⚠️ Chỉ là tham khảo, cần tư vấn dược sĩ.'
};

// Medicine contraindications and warnings
const medicineWarnings: { [key: string]: { contraindications: string; sideEffects: string; notes: string } } = {
  'Paracetamol': {
    contraindications: 'Người suy gan nặng, quá mẫn với Paracetamol',
    sideEffects: 'Hiếm gặp: phát ban, buồn nôn',
    notes: 'Không vượt quá 4g/ngày, tránh dùng với rượu'
  },
  'Ibuprofen': {
    contraindications: 'Người đau dạ dày, loét dạ dày, suy thận, phụ nữ mang thai 3 tháng cuối',
    sideEffects: 'Có thể gây đau dạ dày, buồn nôn, chóng mặt',
    notes: 'Nên uống sau ăn, không dùng quá 7 ngày'
  },
  'Aspirin': {
    contraindications: 'Người đau dạ dày, loét dạ dày, trẻ em dưới 16 tuổi, phụ nữ mang thai',
    sideEffects: 'Có thể gây đau dạ dày, xuất huyết',
    notes: 'Không dùng cho trẻ em, người đau dạ dày'
  },
  'Cefuroxime': {
    contraindications: 'Quá mẫn với Cephalosporin, phụ nữ mang thai cần thận trọng',
    sideEffects: 'Có thể gây tiêu chảy, buồn nôn, phát ban',
    notes: 'Cần có đơn bác sĩ, không tự ý sử dụng'
  },
  'Domperidone': {
    contraindications: 'Người có bệnh tim, rối loạn nhịp tim',
    sideEffects: 'Hiếm gặp: đau đầu, khô miệng',
    notes: 'Nên uống trước ăn 15-30 phút'
  }
};

// Safety warnings for dangerous queries
const safetyWarnings: { [key: string]: string } = {
  'sốt cao 40': '⚠️ Sốt cao 40°C là tình trạng nghiêm trọng. Bạn cần đi khám bác sĩ ngay lập tức hoặc đến cơ sở y tế gần nhất. Không tự ý điều trị tại nhà.',
  'đổi toa thuốc': '⚠️ Không được tự ý đổi toa thuốc bác sĩ đã kê. Vui lòng liên hệ với bác sĩ điều trị để được tư vấn. Tự ý đổi thuốc có thể gây nguy hiểm.',
  'covid': '⚠️ Nếu nghi ngờ COVID-19, bạn cần làm test nhanh hoặc đến cơ sở y tế để được xét nghiệm và điều trị đúng cách. Không có thuốc đặc trị COVID-19 không cần đơn.',
  'kháng sinh không toa': '⚠️ Kháng sinh là thuốc kê đơn, không được bán không cần đơn bác sĩ. Việc tự ý dùng kháng sinh có thể gây kháng thuốc và nguy hiểm. Vui lòng đến bác sĩ để được kê đơn.',
  'đau ngực tim': '⚠️ Đau ngực nghi là tim là tình trạng khẩn cấp. Bạn cần gọi cấp cứu 115 hoặc đến bệnh viện ngay lập tức. Không tự ý uống thuốc.',
  'đau ngực': '⚠️ Đau ngực có thể là dấu hiệu của bệnh tim. Bạn nên đi khám bác sĩ ngay để được chẩn đoán chính xác.'
};

// Common medicine information (fallback when not in database)
const commonMedicineInfo: { [key: string]: { indication: string; description: string } } = {
  'Paracetamol': {
    indication: 'Hạ sốt, giảm đau nhẹ đến vừa (đau đầu, đau răng, đau cơ, đau khớp, đau do kinh nguyệt)',
    description: 'Paracetamol (Acetaminophen) là thuốc giảm đau, hạ sốt phổ biến. Dùng để điều trị các cơn đau nhẹ đến vừa và hạ sốt.'
  },
  'Ibuprofen': {
    indication: 'Giảm đau, hạ sốt, chống viêm (đau đầu, đau răng, đau cơ, viêm khớp, đau bụng kinh)',
    description: 'Ibuprofen là thuốc kháng viêm không steroid (NSAID), dùng để giảm đau, hạ sốt và chống viêm.'
  },
  'Decolgen': {
    indication: 'Điều trị triệu chứng cảm cúm: hạ sốt, giảm đau, giảm nghẹt mũi, sổ mũi',
    description: 'Decolgen là thuốc kết hợp dùng để điều trị các triệu chứng cảm cúm như sốt, đau đầu, nghẹt mũi, sổ mũi.'
  },
  'Tiffy': {
    indication: 'Giảm nghẹt mũi, sổ mũi, đau đầu do cảm lạnh',
    description: 'Tiffy là thuốc kết hợp dùng để điều trị các triệu chứng cảm lạnh như nghẹt mũi, sổ mũi, đau đầu.'
  },
  'Panadol': {
    indication: 'Giảm đau, hạ sốt, giảm mệt mỏi',
    description: 'Panadol là thuốc giảm đau, hạ sốt phổ biến, dùng để điều trị đau đầu, đau cơ, sốt và mệt mỏi.'
  },
  'Efferalgan': {
    indication: 'Hạ sốt, giảm đau nhẹ đến vừa',
    description: 'Efferalgan là thuốc giảm đau, hạ sốt, dùng để điều trị các cơn đau nhẹ đến vừa và hạ sốt.'
  },
  'Acetylcysteine': {
    indication: 'Giúp tiêu đờm (chỉ dùng nếu có ho đờm)',
    description: 'Acetylcysteine là thuốc long đờm, dùng để điều trị ho có đờm, giúp làm loãng đờm và dễ khạc ra.'
  },
  'Terpin Codein': {
    indication: 'Giảm ho khan, ho do kích thích',
    description: 'Terpin Codein là thuốc giảm ho, dùng để điều trị ho khan, ho do kích thích.'
  },
  'Terpin-codein': {
    indication: 'Giảm ho khan, ho do kích thích',
    description: 'Terpin Codein là thuốc giảm ho, dùng để điều trị ho khan, ho do kích thích.'
  },
  'Coldacmin': {
    indication: 'Điều trị triệu chứng cảm cúm: hạ sốt, giảm đau, giảm nghẹt mũi',
    description: 'Coldacmin là thuốc kết hợp dùng để điều trị các triệu chứng cảm cúm.'
  },
  'Clorpheniramin': {
    indication: 'Điều trị các triệu chứng dị ứng: mề đay, ngứa, viêm mũi dị ứng, phát ban',
    description: 'Clorpheniramin là thuốc kháng histamin, dùng để điều trị các triệu chứng dị ứng như mề đay, ngứa, viêm mũi dị ứng.'
  },
  'Loperamide': {
    indication: 'Điều trị tiêu chảy cấp và mạn tính không do nhiễm khuẩn',
    description: 'Loperamide là thuốc chống tiêu chảy, làm giảm nhu động ruột và giảm tần suất đi ngoài.'
  },
  'Domperidone': {
    indication: 'Điều trị các triệu chứng rối loạn tiêu hóa: buồn nôn, nôn, đầy bụng, khó tiêu',
    description: 'Domperidone là thuốc chống nôn, kích thích nhu động dạ dày, dùng để điều trị buồn nôn, nôn và các rối loạn tiêu hóa.'
  },
  'Oresol': {
    indication: 'Bù nước và điện giải trong trường hợp mất nước do tiêu chảy, nôn, sốt',
    description: 'Oresol (ORS) là dung dịch bù nước và điện giải, dùng để bù nước khi bị mất nước do tiêu chảy, nôn hoặc sốt.'
  },
  'Metronidazole': {
    indication: 'Điều trị nhiễm khuẩn kỵ khí, nhiễm ký sinh trùng (amip, giardia), viêm âm đạo do vi khuẩn',
    description: 'Metronidazole là kháng sinh, dùng để điều trị các nhiễm khuẩn kỵ khí và nhiễm ký sinh trùng.'
  },
  'Augmentin': {
    indication: 'Điều trị nhiễm khuẩn đường hô hấp, đường tiết niệu, da và mô mềm do vi khuẩn nhạy cảm',
    description: 'Augmentin là kháng sinh phổ rộng, kết hợp Amoxicillin và Clavulanic acid, dùng để điều trị các nhiễm khuẩn do vi khuẩn.'
  },
  'Azithromycin': {
    indication: 'Điều trị nhiễm khuẩn đường hô hấp, đường sinh dục, da và mô mềm do vi khuẩn nhạy cảm',
    description: 'Azithromycin là kháng sinh nhóm macrolide, dùng để điều trị các nhiễm khuẩn đường hô hấp và các nhiễm khuẩn khác.'
  }
};

// Get detailed medicine information - prioritize generic information
async function getMedicineDetails(productName: string, isUsageQuery: boolean = false): Promise<any> {
  try {
    const db = mongoose.connection.db;
    if (!db) return null;
    
    // Clean product name - remove dosage info for better matching
    const cleanName = productName.replace(/\d+\s*(mg|g|ml|%|viên|hộp)/gi, '').trim();
    const baseName = cleanName.split(' ')[0]; // Get base name (e.g., "Paracetamol" from "Paracetamol 500mg")
    
    // For usage queries, prioritize medicines collection (generic info)
    if (isUsageQuery) {
      const medicinesCollection = db.collection('medicines');
      
      // Try exact match first
      let medicine = await medicinesCollection.findOne({
        $or: [
          { name: { $regex: `^${baseName}`, $options: 'i' } },
          { genericName: { $regex: `^${baseName}`, $options: 'i' } },
          { brand: { $regex: `^${baseName}`, $options: 'i' } }
        ]
      });
      
      // If not found, try partial match
      if (!medicine) {
        medicine = await medicinesCollection.findOne({
          $or: [
            { name: { $regex: baseName, $options: 'i' } },
            { genericName: { $regex: baseName, $options: 'i' } },
            { brand: { $regex: baseName, $options: 'i' } }
          ]
        });
      }
      
      if (medicine) {
        return {
          name: medicine.name || baseName,
          description: medicine.description || medicine.indication || commonMedicineInfo[baseName]?.description || '',
          brand: medicine.brand || '',
          price: medicine.price || 0,
          stockQuantity: medicine.stockQuantity || 0,
          unit: medicine.unit || 'đơn vị',
          indication: medicine.indication || commonMedicineInfo[baseName]?.indication || '',
          contraindication: medicine.contraindication || '',
          dosage: medicine.dosage || '',
          interaction: medicine.interaction || '',
          sideEffect: medicine.sideEffect || ''
        };
      }
      
      // Fallback to common medicine info
      if (commonMedicineInfo[baseName]) {
        return {
          name: baseName,
          description: commonMedicineInfo[baseName].description,
          indication: commonMedicineInfo[baseName].indication,
          brand: '',
          price: 0,
          stockQuantity: 0,
          unit: 'đơn vị'
        };
      }
    }
    
    // For non-usage queries or if not found in medicines, search in products
    const productsCollection = db.collection('products');
    let product = await productsCollection.findOne({
      $or: [
        { name: { $regex: `^${baseName}`, $options: 'i' } },
        { name: { $regex: baseName, $options: 'i' } }
      ]
    });
    
    // If not found, search in medicines collection
    if (!product) {
      const medicinesCollection = db.collection('medicines');
      const medicine = await medicinesCollection.findOne({
        $or: [
          { name: { $regex: baseName, $options: 'i' } },
          { brand: { $regex: baseName, $options: 'i' } },
          { genericName: { $regex: baseName, $options: 'i' } }
        ]
      });
      
      if (medicine) {
        product = {
          _id: medicine._id,
          name: medicine.name || baseName,
          description: medicine.description || medicine.indication || commonMedicineInfo[baseName]?.description || '',
          brand: medicine.brand || '',
          price: medicine.price || 0,
          stockQuantity: medicine.stockQuantity || 0,
          unit: medicine.unit || 'đơn vị',
          indication: medicine.indication || commonMedicineInfo[baseName]?.indication || '',
          contraindication: medicine.contraindication || '',
          dosage: medicine.dosage || '',
          interaction: medicine.interaction || '',
          sideEffect: medicine.sideEffect || ''
        };
      } else if (commonMedicineInfo[baseName]) {
        // Fallback to common info
        product = {
          _id: new mongoose.Types.ObjectId(),
          name: baseName,
          description: commonMedicineInfo[baseName].description,
          indication: commonMedicineInfo[baseName].indication,
          brand: '',
          price: 0,
          stockQuantity: 0,
          unit: 'đơn vị'
        };
      }
    }
    
    return product;
  } catch (error) {
    console.error('Error getting medicine details:', error);
    return null;
  }
}

// Get user's purchase history
async function getUserPurchaseHistory(userId: string): Promise<any[]> {
  try {
    if (!userId) return [];
    
    const userIdObj = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const orders = await Order.find({ 
      userId: userIdObj,
      status: { $in: ['delivered', 'confirmed', 'processing'] }
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    const purchaseHistory: any[] = [];
    
    for (const order of orders) {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productId');
      
      for (const item of items) {
        const product = item.productId as any;
        if (product) {
          purchaseHistory.push({
            productId: product._id,
            productName: product.name,
            brand: product.brand || '',
            categoryId: product.categoryId,
            lastPurchased: order.createdAt,
            quantity: item.quantity
          });
        }
      }
    }
    
    return purchaseHistory;
  } catch (error) {
    console.error('Error getting purchase history:', error);
    return [];
  }
}

// Semantic search - find medicines by meaning, not exact keywords
// QUAN TRỌNG: Chỉ tìm thuốc từ medicineNames mapping để đảm bảo chính xác
// ============================================
// PHÂN LOẠI INTENT CÂU HỎI
// ============================================

/**
 * Phân loại intent của câu hỏi người dùng
 * Trả về: 'medical_consultation' | 'stock_inquiry' | 'price_inquiry' | 'alternative_inquiry' | 'general'
 */
function classifyQuestionIntent(userMessage: string): {
  intent: 'medical_consultation' | 'stock_inquiry' | 'price_inquiry' | 'alternative_inquiry' | 'general';
  extractedProductName?: string;
} {
  const lowerMessage = normalizeText(userMessage);
  
  // Keywords cho câu hỏi về tồn kho
  const stockKeywords = [
    'còn lại', 'còn bao nhiêu', 'còn không', 'còn hàng', 'tồn kho', 
    'số lượng', 'có sẵn', 'còn không', 'còn lại bao nhiêu',
    'còn bao nhiêu chai', 'còn bao nhiêu viên', 'còn bao nhiêu hộp'
  ];
  
  // Keywords cho câu hỏi về giá
  const priceKeywords = [
    'giá', 'giá bao nhiêu', 'giá tiền', 'bao nhiêu tiền', 
    'giá bán', 'chi phí', 'phí', 'cost'
  ];
  
  // Keywords cho câu hỏi về thuốc thay thế
  const alternativeKeywords = [
    'thay thế', 'thay thế cho', 'thay cho', 'tương đương',
    'giống', 'tương tự', 'thay vì', 'thay được không',
    'có thuốc nào thay', 'thuốc nào thay', 'sản phẩm thay thế'
  ];
  
  // Keywords cho tư vấn y tế
  const medicalKeywords = [
    'tư vấn', 'tôi bị', 'bị', 'có thuốc', 'uống thuốc gì',
    'triệu chứng', 'đau', 'sốt', 'ho', 'cảm', 'cúm'
  ];
  
  // Kiểm tra câu hỏi về tồn kho
  const hasStockKeyword = stockKeywords.some(keyword => lowerMessage.includes(keyword));
  if (hasStockKeyword) {
    // Cố gắng extract tên sản phẩm
    const productName = extractProductNameFromMessage(userMessage);
    return { intent: 'stock_inquiry', extractedProductName: productName };
  }
  
  // Kiểm tra câu hỏi về giá
  const hasPriceKeyword = priceKeywords.some(keyword => lowerMessage.includes(keyword));
  if (hasPriceKeyword) {
    const productName = extractProductNameFromMessage(userMessage);
    return { intent: 'price_inquiry', extractedProductName: productName };
  }
  
  // Kiểm tra câu hỏi về thuốc thay thế
  const hasAlternativeKeyword = alternativeKeywords.some(keyword => lowerMessage.includes(keyword));
  if (hasAlternativeKeyword) {
    const productName = extractProductNameFromMessage(userMessage);
    return { intent: 'alternative_inquiry', extractedProductName: productName };
  }
  
  // Kiểm tra tư vấn y tế
  const hasMedicalKeyword = medicalKeywords.some(keyword => lowerMessage.includes(keyword));
  if (hasMedicalKeyword) {
    return { intent: 'medical_consultation' };
  }
  
  // Mặc định là general
  return { intent: 'general' };
}

/**
 * Extract tên sản phẩm từ câu hỏi
 * Cải thiện để xử lý các trường hợp như "ok biết rồi, muốn biết Siro Ích Nhi"
 */
function extractProductNameFromMessage(message: string): string | undefined {
  // Danh sách các từ/cụm từ cần loại bỏ (mở rộng)
  const removePatterns = [
    // Từ chào hỏi, xác nhận
    /^(ok|okay|được|biết rồi|hiểu rồi|tôi biết|tôi hiểu)[\s,]*/i,
    /(ok|okay|được|biết rồi|hiểu rồi)[\s,]*/gi,
    
    // Từ hỏi
    /cho tôi hỏi|hỏi|về|vậy|ạ|nhé|giúp|bạn|tôi|mình|thuốc/gi,
    
    // Từ về số lượng, giá
    /còn lại|còn bao nhiêu|còn không|còn hàng|tồn kho|số lượng|giá|giá bao nhiêu|bao nhiêu/gi,
    
    // Từ về thay thế
    /thay thế|thay cho|tương đương/gi,
    
    // Từ muốn, cần
    /muốn biết|muốn hỏi|muốn|tôi muốn|cần biết|cần hỏi/gi,
  ];
  
  let cleaned = message;
  
  // Loại bỏ các pattern
  for (const pattern of removePatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  
  // Loại bỏ nhiều khoảng trắng
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Loại bỏ các ký tự đặc biệt ở đầu/cuối
  cleaned = cleaned.replace(/^[?.,!\-:;,\s]+|[?.,!\-:;,\s]+$/g, '').trim();
  
  // Nếu còn lại ít hơn 100 ký tự và có ít nhất 2 ký tự, có thể là tên sản phẩm
  if (cleaned.length >= 2 && cleaned.length < 100) {
    // Kiểm tra xem có phải là tên sản phẩm hợp lệ không (có chữ cái)
    if (/[a-zA-ZÀ-ỹ]/.test(cleaned)) {
      return cleaned;
    }
  }
  
  // Nếu không extract được, thử các pattern khác
  const patterns = [
    // Pattern: "muốn biết [Tên sản phẩm]"
    /(?:muốn biết|muốn hỏi|muốn|tôi muốn|cần biết|cần hỏi)[\s,]+([A-ZÀ-ỹ][^?.,!]+?)(?:\s+còn|\s+giá|\s+thay|$)/i,
    
    // Pattern: "tên sản phẩm [Tên]"
    /(?:thuốc|sản phẩm)[\s,]+([A-ZÀ-ỹ][^?.,!]+?)(?:\s+còn|\s+giá|\s+thay|$)/i,
    
    // Pattern: tìm cụm từ có chữ cái viết hoa ở đầu (tên sản phẩm thường viết hoa chữ cái đầu)
    /([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][A-Za-zÀ-ỹ\s]{2,50})/,
    
    // Pattern: tìm sau từ "biết" hoặc "hỏi"
    /(?:biết|hỏi)[\s,]+([A-ZÀ-ỹ][^?.,!]+?)(?:\s+còn|\s+giá|\s+thay|$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let extracted = match[1].trim();
      // Loại bỏ các từ không cần thiết ở cuối
      extracted = extracted.replace(/\s+(còn|giá|thay|vậy|ạ|nhé|gì|nào)$/i, '').trim();
      
      if (extracted.length >= 2 && extracted.length < 100 && /[a-zA-ZÀ-ỹ]/.test(extracted)) {
        return extracted;
      }
    }
  }
  
  // Thử tìm cụm từ có vẻ là tên sản phẩm (có chữ cái viết hoa)
  const words = message.split(/\s+/);
  const productNameWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Nếu từ bắt đầu bằng chữ cái viết hoa và không phải là từ khóa
    if (/^[A-ZÀ-ỹ]/.test(word) && 
        !/^(Tôi|Bạn|Mình|Cho|Hỏi|Về|Vậy|Còn|Bao|Nhiêu|Giá|Thay|Thế)$/i.test(word)) {
      productNameWords.push(word);
      // Tiếp tục lấy các từ sau nếu cũng viết hoa hoặc là từ thường (tên sản phẩm có thể có nhiều từ)
      let j = i + 1;
      while (j < words.length && 
             (/^[A-ZÀ-ỹ]/.test(words[j]) || 
              /^[a-zà-ỹ]/.test(words[j])) &&
             !/^(còn|giá|thay|vậy|ạ|nhé|gì|nào|bao|nhiêu)$/i.test(words[j])) {
        productNameWords.push(words[j]);
        j++;
      }
      break;
    }
  }
  
  if (productNameWords.length >= 2) {
    const extracted = productNameWords.join(' ').trim();
    if (extracted.length >= 2 && extracted.length < 100) {
      return extracted;
    }
  }
  
  return undefined;
}

// ============================================
// QUERY DATABASE CHO CÁC LOẠI CÂU HỎI
// ============================================

/**
 * Query database để lấy thông tin tồn kho của sản phẩm
 * Sử dụng nhiều cách tìm kiếm để tăng độ chính xác
 */
async function queryProductStock(productName: string): Promise<any | null> {
  try {
    const db = mongoose.connection.db;
    if (!db) return null;
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    // Chuẩn hóa tên sản phẩm để tìm kiếm
    const normalizedName = productName.trim();
    const nameWords = normalizedName.split(/\s+/).filter(w => w.length > 1);
    
    // Tạo nhiều pattern tìm kiếm
    const searchPatterns: any[] = [
      // Tìm chính xác
      { name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } },
      // Tìm chứa toàn bộ tên
      { name: { $regex: normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      // Tìm chứa brand
      { brand: { $regex: normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
    ];
    
    // Nếu có nhiều từ, tìm các từ riêng lẻ
    if (nameWords.length > 1) {
      // Tìm sản phẩm chứa tất cả các từ
      searchPatterns.push({
        $and: nameWords.map(word => ({
          $or: [
            { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { brand: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        }))
      });
      
      // Tìm sản phẩm chứa ít nhất 2 từ quan trọng (bỏ qua từ ngắn như "ho", "cho")
      const importantWords = nameWords.filter(w => w.length > 2);
      if (importantWords.length >= 2) {
        searchPatterns.push({
          $and: importantWords.slice(0, 2).map(word => ({
            $or: [
              { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
              { brand: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
            ]
          }))
        });
      }
    }
    
    // Tìm trong products collection
    let product = null;
    for (const pattern of searchPatterns) {
      product = await productsCollection.findOne({
        $or: Array.isArray(pattern.$or) ? pattern.$or : [pattern]
      });
      if (product) break;
    }
    
    // Nếu vẫn không tìm thấy, thử tìm với $and pattern
    if (!product && nameWords.length > 1) {
      product = await productsCollection.findOne({
        $and: nameWords.map(word => ({
          $or: [
            { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { brand: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        }))
      });
    }
    
    if (product) {
      return {
        name: product.name,
        stockQuantity: product.stockQuantity || 0,
        unit: product.unit || 'sản phẩm',
        price: product.price || 0,
        inStock: product.inStock || false,
        source: 'products'
      };
    }
    
    // Nếu không tìm thấy trong products, tìm trong medicines collection
    let medicine = null;
    for (const pattern of searchPatterns) {
      medicine = await medicinesCollection.findOne({
        $or: Array.isArray(pattern.$or) ? pattern.$or : [pattern]
      });
      if (medicine) break;
    }
    
    // Nếu vẫn không tìm thấy, thử tìm với $and pattern
    if (!medicine && nameWords.length > 1) {
      medicine = await medicinesCollection.findOne({
        $and: nameWords.map(word => ({
          $or: [
            { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { brand: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        }))
      });
    }
    
    if (medicine) {
      return {
        name: medicine.name,
        stockQuantity: medicine.stockQuantity || 0,
        unit: medicine.unit || 'sản phẩm',
        price: medicine.price || 0,
        inStock: (medicine.stockQuantity || 0) > 0,
        source: 'medicines'
      };
    }
    
    // Log để debug
    console.log(`[queryProductStock] Không tìm thấy sản phẩm với tên: "${productName}"`);
    
    // Thử tìm kiếm linh hoạt hơn: tìm sản phẩm có chứa tất cả các từ (không cần thứ tự)
    if (nameWords.length >= 2) {
      // Tạo query tìm sản phẩm có chứa tất cả các từ quan trọng
      const allWordsPattern = {
        $and: nameWords.map(word => ({
          $or: [
            { name: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { brand: { $regex: word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        }))
      };
      
      // Tìm trong products
      const flexibleProduct = await productsCollection.findOne(allWordsPattern);
      if (flexibleProduct) {
        console.log(`[queryProductStock] Tìm thấy sản phẩm linh hoạt: "${flexibleProduct.name}"`);
        return {
          name: flexibleProduct.name,
          stockQuantity: flexibleProduct.stockQuantity || 0,
          unit: flexibleProduct.unit || 'sản phẩm',
          price: flexibleProduct.price || 0,
          inStock: flexibleProduct.inStock || false,
          source: 'products'
        };
      }
      
      // Tìm trong medicines
      const flexibleMedicine = await medicinesCollection.findOne(allWordsPattern);
      if (flexibleMedicine) {
        console.log(`[queryProductStock] Tìm thấy thuốc linh hoạt: "${flexibleMedicine.name}"`);
        return {
          name: flexibleMedicine.name,
          stockQuantity: flexibleMedicine.stockQuantity || 0,
          unit: flexibleMedicine.unit || 'sản phẩm',
          price: flexibleMedicine.price || 0,
          inStock: (flexibleMedicine.stockQuantity || 0) > 0,
          source: 'medicines'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error querying product stock:', error);
    return null;
  }
}

/**
 * Query database để lấy thông tin giá của sản phẩm
 * Sử dụng logic tìm kiếm tương tự queryProductStock
 */
async function queryProductPrice(productName: string): Promise<any | null> {
  try {
    // Sử dụng lại logic từ queryProductStock
    const stockInfo = await queryProductStock(productName);
    if (!stockInfo) return null;
    
    const db = mongoose.connection.db;
    if (!db) return null;
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    // Lấy thông tin đầy đủ về giá
    const product = await productsCollection.findOne({ name: stockInfo.name });
    if (product) {
      return {
        name: product.name,
        price: product.price || 0,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage || 0,
        unit: product.unit || 'sản phẩm',
        inStock: product.inStock || false,
        source: 'products'
      };
    }
    
    const medicine = await medicinesCollection.findOne({ name: stockInfo.name });
    if (medicine) {
      return {
        name: medicine.name,
        price: medicine.price || 0,
        unit: medicine.unit || 'sản phẩm',
        inStock: (medicine.stockQuantity || 0) > 0,
        source: 'medicines'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error querying product price:', error);
    return null;
  }
}

/**
 * Query database để tìm thuốc thay thế
 * Tìm các thuốc có cùng hoạt chất, cùng chỉ định, hoặc cùng nhóm điều trị
 */
async function queryAlternativeMedicines(productName: string, limit: number = 5): Promise<any[]> {
  try {
    const db = mongoose.connection.db;
    if (!db) return [];
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    // Tìm sản phẩm gốc
    const originalProduct = await productsCollection.findOne({
      $or: [
        { name: { $regex: productName, $options: 'i' } },
        { brand: { $regex: productName, $options: 'i' } }
      ]
    }) || await medicinesCollection.findOne({
      $or: [
        { name: { $regex: productName, $options: 'i' } },
        { brand: { $regex: productName, $options: 'i' } }
      ]
    });
    
    if (!originalProduct) {
      return [];
    }
    
    // Lấy thông tin để tìm thuốc thay thế
    const originalName = (originalProduct.name || '').toLowerCase();
    const originalIndication = (originalProduct.indication || originalProduct.description || '').toLowerCase();
    const originalCategory = (originalProduct.categoryName || originalProduct.category || '').toLowerCase();
    
    // Tìm các thuốc tương tự:
    // 1. Cùng category/indication
    // 2. Có tên tương tự (nhưng không phải chính nó)
    // 3. Có trong kho
    
    const alternatives: any[] = [];
    
    // Tìm theo indication/description
    if (originalIndication) {
      const indicationKeywords = originalIndication.split(/\s+/).filter((w: string) => w.length > 3);
      if (indicationKeywords.length > 0) {
        const products = await productsCollection.find({
          $and: [
            {
              $or: [
                { indication: { $regex: indicationKeywords.join('|'), $options: 'i' } },
                { description: { $regex: indicationKeywords.join('|'), $options: 'i' } }
              ]
            },
            { name: { $not: { $regex: originalName, $options: 'i' } } },
            { inStock: true },
            { stockQuantity: { $gt: 0 } }
          ]
        })
        .limit(limit)
        .toArray();
        
        alternatives.push(...products);
      }
    }
    
    // Tìm theo category
    if (originalCategory) {
      const medicines = await medicinesCollection.find({
        $and: [
          { categoryName: { $regex: originalCategory, $options: 'i' } },
          { name: { $not: { $regex: originalName, $options: 'i' } } }
        ]
      })
      .limit(limit)
      .toArray();
      
      // Convert medicines to product format
      const convertedMedicines = medicines.map(med => ({
        _id: med._id,
        name: med.name,
        price: med.price || 0,
        description: med.description || med.indication || '',
        brand: med.brand || '',
        inStock: (med.stockQuantity || 0) > 0,
        stockQuantity: med.stockQuantity || 0,
        unit: med.unit || 'đơn vị',
        imageUrl: med.imageUrl || '',
        indication: med.indication || '',
        categoryName: med.categoryName || ''
      }));
      
      alternatives.push(...convertedMedicines);
    }
    
    // Loại bỏ trùng lặp
    const uniqueAlternatives = new Map<string, any>();
    for (const alt of alternatives) {
      const key = (alt.name || '').toLowerCase();
      if (!uniqueAlternatives.has(key) && key !== originalName) {
        uniqueAlternatives.set(key, alt);
      }
    }
    
    return Array.from(uniqueAlternatives.values()).slice(0, limit);
  } catch (error) {
    console.error('Error querying alternative medicines:', error);
    return [];
  }
}

/**
 * Query database để lấy thuốc phù hợp với triệu chứng (chỉ từ DB)
 * Đảm bảo AI chỉ tư vấn thuốc có trong database
 */
async function queryMedicinesBySymptom(symptomText: string): Promise<any[]> {
  try {
    // Sử dụng semanticSearch hiện có nhưng đảm bảo chỉ trả về từ DB
    const results = await semanticSearch(symptomText);
    
    // Đảm bảo tất cả thuốc đều có trong DB (đã được kiểm tra trong semanticSearch)
    return results.filter(med => med && med.name);
  } catch (error) {
    console.error('Error querying medicines by symptom:', error);
    return [];
  }
}

function relevanceScore(query: string, product: any, matchedSymptoms: string[]): number {
  const q = query.toLowerCase();
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const desc = (product.description || product.indication || product.uses || product.congDung || '').toLowerCase();
  const category = (product.categoryName || product.category || product.mainCategory || '').toLowerCase();
  const subcategory = (product.subcategoryName || product.subcategory || '').toLowerCase();

  let score = 0;
  
  // Base score from matched symptoms
  matchedSymptoms.forEach(sym => {
    if (name.includes(sym)) score += 0.4;
    if (desc.includes(sym)) score += 0.3;
    if (category.includes(sym)) score += 0.3;
  });
  
  // Specific symptom scoring
  if (q.includes('ho') && (name.includes('ho') || desc.includes('ho'))) score += 0.3;
  if (q.includes('nghẹt mũi') && (name.includes('nghẹt') || desc.includes('nghẹt'))) score += 0.3;
  if (q.includes('sổ mũi') && (name.includes('mũi') || desc.includes('mũi'))) score += 0.3;
  if (q.includes('sốt') && (name.includes('sốt') || desc.includes('sốt'))) score += 0.2;
  if (q.includes('đau họng') && (name.includes('họng') || desc.includes('họng'))) score += 0.3;
  if (q.includes('cảm')) score += 0.2;
  
  // Digestive symptoms scoring (QUAN TRỌNG - thêm logic cho tiêu hóa)
  if (q.includes('khó tiêu') || q.includes('kho tieu')) {
    const digestiveKeywords = ['khó tiêu', 'kho tieu', 'indigestion', 'dyspepsia', 'antacid', 'kháng acid', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'gaviscon', 'gastropulgite', 'domperidone', 'men tiêu hóa', 'enzyme', 'pancreatin', 'simethicone', 'air-x', 'espumisan'];
    const isDigestive = digestiveKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('tiêu hóa') || category.includes('digestive'));
    if (isDigestive) score += 0.5; // High score for digestive medicines
    // Penalty nếu không phải thuốc tiêu hóa
    if (!category.includes('tiêu hóa') && !category.includes('digestive') && !category.includes('antacid') && !category.includes('kháng acid')) {
      score -= 1.0; // Heavy penalty for non-digestive medicines
    }
  }
  
  // Ợ chua, ợ nóng scoring (Thuốc kháng acid)
  // QUAN TRỌNG: Ưu tiên cao cho thuốc trong subcategory "Thuốc kháng acid"
  if (q.includes('ợ chua') || q.includes('o chua') || q.includes('ợ nóng') || q.includes('o nong') || q.includes('heartburn') || q.includes('acid reflux')) {
    const antacidKeywords = ['ợ chua', 'o chua', 'ợ nóng', 'o nong', 'heartburn', 'acid reflux', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite', 'maalox', 'tums'];
    const isAntacid = antacidKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
    const isAntacidCategory = category.includes('kháng acid') || category.includes('antacid') || category.includes('tiêu hóa') || category.includes('digestive');
    const isAntacidSubcategory = subcategory.includes('kháng acid') || subcategory.includes('antacid');
    
    // QUAN TRỌNG: Bonus cao nhất cho thuốc trong subcategory "Thuốc kháng acid"
    if (isAntacidSubcategory) {
      score += 1.5; // Very high score for antacid subcategory
    } else if (isAntacid || isAntacidCategory) {
      score += 0.6; // High score for antacid medicines
    }
    
    // Penalty nặng nếu không phải thuốc tiêu hóa/kháng acid
    if (!isAntacidCategory && !isAntacidSubcategory && !isAntacid) {
      score -= 2.0; // Very heavy penalty for non-digestive medicines (vitamin, probiotic, etc.)
    }
    
    // Penalty đặc biệt cho thuốc vitamin/khoáng chất khi query về ợ chua/ợ nóng
    if (category.includes('vitamin') || category.includes('khoáng chất') || category.includes('probiotic') || 
        name.includes('vitamin') || name.includes('probiotic') || name.includes('neopeptine')) {
      score -= 3.0; // Extremely heavy penalty - these are NOT antacids
    }
  }
  
  if (q.includes('đầy bụng') || q.includes('day bung')) {
    const bloatingKeywords = ['đầy bụng', 'day bung', 'bloating', 'flatulence', 'simethicone', 'air-x', 'espumisan', 'men tiêu hóa', 'enzyme'];
    const isBloating = bloatingKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('tiêu hóa') || category.includes('digestive'));
    if (isBloating) score += 0.5;
  }
  
  if (q.includes('đau bụng') || q.includes('dau bung')) {
    const stomachKeywords = ['đau bụng', 'dau bung', 'buscopan', 'spasmaverine', 'duspatalin', 'antispasmodic', 'co thắt'];
    const isStomach = stomachKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('tiêu hóa') || category.includes('digestive'));
    if (isStomach) score += 0.5;
  }
  
  if (q.includes('tiêu hóa') || q.includes('tieu hoa')) {
    const digestiveCategoryKeywords = ['tiêu hóa', 'tieu hoa', 'digestive', 'gastrointestinal', 'antacid', 'kháng acid', 'men tiêu hóa', 'enzyme'];
    const isDigestiveCategory = digestiveCategoryKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes(keyword)
    );
    if (isDigestiveCategory) score += 0.4; // Good score for digestive category
    // Penalty nếu không phải thuốc tiêu hóa
    if (!category.includes('tiêu hóa') && !category.includes('digestive') && !category.includes('antacid') && !category.includes('kháng acid')) {
      score -= 1.0; // Heavy penalty for non-digestive medicines
    }
  }
  
  // QUAN TRỌNG: Bonus cho thuốc đúng category, penalty cho thuốc sai category
  // Nếu query về tiêu hóa, chỉ ưu tiên thuốc tiêu hóa
  if (q.includes('tiêu hóa') || q.includes('tieu hoa') || q.includes('ợ chua') || q.includes('o chua') || q.includes('ợ nóng') || q.includes('o nong') || q.includes('khó tiêu') || q.includes('kho tieu') || q.includes('đầy bụng') || q.includes('day bung') || q.includes('táo bón') || q.includes('tao bon') || q.includes('tiêu chảy') || q.includes('tieu chay')) {
    const isDigestiveCategory = category.includes('tiêu hóa') || category.includes('digestive') || category.includes('antacid') || category.includes('kháng acid');
    if (isDigestiveCategory) {
      score += 0.8; // High bonus for correct category
    } else {
      score -= 2.0; // Very heavy penalty for wrong category (vitamin, probiotic, etc.)
    }
  }
  
  // Allergy/antihistamine symptoms scoring (QUAN TRỌNG - thêm logic cho thuốc kháng dị ứng)
  if (q.includes('dị ứng') || q.includes('di ung') || q.includes('kháng dị ứng') || q.includes('khang di ung') || q.includes('antihistamine')) {
    const allergyKeywords = ['dị ứng', 'di ung', 'allergy', 'antihistamine', 'clorpheniramin', 'chlorpheniramine', 'cetirizine', 'loratadine', 'fexofenadine', 'mề đay', 'me day', 'urticaria', 'ngứa', 'ngua', 'itchy', 'phát ban', 'phat ban', 'rash'];
    const isAllergy = allergyKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('dị ứng') || category.includes('allergy') || category.includes('antihistamine')
    );
    if (isAllergy) score += 0.5; // High score for allergy medicines
  }
  
  if (q.includes('ngứa') || q.includes('ngua') || q.includes('itchy')) {
    const itchKeywords = ['ngứa', 'ngua', 'itchy', 'pruritus', 'clorpheniramin', 'chlorpheniramine', 'cetirizine', 'loratadine', 'fexofenadine'];
    const isItch = itchKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('dị ứng') || category.includes('allergy'));
    if (isItch) score += 0.5;
  }
  
  if (q.includes('mề đay') || q.includes('me day') || q.includes('urticaria')) {
    const urticariaKeywords = ['mề đay', 'me day', 'urticaria', 'hives', 'clorpheniramin', 'chlorpheniramine', 'cetirizine', 'loratadine', 'fexofenadine'];
    const isUrticaria = urticariaKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('dị ứng') || category.includes('allergy'));
    if (isUrticaria) score += 0.5;
  }
  
  if (q.includes('phát ban') || q.includes('phat ban') || q.includes('rash')) {
    const rashKeywords = ['phát ban', 'phat ban', 'rash', 'clorpheniramin', 'chlorpheniramine', 'cetirizine', 'loratadine', 'fexofenadine'];
    const isRash = rashKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword) || category.includes('dị ứng') || category.includes('allergy'));
    if (isRash) score += 0.5;
  }
  
  // Anti-inflammatory medicines scoring (Thuốc kháng viêm)
  if (q.includes('kháng viêm') || q.includes('khang viem') || q.includes('anti-inflammatory') || q.includes('chống viêm') || q.includes('chong viem')) {
    const antiInflammatoryKeywords = ['kháng viêm', 'khang viem', 'anti-inflammatory', 'chống viêm', 'chong viem', 'prednisolone', 'dexamethasone', 'methylprednisolone', 'ibuprofen', 'naproxen', 'diclofenac', 'meloxicam', 'celecoxib'];
    const isAntiInflammatory = antiInflammatoryKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('kháng viêm') || category.includes('anti-inflammatory')
    );
    if (isAntiInflammatory) score += 0.5;
  }
  
  // Neurological medicines scoring (Thuốc thần kinh)
  if (q.includes('thần kinh') || q.includes('than kinh') || q.includes('neurological') || q.includes('đau đầu') || q.includes('dau dau') || q.includes('nhức đầu') || q.includes('nhuc dau') || q.includes('migraine')) {
    const neurologicalKeywords = ['thần kinh', 'than kinh', 'neurological', 'betahistine', 'cinnarizine', 'flunarizine', 'piracetam', 'ginkgo', 'đau đầu', 'dau dau', 'nhức đầu', 'nhuc dau', 'migraine', 'vertigo', 'chóng mặt', 'chong mat'];
    const isNeurological = neurologicalKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('thần kinh') || category.includes('neurological')
    );
    if (isNeurological) score += 0.5;
  }
  
  // Musculoskeletal medicines scoring (Thuốc cơ xương khớp)
  if (q.includes('xương khớp') || q.includes('xuong khop') || q.includes('đau khớp') || q.includes('dau khop') || q.includes('viêm khớp') || q.includes('viem khop') || q.includes('arthrit') || q.includes('joint pain')) {
    const musculoskeletalKeywords = ['xương khớp', 'xuong khop', 'musculoskeletal', 'arthrit', 'đau khớp', 'dau khop', 'viêm khớp', 'viem khop', 'etoricoxib', 'celecoxib', 'meloxicam', 'diclofenac', 'ibuprofen', 'naproxen', 'glucosamine', 'chondroitin'];
    const isMusculoskeletal = musculoskeletalKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('xương khớp') || category.includes('musculoskeletal') || category.includes('cơ xương khớp')
    );
    if (isMusculoskeletal) score += 0.5;
  }
  
  // Cardiovascular medicines scoring (Thuốc tim mạch, huyết áp)
  if (q.includes('tim mạch') || q.includes('tim mach') || q.includes('huyết áp') || q.includes('huyet ap') || q.includes('cardiovascular') || q.includes('hypertension') || q.includes('blood pressure') || q.includes('hạ huyết áp') || q.includes('ha huyet ap')) {
    const cardiovascularKeywords = ['tim mạch', 'tim mach', 'cardiovascular', 'huyết áp', 'huyet ap', 'hypertension', 'blood pressure', 'amlodipine', 'atenolol', 'losartan', 'captopril', 'enalapril', 'metoprolol', 'propranolol', 'hạ huyết áp', 'ha huyet ap'];
    const isCardiovascular = cardiovascularKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('tim mạch') || category.includes('cardiovascular') || category.includes('huyết áp') || category.includes('hypertension')
    );
    if (isCardiovascular) score += 0.5;
  }
  
  // Pain relief and fever reduction scoring (Giảm đau, hạ sốt)
  if (q.includes('giảm đau') || q.includes('giam dau') || q.includes('hạ sốt') || q.includes('ha sot') || q.includes('pain relief') || q.includes('fever') || q.includes('đau') || q.includes('dau') || q.includes('sốt') || q.includes('sot')) {
    const painFeverKeywords = ['giảm đau', 'giam dau', 'hạ sốt', 'ha sot', 'pain relief', 'fever', 'paracetamol', 'acetaminophen', 'panadol', 'efferalgan', 'hapacol', 'ibuprofen', 'aspirin'];
    const isPainFever = painFeverKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('giảm đau') || category.includes('hạ sốt') || category.includes('pain') || category.includes('fever')
    );
    if (isPainFever) score += 0.5;
  }
  
  // Antibiotic medicines scoring (Thuốc kháng sinh)
  if (q.includes('kháng sinh') || q.includes('khang sinh') || q.includes('antibiotic') || q.includes('amoxicillin') || q.includes('azithromycin') || q.includes('cephalexin') || q.includes('ciprofloxacin')) {
    const antibioticKeywords = ['kháng sinh', 'khang sinh', 'antibiotic', 'amoxicillin', 'azithromycin', 'cephalexin', 'ciprofloxacin', 'augmentin', 'cefuroxime', 'metronidazole', 'doxycycline', 'clindamycin'];
    const isAntibiotic = antibioticKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('kháng sinh') || category.includes('antibiotic')
    );
    if (isAntibiotic) score += 0.5;
  }
  
  // Pediatric digestive medicines scoring (Thuốc tiêu hóa cho trẻ)
  if ((q.includes('tiêu hóa') || q.includes('tieu hoa') || q.includes('digestive')) && (q.includes('trẻ') || q.includes('tre') || q.includes('trẻ em') || q.includes('tre em') || q.includes('trẻ nhỏ') || q.includes('tre nho') || q.includes('kids') || q.includes('pediatric') || q.includes('infant'))) {
    const pediatricDigestiveKeywords = ['tiêu hóa cho trẻ', 'tieu hoa cho tre', 'pediatric digestive', 'kids digestive', 'smecta kids', 'gastropulgite kids', 'lactulose kids', 'hepasol kid', 'nausy kids', 'infacol', 'gaviscon infant', 'sab simplex'];
    const isPediatricDigestive = pediatricDigestiveKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('tiêu hóa cho trẻ') || category.includes('pediatric digestive')
    );
    if (isPediatricDigestive) score += 0.5;
  }
  
  // Eye/Ear/Nose medicines scoring (Thuốc Mắt/Tai/Mũi)
  if (q.includes('mắt') || q.includes('mat') || q.includes('eye') || q.includes('tai') || q.includes('ear') || q.includes('mũi') || q.includes('mui') || q.includes('nose') || q.includes('nghẹt mũi') || q.includes('nghet mui') || q.includes('sổ mũi') || q.includes('so mui') || q.includes('viêm mũi') || q.includes('viem mui')) {
    const eyeEarNoseKeywords = ['mắt', 'mat', 'eye', 'ophthalmic', 'tai', 'ear', 'otic', 'mũi', 'mui', 'nose', 'nasal', 'nghẹt mũi', 'nghet mui', 'sổ mũi', 'so mui', 'viêm mũi', 'viem mui', 'rhinitis', 'otrivin', 'naphazoline', 'rhinocort', 'xịt mũi', 'xit mui', 'nhỏ mũi', 'nho mui', 'nhỏ mắt', 'nho mat', 'nhỏ tai', 'nho tai'];
    const isEyeEarNose = eyeEarNoseKeywords.some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || category.includes('mắt') || category.includes('tai') || category.includes('mũi') || category.includes('eye') || category.includes('ear') || category.includes('nose')
    );
    if (isEyeEarNose) score += 0.5;
  }
  
  // Bonus score if product is in stock
  if (product.inStock && product.stockQuantity > 0) score += 0.1;
  
  // Penalty for irrelevant products
  if (name.includes('probiotic') || desc.includes('probiotic')) score -= 1;
  
  // QUAN TRỌNG: Bonus cho thuốc đúng category, penalty cho thuốc sai category
  // Nếu query về tiêu hóa, chỉ ưu tiên thuốc tiêu hóa
  if (q.includes('tiêu hóa') || q.includes('tieu hoa') || q.includes('ợ chua') || q.includes('o chua') || q.includes('ợ nóng') || q.includes('o nong') || q.includes('khó tiêu') || q.includes('kho tieu') || q.includes('đầy bụng') || q.includes('day bung') || q.includes('táo bón') || q.includes('tao bon') || q.includes('tiêu chảy') || q.includes('tieu chay')) {
    const isDigestiveCategory = category.includes('tiêu hóa') || category.includes('digestive') || category.includes('antacid') || category.includes('kháng acid');
    const isPediatricDigestiveCategory = category.includes('tiêu hóa cho trẻ') || category.includes('tieu hoa cho tre') || category.includes('pediatric digestive');
    
    // QUAN TRỌNG: Nếu query KHÔNG có "trẻ em", loại bỏ "Thuốc tiêu hóa cho trẻ"
    const queryHasPediatricKeyword = q.includes('trẻ') || q.includes('tre') || q.includes('trẻ em') || q.includes('tre em') || q.includes('trẻ nhỏ') || q.includes('tre nho') || q.includes('kids') || q.includes('pediatric') || q.includes('infant');
    
    if (isPediatricDigestiveCategory && !queryHasPediatricKeyword) {
      score -= 3.0; // Very heavy penalty for pediatric digestive medicines when user is adult
    } else if (isDigestiveCategory && !isPediatricDigestiveCategory) {
      score += 0.8; // High bonus for correct category (adult digestive medicines)
    } else if (!isDigestiveCategory) {
      score -= 2.0; // Very heavy penalty for wrong category (vitamin, probiotic, etc.)
    }
  }
  
  return score;
}

async function semanticSearch(query: string): Promise<any[]> {
  try {
    const lowerQuery = query.toLowerCase();
    const foundMedicines: string[] = [];
    const matchedSymptoms: string[] = [];
    
    // Check symptom mapping for specific medicines
    // QUAN TRỌNG: Match triệu chứng từ cả symptomToMedicines VÀ symptomToCategoryKeywords
    // Điều này đảm bảo hệ thống nhận diện được TẤT CẢ các triệu chứng đã được định nghĩa
    
    // Bước 1: Match từ symptomToMedicines (cho tên thuốc cụ thể)
    for (const [symptom, data] of Object.entries(symptomToMedicines)) {
      const hasKeyword = data.keywords.some(keyword => lowerQuery.includes(keyword));
      const symptomLower = symptom.toLowerCase();
      const matchesSymptom = lowerQuery.includes(symptomLower);
      
      if (hasKeyword || matchesSymptom) {
        foundMedicines.push(...data.medicineNames);
        matchedSymptoms.push(symptom);
      }
    }
    
    console.log(`[semanticSearch] Query: "${query}" -> Matched symptoms: ${matchedSymptoms.join(', ')} -> Medicines: ${foundMedicines.slice(0, 5).join(', ')}`);
    
    // Remove duplicates from medicine names
    const uniqueMedicineNames = [...new Set(foundMedicines)];
    
    const db = mongoose.connection.db;
    if (!db) return [];
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    // Build search patterns: tìm theo tên thuốc, category, indication, description
    const searchPatterns: any[] = [];
    
    // 1. Tìm theo tên thuốc cụ thể (nếu có mapping)
    if (uniqueMedicineNames.length > 0) {
    const medicineNameRegex = uniqueMedicineNames.map(name => ({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { brand: { $regex: name, $options: 'i' } }
      ]
    }));
      searchPatterns.push(...medicineNameRegex);
    }
    
    // 2. Tìm theo category và indication/description (quan trọng cho trường hợp không có mapping)
    // Mapping symptom -> category và keywords để tìm trong database
    // QUAN TRỌNG: Mapping đầy đủ cho TẤT CẢ triệu chứng trong 5 nhóm thuốc tiêu hóa
    // Khi người dùng cung cấp triệu chứng, hệ thống sẽ tự động xác định nhóm và tìm TRỰC TIẾP trong nhóm đó
    const symptomToCategoryKeywords: { [key: string]: { categories: string[]; subcategories: string[]; keywords: string[] } } = {
      // ========== NHÓM A - MEN TIÊU HÓA ==========
      'ăn không tiêu': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['ăn không tiêu', 'men tiêu hóa', 'enzyme', 'pancreatin', 'neopeptine', 'festal', 'digestive enzyme']
      },
      'đầy bụng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['đầy bụng', 'chướng bụng', 'bloating', 'flatulence', 'simethicone', 'air-x', 'espumisan', 'men tiêu hóa', 'enzyme']
      },
      'chướng bụng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['chướng bụng', 'đầy bụng', 'bloating', 'flatulence', 'simethicone', 'air-x', 'espumisan', 'men tiêu hóa', 'enzyme']
      },
      'khó tiêu': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['khó tiêu', 'khó tiêu hóa', 'dyspepsia', 'indigestion', 'men tiêu hóa', 'enzyme', 'pancreatin', 'neopeptine', 'festal']
      },
      'đi ngoài phân sống': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['đi ngoài phân sống', 'phân sống', 'men tiêu hóa', 'enzyme', 'pancreatin']
      },
      'rối loạn tiêu hóa nhẹ': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['men tiêu hóa'],
        keywords: ['rối loạn tiêu hóa nhẹ', 'rối loạn tiêu hóa', 'men tiêu hóa', 'enzyme']
      },
      'trẻ em ăn uống kém': {
        categories: ['thuốc tiêu hóa cho trẻ', 'thuoc-tieu-hoa-cho-tre'],
        subcategories: ['men tiêu hóa'],
        keywords: ['trẻ em ăn uống kém', 'trẻ ăn uống kém', 'men tiêu hóa cho trẻ']
      },
      
      // ========== NHÓM B - THUỐC CHỐNG TIÊU CHẢY ==========
      'tiêu chảy': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antidiarrheal'],
        subcategories: ['thuốc chống tiêu chảy'],
        keywords: ['tiêu chảy', 'diarrhea', 'loperamide', 'smecta', 'diosmectite', 'chống tiêu chảy', 'antidiarrheal', 'diarstop']
      },
      'đi ngoài phân lỏng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antidiarrheal'],
        subcategories: ['thuốc chống tiêu chảy'],
        keywords: ['đi ngoài phân lỏng', 'phân lỏng', 'tiêu chảy', 'loperamide', 'smecta', 'diosmectite']
      },
      'đi ngoài nhiều lần': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antidiarrheal'],
        subcategories: ['thuốc chống tiêu chảy'],
        keywords: ['đi ngoài nhiều lần', 'đi ngoài nhiều lần trong ngày', 'tiêu chảy', 'loperamide', 'smecta']
      },
      'đau bụng kèm tiêu chảy': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antidiarrheal'],
        subcategories: ['thuốc chống tiêu chảy'],
        keywords: ['đau bụng kèm tiêu chảy', 'tiêu chảy', 'loperamide', 'smecta', 'diosmectite']
      },
      
      // ========== NHÓM C - THUỐC KHÁNG ACID ==========
      'ợ chua': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['ợ chua', 'o chua', 'ợ nóng', 'o nong', 'heartburn', 'acid reflux', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite', 'maalox', 'tums']
      },
      'ợ nóng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['ợ chua', 'o chua', 'ợ nóng', 'o nong', 'heartburn', 'acid reflux', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite', 'maalox', 'tums']
      },
      'nóng rát vùng thượng vị': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['nóng rát vùng thượng vị', 'nóng rát', 'thượng vị', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite']
      },
      'đau dạ dày nhẹ': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['đau dạ dày nhẹ', 'đau dạ dày', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite']
      },
      'khó tiêu do tăng acid': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['khó tiêu do tăng acid', 'tăng acid', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite']
      },
      'trào ngược nhẹ sau ăn': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antacid', 'kháng acid'],
        subcategories: ['thuốc kháng acid', 'antacid'],
        keywords: ['trào ngược nhẹ sau ăn', 'trào ngược nhẹ', 'antacid', 'kháng acid', 'gaviscon', 'gastropulgite']
      },
      
      // ========== NHÓM D - THUỐC NHUẬN TRÀNG ==========
      'táo bón': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'laxative'],
        subcategories: ['thuốc nhuận tràng'],
        keywords: ['táo bón', 'constipation', 'duphalac', 'forlax', 'microlax', 'nhuận tràng', 'laxative']
      },
      'đi cầu khó': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'laxative'],
        subcategories: ['thuốc nhuận tràng'],
        keywords: ['đi cầu khó', 'táo bón', 'duphalac', 'forlax', 'nhuận tràng', 'laxative']
      },
      'phân cứng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'laxative'],
        subcategories: ['thuốc nhuận tràng'],
        keywords: ['phân cứng', 'táo bón', 'duphalac', 'forlax', 'nhuận tràng', 'laxative']
      },
      'đi ngoài ít hơn 3 lần/tuần': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'laxative'],
        subcategories: ['thuốc nhuận tràng'],
        keywords: ['đi ngoài ít', 'táo bón', 'duphalac', 'forlax', 'nhuận tràng', 'laxative']
      },
      
      // ========== NHÓM E - THUỐC ỨC CHẾ TIẾT ACID (PPI/H2) ==========
      'đau dạ dày nhiều': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['đau dạ dày nhiều', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'lansoprazole', 'ppi', 'h2']
      },
      'đau thượng vị kéo dài': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['đau thượng vị kéo dài', 'đau thượng vị', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'ppi', 'h2']
      },
      'trào ngược thường xuyên': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['trào ngược thường xuyên', 'trào ngược', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'ppi', 'h2']
      },
      'ợ chua kéo dài': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['ợ chua kéo dài', 'ợ chua', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'ppi', 'h2']
      },
      'đau tăng về đêm': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['đau tăng về đêm', 'đau về đêm', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'ppi', 'h2']
      },
      'tiền sử viêm loét dạ dày': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive'],
        subcategories: ['thuốc ức chế tiết acid', 'ppi', 'h2'],
        keywords: ['tiền sử viêm loét dạ dày', 'viêm loét dạ dày', 'omeprazole', 'esomeprazole', 'pantoprazole', 'ranitidine', 'famotidine', 'ppi', 'h2']
      },
      
      // ========== MAPPING CHUNG (fallback) ==========
      'tiêu hóa': {
        // QUAN TRỌNG: Chỉ tìm trong "Thuốc tiêu hóa" (người lớn), KHÔNG tìm "Thuốc tiêu hóa cho trẻ"
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'gastrointestinal'],
        subcategories: ['thuốc kháng acid', 'thuốc ức chế tiết acid', 'men tiêu hóa', 'thuốc chống tiêu chảy', 'thuốc nhuận tràng'],
        keywords: ['tiêu hóa', 'digestive', 'gastrointestinal', 'rối loạn tiêu hóa', 'digestion']
      },
      'đau bụng': {
        categories: ['thuốc tiêu hóa', 'thuoc-tieu-hoa', 'tiêu hóa', 'digestive', 'antispasmodic'],
        subcategories: ['men tiêu hóa', 'thuốc kháng acid'],
        keywords: ['đau bụng', 'co thắt', 'spasm', 'buscopan', 'spasmaverine', 'duspatalin', 'antispasmodic']
      }
    };
    
    // QUAN TRỌNG: Match triệu chứng từ symptomToCategoryKeywords TRỰC TIẾP từ query
    // Điều này đảm bảo các triệu chứng dài như "nóng rát vùng thượng vị" được nhận diện
    const matchedCategorySymptoms: string[] = [];
    for (const [symptom, config] of Object.entries(symptomToCategoryKeywords)) {
      const symptomLower = symptom.toLowerCase();
      // Match nếu query chứa symptom name hoặc bất kỳ keyword nào
      const matchesSymptomName = lowerQuery.includes(symptomLower);
      const matchesKeyword = config.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
      
      if (matchesSymptomName || matchesKeyword) {
        matchedCategorySymptoms.push(symptom);
        // Thêm vào matchedSymptoms để dùng cho scoring
        if (!matchedSymptoms.includes(symptom)) {
          matchedSymptoms.push(symptom);
        }
      }
    }
    
    // Nếu có matched symptoms (từ symptomToMedicines hoặc symptomToCategoryKeywords), tìm theo category và keywords
    const allMatchedSymptoms = [...new Set([...matchedSymptoms, ...matchedCategorySymptoms])];
    
    if (allMatchedSymptoms.length > 0) {
      for (const symptom of allMatchedSymptoms) {
        if (symptomToCategoryKeywords[symptom]) {
          const { categories, subcategories, keywords } = symptomToCategoryKeywords[symptom];
          
          // Tìm theo category name (tên category chính xác từ database)
          for (const category of categories) {
            searchPatterns.push({
              $or: [
                { categoryName: { $regex: category.replace(/-/g, '[-\\s]'), $options: 'i' } },
                { category: { $regex: category.replace(/-/g, '[-\\s]'), $options: 'i' } },
                { mainCategory: { $regex: category.replace(/-/g, '[-\\s]'), $options: 'i' } }
              ]
            });
          }
          
          // QUAN TRỌNG: Tìm theo subcategory (tên subcategory chính xác từ database)
          // Đây là bước then chốt để tìm TRỰC TIẾP trong nhóm thuốc đúng
          if (subcategories && subcategories.length > 0) {
            for (const subcategory of subcategories) {
              searchPatterns.push({
                $or: [
                  { subcategoryName: { $regex: subcategory, $options: 'i' } },
                  { subcategory: { $regex: subcategory, $options: 'i' } },
                  { categoryName: { $regex: subcategory, $options: 'i' } },
                  { category: { $regex: subcategory, $options: 'i' } }
                ]
              });
            }
          }
          
          // Tìm theo indication/description/uses
          for (const keyword of keywords) {
            searchPatterns.push({
              $or: [
                { indication: { $regex: keyword, $options: 'i' } },
                { indications: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { uses: { $regex: keyword, $options: 'i' } },
                { congDung: { $regex: keyword, $options: 'i' } },
                { name: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
              ]
            });
          }
        }
      }
    }
    
    // Nếu không có mapping nhưng query có từ khóa tiêu hóa, tìm theo category/keywords
    if (uniqueMedicineNames.length === 0) {
      if (lowerQuery.includes('tiêu hóa') || lowerQuery.includes('khó tiêu') || lowerQuery.includes('đầy bụng') || lowerQuery.includes('đau bụng')) {
        // Tìm theo category name chính xác từ database
        searchPatterns.push(
          { categoryName: { $regex: 'thuốc tiêu hóa|thuoc-tieu-hoa|tiêu hóa|digestive|antacid|kháng acid', $options: 'i' } },
          { category: { $regex: 'thuốc tiêu hóa|thuoc-tieu-hoa|tiêu hóa|digestive|antacid|kháng acid', $options: 'i' } },
          { mainCategory: { $regex: 'thuốc tiêu hóa|thuoc-tieu-hoa|tiêu hóa|digestive|antacid|kháng acid', $options: 'i' } },
          // Tìm theo subcategory
          { subcategoryName: { $regex: 'thuốc kháng acid|thuốc ức chế tiết acid|men tiêu hóa|thuốc chống tiêu chảy|thuốc nhuận tràng', $options: 'i' } },
          { subcategory: { $regex: 'thuốc kháng acid|thuốc ức chế tiết acid|men tiêu hóa|thuốc chống tiêu chảy|thuốc nhuận tràng', $options: 'i' } },
          // Tìm theo indication/description
          { indication: { $regex: 'tiêu hóa|khó tiêu|đầy bụng|digestive|antacid|indigestion|dyspepsia|kháng acid|men tiêu hóa|enzyme', $options: 'i' } },
          { indications: { $regex: 'tiêu hóa|khó tiêu|đầy bụng|digestive|antacid|indigestion|dyspepsia|kháng acid|men tiêu hóa|enzyme', $options: 'i' } },
          { description: { $regex: 'tiêu hóa|khó tiêu|đầy bụng|digestive|antacid|indigestion|dyspepsia|kháng acid|men tiêu hóa|enzyme', $options: 'i' } },
          { uses: { $regex: 'tiêu hóa|khó tiêu|đầy bụng|digestive|antacid|indigestion|dyspepsia|kháng acid|men tiêu hóa|enzyme', $options: 'i' } },
          // Tìm theo tên thuốc phổ biến
          { name: { $regex: 'antacid|omeprazole|esomeprazole|pantoprazole|ranitidine|famotidine|gaviscon|gastropulgite|simethicone|air-x|espumisan|domperidone|buscopan|spasmaverine|duspatalin|men tiêu hóa|enzyme|pancreatin', $options: 'i' } }
        );
      }
    }
    
    // QUAN TRỌNG: Log search patterns để debug
    console.log(`[semanticSearch] Search patterns count: ${searchPatterns.length}`);
    if (searchPatterns.length > 0) {
      console.log(`[semanticSearch] First 3 search patterns:`, JSON.stringify(searchPatterns.slice(0, 3), null, 2));
    }
    
    // Search in products collection
    let products: any[] = [];
    if (searchPatterns.length > 0) {
      // QUAN TRỌNG: Đảm bảo tìm được TẤT CẢ thuốc trong subcategory "Thuốc kháng acid" khi query có "ợ chua" hoặc "ợ nóng"
      // Thêm một search pattern riêng để tìm trực tiếp trong subcategory
      if (lowerQuery.includes('ợ chua') || lowerQuery.includes('o chua') || lowerQuery.includes('ợ nóng') || lowerQuery.includes('o nong')) {
        // Tìm TRỰC TIẾP trong subcategory "Thuốc kháng acid" với nhiều biến thể tên
        const antacidSubcategoryPatterns = [
          { subcategoryName: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } },
          { subcategory: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } },
          { medicineGroup: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } },
          { group: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } },
          { categoryName: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } },
          { category: { $regex: 'kháng acid|khang acid|antacid', $options: 'i' } }
        ];
        searchPatterns.push(...antacidSubcategoryPatterns);
        console.log(`[semanticSearch] ✅ Đã thêm ${antacidSubcategoryPatterns.length} patterns để tìm trực tiếp trong subcategory "Thuốc kháng acid"`);
      }
      
      products = await productsCollection.find({
        $or: searchPatterns,
        inStock: true,
        stockQuantity: { $gt: 0 }
      })
      .limit(30) // Tăng limit để tìm được nhiều thuốc hơn
      .toArray();
      
      console.log(`[semanticSearch] ✅ Tìm được ${products.length} products từ database`);
      if (products.length > 0) {
        console.log(`[semanticSearch] Sample products: ${products.slice(0, 5).map(p => `${p.name} (category: ${p.categoryName || p.category || 'N/A'}, subcategory: ${p.subcategoryName || p.subcategory || p.medicineGroup || 'N/A'})`).join(', ')}`);
      }
    }
    
    // QUAN TRỌNG: Tìm trong medicines collection vì nó có field subcategory
    // Products collection không có subcategory (không được sync từ medicines)
    // Nên cần tìm trực tiếp trong medicines collection khi cần tìm theo subcategory
    if (searchPatterns.length > 0) {
      // Tìm trong medicines collection với cùng search patterns
      // QUAN TRỌNG: Medicines collection có field subcategory, nên tìm ở đây sẽ chính xác hơn
      // Không filter stock quá chặt vì có thể có thuốc không có stock field
      const medicines = await medicinesCollection.find({
        $or: searchPatterns
      })
      .limit(30) // Tăng limit để tìm được nhiều thuốc hơn
      .toArray();
      
      console.log(`[semanticSearch] ✅ Tìm được ${medicines.length} medicines từ database`);
      
      // Convert to product format và QUAN TRỌNG: giữ lại subcategory từ medicines
      const convertedMedicines = medicines.map(med => ({
        _id: med._id,
        name: med.name,
        price: med.price || med.salePrice || 0,
        description: med.description || med.indication || med.indications || med.uses || med.congDung || '',
        brand: med.brand || '',
        inStock: (med.stock || med.stockQuantity || 0) > 0,
        stockQuantity: med.stock || med.stockQuantity || 0,
        unit: med.unit || 'đơn vị',
        imageUrl: med.imageUrl || med.image || med.imagePath || '',
        indication: med.indication || med.indications || med.uses || med.congDung || '',
        categoryName: med.category || med.mainCategory || med.categoryName || '',
        category: med.category || med.mainCategory || med.categoryName || '',
        // QUAN TRỌNG: Giữ lại subcategory từ medicines collection
        subcategoryName: med.subcategory || med.subcategoryName || med.medicineGroup || med.group || '',
        subcategory: med.subcategory || med.subcategoryName || med.medicineGroup || med.group || '',
        medicineGroup: med.medicineGroup || med.group || med.subcategory || med.subcategoryName || ''
      }));
      
      // Merge với products (ưu tiên medicines vì có subcategory)
      // Loại bỏ duplicates dựa trên name
      const allResults = [...convertedMedicines, ...products];
      const uniqueResults = new Map<string, any>();
      
      for (const item of allResults) {
        const key = (item.name || '').toLowerCase().trim();
        if (key && !uniqueResults.has(key)) {
          uniqueResults.set(key, item);
        } else if (key && uniqueResults.has(key)) {
          // Nếu đã có, ưu tiên item có subcategory
          const existing = uniqueResults.get(key);
          if (!existing.subcategory && !existing.subcategoryName && (item.subcategory || item.subcategoryName)) {
            uniqueResults.set(key, item);
          }
        }
      }
      
      products = Array.from(uniqueResults.values());
      console.log(`[semanticSearch] ✅ Sau khi merge: ${products.length} products/medicines (ưu tiên medicines có subcategory)`);
    }
    
    console.log(`[semanticSearch] Found ${products.length} products from database`);
    
    // Filter out irrelevant medicines based on matched symptoms
    // QUAN TRỌNG: Loại bỏ thuốc không liên quan đến triệu chứng
    const filteredProducts = products.filter(product => {
      const productNameLower = (product.name || '').toLowerCase();
      
      // Nếu CHỈ hỏi "nghẹt mũi" hoặc "sổ mũi" (không có sốt, đau đầu, ho)
      if ((matchedSymptoms.includes('nghẹt mũi') || matchedSymptoms.includes('sổ mũi')) && 
          !matchedSymptoms.includes('sốt') && 
          !matchedSymptoms.includes('đau đầu') && 
          !matchedSymptoms.includes('nhức đầu') &&
          !matchedSymptoms.includes('ho') &&
          !matchedSymptoms.includes('cảm') &&
          !matchedSymptoms.includes('cảm cúm')) {
        // Chỉ giữ thuốc xịt mũi, loại bỏ TẤT CẢ thuốc khác
        const nasalMedicines = ['natri clorid', 'xịt mũi', 'otrivin', 'naphazoline', 'rhinocort', 'muối biển', 'loratadine', 'cetirizine', 'fexofenadine'];
        const isNasalMedicine = nasalMedicines.some(med => productNameLower.includes(med));
        
        // Loại bỏ TẤT CẢ thuốc không phải thuốc nghẹt mũi
        if (!isNasalMedicine) {
          // Loại bỏ thuốc sốt/đau
          if (productNameLower.includes('paracetamol') || productNameLower.includes('panadol') || productNameLower.includes('efferalgan') || productNameLower.includes('ibuprofen')) {
            return false;
          }
          // Loại bỏ thuốc ho
          if (productNameLower.includes('terpin') || productNameLower.includes('acetylcysteine') || productNameLower.includes('bromhexin') || productNameLower.includes('ambroxol')) {
            return false;
          }
          // Loại bỏ thuốc cảm cúm
          if (productNameLower.includes('decolgen') || productNameLower.includes('tiffy') || productNameLower.includes('coldacmin')) {
            return false;
          }
        }
      }
      
      // Nếu CHỈ hỏi "đau đầu" hoặc "nhức đầu" (không có nghẹt mũi, sốt)
      if ((matchedSymptoms.includes('nhức đầu') || matchedSymptoms.includes('đau đầu')) && 
          !matchedSymptoms.includes('nghẹt mũi') && 
          !matchedSymptoms.includes('sổ mũi') &&
          !matchedSymptoms.includes('cảm') &&
          !matchedSymptoms.includes('cảm cúm')) {
        // Ưu tiên Paracetamol, Ibuprofen, loại bỏ Decolgen, Tiffy
        const headacheMedicines = ['paracetamol', 'panadol', 'efferalgan', 'hapacol', 'ibuprofen'];
        const isHeadacheMedicine = headacheMedicines.some(med => productNameLower.includes(med));
        if (!isHeadacheMedicine && (productNameLower.includes('decolgen') || productNameLower.includes('tiffy') || productNameLower.includes('coldacmin'))) {
          return false; // Loại bỏ Decolgen/Tiffy nếu chỉ có đau đầu
        }
      }
      
      // Nếu CHỈ hỏi "ho" (không có sốt, đau đầu, nghẹt mũi)
      if (matchedSymptoms.includes('ho') && 
          !matchedSymptoms.includes('sốt') && 
          !matchedSymptoms.includes('đau đầu') &&
          !matchedSymptoms.includes('nhức đầu') &&
          !matchedSymptoms.includes('nghẹt mũi') &&
          !matchedSymptoms.includes('sổ mũi') &&
          !matchedSymptoms.includes('cảm') &&
          !matchedSymptoms.includes('cảm cúm')) {
        // Ưu tiên thuốc ho, loại bỏ TẤT CẢ thuốc khác
        const coughMedicines = ['terpin', 'bromhexin', 'acetylcysteine', 'ambroxol', 'prospan', 'eugica', 'mucosolvan', 'dextromethorphan'];
        const isCoughMedicine = coughMedicines.some(med => productNameLower.includes(med));
        
        // Loại bỏ TẤT CẢ thuốc không phải thuốc ho
        if (!isCoughMedicine) {
          // Loại bỏ thuốc sốt/đau
          if (productNameLower.includes('paracetamol') || productNameLower.includes('panadol') || productNameLower.includes('efferalgan') || productNameLower.includes('ibuprofen')) {
            return false;
          }
          // Loại bỏ thuốc nghẹt mũi
          if (productNameLower.includes('otrivin') || productNameLower.includes('naphazoline') || productNameLower.includes('rhinocort')) {
            return false;
          }
          // Loại bỏ thuốc cảm cúm
          if (productNameLower.includes('decolgen') || productNameLower.includes('tiffy') || productNameLower.includes('coldacmin')) {
            return false;
          }
        }
      }
      
      // Nếu hỏi về tiêu hóa, khó tiêu, đầy bụng
      if (matchedSymptoms.includes('khó tiêu') || 
          matchedSymptoms.includes('tiêu hóa') || 
          matchedSymptoms.includes('đầy bụng') ||
          matchedSymptoms.includes('đau bụng')) {
        // QUAN TRỌNG: Kiểm tra category thay vì chỉ kiểm tra tên thuốc
        // Vì có thể có thuốc tiêu hóa với tên khác không có trong danh sách trên
        const productCategory = (product.categoryName || product.category || product.mainCategory || '').toLowerCase();
        const isDigestiveCategory = productCategory.includes('tiêu hóa') || 
                                    productCategory.includes('digestive') || 
                                    productCategory.includes('antacid') || 
                                    productCategory.includes('kháng acid') ||
                                    productCategory.includes('gastrointestinal');
        
        // Danh sách thuốc tiêu hóa phổ biến (để kiểm tra nếu category không rõ)
        const digestiveMedicines = ['domperidone', 'men tiêu hóa', 'enzym', 'pancreatin', 'buscopan', 'spasmaverine', 'duspatalin', 'omeprazole', 'esomeprazole', 'pantoprazole', 'gaviscon', 'gastropulgite', 'simethicone', 'air-x', 'espumisan', 'neopeptine', 'festal', 'smecta', 'loperamide', 'diosmectite', 'duphalac', 'forlax', 'microlax', 'ranitidine', 'famotidine', 'maalox', 'tums'];
        const isDigestiveMedicine = digestiveMedicines.some(med => productNameLower.includes(med));
        
        // QUAN TRỌNG: Chỉ loại bỏ nếu KHÔNG phải thuốc tiêu hóa (theo category hoặc tên)
        if (!isDigestiveCategory && !isDigestiveMedicine) {
          // Loại bỏ thuốc dị ứng
          if (productNameLower.includes('clorpheniramin') || 
              productNameLower.includes('chlorpheniramine') ||
              productNameLower.includes('cetirizine') || 
              productNameLower.includes('loratadine') || 
              productNameLower.includes('fexofenadine')) {
            return false;
          }
          // Loại bỏ thuốc sốt/đau
          if (productNameLower.includes('paracetamol') || productNameLower.includes('panadol') || productNameLower.includes('efferalgan') || productNameLower.includes('ibuprofen')) {
            return false;
          }
          // Loại bỏ thuốc ho
          if (productNameLower.includes('terpin') || productNameLower.includes('acetylcysteine') || productNameLower.includes('bromhexin') || productNameLower.includes('ambroxol')) {
            return false;
          }
          // Loại bỏ thuốc cảm cúm
          if (productNameLower.includes('decolgen') || productNameLower.includes('tiffy') || productNameLower.includes('coldacmin')) {
            return false;
          }
          // Loại bỏ vitamin/probiotic nếu không phải thuốc tiêu hóa
          if (productCategory.includes('vitamin') || productCategory.includes('probiotic') || productCategory.includes('khoáng chất')) {
            return false;
          }
        }
      }
      
      // Nếu hỏi "cảm" hoặc "cảm cúm"
      if (matchedSymptoms.includes('cảm') || matchedSymptoms.includes('cảm cúm')) {
        // Loại bỏ Probiotics - KHÔNG liên quan đến cảm
        if (productNameLower.includes('probiotic') || 
            productNameLower.includes('men vi sinh') ||
            productNameLower.includes('lactobacillus') ||
            productNameLower.includes('probio') ||
            productNameLower.includes('biogaia') ||
            productNameLower.includes('enterogermina')) {
          return false;
        }
        
        // Loại bỏ thuốc long đờm nếu không có "ho đờm" hoặc "ho có đờm"
        if (!lowerQuery.includes('ho đờm') && !lowerQuery.includes('ho có đờm') && !lowerQuery.includes('long đờm')) {
          if (productNameLower.includes('acetylcysteine') || 
              productNameLower.includes('bromhexin') || 
              productNameLower.includes('ambroxol') ||
              productNameLower.includes('mucosolvan') ||
              productNameLower.includes('long đờm')) {
            return false; // Loại bỏ thuốc long đờm khi không có ho đờm
          }
        }
        
        // Chỉ giữ lại thuốc cảm phù hợp: Paracetamol, Panadol, Efferalgan, Decolgen, Tiffy, Coldacmin, Hapacol
        const validColdMedicines = ['paracetamol', 'panadol', 'efferalgan', 'decolgen', 'tiffy', 'coldacmin', 'hapacol', 'terpin'];
        const isValidColdMedicine = validColdMedicines.some(med => productNameLower.includes(med));
        
        // Nếu không phải thuốc cảm hợp lệ, loại bỏ
        if (!isValidColdMedicine) {
          // Cho phép một số thuốc hỗ trợ cảm nhưng không phải thuốc chính
          const allowedSupportMedicines = ['loratadine', 'cetirizine', 'fexofenadine']; // Thuốc dị ứng có thể dùng khi cảm
          const isAllowedSupport = allowedSupportMedicines.some(med => productNameLower.includes(med));
          
          if (!isAllowedSupport) {
            return false; // Loại bỏ nếu không phải thuốc cảm hợp lệ
          }
        }
      }
      
      return true;
    });
    
    // Remove duplicates
    const uniqueProducts = new Map<string, any>();
    for (const product of filteredProducts) {
      const key = product.name?.toLowerCase() || '';
      if (!uniqueProducts.has(key)) uniqueProducts.set(key, product);
    }

    // Scoring and limit to top 5 by relevance
    const scored = Array.from(uniqueProducts.values()).map(p => ({
      ...p,
      _score: relevanceScore(query, p, matchedSymptoms)
    }));

    // For specific medicine categories, lower the threshold to ensure we get results
    // If we have matched symptoms for these categories, accept lower scores
    const hasDigestiveSymptoms = matchedSymptoms.some(s => 
      ['khó tiêu', 'tiêu hóa', 'đầy bụng', 'đau bụng', 'tiêu chảy', 'táo bón'].includes(s)
    );
    const hasAllergySymptoms = matchedSymptoms.some(s => 
      ['dị ứng', 'ngứa', 'mề đay', 'phát ban'].includes(s)
    ) || lowerQuery.includes('dị ứng') || lowerQuery.includes('kháng dị ứng') || lowerQuery.includes('antihistamine');
    const hasAntiInflammatorySymptoms = lowerQuery.includes('kháng viêm') || lowerQuery.includes('chống viêm') || lowerQuery.includes('anti-inflammatory');
    const hasNeurologicalSymptoms = lowerQuery.includes('thần kinh') || lowerQuery.includes('đau đầu') || lowerQuery.includes('nhức đầu') || lowerQuery.includes('migraine');
    const hasMusculoskeletalSymptoms = lowerQuery.includes('xương khớp') || lowerQuery.includes('đau khớp') || lowerQuery.includes('viêm khớp') || lowerQuery.includes('arthrit');
    const hasCardiovascularSymptoms = lowerQuery.includes('tim mạch') || lowerQuery.includes('huyết áp') || lowerQuery.includes('cardiovascular') || lowerQuery.includes('hypertension');
    const hasPainFeverSymptoms = lowerQuery.includes('giảm đau') || lowerQuery.includes('hạ sốt') || lowerQuery.includes('pain') || lowerQuery.includes('fever');
    const hasAntibioticSymptoms = lowerQuery.includes('kháng sinh') || lowerQuery.includes('antibiotic');
    const hasPediatricDigestiveSymptoms = (lowerQuery.includes('tiêu hóa') || lowerQuery.includes('digestive')) && (lowerQuery.includes('trẻ') || lowerQuery.includes('kids') || lowerQuery.includes('pediatric'));
    const hasEyeEarNoseSymptoms = lowerQuery.includes('mắt') || lowerQuery.includes('tai') || lowerQuery.includes('mũi') || lowerQuery.includes('eye') || lowerQuery.includes('ear') || lowerQuery.includes('nose');
    
    const hasSpecialCategorySymptoms = hasDigestiveSymptoms || hasAllergySymptoms || hasAntiInflammatorySymptoms || 
                                       hasNeurologicalSymptoms || hasMusculoskeletalSymptoms || hasCardiovascularSymptoms ||
                                       hasPainFeverSymptoms || hasAntibioticSymptoms || hasPediatricDigestiveSymptoms || 
                                       hasEyeEarNoseSymptoms;
    
    // QUAN TRỌNG: Điều chỉnh threshold dựa trên query
    // Nếu query về tiêu hóa/ợ chua, threshold thấp hơn để lấy được thuốc đúng category
    const isDigestiveQuery = lowerQuery.includes('tiêu hóa') || lowerQuery.includes('tieu hoa') || 
                             lowerQuery.includes('ợ chua') || lowerQuery.includes('o chua') || 
                             lowerQuery.includes('ợ nóng') || lowerQuery.includes('o nong') ||
                             lowerQuery.includes('khó tiêu') || lowerQuery.includes('kho tieu') ||
                             lowerQuery.includes('đầy bụng') || lowerQuery.includes('day bung');
    
    // QUAN TRỌNG: Giảm threshold xuống rất thấp cho digestive queries để đảm bảo có kết quả
    const scoreThreshold = isDigestiveQuery ? 0.05 : (hasSpecialCategorySymptoms ? 0.15 : 0.25); // Lower threshold for digestive queries
    
    // Debug: Log scores của top products
    const topScored = scored
      .sort((a, b) => b._score - a._score)
      .slice(0, 5);
    
    console.log(`[semanticSearch] Top 5 products with scores:`);
    topScored.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.name}: score=${p._score.toFixed(3)}, category=${(p.categoryName || p.category || '').substring(0, 30)}`);
    });
    console.log(`[semanticSearch] Score threshold: ${scoreThreshold}`);
    
    // QUAN TRỌNG: Với digestive queries, ưu tiên trả về products từ database TRƯỚC KHI filter theo score
    // Điều này đảm bảo AI luôn có thuốc từ database để dùng, không tự tạo
    if (isDigestiveQuery && topScored.length > 0) {
      // Lọc products có category đúng hoặc score không quá thấp
      const digestiveProducts = topScored.filter(p => {
        const pCategory = (p.categoryName || p.category || '').toLowerCase();
        const isDigestiveCategory = pCategory.includes('tiêu hóa') || pCategory.includes('digestive') || pCategory.includes('antacid') || pCategory.includes('kháng acid');
        // Trả về nếu category đúng HOẶC score > -2.0 (không quá thấp)
        return isDigestiveCategory || p._score > -2.0;
      });
      
      if (digestiveProducts.length > 0) {
        console.log(`[semanticSearch] ✅ Digestive query: Trả về ${Math.min(3, digestiveProducts.length)} products từ DB để đảm bảo AI dùng thuốc thực tế`);
        console.log(`[semanticSearch] Products: ${digestiveProducts.slice(0, 3).map(p => `${p.name} (score=${p._score.toFixed(3)}, category=${(p.categoryName || p.category || '').substring(0, 30)})`).join(', ')}`);
        return digestiveProducts.slice(0, 3).map(({ _score, ...rest }) => rest);
      }
    }
    
    const finalResults = scored
      .filter(p => p._score > scoreThreshold)
      .sort((a, b) => b._score - a._score)
      .slice(0, 3) // Giới hạn tối đa 3 thuốc để tránh dài dòng
      .map(({ _score, ...rest }) => rest);
    
      if (finalResults.length === 0) {
        console.log(`[semanticSearch] ⚠️ Không tìm thấy thuốc phù hợp trong DB cho query: "${query}"`);
        console.log(`[semanticSearch] Matched symptoms: ${matchedSymptoms.join(', ')}`);
        console.log(`[semanticSearch] Medicine names to search: ${uniqueMedicineNames.slice(0, 10).join(', ')}`);
        console.log(`[semanticSearch] Top product score: ${topScored[0]?._score || 0}, threshold: ${scoreThreshold}`);
        
        // QUAN TRỌNG: Nếu có products từ database, PHẢI trả về chúng để AI dùng
        // KHÔNG được để AI tự tạo thuốc
        if (topScored.length > 0) {
          const topProduct = topScored[0];
          const topCategory = (topProduct.categoryName || topProduct.category || '').toLowerCase();
          const isDigestiveCategory = topCategory.includes('tiêu hóa') || topCategory.includes('digestive') || topCategory.includes('antacid') || topCategory.includes('kháng acid');
          
          // Nếu là digestive query và product có category đúng, trả về top 3 (dù score thấp)
          if (isDigestiveQuery && isDigestiveCategory) {
            console.log(`[semanticSearch] ⚠️ Fallback: Trả về top ${Math.min(3, topScored.length)} products từ DB (digestive query, category đúng, score=${topProduct._score.toFixed(3)}) để tránh AI tự tạo thuốc`);
            console.log(`[semanticSearch] Products: ${topScored.slice(0, 3).map(p => `${p.name} (${(p.categoryName || p.category || '').substring(0, 30)})`).join(', ')}`);
            return topScored.slice(0, 3).map(({ _score, ...rest }) => rest);
          }
          // Nếu là digestive query nhưng category không đúng, vẫn trả về nếu score > -2.0
          else if (isDigestiveQuery && topProduct._score > -2.0) {
            console.log(`[semanticSearch] ⚠️ Fallback: Trả về top ${Math.min(3, topScored.length)} products từ DB (digestive query, score=${topProduct._score.toFixed(3)}) để tránh AI tự tạo thuốc`);
            console.log(`[semanticSearch] Products: ${topScored.slice(0, 3).map(p => `${p.name} (${(p.categoryName || p.category || '').substring(0, 30)})`).join(', ')}`);
            return topScored.slice(0, 3).map(({ _score, ...rest }) => rest);
          }
          // Với các query khác, chỉ trả về top 1 nếu score không quá thấp
          else if (!isDigestiveQuery && topProduct._score > -1.0) {
            console.log(`[semanticSearch] ⚠️ Fallback: Trả về top 1 product dù score thấp để tránh AI tự tạo thuốc`);
            return [topScored[0]].map(({ _score, ...rest }) => rest);
          }
        }
        
        console.log(`[semanticSearch] ❌ Không có products nào từ DB phù hợp, trả về rỗng`);
      } else {
        console.log(`[semanticSearch] ✅ Tìm thấy ${finalResults.length} thuốc phù hợp: ${finalResults.map(p => p.name).join(', ')}`);
      }
    
    return finalResults;
  } catch (error) {
    console.error('Error in semantic search:', error);
    return [];
  }
}

// Suggest medicines based on symptoms (improved version)
async function suggestMedicinesBySymptom(symptoms: string[]): Promise<any[]> {
  try {
    // First try semantic search
    const query = symptoms.join(' ');
    const semanticResults = await semanticSearch(query);
    
    if (semanticResults.length > 0) {
      return semanticResults;
    }
    
    // Fallback to category-based search
    const categories: string[] = [];
    for (const symptom of symptoms) {
      const lowerSymptom = symptom.toLowerCase();
      if (symptomToMedicines[lowerSymptom]) {
        categories.push(...symptomToMedicines[lowerSymptom].keywords);
      }
    }
    
    if (categories.length === 0) return [];
    
    const db = mongoose.connection.db;
    if (!db) return [];
    
    const productsCollection = db.collection('products');
    const searchTerms = categories.join('|');
    
    const products = await productsCollection.find({
      $or: [
        { name: { $regex: searchTerms, $options: 'i' } },
        { description: { $regex: searchTerms, $options: 'i' } }
      ],
      inStock: true,
      stockQuantity: { $gt: 0 }
    })
    .limit(10)
    .toArray();
    
    return products;
  } catch (error) {
    console.error('Error suggesting medicines by symptom:', error);
    return [];
  }
}

// Normalize text (handle typos and common misspellings)
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  
  // Common typos
  const typos: { [key: string]: string } = {
    'bi': 'bị',
    'thuoc': 'thuốc',
    'giam': 'giảm',
    'dau': 'đau',
    'bong': 'bụng',
    'di': 'đi',
    'ung': 'ứng',
    'ban': 'bán',
    'tro': 'tìm',
    'hok': 'không',
    'z': 'gì',
    'coi': 'xem',
    'vô': 'vào',
    'xíu': 'một chút'
  };
  
  for (const [typo, correct] of Object.entries(typos)) {
    normalized = normalized.replace(new RegExp(`\\b${typo}\\b`, 'gi'), correct);
  }
  
  return normalized;
}

// Check for safety warnings and handle difficult situations
function checkSafetyWarnings(message: string): string | null {
  const lowerMessage = normalizeText(message);

  // Critical symptoms - require immediate medical attention
  const criticalPatterns: { pattern: RegExp; warning: string }[] = [
    { pattern: /sốt\s*(cao|trên|>)\s*39/i, warning: safetyWarnings['sốt cao 40'] },
    { pattern: /(khó thở|thở dốc|ngạt thở|thở gấp)/i, warning: safetyWarnings['đau ngực tim'] },
    { pattern: /đau\s*ngực/i, warning: safetyWarnings['đau ngực'] },
    { pattern: /trẻ\s*(em|nhỏ|<|dưới)\s*[0-5]\s*(tháng|th)/i, warning: '⚠️ Trẻ dưới 6 tháng cần được khám bác sĩ ngay. Không tự ý dùng thuốc.' },
    { pattern: /mang\s*thai\s*(3|ba)\s*tháng\s*đầu/i, warning: '⚠️ Phụ nữ mang thai 3 tháng đầu cần khám bác sĩ trước khi dùng thuốc.' },
    { pattern: /(nôn\s*ra\s*máu|đi\s*ngoài\s*ra\s*máu|ho\s*ra\s*máu|phân\s*có\s*máu)/i, warning: '⚠️ Đây là triệu chứng nghiêm trọng. Bạn cần đi khám bác sĩ ngay lập tức hoặc đến cơ sở y tế gần nhất. Không tự ý điều trị tại nhà.' },
    { pattern: /(co giật|động kinh|hôn mê)/i, warning: '⚠️ Đây là tình trạng khẩn cấp. Bạn cần gọi cấp cứu 115 hoặc đến bệnh viện ngay lập tức.' },
    { pattern: /tiêu\s*chảy\s*(?:hơn|trên|>|quá)\s*2\s*ngày/i, warning: '⚠️ Tiêu chảy kéo dài hơn 2 ngày là dấu hiệu nghiêm trọng, đặc biệt với trẻ em. Bạn cần đi khám bác sĩ ngay. Không tự ý điều trị tại nhà.' },
    { pattern: /nôn\s*(?:nhiều|liên\s*tục|thường\s*xuyên)/i, warning: '⚠️ Nôn nhiều hoặc nôn liên tục là dấu hiệu nghiêm trọng, đặc biệt với trẻ em. Bạn cần đi khám bác sĩ ngay. Không tự ý điều trị tại nhà.' }
  ];

  for (const { pattern, warning } of criticalPatterns) {
    if (pattern.test(lowerMessage)) return warning;
  }

  // Check for prescription-only medicines requests
  const prescriptionMedicinePatterns = [
    /(kháng sinh|antibiotic|amoxicillin|azithromycin|cefuroxime|augmentin|metronidazole)/i,
    /(thuốc\s*kê\s*đơn|thuốc\s*theo\s*đơn|thuốc\s*phải\s*có\s*đơn)/i,
    /(corticoid|prednisolone|dexamethasone)/i
  ];
  
  for (const pattern of prescriptionMedicinePatterns) {
    if (pattern.test(lowerMessage)) {
      return '⚠️ Kháng sinh và một số thuốc khác là thuốc kê đơn, không được bán không cần đơn bác sĩ. Việc tự ý dùng thuốc kê đơn có thể gây nguy hiểm và kháng thuốc. Vui lòng đến bác sĩ để được kê đơn phù hợp.';
    }
  }

  // Check for diagnosis requests (AI should not diagnose)
  if (/(chẩn đoán|tôi\s*bị\s*bệnh\s*gì|bệnh\s*của\s*tôi\s*là|tôi\s*có\s*bị)/i.test(lowerMessage) && 
      !/(thuốc|tư vấn|gợi ý)/i.test(lowerMessage)) {
    return '⚠️ Tôi không thể chẩn đoán bệnh. Tôi chỉ có thể tư vấn về thuốc và triệu chứng nhẹ. Nếu bạn cần chẩn đoán, vui lòng đến bác sĩ để được khám và xét nghiệm.';
  }

  // Check existing safety warnings
  for (const [key, warning] of Object.entries(safetyWarnings)) {
    if (lowerMessage.includes(key)) {
      return warning;
    }
  }

  return null;
}

// Parse patient info from a message or entire conversation history
function parsePatientInfo(message: string, conversationHistory?: ChatMessage[]) {
  // Combine current message with all previous user messages to check for already provided info
  let combinedText = normalizeText(message);
  if (conversationHistory && conversationHistory.length > 0) {
    const allUserMessages = conversationHistory
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');
    combinedText = normalizeText(allUserMessages + ' ' + message);
  }
  
  const lower = combinedText;
  const hasSymptom = ['cảm', 'cúm', 'sốt', 'ho', 'sổ mũi', 'nghẹt mũi', 'đau họng', 'nhức đầu', 'tiêu hóa', 'khó tiêu', 'đầy bụng', 'đau bụng']
    .some(sym => lower.includes(sym));

  // Extract age
  let age: number | null = null;
  let ageGroup: 'infant' | 'toddler' | 'child' | 'adolescent' | 'adult' | null = null;
  
  const ageMatch = lower.match(/(\d{1,3})\s*tuổi/i) || lower.match(/tôi\s+(\d{1,3})/i) || lower.match(/(\d{1,3})\s*yo/i);
  if (ageMatch) {
    age = parseInt(ageMatch[1]);
    if (age >= 0 && age < 1) ageGroup = 'infant';
    else if (age >= 1 && age < 6) ageGroup = 'toddler';
    else if (age >= 6 && age < 12) ageGroup = 'child';
    else if (age >= 12) ageGroup = 'adult'; // Từ 12 tuổi trở lên được coi là người lớn
  } else if (lower.includes('trẻ sơ sinh') || lower.includes('trẻ dưới 1 tuổi')) {
    ageGroup = 'infant';
  } else if (lower.includes('trẻ nhỏ') || lower.includes('trẻ em dưới 6')) {
    ageGroup = 'toddler';
  } else if (lower.includes('trẻ em') && !lower.includes('dưới')) {
    ageGroup = 'child';
  } else if (lower.includes('người lớn') || lower.includes('vị thành niên')) {
    ageGroup = 'adult';
  }

  const hasAge = age !== null || ageGroup !== null || /\d{1,2}\s*tuổi/.test(lower) || lower.includes('trẻ em') || lower.includes('người lớn');

  // Extract pregnancy/breastfeeding info
  const isPregnant = /(mang\s*thai|có\s*thai|bầu|đang\s*thai)/i.test(lower) && !/(không\s*mang\s*thai|không\s*có\s*thai|không\s*bầu)/i.test(lower);
  const isBreastfeeding = /(cho\s*con\s*bú|đang\s*cho\s*con\s*bú)/i.test(lower) && !/(không\s*cho\s*con\s*bú)/i.test(lower);
  const isMale = /(nam|đàn\s*ông|con\s*trai)/i.test(lower);
  const hasPregnancyInfo = isPregnant || isBreastfeeding || /(không\s*mang\s*thai|không\s*bầu|không\s*có\s*thai|không\s*cho\s*con\s*bú)/i.test(lower) || isMale;

  // Extract drug allergy info
  const hasDrugAllergy = /(dị\s*ứng|dị\s*thuốc|tiền\s*sử\s*dị\s*ứng)/i.test(lower) && !/(không\s*dị\s*ứng|không\s*dị\s*thuốc)/i.test(lower);
  const allergyDrugs: string[] = [];
  if (hasDrugAllergy) {
    // Try to extract drug names from allergy info
    const allergyMatch = lower.match(/dị\s*ứng\s*(?:với|thuốc)?\s*([^,.\n]+)/i);
    if (allergyMatch) {
      allergyDrugs.push(allergyMatch[1].trim());
    }
  }
  const hasDrugAllergyInfo = hasDrugAllergy || /(không\s*dị\s*ứng|không\s*dị\s*thuốc)/i.test(lower);

  // Extract chronic disease info
  const hasChronicDisease = /(bệnh\s*nền|có\s*bệnh)/i.test(lower) && !/(không\s*bệnh\s*nền|không\s*có\s*bệnh)/i.test(lower);
  const chronicDiseases: string[] = [];
  if (hasChronicDisease) {
    const diseases = ['gan', 'thận', 'tim', 'dạ dày', 'huyết áp', 'tiểu đường', 'đái tháo đường', 'cao huyết áp'];
    diseases.forEach(disease => {
      if (lower.includes(disease)) {
        chronicDiseases.push(disease);
      }
    });
  }
  const hasChronicInfo = hasChronicDisease || /(không\s*bệnh\s*nền|không\s*có\s*bệnh)/i.test(lower);

  return {
    hasSymptom,
    hasAge,
    age,
    ageGroup,
    hasPregnancyInfo,
    isPregnant,
    isBreastfeeding,
    isMale,
    hasDrugAllergyInfo,
    hasDrugAllergy,
    allergyDrugs,
    hasChronicInfo,
    hasChronicDisease,
    chronicDiseases
  };
}

function buildMissingInfoQuestions(info: ReturnType<typeof parsePatientInfo>): string | null {
  const missing: string[] = [];
  if (!info.hasAge) missing.push('Tuổi (người lớn/trẻ em)');
  if (!info.hasPregnancyInfo) missing.push('Có đang mang thai/cho con bú không?');
  if (!info.hasDrugAllergyInfo) missing.push('Có dị ứng thuốc không?');
  if (!info.hasChronicInfo) missing.push('Có bệnh nền (gan, thận, tim, dạ dày, huyết áp...) không?');

  if (missing.length === 0) return null;
  
  // Format với xuống dòng để dễ đọc
  let response = 'Để tư vấn an toàn, bạn vui lòng cho biết thêm:\n\n';
  missing.forEach((item, index) => {
    response += `${index + 1}. ${item}\n`;
  });
  response += '\nCảm ơn bạn!';
  
  return response;
}

/**
 * Filter thuốc theo thông tin bệnh nhân (độ tuổi, mang thai, bệnh nền, dị ứng)
 */
function filterMedicinesByPatientInfo(medicines: any[], patientInfo: ReturnType<typeof parsePatientInfo>): any[] {
  if (!medicines || medicines.length === 0) return medicines;
  
  return medicines.filter(med => {
    const medName = (med.name || '').toLowerCase();
    const medIndication = (med.indication || med.description || '').toLowerCase();
    
    // 1. Filter theo độ tuổi
    if (patientInfo.ageGroup) {
      // Trẻ sơ sinh (0-1 tuổi): chỉ men vi sinh dạng giọt
      if (patientInfo.ageGroup === 'infant') {
        if (!medName.includes('men vi sinh') && !medName.includes('probiotic') && !medIndication.includes('men vi sinh')) {
          return false; // Loại bỏ thuốc không phải men vi sinh cho trẻ sơ sinh
        }
        // Chỉ giữ men vi sinh dạng giọt
        if (!medName.includes('giọt') && !medName.includes('drop')) {
          return false;
        }
      }
      
      // Trẻ nhỏ (1-6 tuổi): tránh thuốc người lớn
      if (patientInfo.ageGroup === 'toddler') {
        // Loại bỏ thuốc có "người lớn" trong tên hoặc indication
        if (medName.includes('người lớn') || medIndication.includes('người lớn')) {
          return false;
        }
      }
      
      // Người lớn (≥12 tuổi): loại bỏ thuốc dành cho trẻ em
      if (patientInfo.ageGroup === 'adult' && patientInfo.age && patientInfo.age >= 12) {
        // Loại bỏ thuốc có "trẻ em", "cho trẻ", "trẻ nhỏ", "kids", "pediatric", "infant" trong tên hoặc indication
        const pediatricKeywords = ['trẻ em', 'tre em', 'cho trẻ', 'cho tre', 'trẻ nhỏ', 'tre nho', 'kids', 'pediatric', 'infant', 'trẻ sơ sinh', 'tre so sinh'];
        const hasPediatricKeyword = pediatricKeywords.some(keyword => 
          medName.includes(keyword) || medIndication.includes(keyword)
        );
        
        // QUAN TRỌNG: Loại bỏ thuốc có category "Thuốc tiêu hóa cho trẻ" hoặc "Thuốc ... cho trẻ"
        const medCategory = (med.categoryName || med.category || med.mainCategory || '').toLowerCase();
        const isPediatricCategory = medCategory.includes('cho trẻ') || medCategory.includes('cho tre') || 
                                    medCategory.includes('trẻ em') || medCategory.includes('tre em') ||
                                    medCategory.includes('pediatric') || medCategory.includes('kids');
        
        // Chỉ loại bỏ nếu không có chỉ định dùng cho cả người lớn
        if ((hasPediatricKeyword || isPediatricCategory) && 
            !medIndication.includes('người lớn') && 
            !medIndication.includes('cả trẻ em và người lớn') &&
            !medIndication.includes('dùng cho người lớn')) {
          return false; // Loại bỏ thuốc trẻ em cho người lớn
        }
      }
    }
    
    // 2. Filter theo mang thai/cho con bú
    if (patientInfo.isPregnant || patientInfo.isBreastfeeding) {
      // Loại bỏ thuốc có chống chỉ định cho phụ nữ mang thai
      const contraindicatedForPregnancy = ['ibuprofen', 'aspirin', 'nsaid', 'corticoid', 'prednisolone', 'dexamethasone'];
      if (contraindicatedForPregnancy.some(drug => medName.includes(drug) || medIndication.includes(drug))) {
        return false;
      }
    }
    
    // 3. Filter theo dị ứng thuốc
    if (patientInfo.hasDrugAllergy && patientInfo.allergyDrugs.length > 0) {
      for (const allergyDrug of patientInfo.allergyDrugs) {
        const allergyLower = allergyDrug.toLowerCase();
        // Loại bỏ thuốc dị ứng hoặc thuốc cùng nhóm
        if (medName.includes(allergyLower) || medIndication.includes(allergyLower)) {
          return false;
        }
        
        // Loại bỏ thuốc cùng nhóm (ví dụ: dị ứng Paracetamol thì tránh tất cả Paracetamol)
        const drugGroups: { [key: string]: string[] } = {
          'paracetamol': ['paracetamol', 'acetaminophen', 'panadol', 'efferalgan', 'hapacol'],
          'ibuprofen': ['ibuprofen', 'nsaid', 'diclofenac', 'meloxicam'],
          'aspirin': ['aspirin', 'acetylsalicylic'],
          'penicillin': ['penicillin', 'amoxicillin', 'ampicillin', 'augmentin'],
        };
        
        for (const [group, drugs] of Object.entries(drugGroups)) {
          if (drugs.some(d => allergyLower.includes(d) || d.includes(allergyLower))) {
            if (drugs.some(d => medName.includes(d) || medIndication.includes(d))) {
              return false;
            }
          }
        }
      }
    }
    
    // 4. Filter theo bệnh nền
    if (patientInfo.hasChronicDisease && patientInfo.chronicDiseases.length > 0) {
      for (const disease of patientInfo.chronicDiseases) {
        const diseaseLower = disease.toLowerCase();
        
        // Bệnh gan: tránh thuốc chuyển hóa qua gan
        if (diseaseLower.includes('gan')) {
          if (medIndication.includes('chuyển hóa qua gan') || medName.includes('paracetamol')) {
            // Paracetamol vẫn có thể dùng nhưng cần thận trọng - để AI quyết định
            // Chỉ loại bỏ nếu có chống chỉ định rõ ràng
          }
        }
        
        // Bệnh thận: tránh thuốc chuyển hóa qua thận
        if (diseaseLower.includes('thận')) {
          if (medIndication.includes('chống chỉ định suy thận') || medName.includes('ibuprofen')) {
            // Ibuprofen cần thận trọng với bệnh thận
          }
        }
        
        // Bệnh dạ dày: tránh thuốc kích ứng dạ dày
        if (diseaseLower.includes('dạ dày') || diseaseLower.includes('bao tử')) {
          if (medName.includes('ibuprofen') || medName.includes('aspirin') || medName.includes('nsaid') || 
              medIndication.includes('kích ứng dạ dày') || medIndication.includes('loét dạ dày')) {
            return false;
          }
        }
        
        // Bệnh tim/huyết áp: tránh thuốc ảnh hưởng tim mạch
        if (diseaseLower.includes('tim') || diseaseLower.includes('huyết áp')) {
          if (medIndication.includes('chống chỉ định bệnh tim') || medIndication.includes('tăng huyết áp')) {
            return false;
          }
        }
      }
    }
    
    return true;
  });
}

/**
 * Filter thuốc kháng histamin cho mề đay dựa trên thời gian (cấp hay mạn) và ngứa ban đêm
 * - Mề đay cấp (< 6 tuần) + KHÔNG ngứa nhiều về đêm: CHỈ thế hệ 2
 * - Mề đay cấp (< 6 tuần) + CÓ ngứa nhiều về đêm: Ưu tiên thế hệ 2, có thể gợi ý thế hệ 1
 * - Mề đay mạn (≥ 6 tuần): CHỈ dùng thế hệ 2, không đưa thế hệ 1
 */
function filterAntihistaminesForUrticaria(medicines: any[], duration: 'acute' | 'chronic', hasNightItching: boolean = false): any[] {
  if (!medicines || medicines.length === 0) return medicines;
  
  // Phân loại thuốc theo thế hệ
  const firstGenAntihistamines = ['clorpheniramin', 'chlorpheniramine']; // Thế hệ 1 - gây buồn ngủ
  const secondGenAntihistamines = ['cetirizine', 'loratadine', 'fexofenadine', 'desloratadine', 'levocetirizine']; // Thế hệ 2 - ít gây buồn ngủ
  
  const firstGen: any[] = [];
  const secondGen: any[] = [];
  const others: any[] = [];
  
  medicines.forEach(med => {
    const medName = (med.name || '').toLowerCase();
    const isFirstGen = firstGenAntihistamines.some(drug => medName.includes(drug));
    const isSecondGen = secondGenAntihistamines.some(drug => medName.includes(drug));
    
    if (isFirstGen) {
      firstGen.push(med);
    } else if (isSecondGen) {
      secondGen.push(med);
    } else {
      others.push(med); // Các thuốc khác không phải kháng histamin
    }
  });
  
  // Sắp xếp thế hệ 2 theo thứ tự ưu tiên (có thể thêm logic scoring)
  secondGen.sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    // Ưu tiên Cetirizine, Loratadine, Fexofenadine
    const priority = ['cetirizine', 'loratadine', 'fexofenadine'];
    const aPriority = priority.findIndex(p => aName.includes(p));
    const bPriority = priority.findIndex(p => bName.includes(p));
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return 0;
  });
  
  if (duration === 'chronic') {
    // Mề đay mạn: CHỈ dùng thế hệ 2, không đưa thế hệ 1
    return [...secondGen, ...others].slice(0, 3); // Giới hạn 3 thuốc
  } else {
    // Mề đay cấp
    if (hasNightItching) {
      // Có ngứa nhiều về đêm: Ưu tiên thế hệ 2, có thể gợi ý thế hệ 1
      const limitedFirstGen = firstGen.slice(0, 1);
      return [...secondGen.slice(0, 2), ...others, ...limitedFirstGen].slice(0, 3); // Tối đa 3 thuốc
    } else {
      // KHÔNG ngứa nhiều về đêm: CHỈ thế hệ 2, không đưa thế hệ 1
      return [...secondGen, ...others].slice(0, 3); // Giới hạn 3 thuốc
    }
  }
}

// Detect if current message is a follow-up answer to previous questions
function isFollowUpAnswer(message: string, conversationHistory: ChatMessage[]): boolean {
  const lower = normalizeText(message);
  const indicators = [
    /\b\d{1,2}\s*tuổi\b/,  // "22 tuổi", "30 tuổi"
    /\d{1,2}\s*yo\b/i,      // "22 yo"
    /không\s*dị\s*ứng/,     // "không dị ứng"
    /không\s*dị\s*thuốc/,   // "không dị thuốc"
    /không\s*bệnh\s*nền/,   // "không bệnh nền"
    /không\s*có\s*bệnh/,    // "không có bệnh"
    /mang\s*thai|cho\s*con\s*bú/,  // "mang thai", "cho con bú"
    /không\s*mang\s*thai/,  // "không mang thai"
    /người\s*lớn/,          // "người lớn"
    /trẻ\s*em/              // "trẻ em"
  ];
  const isAnswer = indicators.some(p => p.test(lower));
  if (!isAnswer) return false;

  // Check if last assistant message asked for info (has question mark or asks for info)
  const lastBot = [...conversationHistory].reverse().find(m => m.role === 'assistant');
  if (!lastBot) return false;
  
  const lastBotLower = normalizeText(lastBot.content);
  const isAskingForInfo = 
    lastBot.content.includes('?') ||
    lastBotLower.includes('vui lòng cho biết') ||
    lastBotLower.includes('cần bổ sung') ||
    lastBotLower.includes('bạn vui lòng') ||
    lastBotLower.includes('cho biết thêm');
  
  return isAskingForInfo;
}

// Extract medicine name from query
function extractMedicineNameFromQuery(query: string): string | null {
  const lowerQuery = normalizeText(query);
  
  // Common patterns
  const patterns = [
    /(?:thuốc|sản phẩm)\s+([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+\d+[a-z]+)?)/i,
    /([A-Z][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+\d+[a-z]+)?)/,
    /(?:giá|tồn kho|còn hàng|công dụng|liều dùng|chống chỉ định)\s+(?:của|thuốc)?\s*([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+\d+[a-z]+)?)/i
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// AI response function with hybrid approach: LLM + Rule-based
async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userId?: string
): Promise<string> {
  const lowerMessage = normalizeText(userMessage);

  // ============================================
  // KIỂM TRA NẾU LÀ MESSAGE ĐẦU TIÊN - HỎI THÔNG TIN CÁ NHÂN NGAY
  // ============================================
  // Nếu conversationHistory chỉ có 1 message (chào mừng) hoặc không có, đây là lần đầu tiên
  const isFirstMessage = conversationHistory.length <= 1 || 
    (conversationHistory.length === 1 && conversationHistory[0].role === 'assistant');
  
  // Parse thông tin từ message hiện tại và conversation history
  const patientInfo = parsePatientInfo(userMessage, conversationHistory);
  
  // Nếu là message đầu tiên và chưa có đủ thông tin cá nhân, hỏi ngay
  if (isFirstMessage) {
    const missingInfo = buildMissingInfoQuestions(patientInfo);
    if (missingInfo) {
      // Kiểm tra xem message có phải là chào hỏi không (không phải câu hỏi về thuốc)
      const isGreeting = /^(xin chào|chào|hi|hello|hey|tôi cần|tôi muốn|cho tôi|giúp tôi)/i.test(userMessage.trim());
      const hasMedicalQuery = /(tư vấn|thuốc|bị|đau|sốt|ho|cảm|cúm|tiêu hóa|khó tiêu|đầy bụng)/i.test(userMessage);
      
      // Nếu chỉ là chào hỏi hoặc chưa có câu hỏi y tế cụ thể, hỏi thông tin cá nhân ngay
      if (isGreeting || !hasMedicalQuery) {
        return `Xin chào! Tôi là trợ lý AI của Nhà Thuốc Thông Minh. Tôi có thể giúp bạn tìm thông tin về thuốc, tư vấn sức khỏe, và hỗ trợ mua sắm.\n\n${missingInfo}`;
      }
    }
  }

  // ============================================
  // PHÂN LOẠI INTENT CÂU HỎI
  // ============================================
  const { intent, extractedProductName } = classifyQuestionIntent(userMessage);
  
  // Xử lý các loại câu hỏi khác nhau
  if (intent === 'stock_inquiry') {
    // Câu hỏi về tồn kho
    // Nếu không extract được tên, thử extract lại từ message gốc
    let productName = extractedProductName;
    if (!productName) {
      // Thử extract lại với cách khác
      productName = extractProductNameFromMessage(userMessage);
    }
    
    // Nếu vẫn không extract được, thử tìm trong toàn bộ message
    if (!productName) {
      // Tìm các từ có chữ cái viết hoa (thường là tên sản phẩm)
      const words = userMessage.split(/\s+/);
      const potentialNames: string[] = [];
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[?.,!\-:;,\s]/g, '');
        if (/^[A-ZÀ-ỹ]/.test(word) && word.length > 2) {
          // Lấy từ này và các từ tiếp theo (có thể là tên sản phẩm nhiều từ)
          let name = word;
          let j = i + 1;
          while (j < words.length && 
                 (words[j].match(/^[A-ZÀ-ỹ]/) || words[j].match(/^[a-zà-ỹ]/)) &&
                 !words[j].match(/^(còn|giá|thay|vậy|ạ|nhé|gì|nào|bao|nhiêu|biết|muốn|hỏi)$/i)) {
            name += ' ' + words[j].replace(/[?.,!\-:;,\s]/g, '');
            j++;
          }
          if (name.length >= 3 && name.length < 100) {
            potentialNames.push(name);
          }
        }
      }
      
      // Lấy tên dài nhất (thường là tên sản phẩm đầy đủ)
      if (potentialNames.length > 0) {
        productName = potentialNames.sort((a, b) => b.length - a.length)[0];
      }
    }
    
    if (!productName) {
      return `Để mình kiểm tra tồn kho, bạn vui lòng cho mình biết tên sản phẩm cụ thể nhé.\n\nVí dụ: "Siro ho Ích Nhi còn bao nhiêu?" hoặc "Siro Ích Nhi còn không?"`;
    }
    
    console.log(`[stock_inquiry] Đang tìm sản phẩm: "${productName}"`);
    const productInfo = await queryProductStock(productName);
    
    if (productInfo) {
      // Tạo prompt cho AI với thông tin tồn kho
      const aiService = await import('../services/aiService.js').catch(() => null);
      if (aiService) {
        const context: any = {
          queryType: 'stock_inquiry',
          productInfo: productInfo
        };
        const response = await aiService.generateAIResponseWithGemini({
          userMessage: userMessage,
          conversationHistory: conversationHistory,
          context: context
        });
        if (response) return response;
      }
      
      // Fallback: trả lời trực tiếp
      if (productInfo.inStock && productInfo.stockQuantity > 0) {
        return `Hiện tại nhà thuốc còn ${productInfo.stockQuantity} ${productInfo.unit} ${productInfo.name}.\n\nGiá bán: ${productInfo.price.toLocaleString('vi-VN')}đ/${productInfo.unit}\n\nBạn có muốn mình tư vấn thêm cách sử dụng hoặc sản phẩm thay thế không?`;
      } else {
        return `Hiện tại nhà thuốc đã hết ${productInfo.name}.\n\nMình có thể tìm sản phẩm thay thế phù hợp cho bạn. Bạn có muốn mình tư vấn không?`;
      }
    } else {
      // Thử tìm kiếm gần đúng hơn - tìm các sản phẩm có chứa một phần tên
      const nameWords = productName.split(/\s+/).filter(w => w.length > 2);
      if (nameWords.length > 0) {
        // Tìm sản phẩm có chứa ít nhất 1 từ quan trọng
        const db = mongoose.connection.db;
        if (db) {
          const productsCollection = db.collection('products');
          const medicinesCollection = db.collection('medicines');
          
          const similarProducts = await productsCollection.find({
            $or: nameWords.map(word => ({
              name: { $regex: word, $options: 'i' }
            }))
          }).limit(5).toArray();
          
          if (similarProducts.length > 0) {
            let response = `Mình không tìm thấy sản phẩm "${productName}" trong hệ thống.\n\n`;
            response += `Có thể bạn đang tìm một trong các sản phẩm sau:\n\n`;
            similarProducts.forEach((p, idx) => {
              response += `${idx + 1}. ${p.name}${p.stockQuantity ? ` (Còn ${p.stockQuantity} ${p.unit || 'sản phẩm'})` : ''}\n`;
            });
            response += `\nBạn có thể hỏi lại với tên chính xác hoặc liên hệ dược sĩ để được hỗ trợ.`;
            return response;
          }
        }
      }
      
      return `Xin lỗi, mình không tìm thấy thông tin về sản phẩm "${productName}" trong hệ thống.\n\nBạn có thể:\n- Kiểm tra lại tên sản phẩm\n- Liên hệ trực tiếp với dược sĩ tại quầy để được hỗ trợ tốt hơn`;
    }
  }
  
  if (intent === 'price_inquiry') {
    // Câu hỏi về giá
    let productName = extractedProductName;
    if (!productName) {
      productName = extractProductNameFromMessage(userMessage);
    }
    
    if (!productName) {
      return `Để mình kiểm tra giá, bạn vui lòng cho mình biết tên sản phẩm cụ thể nhé.`;
    }
    
    const productInfo = await queryProductPrice(productName);
    if (productInfo) {
      const aiService = await import('../services/aiService.js').catch(() => null);
      if (aiService) {
        const context: any = {
          queryType: 'price_inquiry',
          productInfo: productInfo
        };
        const response = await aiService.generateAIResponseWithGemini({
          userMessage: userMessage,
          conversationHistory: conversationHistory,
          context: context
        });
        if (response) return response;
      }
      
      // Fallback: trả lời trực tiếp
      let priceText = `Giá bán: ${productInfo.price.toLocaleString('vi-VN')}đ/${productInfo.unit}`;
      if (productInfo.originalPrice && productInfo.originalPrice > productInfo.price) {
        priceText += `\nGiá gốc: ${productInfo.originalPrice.toLocaleString('vi-VN')}đ`;
        if (productInfo.discountPercentage > 0) {
          priceText += `\nGiảm ${productInfo.discountPercentage}%`;
        }
      }
      if (!productInfo.inStock) {
        priceText += `\n\n⚠️ Hiện tại sản phẩm đã hết hàng.`;
      }
      return `${productInfo.name}:\n${priceText}`;
    } else {
      return `Xin lỗi, mình không tìm thấy thông tin giá của sản phẩm "${productName}" trong hệ thống.\n\nBạn có thể mô tả rõ hơn tên sản phẩm hoặc liên hệ trực tiếp với dược sĩ tại quầy.`;
    }
  }
  
  if (intent === 'alternative_inquiry') {
    // Câu hỏi về thuốc thay thế
    let productName = extractedProductName;
    if (!productName) {
      productName = extractProductNameFromMessage(userMessage);
    }
    
    if (!productName) {
      return `Để mình tìm thuốc thay thế, bạn vui lòng cho mình biết tên sản phẩm cụ thể nhé.`;
    }
    
    const alternatives = await queryAlternativeMedicines(productName, 5);
    if (alternatives.length > 0) {
      const aiService = await import('../services/aiService.js').catch(() => null);
      if (aiService) {
        const context: any = {
          queryType: 'alternative_inquiry',
          originalProductName: extractedProductName,
          alternatives: alternatives
        };
        const response = await aiService.generateAIResponseWithGemini({
          userMessage: userMessage,
          conversationHistory: conversationHistory,
          context: context
        });
        if (response) return response;
      }
      
      // Fallback: trả lời trực tiếp
      let response = `Nếu bạn đang tìm sản phẩm thay thế cho "${extractedProductName}", nhà thuốc hiện có các lựa chọn sau:\n\n`;
      alternatives.forEach((alt, idx) => {
        response += `${idx + 1}. **${alt.name}**\n`;
        if (alt.indication || alt.description) {
          response += `   - Tác dụng: ${(alt.indication || alt.description).substring(0, 100)}\n`;
        }
        if (alt.price) {
          response += `   - Giá: ${alt.price.toLocaleString('vi-VN')}đ/${alt.unit || 'sản phẩm'}\n`;
        }
        if (alt.stockQuantity) {
          response += `   - Tồn kho: ${alt.stockQuantity} ${alt.unit || 'sản phẩm'}\n`;
        }
        response += '\n';
      });
      response += `Tùy độ tuổi và tình trạng sức khỏe, mình có thể tư vấn kỹ hơn cho bạn nhé.`;
      return response;
    } else {
      return `Xin lỗi, mình không tìm thấy sản phẩm thay thế phù hợp cho "${productName}" trong kho hiện tại.\n\nBạn có thể liên hệ trực tiếp với dược sĩ tại quầy để được tư vấn cụ thể hơn.`;
    }
  }

  // Detect if this is a follow-up answer to previous safety questions
  const followUpAnswer = isFollowUpAnswer(userMessage, conversationHistory);
  const previousSymptomMessage = followUpAnswer
    ? [...conversationHistory].reverse().find(m =>
        m.role === 'user' &&
        /(cảm|cúm|sốt|ho|sổ mũi|nghẹt mũi|đau họng|nhức đầu|viêm|dị ứng|đau bụng|tiêu chảy)/i.test(m.content)
      )
    : null;

  // Use combined message to retain context when user is only providing follow-up info
  const combinedSymptomMessage = previousSymptomMessage
    ? `${previousSymptomMessage.content}\nThông tin bổ sung: ${userMessage}`
    : userMessage;
  const lowerCombinedMessage = normalizeText(combinedSymptomMessage);
  
  // QUAN TRỌNG: Kiểm tra xem message hiện tại có triệu chứng cụ thể không
  // Nếu có, ưu tiên dùng nó thay vì kết hợp với message cũ (tránh match nhầm)
  const currentMessageHasSpecificSymptom = /(khó tiêu|đầy bụng|đau bụng|tiêu chảy|táo bón|ợ chua|ợ nóng|buồn nôn|nôn|ngứa|mề đay|ho|sổ mũi|nghẹt mũi|đau đầu|sốt|đau họng)/i.test(userMessage);
  
  // Try to use AI LLM first (if configured)
  try {
    // Import AI service dynamically to avoid errors if not installed
    const aiService = await import('../services/aiService.js').catch(() => null);
    
    if (aiService) {
      // Rehydrate context from previous symptom message if this is a follow-up
      let forcedContext: any = {};
      let messageForAI = userMessage; // Default to current message
      
      if (previousSymptomMessage) {
        // This is a follow-up answer - we need to combine symptom + safety info
        const symptomText = previousSymptomMessage.content;
        const safetyInfo = userMessage;
        
        // Create combined message for AI with clear instruction
        // Format: Original symptom + explicit instruction + safety info
        messageForAI = `Người dùng đã mô tả triệu chứng: "${symptomText}"\n\nBây giờ người dùng cung cấp thông tin an toàn: "${safetyInfo}"\n\nBẠN PHẢI tiếp tục tư vấn thuốc dựa trên triệu chứng "${symptomText}" với thông tin an toàn đã có. BẮT ĐẦU bằng "Dưới đây là các thuốc phù hợp với tình trạng của bạn:" và liệt kê cụ thể từng thuốc với format: [Số]. **[Tên thuốc]** - Công dụng: [mô tả] - Liều: [liều dùng]. KHÔNG được trả lời chung chung. KHÔNG được reset hay chào lại.`;
        
        // Get medicines for the symptom
        const meds = await semanticSearch(symptomText);
          if (meds.length > 0) {
            forcedContext.medicines = meds.slice(0, 3);
          
          // Extract symptom keywords from original symptom message
          const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
            normalizeText(symptomText).includes(symptom)
          );
          forcedContext.symptoms = symptomKeywords.length > 0 ? symptomKeywords : ['cảm cúm'];
          forcedContext.userQuery = symptomText;
            forcedContext.isFollowUpAnswer = true;
          // Add explicit instruction to context
          forcedContext.instruction = `Đây là follow-up answer. Người dùng đã cung cấp thông tin an toàn cho triệu chứng "${symptomText}". Bạn PHẢI gợi ý thuốc ngay theo format BẮT BUỘC: Bắt đầu bằng "Dưới đây là các thuốc phù hợp với tình trạng của bạn:" và liệt kê cụ thể từng thuốc với số thứ tự, tên thuốc in đậm, công dụng, liều dùng. KHÔNG được trả lời chung chung như "tham khảo các thuốc như..." hoặc "vui lòng liên hệ dược sĩ". KHÔNG được reset hay chào lại.`;
        }
      }

      // Parse patient info để filter thuốc
      const patientInfo = parsePatientInfo(combinedSymptomMessage, conversationHistory);

      // Get context for AI (medicines, user history, etc.)
      const context: any = { ...forcedContext };
      
      // Thêm thông tin bệnh nhân vào context
      context.patientInfo = {
        age: patientInfo.age,
        ageGroup: patientInfo.ageGroup,
        isPregnant: patientInfo.isPregnant,
        isBreastfeeding: patientInfo.isBreastfeeding,
        isMale: patientInfo.isMale,
        hasDrugAllergy: patientInfo.hasDrugAllergy,
        allergyDrugs: patientInfo.allergyDrugs,
        hasChronicDisease: patientInfo.hasChronicDisease,
        chronicDiseases: patientInfo.chronicDiseases
      };
      
      // Kiểm tra xem có triệu chứng cụ thể không (đặc biệt với "tiêu hóa")
      const hasSpecificSymptom = /(khó tiêu|đầy bụng|đau bụng|tiêu chảy|táo bón|ợ nóng|buồn nôn|nôn)/i.test(lowerCombinedMessage);
      // Kiểm tra xem có phải là câu hỏi chung chung về một loại thuốc không (không có triệu chứng cụ thể)
      const generalMedicineCategories = {
        'tiêu hóa': {
          pattern: /thuốc\s*tiêu\s*hóa|tiêu\s*hóa/i,
          symptoms: ['khó tiêu', 'đầy bụng', 'đau bụng', 'tiêu chảy', 'táo bón', 'ợ nóng', 'buồn nôn', 'nôn', 'đầy hơi', 'chướng bụng'],
          question: 'Để tư vấn thuốc tiêu hóa phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: khó tiêu, đầy bụng, đau bụng, tiêu chảy, táo bón, ợ nóng, buồn nôn...).'
        },
        'kháng dị ứng': {
          pattern: /thuốc\s*kháng\s*dị\s*ứng|thuốc\s*dị\s*ứng|kháng\s*dị\s*ứng/i,
          symptoms: ['ngứa', 'mề đay', 'phát ban', 'hắt hơi', 'sổ mũi', 'nghẹt mũi', 'viêm mũi dị ứng', 'chảy nước mắt', 'đỏ mắt'],
          question: 'Để tư vấn thuốc kháng dị ứng phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: ngứa, nổi mề đay, phát ban, hắt hơi, sổ mũi, nghẹt mũi, viêm mũi dị ứng, chảy nước mắt...).'
        },
        'kháng viêm': {
          pattern: /thuốc\s*kháng\s*viêm|thuốc\s*chống\s*viêm|kháng\s*viêm|chống\s*viêm/i,
          symptoms: ['viêm', 'sưng', 'đau', 'đỏ', 'nóng'],
          question: 'Để tư vấn thuốc kháng viêm phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: viêm khớp, viêm họng, viêm mũi, sưng đau, đỏ nóng...).'
        },
        'thần kinh': {
          pattern: /thuốc\s*thần\s*kinh|thần\s*kinh/i,
          symptoms: ['đau đầu', 'nhức đầu', 'chóng mặt', 'hoa mắt', 'migraine', 'đau nửa đầu'],
          question: 'Để tư vấn thuốc thần kinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: đau đầu, nhức đầu, chóng mặt, hoa mắt, migraine, đau nửa đầu...).'
        },
        'cơ xương khớp': {
          pattern: /thuốc\s*cơ\s*xương\s*khớp|thuốc\s*xương\s*khớp|cơ\s*xương\s*khớp|xương\s*khớp/i,
          symptoms: ['đau khớp', 'viêm khớp', 'đau cơ', 'cứng khớp', 'sưng khớp'],
          question: 'Để tư vấn thuốc cơ xương khớp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: đau khớp, viêm khớp, đau cơ, cứng khớp, sưng khớp...).'
        },
        'tim mạch': {
          pattern: /thuốc\s*tim\s*mạch|thuốc\s*huyết\s*áp|tim\s*mạch|huyết\s*áp/i,
          symptoms: ['tăng huyết áp', 'hạ huyết áp', 'đau ngực', 'nhịp tim nhanh', 'nhịp tim chậm', 'hồi hộp'],
          question: 'Để tư vấn thuốc tim mạch/huyết áp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: tăng huyết áp, hạ huyết áp, đau ngực, nhịp tim nhanh/chậm, hồi hộp...).'
        },
        'giảm đau': {
          pattern: /thuốc\s*giảm\s*đau|giảm\s*đau|thuốc\s*hạ\s*sốt|hạ\s*sốt/i,
          symptoms: ['đau', 'sốt', 'đau đầu', 'đau cơ', 'đau khớp', 'đau răng'],
          question: 'Để tư vấn thuốc giảm đau/hạ sốt phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: đau đầu, đau cơ, đau khớp, đau răng, sốt, sốt cao...).'
        },
        'kháng sinh': {
          pattern: /thuốc\s*kháng\s*sinh|kháng\s*sinh/i,
          symptoms: ['nhiễm khuẩn', 'viêm nhiễm', 'sốt', 'mủ', 'đau họng', 'ho có đờm'],
          question: 'Để tư vấn thuốc kháng sinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: nhiễm khuẩn, viêm nhiễm, sốt, có mủ, đau họng, ho có đờm...). Lưu ý: Thuốc kháng sinh cần có chỉ định của bác sĩ.'
        },
        'tiêu hóa cho trẻ': {
          pattern: /thuốc\s*tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*trẻ\s*em/i,
          symptoms: ['khó tiêu', 'đầy bụng', 'đau bụng', 'tiêu chảy', 'táo bón', 'nôn', 'trớ'],
          question: 'Để tư vấn thuốc tiêu hóa cho trẻ phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng trẻ đang gặp phải (ví dụ: khó tiêu, đầy bụng, đau bụng, tiêu chảy, táo bón, nôn, trớ...). Và vui lòng cho biết tuổi và cân nặng của trẻ.'
        },
        'mắt tai mũi': {
          pattern: /thuốc\s*mắt|thuốc\s*tai|thuốc\s*mũi|mắt|tai|mũi/i,
          symptoms: ['đau mắt', 'đỏ mắt', 'chảy nước mắt', 'đau tai', 'ù tai', 'nghẹt mũi', 'sổ mũi', 'viêm mũi'],
          question: 'Để tư vấn thuốc mắt/tai/mũi phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải (ví dụ: đau mắt, đỏ mắt, chảy nước mắt, đau tai, ù tai, nghẹt mũi, sổ mũi, viêm mũi...).'
        }
      };
      
      // Kiểm tra từng loại thuốc
      let generalMedicineCategory: string | null = null;
      for (const [category, config] of Object.entries(generalMedicineCategories)) {
        if (config.pattern.test(lowerCombinedMessage)) {
          // Kiểm tra xem có triệu chứng cụ thể không
          const hasSpecificSymptomForCategory = config.symptoms.some(symptom => 
            lowerCombinedMessage.includes(symptom.toLowerCase())
          );
          if (!hasSpecificSymptomForCategory) {
            generalMedicineCategory = category;
            break;
          }
        }
      }
      
      // Đặc biệt: Kiểm tra thuốc ức chế tiết acid (PPI/H2) - cần hỏi kỹ về triệu chứng TRƯỚC KHI tư vấn
      const hasPPI_H2Symptoms = /(đau dạ dày nhiều|đau thượng vị kéo dài|trào ngược thường xuyên|ợ chua kéo dài|đau tăng về đêm|tiền sử viêm loét dạ dày)/i.test(lowerCombinedMessage);
      if (hasPPI_H2Symptoms && patientInfo.hasAge) {
        // Kiểm tra xem đã có thông tin chi tiết chưa (kéo dài, thường xuyên, nhiều, tiền sử)
        const hasDetailedInfo = /(kéo dài|thường xuyên|nhiều|nhiều ngày|nhiều tuần|nhiều tháng|tăng về đêm|tiền sử|viêm loét)/i.test(lowerCombinedMessage);
        if (!hasDetailedInfo) {
          context.instruction = `Người dùng đã cung cấp thông tin an toàn và có triệu chứng liên quan đến thuốc ức chế tiết acid (PPI/H2), nhưng chưa có thông tin chi tiết. Bạn PHẢI hỏi lại về thời gian, tần suất, và tiền sử trước khi tư vấn thuốc. Hãy hỏi: "Để tư vấn thuốc phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn:\n\n1. Bạn bị đau dạ dày/ợ chua đã bao lâu rồi? (mới bị hay kéo dài)\n2. Tần suất xuất hiện như thế nào? (thỉnh thoảng hay thường xuyên)\n3. Có đau tăng về đêm không?\n4. Bạn có tiền sử viêm loét dạ dày không?\n\n⚠️ Lưu ý: Thuốc ức chế tiết acid (PPI/H2) cần được tư vấn cẩn thận và dùng theo đợt."\n\nKHÔNG được đưa thuốc PPI/H2 ngay khi chưa có thông tin chi tiết.`;
          context.queryType = 'symptom_clarification_needed';
        }
      }
      
      // Đặc biệt: Kiểm tra tiêu chảy - cần hỏi số lần đi/ngày và có sốt/máu không
      const hasDiarrhea = /(tiêu chảy|đi ngoài phân lỏng|đi ngoài nhiều lần|đau bụng kèm tiêu chảy)/i.test(lowerCombinedMessage);
      if (hasDiarrhea && patientInfo.hasAge) {
        // Kiểm tra xem đã có thông tin về số lần đi/ngày và sốt/máu chưa
        const hasFrequencyInfo = /(\d+\s*lần|\d+\s*lần\/ngày|nhiều lần|ít lần|vài lần)/i.test(lowerCombinedMessage);
        const hasFeverOrBloodInfo = /(sốt|máu|phân có máu|đi ngoài ra máu|không sốt|không có máu)/i.test(lowerCombinedMessage);
        
        if (!hasFrequencyInfo || !hasFeverOrBloodInfo) {
          context.instruction = `Người dùng đã cung cấp thông tin an toàn và có triệu chứng "tiêu chảy", nhưng chưa có thông tin về số lần đi/ngày hoặc có sốt/máu. Bạn PHẢI hỏi lại trước khi tư vấn thuốc. Hãy hỏi: "Để tư vấn thuốc chống tiêu chảy phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn:\n\n1. Bạn đi ngoài bao nhiêu lần trong ngày?\n2. Có sốt không?\n3. Phân có máu không?\n\n⚠️ Lưu ý: Nếu tiêu chảy > 2 ngày hoặc có máu trong phân, bạn nên đi khám bác sĩ ngay."\n\nKHÔNG được đưa thuốc ngay khi chưa có thông tin này.`;
          context.queryType = 'symptom_clarification_needed';
        }
      }
      
      // Đặc biệt: Kiểm tra mề đay - cần hỏi thêm về thời gian (cấp hay mạn)
      const hasUrticaria = /(mề đay|me day|nổi mề đay|noi me day|urticaria)/i.test(lowerCombinedMessage);
      let urticariaDuration: 'acute' | 'chronic' | null = null;
      let hasUrticariaDurationInfo = false;
      
      if (hasUrticaria) {
        // Kiểm tra xem đã có thông tin về thời gian chưa
        const durationPatterns = {
          acute: /(dưới|dưới 6|ít hơn 6|mới|mới bị|vài ngày|vài tuần|1 tuần|2 tuần|3 tuần|4 tuần|5 tuần|dưới 1 tháng|dưới 2 tháng|cấp|cấp tính)/i,
          chronic: /(trên|trên 6|hơn 6|hơn 6 tuần|trên 6 tuần|nhiều hơn 6|6 tuần|7 tuần|8 tuần|2 tháng|3 tháng|nhiều tháng|mạn|mạn tính|kéo dài|lâu rồi)/i
        };
        
        if (durationPatterns.chronic.test(lowerCombinedMessage)) {
          urticariaDuration = 'chronic';
          hasUrticariaDurationInfo = true;
        } else if (durationPatterns.acute.test(lowerCombinedMessage)) {
          urticariaDuration = 'acute';
          hasUrticariaDurationInfo = true;
        }
        
        // Nếu chưa có thông tin về thời gian, hỏi lại
        if (!hasUrticariaDurationInfo && patientInfo.hasAge) {
          context.instruction = `Người dùng đã cung cấp thông tin an toàn và nói về triệu chứng "mề đay" hoặc "nổi mề đay", nhưng chưa có thông tin về thời gian bị mề đay. Bạn PHẢI hỏi lại về thời gian trước khi tư vấn thuốc. Hãy hỏi một cách tự nhiên: "Mình hỏi thêm một chút để tư vấn chính xác hơn nhé:\n\n1. Bạn bị nổi mề đay đã bao lâu rồi? (dưới hay trên 6 tuần)\n2. Các nốt mề đay có xuất hiện nhiều vào ban đêm không?"\n\nKHÔNG được đưa thuốc ngay khi chưa có thông tin về thời gian.`;
          context.queryType = 'symptom_clarification_needed';
          context.urticariaInfo = { needsDuration: true };
        } else if (hasUrticariaDurationInfo) {
          // Đã có thông tin về thời gian, lưu vào context
          context.urticariaInfo = { 
            duration: urticariaDuration,
            needsDuration: false 
          };
        }
      }
      
      // Nếu chỉ hỏi chung chung về một loại thuốc mà không có triệu chứng cụ thể, thêm instruction để AI hỏi lại
      if (generalMedicineCategory && patientInfo.hasAge && !hasUrticaria) {
        const categoryConfig = generalMedicineCategories[generalMedicineCategory as keyof typeof generalMedicineCategories];
        
        // QUAN TRỌNG: Sử dụng câu hỏi chi tiết cho "tiêu hóa" và "kháng dị ứng" thay vì câu hỏi đơn giản
        let detailedQuestion = categoryConfig.question;
        if (generalMedicineCategory === 'tiêu hóa') {
          detailedQuestion = 'Để tư vấn thuốc tiêu hóa phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n🔹 Men tiêu hóa:\n- Ăn không tiêu\n- Đầy bụng / Chướng bụng\n- Khó tiêu\n- Đi ngoài phân sống\n- Rối loạn tiêu hóa nhẹ\n- Trẻ em ăn uống kém\n\n🔹 Thuốc chống tiêu chảy:\n- Tiêu chảy\n- Đi ngoài phân lỏng\n- Đi ngoài nhiều lần trong ngày\n- Đau bụng kèm tiêu chảy\n\n🔹 Thuốc kháng acid:\n- Ợ chua / Ợ nóng\n- Nóng rát vùng thượng vị\n- Đau dạ dày nhẹ\n- Khó tiêu do tăng acid\n- Trào ngược nhẹ sau ăn\n\n🔹 Thuốc nhuận tràng:\n- Táo bón\n- Đi cầu khó\n- Phân cứng\n- Đi ngoài < 3 lần/tuần\n\n🔹 Thuốc ức chế tiết acid (PPI/H2):\n- Đau dạ dày nhiều / Đau thượng vị kéo dài\n- Trào ngược thường xuyên\n- Ợ chua kéo dài\n- Đau tăng về đêm\n\nBạn có thể mô tả triệu chứng của mình để tôi tư vấn chính xác hơn.';
        } else if (generalMedicineCategory === 'kháng dị ứng') {
          detailedQuestion = 'Để tư vấn thuốc kháng dị ứng phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n🔹 Dị ứng da:\n- Ngứa da\n- Nổi mề đay\n- Phát ban dị ứng\n- Mẩn đỏ da\n- Dị ứng da do thức ăn\n- Dị ứng da do côn trùng đốt\n\n🔹 Dị ứng đường hô hấp:\n- Hắt hơi nhiều\n- Sổ mũi trong\n- Nghẹt mũi\n- Ngứa mũi\n- Chảy nước mắt\n- Đỏ mắt\n- Viêm mũi dị ứng theo mùa\n\n🔹 Ngứa khu trú/tại chỗ:\n- Ngứa da tại chỗ\n- Ngứa do côn trùng đốt\n- Ngứa da nhẹ, không nổi mề đay\n- Viêm da dị ứng nhẹ\n- Dị ứng mỹ phẩm\n\nBạn có thể mô tả triệu chứng của mình để tôi tư vấn chính xác hơn.';
        }
        
        context.instruction = `Người dùng đã cung cấp thông tin an toàn nhưng chỉ hỏi chung chung về "${generalMedicineCategory}" mà chưa có triệu chứng cụ thể. Bạn PHẢI hỏi lại triệu chứng cụ thể trước khi tư vấn thuốc. Hãy hỏi CHÍNH XÁC như sau:\n\n${detailedQuestion}\n\nKHÔNG được tự ý thay đổi nội dung câu hỏi.`;
        context.queryType = 'symptom_clarification_needed';
      }
      
      // If not already set (not a follow-up), try to get relevant medicines for context
      if (!context.medicines || context.medicines.length === 0) {
      // QUAN TRỌNG: Nếu message hiện tại có triệu chứng cụ thể, chỉ dùng nó để search (tránh match nhầm với message cũ)
      const messageToSearch = currentMessageHasSpecificSymptom ? userMessage : combinedSymptomMessage;
      const lowerMessageToSearch = normalizeText(messageToSearch);
      
      const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
          lowerMessageToSearch.includes(symptom)
      );
      // Kiểm tra lại xem có phải là câu hỏi chung chung không
      const isGeneralMedicineQuery = generalMedicineCategory !== null;
      
      if (symptomKeywords.length > 0 && !isGeneralMedicineQuery) {
        // QUAN TRỌNG: Tìm thuốc trong database TRƯỚC, rồi mới lọc
        // Use semanticSearch which already has filtering logic
        const suggestedMedicines = await semanticSearch(messageToSearch);
        
        if (suggestedMedicines.length > 0) {
          console.log(`[generateAIResponse] ✅ Tìm thấy ${suggestedMedicines.length} thuốc từ DB: ${suggestedMedicines.map(m => m.name).join(', ')}`);
          
          // Filter thuốc theo điều kiện bệnh nhân
          const filteredMedicines = filterMedicinesByPatientInfo(suggestedMedicines, patientInfo);
          
          if (filteredMedicines.length > 0) {
            console.log(`[generateAIResponse] ✅ Sau khi filter theo patientInfo: ${filteredMedicines.length} thuốc: ${filteredMedicines.map(m => m.name).join(', ')}`);
            
            // QUAN TRỌNG: Chỉ truyền thuốc đã được filter, đảm bảo không có thuốc không liên quan
            // Giới hạn tối đa 3 thuốc để tránh dài dòng
            context.medicines = filteredMedicines.slice(0, 3);
            context.symptoms = symptomKeywords;
            // Add explicit instruction about what medicines to suggest
            context.queryType = 'symptom_based';
            context.userQuery = userMessage;
          } else {
            console.log(`[generateAIResponse] ⚠️ Sau khi filter theo patientInfo: 0 thuốc, nhưng vẫn truyền ${suggestedMedicines.length} thuốc gốc để AI có thể dùng`);
            // Nếu filter quá strict, vẫn truyền thuốc gốc (để AI có thể dùng, nhưng sẽ có instruction rõ ràng)
            context.medicines = suggestedMedicines.slice(0, 3);
            context.symptoms = symptomKeywords;
            context.queryType = 'symptom_based';
            context.userQuery = userMessage;
          }
        } else {
          console.log(`[generateAIResponse] ❌ KHÔNG tìm thấy thuốc nào từ DB cho query: "${messageToSearch}"`);
          // QUAN TRỌNG: Nếu không tìm thấy thuốc trong DB, KHÔNG truyền medicines vào context
          // Để AI biết là không có thuốc và phải nói rõ
          context.medicines = [];
          context.symptoms = symptomKeywords;
          context.queryType = 'symptom_based';
          context.userQuery = userMessage;
        }
      }
      } else if (context.medicines && context.medicines.length > 0) {
        // Filter thuốc đã có trong context
        context.medicines = filterMedicinesByPatientInfo(context.medicines, patientInfo);
      }
      
      // Get user purchase history if available
      if (userId) {
        const purchaseHistory = await getUserPurchaseHistory(userId);
        if (purchaseHistory.length > 0) {
          context.userHistory = purchaseHistory.slice(0, 5);
        }
      }
      
      // Try Google Gemini first (free tier, good for Vietnamese)
      // QUAN TRỌNG: Use messageForAI (combined message for follow-up) instead of just userMessage
      console.log('🔄 Attempting to use Gemini AI...');
      const geminiResponse = await aiService.generateAIResponseWithGemini({
        userMessage: messageForAI,
        conversationHistory,
        context
      });
      
      if (geminiResponse) {
        console.log('✅ Gemini AI response received, length:', geminiResponse.length);
        // Check if response is a default/generic message (AI reset) - only fallback if really needed
        const lowerResponse = geminiResponse.toLowerCase();
        // More strict check: must have multiple default keywords AND be a follow-up answer
        const hasMultipleDefaultKeywords = 
          (lowerResponse.includes('tôi có thể giúp bạn') && lowerResponse.includes('bạn có thể hỏi tôi')) ||
          (lowerResponse.includes('tìm kiếm thông tin') && lowerResponse.includes('tư vấn thông tin') && lowerResponse.includes('gợi ý thuốc'));
        
        // Only fallback if: it's clearly a default message AND we have strong context (medicines or follow-up)
        const shouldFallback = hasMultipleDefaultKeywords && 
                               previousSymptomMessage && 
                               context.medicines?.length > 0;
        
        if (shouldFallback) {
          console.log('⚠️ AI returned default message despite having context, falling back to rule-based system');
          // Don't return, continue to rule-based
        } else {
          // Accept AI response even if it might be slightly generic, as long as it's not clearly reset
        return geminiResponse;
        }
      }
      
      // Try OpenAI as fallback (if configured)
      const aiResponse = await aiService.generateAIResponseWithLLM({
        userMessage: messageForAI,
        conversationHistory,
        context
      });
      
      if (aiResponse) {
        // Same logic as Gemini
        const lowerResponse = aiResponse.toLowerCase();
        const hasMultipleDefaultKeywords = 
          (lowerResponse.includes('tôi có thể giúp bạn') && lowerResponse.includes('bạn có thể hỏi tôi')) ||
          (lowerResponse.includes('tìm kiếm thông tin') && lowerResponse.includes('tư vấn thông tin') && lowerResponse.includes('gợi ý thuốc'));
        
        const shouldFallback = hasMultipleDefaultKeywords && 
                               previousSymptomMessage && 
                               context.medicines?.length > 0;
        
        if (shouldFallback) {
          console.log('⚠️ AI returned default message despite having context, falling back to rule-based system');
          // Don't return, continue to rule-based
        } else {
        return aiResponse;
        }
      }
      
      // Try Ollama (local LLM) as last fallback
      const ollamaResponse = await aiService.generateAIResponseWithOllama({
        userMessage: messageForAI,
        conversationHistory,
        context
      });
      
      if (ollamaResponse) {
        // Same logic - be more lenient
        const lowerResponse = ollamaResponse.toLowerCase();
        const hasMultipleDefaultKeywords = 
          (lowerResponse.includes('tôi có thể giúp bạn') && lowerResponse.includes('bạn có thể hỏi tôi')) ||
          (lowerResponse.includes('tìm kiếm thông tin') && lowerResponse.includes('tư vấn thông tin') && lowerResponse.includes('gợi ý thuốc'));
        
        const shouldFallback = hasMultipleDefaultKeywords && 
                               previousSymptomMessage && 
                               context.medicines?.length > 0;
        
        if (shouldFallback) {
          console.log('⚠️ AI returned default message despite having context, falling back to rule-based system');
          // Don't return, continue to rule-based
        } else {
        return ollamaResponse;
        }
      }
    }
  } catch (error) {
    console.log('AI service not available, using rule-based system:', error);
    // Continue with rule-based system
  }
  
  // Fallback to rule-based system (current implementation)
  
  // 0. Check for safety warnings first (highest priority)
  const safetyWarning = checkSafetyWarnings(userMessage);
  if (safetyWarning) {
    return safetyWarning;
  }

  // 0.5. Check for vague symptoms - must ask for clarification
  const vagueSymptoms = ['mệt', 'nhức người', 'khó chịu', 'người không ổn', 'mệt mỏi'];
  const hasVagueSymptom = vagueSymptoms.some(symptom => lowerMessage.includes(symptom));
  const hasSpecificSymptom = /(cảm|cúm|sốt|ho|sổ mũi|nghẹt mũi|đau họng|nhức đầu|đau đầu|viêm|dị ứng|đau bụng|tiêu chảy|đờm)/i.test(lowerMessage);
  
  // If only vague symptoms without specific ones, ask for clarification
  if (hasVagueSymptom && !hasSpecificSymptom) {
    return "Để tư vấn thuốc phù hợp, bạn vui lòng cho tôi biết thêm triệu chứng cụ thể:\n\nBạn có sốt, đau đầu, nghẹt mũi, ho, đau họng hay triệu chứng nào khác không?";
  }

  // Check if this is a follow-up answer to safety questions
  const isFollowUp = isFollowUpAnswer(userMessage, conversationHistory);
  const hasSymptomInHistory = 
    conversationHistory.some(m => 
      m.role === 'user' && 
      /(cảm|cúm|sốt|ho|sổ mũi|nghẹt mũi|đau họng|nhức đầu|viêm|dị ứng|đau bụng|tiêu chảy|đờm)/i.test(m.content)
    ) ||
    /(cảm|cúm|sốt|ho|sổ mũi|nghẹt mũi|đau họng|nhức đầu|viêm|dị ứng|đau bụng|tiêu chảy|đờm)/i.test(combinedSymptomMessage);

  // Collect patient info before suggesting common cold/flu medicines
  const hasSymptomKeyword =
    lowerCombinedMessage.includes('cảm') || lowerCombinedMessage.includes('cúm') || lowerCombinedMessage.includes('ho') ||
    lowerCombinedMessage.includes('sổ mũi') || lowerCombinedMessage.includes('nghẹt mũi') ||
    lowerCombinedMessage.includes('đau họng') || lowerCombinedMessage.includes('nhức đầu') ||
    lowerCombinedMessage.includes('sốt') || lowerCombinedMessage.includes('đờm');

  // QUAN TRỌNG: Kiểm tra xem có phải follow-up answer với đủ thông tin không
  // Cải thiện detection: check cả message hiện tại và conversation history
  const parsed = parsePatientInfo(combinedSymptomMessage, conversationHistory);
  const hasAllInfo = parsed.hasAge && (parsed.hasPregnancyInfo || parsed.hasDrugAllergyInfo || parsed.hasChronicInfo);
  
  console.log('🔍 Rule-based check:', {
    isFollowUp,
    hasAllInfo,
    hasSymptomInHistory,
    parsed: {
      hasAge: parsed.hasAge,
      hasPregnancyInfo: parsed.hasPregnancyInfo,
      hasDrugAllergyInfo: parsed.hasDrugAllergyInfo,
      hasChronicInfo: parsed.hasChronicInfo
    }
  });
  
  // QUAN TRỌNG: Ưu tiên suggest medicines khi có đủ thông tin và có symptom
  // If this is a follow-up answer and we have symptom in history, proceed to suggest medicines
  const shouldSuggestMedicines = (isFollowUp || hasAllInfo) && hasSymptomInHistory && !lowerMessage.includes('liều') && !lowerMessage.includes('giá') && !lowerMessage.includes('tồn kho');
  
  console.log('🔍 Should suggest medicines?', {
    shouldSuggestMedicines,
    condition1: (isFollowUp || hasAllInfo),
    condition2: hasSymptomInHistory,
    condition3: !lowerMessage.includes('liều') && !lowerMessage.includes('giá') && !lowerMessage.includes('tồn kho'),
    lowerMessage: lowerMessage.substring(0, 50),
    'isFollowUp': isFollowUp,
    'hasAllInfo': hasAllInfo,
    'hasSymptomInHistory': hasSymptomInHistory
  });
  
  console.log('📍 About to check shouldSuggestMedicines, value:', shouldSuggestMedicines);
  
  if (shouldSuggestMedicines) {
    // Parse patient info from entire conversation history
    // If we have age info (required), proceed to suggest medicines
    if (parsed.hasAge) {
      // QUAN TRỌNG: Kiểm tra xem có phải là câu hỏi chung chung về một loại thuốc không TRƯỚC KHI tìm thuốc
      const generalMedicineCategoriesRuleBased = {
        'tiêu hóa': {
          pattern: /thuốc\s*tiêu\s*hóa|tiêu\s*hóa/i,
          symptoms: [
            // NHÓM A - Men tiêu hóa
            'ăn không tiêu', 'đầy bụng', 'chướng bụng', 'khó tiêu', 'đi ngoài phân sống', 'rối loạn tiêu hóa nhẹ', 'trẻ em ăn uống kém',
            // NHÓM B - Thuốc chống tiêu chảy
            'tiêu chảy', 'đi ngoài phân lỏng', 'đi ngoài nhiều lần', 'đau bụng kèm tiêu chảy',
            // NHÓM C - Thuốc kháng acid
            'ợ chua', 'ợ nóng', 'nóng rát vùng thượng vị', 'đau dạ dày nhẹ', 'khó tiêu do tăng acid', 'trào ngược nhẹ',
            // NHÓM D - Thuốc nhuận tràng
            'táo bón', 'đi cầu khó', 'phân cứng', 'đi ngoài ít hơn 3 lần/tuần',
            // NHÓM E - Thuốc ức chế tiết acid (PPI/H2)
            'đau dạ dày nhiều', 'đau thượng vị kéo dài', 'trào ngược thường xuyên', 'ợ chua kéo dài', 'đau tăng về đêm',
            // Các triệu chứng cũ (để tương thích)
            'đau bụng', 'buồn nôn', 'nôn', 'đầy hơi'
          ]
        },
        'kháng dị ứng': {
          pattern: /thuốc\s*kháng\s*dị\s*ứng|thuốc\s*dị\s*ứng|kháng\s*dị\s*ứng/i,
          symptoms: ['ngứa', 'mề đay', 'phát ban', 'hắt hơi', 'sổ mũi', 'nghẹt mũi', 'viêm mũi dị ứng', 'chảy nước mắt', 'đỏ mắt']
        },
        'kháng viêm': {
          pattern: /thuốc\s*kháng\s*viêm|thuốc\s*chống\s*viêm|kháng\s*viêm|chống\s*viêm/i,
          symptoms: ['viêm', 'sưng', 'đau', 'đỏ', 'nóng']
        },
        'thần kinh': {
          pattern: /thuốc\s*thần\s*kinh|thần\s*kinh/i,
          symptoms: ['đau đầu', 'nhức đầu', 'chóng mặt', 'hoa mắt', 'migraine', 'đau nửa đầu']
        },
        'cơ xương khớp': {
          pattern: /thuốc\s*cơ\s*xương\s*khớp|thuốc\s*xương\s*khớp|cơ\s*xương\s*khớp|xương\s*khớp/i,
          symptoms: ['đau khớp', 'viêm khớp', 'đau cơ', 'cứng khớp', 'sưng khớp']
        },
        'tim mạch': {
          pattern: /thuốc\s*tim\s*mạch|thuốc\s*huyết\s*áp|tim\s*mạch|huyết\s*áp/i,
          symptoms: ['tăng huyết áp', 'hạ huyết áp', 'đau ngực', 'nhịp tim nhanh', 'nhịp tim chậm', 'hồi hộp']
        },
        'giảm đau': {
          pattern: /thuốc\s*giảm\s*đau|giảm\s*đau|thuốc\s*hạ\s*sốt|hạ\s*sốt/i,
          symptoms: ['đau', 'sốt', 'đau đầu', 'đau cơ', 'đau khớp', 'đau răng']
        },
        'kháng sinh': {
          pattern: /thuốc\s*kháng\s*sinh|kháng\s*sinh/i,
          symptoms: ['nhiễm khuẩn', 'viêm nhiễm', 'sốt', 'mủ', 'đau họng', 'ho có đờm']
        },
        'tiêu hóa cho trẻ': {
          pattern: /thuốc\s*tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*trẻ\s*em/i,
          symptoms: ['khó tiêu', 'đầy bụng', 'đau bụng', 'tiêu chảy', 'táo bón', 'nôn', 'trớ']
        },
        'mắt tai mũi': {
          pattern: /thuốc\s*mắt|thuốc\s*tai|thuốc\s*mũi|mắt|tai|mũi/i,
          symptoms: ['đau mắt', 'đỏ mắt', 'chảy nước mắt', 'đau tai', 'ù tai', 'nghẹt mũi', 'sổ mũi', 'viêm mũi']
        }
      };
      
      let generalMedicineCategoryRuleBased: string | null = null;
      for (const [category, config] of Object.entries(generalMedicineCategoriesRuleBased)) {
        if (config.pattern.test(lowerCombinedMessage)) {
          // QUAN TRỌNG: Loại bỏ các từ trong tên loại thuốc khi kiểm tra triệu chứng
          // Ví dụ: "dị ứng" trong "thuốc kháng dị ứng" không phải là triệu chứng cụ thể
          const messageWithoutMedicineName = lowerCombinedMessage.replace(config.pattern, ' ').trim();
          const hasSpecificSymptomForCategory = config.symptoms.some(symptom => 
            messageWithoutMedicineName.includes(symptom.toLowerCase())
          );
          if (!hasSpecificSymptomForCategory) {
            generalMedicineCategoryRuleBased = category;
            break;
          }
        }
      }
      
      // Nếu chỉ hỏi chung chung về một loại thuốc mà không có triệu chứng cụ thể, hỏi lại triệu chứng
      if (generalMedicineCategoryRuleBased) {
        let clarificationQuestion = '';
        
        switch (generalMedicineCategoryRuleBased) {
          case 'tiêu hóa':
            clarificationQuestion = 'Để tư vấn thuốc tiêu hóa phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n🔹 Men tiêu hóa:\n- Ăn không tiêu\n- Đầy bụng / Chướng bụng\n- Khó tiêu\n- Đi ngoài phân sống\n- Rối loạn tiêu hóa nhẹ\n- Trẻ em ăn uống kém\n\n🔹 Thuốc chống tiêu chảy:\n- Tiêu chảy\n- Đi ngoài phân lỏng\n- Đi ngoài nhiều lần trong ngày\n- Đau bụng kèm tiêu chảy\n\n🔹 Thuốc kháng acid:\n- Ợ chua / Ợ nóng\n- Nóng rát vùng thượng vị\n- Đau dạ dày nhẹ\n- Khó tiêu do tăng acid\n- Trào ngược nhẹ sau ăn\n\n🔹 Thuốc nhuận tràng:\n- Táo bón\n- Đi cầu khó\n- Phân cứng\n- Đi ngoài < 3 lần/tuần\n\n🔹 Thuốc ức chế tiết acid (PPI/H2):\n- Đau dạ dày nhiều / Đau thượng vị kéo dài\n- Trào ngược thường xuyên\n- Ợ chua kéo dài\n- Đau tăng về đêm\n\nBạn có thể mô tả triệu chứng của mình để tôi tư vấn chính xác hơn.';
            break;
          case 'kháng dị ứng':
            clarificationQuestion = 'Để tư vấn thuốc kháng dị ứng phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n🔹 Dị ứng da:\n- Ngứa da\n- Nổi mề đay\n- Phát ban dị ứng\n- Mẩn đỏ da\n- Dị ứng da do thức ăn\n- Dị ứng da do côn trùng đốt\n\n🔹 Dị ứng đường hô hấp:\n- Hắt hơi nhiều\n- Sổ mũi trong\n- Nghẹt mũi\n- Ngứa mũi\n- Chảy nước mắt\n- Đỏ mắt\n- Viêm mũi dị ứng theo mùa\n\n🔹 Ngứa khu trú/tại chỗ:\n- Ngứa da tại chỗ\n- Ngứa do côn trùng đốt\n- Ngứa da nhẹ, không nổi mề đay\n- Viêm da dị ứng nhẹ\n- Dị ứng mỹ phẩm\n\nBạn có thể mô tả triệu chứng của mình để tôi tư vấn chính xác hơn.';
            break;
          case 'kháng viêm':
            clarificationQuestion = 'Để tư vấn thuốc kháng viêm phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Viêm khớp\n- Viêm họng\n- Viêm mũi\n- Sưng đau\n- Đỏ nóng\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          case 'thần kinh':
            clarificationQuestion = 'Để tư vấn thuốc thần kinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau đầu\n- Nhức đầu\n- Chóng mặt\n- Hoa mắt\n- Migraine / Đau nửa đầu\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          case 'cơ xương khớp':
            clarificationQuestion = 'Để tư vấn thuốc cơ xương khớp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau khớp\n- Viêm khớp\n- Đau cơ\n- Cứng khớp\n- Sưng khớp\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          case 'tim mạch':
            clarificationQuestion = 'Để tư vấn thuốc tim mạch/huyết áp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Tăng huyết áp\n- Hạ huyết áp\n- Đau ngực\n- Nhịp tim nhanh/chậm\n- Hồi hộp\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          case 'giảm đau':
            clarificationQuestion = 'Để tư vấn thuốc giảm đau/hạ sốt phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau đầu\n- Đau cơ\n- Đau khớp\n- Đau răng\n- Sốt\n- Sốt cao\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          case 'kháng sinh':
            clarificationQuestion = 'Để tư vấn thuốc kháng sinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Nhiễm khuẩn\n- Viêm nhiễm\n- Sốt\n- Có mủ\n- Đau họng\n- Ho có đờm\n\n⚠️ Lưu ý: Thuốc kháng sinh cần có chỉ định của bác sĩ.';
            break;
          case 'tiêu hóa cho trẻ':
            clarificationQuestion = 'Để tư vấn thuốc tiêu hóa cho trẻ phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng trẻ đang gặp phải:\n\n- Khó tiêu\n- Đầy bụng\n- Đau bụng\n- Tiêu chảy\n- Táo bón\n- Nôn / Trớ\n\nVà vui lòng cho biết tuổi và cân nặng của trẻ.';
            break;
          case 'mắt tai mũi':
            clarificationQuestion = 'Để tư vấn thuốc mắt/tai/mũi phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau mắt / Đỏ mắt / Chảy nước mắt\n- Đau tai / Ù tai\n- Nghẹt mũi / Sổ mũi / Viêm mũi\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
            break;
          default:
            clarificationQuestion = 'Để tư vấn thuốc phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải.';
        }
        
        console.log('⚠️ Rule-based: General medicine category detected, asking for specific symptoms:', generalMedicineCategoryRuleBased);
        return clarificationQuestion;
      }
      
      // QUAN TRỌNG: Kiểm tra tiêu chảy - cần hỏi số lần đi/ngày và có sốt/máu không TRƯỚC KHI tư vấn
      const hasDiarrhea = /(tiêu chảy|đi ngoài phân lỏng|đi ngoài nhiều lần|đau bụng kèm tiêu chảy)/i.test(lowerCombinedMessage);
      if (hasDiarrhea) {
        // Kiểm tra xem đã có thông tin về số lần đi/ngày và sốt/máu chưa
        const hasFrequencyInfo = /(\d+\s*lần|\d+\s*lần\/ngày|nhiều lần|ít lần|vài lần)/i.test(lowerCombinedMessage);
        const hasFeverOrBloodInfo = /(sốt|máu|phân có máu|đi ngoài ra máu|không sốt|không có máu)/i.test(lowerCombinedMessage);
        
        if (!hasFrequencyInfo || !hasFeverOrBloodInfo) {
          const diarrheaQuestion = 'Để tư vấn thuốc chống tiêu chảy phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn:\n\n1. Bạn đi ngoài bao nhiêu lần trong ngày?\n2. Có sốt không?\n3. Phân có máu không?\n\n⚠️ Lưu ý: Nếu tiêu chảy > 2 ngày hoặc có máu trong phân, bạn nên đi khám bác sĩ ngay.';
          console.log('⚠️ Rule-based: Diarrhea detected but need more info, asking for frequency and fever/blood');
          return diarrheaQuestion;
        }
      }
      
      // QUAN TRỌNG: Kiểm tra thuốc ức chế tiết acid (PPI/H2) - cần hỏi kỹ về triệu chứng TRƯỚC KHI tư vấn
      const hasPPI_H2Symptoms = /(đau dạ dày nhiều|đau thượng vị kéo dài|trào ngược thường xuyên|ợ chua kéo dài|đau tăng về đêm|tiền sử viêm loét dạ dày)/i.test(lowerCombinedMessage);
      if (hasPPI_H2Symptoms) {
        // Kiểm tra xem đã có thông tin chi tiết chưa (kéo dài, thường xuyên, nhiều, tiền sử)
        const hasDetailedInfo = /(kéo dài|thường xuyên|nhiều|nhiều ngày|nhiều tuần|nhiều tháng|tăng về đêm|tiền sử|viêm loét)/i.test(lowerCombinedMessage);
        if (!hasDetailedInfo) {
          const ppiH2Question = 'Để tư vấn thuốc phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn:\n\n1. Bạn bị đau dạ dày/ợ chua đã bao lâu rồi? (mới bị hay kéo dài)\n2. Tần suất xuất hiện như thế nào? (thỉnh thoảng hay thường xuyên)\n3. Có đau tăng về đêm không?\n4. Bạn có tiền sử viêm loét dạ dày không?\n\n⚠️ Lưu ý: Thuốc ức chế tiết acid (PPI/H2) cần được tư vấn cẩn thận và dùng theo đợt.';
          console.log('⚠️ Rule-based: PPI/H2 symptoms detected but need more info, asking for details');
          return ppiH2Question;
        }
      }
      
      // QUAN TRỌNG: Kiểm tra mề đay - cần hỏi về thời gian (cấp hay mạn) TRƯỚC KHI tìm thuốc
      const hasUrticaria = /(mề đay|me day|nổi mề đay|noi me day|urticaria)/i.test(lowerCombinedMessage);
      if (hasUrticaria) {
        // Kiểm tra xem đã có thông tin về thời gian chưa
        const durationPatterns = {
          acute: /(dưới|dưới 6|ít hơn 6|mới|mới bị|vài ngày|vài tuần|1 tuần|2 tuần|3 tuần|4 tuần|5 tuần|dưới 1 tháng|dưới 2 tháng|cấp|cấp tính|mới xuất hiện|mới bắt đầu)/i,
          chronic: /(trên|trên 6|hơn 6|hơn 6 tuần|trên 6 tuần|nhiều hơn 6|6 tuần|7 tuần|8 tuần|2 tháng|3 tháng|nhiều tháng|mạn|mạn tính|kéo dài|lâu rồi|đã lâu)/i
        };
        
        const hasDurationInfo = durationPatterns.acute.test(lowerCombinedMessage) || 
                                durationPatterns.chronic.test(lowerCombinedMessage);
        
        // Nếu chưa có thông tin về thời gian, hỏi lại
        if (!hasDurationInfo) {
          const urticariaQuestion = 'Mình hỏi thêm một chút để tư vấn chính xác hơn nhé:\n\n1. Bạn bị nổi mề đay đã bao lâu rồi? (dưới hay trên 6 tuần)\n2. Các nốt mề đay có xuất hiện nhiều vào ban đêm không?';
          console.log('⚠️ Rule-based: Urticaria detected but no duration info, asking for duration');
          return urticariaQuestion;
        }
      }
      
      // Find the original symptom message - exclude messages that are just answers
      const originalSymptomMsg = [...conversationHistory].reverse().find(m =>
        m.role === 'user' &&
        /(cảm|cúm|sốt|ho|sổ mũi|nghẹt mũi|đau họng|nhức đầu|viêm|dị ứng|đau bụng|tiêu chảy|đờm)/i.test(m.content) &&
        // Exclude messages that are likely just answers (contain age, pregnancy info, etc.)
        !(/\d{1,2}\s*tuổi/.test(m.content) && !/(cảm|cúm|ho|sốt)/i.test(m.content))
      );
      
      // Use original symptom message if found, otherwise use combined message
      const symptomQuery = originalSymptomMsg ? originalSymptomMsg.content : combinedSymptomMessage;
      
      console.log('✅ Rule-based: Found follow-up with info, searching medicines for:', symptomQuery);
      console.log('   Original symptom message:', originalSymptomMsg?.content || 'Not found');
      console.log('   Combined message:', combinedSymptomMessage.substring(0, 100));
      
      // Use semantic search to find medicines for the symptom
      const suggestedMedicines = await semanticSearch(symptomQuery);
      console.log('   Semantic search result:', suggestedMedicines.length, 'medicines found');
      
      // QUAN TRỌNG: Nếu là mề đay và đã có thông tin về thời gian, filter thuốc theo thời gian
      let finalMedicines = suggestedMedicines;
      if (hasUrticaria && suggestedMedicines.length > 0) {
        // Xác định thời gian (cấp hay mạn)
        const durationPatterns = {
          acute: /(dưới|dưới 6|ít hơn 6|mới|mới bị|vài ngày|vài tuần|1 tuần|2 tuần|3 tuần|4 tuần|5 tuần|dưới 1 tháng|dưới 2 tháng|cấp|cấp tính|mới xuất hiện|mới bắt đầu)/i,
          chronic: /(trên|trên 6|hơn 6|hơn 6 tuần|trên 6 tuần|nhiều hơn 6|6 tuần|7 tuần|8 tuần|2 tháng|3 tháng|nhiều tháng|mạn|mạn tính|kéo dài|lâu rồi|đã lâu)/i
        };
        
        let urticariaDuration: 'acute' | 'chronic' | null = null;
        if (durationPatterns.chronic.test(lowerCombinedMessage)) {
          urticariaDuration = 'chronic';
        } else if (durationPatterns.acute.test(lowerCombinedMessage)) {
          urticariaDuration = 'acute';
        }
        
        // Kiểm tra xem có ngứa nhiều về đêm không
        const hasNightItching = /(ban đêm|buổi đêm|đêm|ngứa nhiều|ngứa dữ dội|ngứa không ngủ|nhiều vào ban đêm)/i.test(lowerCombinedMessage);
        const noNightItching = /(không.*ban đêm|không.*đêm|không.*nhiều|ít.*ban đêm|ít.*đêm)/i.test(lowerCombinedMessage);
        
        // Xác định hasNightItching: nếu có "không" thì false, nếu có "nhiều" thì true
        const nightItchingStatus = noNightItching ? false : (hasNightItching ? true : false);
        
        if (urticariaDuration) {
          finalMedicines = filterAntihistaminesForUrticaria(suggestedMedicines, urticariaDuration, nightItchingStatus);
          console.log(`   Filtered medicines for urticaria (${urticariaDuration}, nightItching: ${nightItchingStatus}):`, finalMedicines.length, 'medicines');
        }
      }
      
      // QUAN TRỌNG: Nếu có "ngứa da" kèm "nổi mề đay", tìm thêm thuốc bôi ngoài da
      const hasSkinItching = /(ngứa da|ngứa da tại chỗ|ngứa do côn trùng đốt|ngứa da nhẹ|viêm da dị ứng nhẹ|dị ứng mỹ phẩm)/i.test(lowerCombinedMessage);
      if (hasUrticaria && hasSkinItching && finalMedicines.length > 0) {
        // Tìm thuốc bôi ngoài da cho ngứa da
        try {
          const db = mongoose.connection.db;
          if (db) {
            const medicinesCollection = db.collection('medicines');
            const productsCollection = db.collection('products');
            
            // Tìm thuốc bôi ngoài da với các keywords
            const topicalKeywords = [
              'bôi ngoài', 'bôi da', 'kem bôi', 'gel bôi', 'thuốc mỡ', 'cream', 'gel', 'ointment',
              'chống ngứa ngoài da', 'topical', 'bôi tại chỗ', 'thuốc bôi', 'kem chống ngứa',
              'corticoid bôi', 'hydrocortisone', 'betamethasone', 'clobetasol', 'triamcinolone',
              'calamine', 'menthol', 'phenol', 'lidocaine'
            ];
            
            const topicalSearchPattern = topicalKeywords.join('|');
            
            // Tìm trong cả medicines và products collection
            const [topicalMedicines, topicalProducts] = await Promise.all([
              medicinesCollection.find({
                $or: [
                  { name: { $regex: topicalSearchPattern, $options: 'i' } },
                  { categoryName: { $regex: /(bôi ngoài|chống ngứa ngoài da|topical|cream|gel)/i } },
                  { indication: { $regex: /(ngứa da|chống ngứa|bôi ngoài)/i } },
                  { description: { $regex: /(ngứa da|chống ngứa|bôi ngoài)/i } }
                ],
                inStock: true,
                stockQuantity: { $gt: 0 }
              }).limit(3).toArray(),
              
              productsCollection.find({
                $or: [
                  { name: { $regex: topicalSearchPattern, $options: 'i' } },
                  { categoryName: { $regex: /(bôi ngoài|chống ngứa ngoài da|topical|cream|gel)/i } },
                  { description: { $regex: /(ngứa da|chống ngứa|bôi ngoài)/i } }
                ],
                inStock: true,
                stockQuantity: { $gt: 0 }
              }).limit(3).toArray()
            ]);
            
            // Kết hợp và loại bỏ trùng lặp
            const allTopicalMedicines = [...topicalMedicines, ...topicalProducts];
            const uniqueTopicalMedicines = Array.from(
              new Map(allTopicalMedicines.map(med => [med.name, med])).values()
            ).slice(0, 1); // Chỉ lấy tối đa 1 thuốc bôi ngoài da (để tổng không quá 3 thuốc)
            
            if (uniqueTopicalMedicines.length > 0) {
              // Thêm thuốc bôi ngoài da vào danh sách (ưu tiên sau thuốc uống)
              // Đảm bảo tổng số thuốc không vượt quá 3
              const maxOralMedicines = Math.max(1, 3 - uniqueTopicalMedicines.length); // Ưu tiên ít nhất 1 thuốc uống
              finalMedicines = [...finalMedicines.slice(0, maxOralMedicines), ...uniqueTopicalMedicines].slice(0, 3);
              console.log(`   Added ${uniqueTopicalMedicines.length} topical medicines for skin itching, total: ${finalMedicines.length} medicines`);
            }
          }
        } catch (error) {
          console.error('Error searching for topical medicines:', error);
          // Không ảnh hưởng đến kết quả chính nếu lỗi
        }
      }
      
      // Extract symptom keywords (used in both success and fallback cases)
      const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
        normalizeText(symptomQuery).includes(symptom)
      );
      
      if (finalMedicines.length > 0) {
        console.log('✅ Rule-based: Suggesting medicines for symptom:', symptomQuery, 'Found', finalMedicines.length, 'medicines');
        console.log('   Symptom keywords:', symptomKeywords);
        const response = await formatSymptomBasedResponse(finalMedicines, symptomKeywords.length > 0 ? symptomKeywords : ['cảm cúm']);
        console.log('   Response length:', response.length);
        return response;
      } else {
        console.log('⚠️ Rule-based: No medicines found for symptom:', symptomQuery);
        // Fallback: Try to suggest common medicines based on symptom keywords
        if (symptomKeywords.length > 0) {
          // Try to get medicines from symptom mapping directly
          const allMedicines: string[] = [];
          symptomKeywords.forEach(symptom => {
            if (symptomToMedicines[symptom]) {
              allMedicines.push(...symptomToMedicines[symptom].medicineNames);
            }
          });
          console.log('   Trying fallback with symptom keywords:', symptomKeywords, 'medicines:', allMedicines.slice(0, 5));
          // Try search again with just the symptom name
          const fallbackMedicines = await semanticSearch(symptomKeywords[0]);
          if (fallbackMedicines.length > 0) {
            console.log('   Fallback found', fallbackMedicines.length, 'medicines');
            return await formatSymptomBasedResponse(fallbackMedicines, symptomKeywords);
          }
        }
        console.log('   No fallback medicines found, creating fallback from commonMedicineInfo');
        // Create fallback medicines from commonMedicineInfo
        if (symptomKeywords.length > 0) {
          const allMedicines: string[] = [];
          symptomKeywords.forEach(symptom => {
            if (symptomToMedicines[symptom]) {
              allMedicines.push(...symptomToMedicines[symptom].medicineNames);
            }
          });
          
          // Create medicine objects from commonMedicineInfo
          const fallbackMedicines = Array.from(new Set(allMedicines))
            .slice(0, 5)
            .map(medName => {
              const commonInfo = commonMedicineInfo[medName];
              if (commonInfo) {
                return {
                  _id: new mongoose.Types.ObjectId(),
                  name: medName,
                  indication: commonInfo.indication,
                  description: commonInfo.description,
                  price: 0,
                  stockQuantity: 0,
                  unit: 'đơn vị',
                  brand: '',
                  dosage: medicineDosageReference[medName] || medicineDosageReference[medName.split(' ')[0]] || ''
                };
              }
              return null;
            })
            .filter(med => med !== null);
          
          if (fallbackMedicines.length > 0) {
            console.log('   Created', fallbackMedicines.length, 'fallback medicines from commonMedicineInfo');
            return await formatSymptomBasedResponse(fallbackMedicines, symptomKeywords);
          }
        }
        
        // Last resort: return format-compliant message
        return `Dưới đây là các thuốc phù hợp với tình trạng của bạn:

1. **Paracetamol** (Hapacol / Panadol)
   - Công dụng: Hạ sốt, giảm đau nhẹ đến vừa
   - Liều: 1 viên 500mg mỗi 4-6 giờ, tối đa 8 viên/ngày
   - Lưu ý: Không dùng quá 4g Paracetamol/ngày

2. **Decolgen Forte**
   - Công dụng: Điều trị triệu chứng cảm cúm: hạ sốt, giảm đau, giảm nghẹt mũi, sổ mũi
   - Liều: 1 viên mỗi 6 giờ
   - Lưu ý: Có thể gây buồn ngủ

⚠️ Lưu ý chung:
- Không dùng chung nhiều thuốc chứa Paracetamol.
- Nếu sốt cao liên tục >39°C, khó thở, đau ngực → đi khám ngay.
- Đọc kỹ hướng dẫn sử dụng trước khi dùng.

Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi.`;
      }
    } else {
      // Still missing age, ask for it
      const followup = buildMissingInfoQuestions(parsed);
      if (followup) {
        return followup;
      }
    }
  } else if (hasSymptomKeyword && !lowerMessage.includes('liều') && !lowerMessage.includes('giá') && !lowerMessage.includes('tồn kho')) {
    // Parse patient info from entire conversation history to avoid asking again
    const followup = buildMissingInfoQuestions(parsed);
    // Only ask if age is missing; otherwise proceed with available info
    // QUAN TRỌNG: Nếu đã có đủ thông tin từ conversation history, không hỏi lại
    if (followup && !parsed.hasAge) {
      return followup;
    }
    
    // QUAN TRỌNG: Kiểm tra xem có phải là câu hỏi chung chung về một loại thuốc không TRƯỚC KHI tìm thuốc
    const generalMedicineCategoriesRuleBased = {
      'tiêu hóa': {
        pattern: /thuốc\s*tiêu\s*hóa|tiêu\s*hóa/i,
        symptoms: [
          // NHÓM A - Men tiêu hóa
          'ăn không tiêu', 'đầy bụng', 'chướng bụng', 'khó tiêu', 'đi ngoài phân sống', 'rối loạn tiêu hóa nhẹ', 'trẻ em ăn uống kém',
          // NHÓM B - Thuốc chống tiêu chảy
          'tiêu chảy', 'đi ngoài phân lỏng', 'đi ngoài nhiều lần', 'đau bụng kèm tiêu chảy',
          // NHÓM C - Thuốc kháng acid
          'ợ chua', 'ợ nóng', 'nóng rát vùng thượng vị', 'đau dạ dày nhẹ', 'khó tiêu do tăng acid', 'trào ngược nhẹ',
          // NHÓM D - Thuốc nhuận tràng
          'táo bón', 'đi cầu khó', 'phân cứng', 'đi ngoài ít hơn 3 lần/tuần',
          // NHÓM E - Thuốc ức chế tiết acid (PPI/H2)
          'đau dạ dày nhiều', 'đau thượng vị kéo dài', 'trào ngược thường xuyên', 'ợ chua kéo dài', 'đau tăng về đêm',
          // Các triệu chứng cũ (để tương thích)
          'đau bụng', 'buồn nôn', 'nôn', 'đầy hơi'
        ]
      },
      'kháng dị ứng': {
        pattern: /thuốc\s*kháng\s*dị\s*ứng|thuốc\s*dị\s*ứng|kháng\s*dị\s*ứng/i,
        symptoms: [
          // NHÓM A - Dị ứng da
          'ngứa da', 'nổi mề đay', 'phát ban dị ứng', 'mẩn đỏ da', 'dị ứng da do thức ăn', 'dị ứng da do côn trùng đốt',
          // NHÓM B - Dị ứng đường hô hấp
          'hắt hơi nhiều', 'sổ mũi trong', 'nghẹt mũi', 'ngứa mũi', 'chảy nước mắt', 'đỏ mắt', 'viêm mũi dị ứng theo mùa',
          // NHÓM C - Ngứa khu trú/tại chỗ
          'ngứa da tại chỗ', 'ngứa do côn trùng đốt', 'ngứa da nhẹ', 'viêm da dị ứng nhẹ', 'dị ứng mỹ phẩm',
          // Các triệu chứng cũ (để tương thích)
          'ngứa', 'mề đay', 'phát ban', 'hắt hơi', 'sổ mũi', 'viêm mũi dị ứng', 'chảy nước mắt', 'đỏ mắt'
        ]
      },
      'kháng viêm': {
        pattern: /thuốc\s*kháng\s*viêm|thuốc\s*chống\s*viêm|kháng\s*viêm|chống\s*viêm/i,
        symptoms: ['viêm', 'sưng', 'đau', 'đỏ', 'nóng']
      },
      'thần kinh': {
        pattern: /thuốc\s*thần\s*kinh|thần\s*kinh/i,
        symptoms: ['đau đầu', 'nhức đầu', 'chóng mặt', 'hoa mắt', 'migraine', 'đau nửa đầu']
      },
      'cơ xương khớp': {
        pattern: /thuốc\s*cơ\s*xương\s*khớp|thuốc\s*xương\s*khớp|cơ\s*xương\s*khớp|xương\s*khớp/i,
        symptoms: ['đau khớp', 'viêm khớp', 'đau cơ', 'cứng khớp', 'sưng khớp']
      },
      'tim mạch': {
        pattern: /thuốc\s*tim\s*mạch|thuốc\s*huyết\s*áp|tim\s*mạch|huyết\s*áp/i,
        symptoms: ['tăng huyết áp', 'hạ huyết áp', 'đau ngực', 'nhịp tim nhanh', 'nhịp tim chậm', 'hồi hộp']
      },
      'giảm đau': {
        pattern: /thuốc\s*giảm\s*đau|giảm\s*đau|thuốc\s*hạ\s*sốt|hạ\s*sốt/i,
        symptoms: ['đau', 'sốt', 'đau đầu', 'đau cơ', 'đau khớp', 'đau răng']
      },
      'kháng sinh': {
        pattern: /thuốc\s*kháng\s*sinh|kháng\s*sinh/i,
        symptoms: ['nhiễm khuẩn', 'viêm nhiễm', 'sốt', 'mủ', 'đau họng', 'ho có đờm']
      },
      'tiêu hóa cho trẻ': {
        pattern: /thuốc\s*tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*cho\s*trẻ|tiêu\s*hóa\s*trẻ\s*em/i,
        symptoms: ['khó tiêu', 'đầy bụng', 'đau bụng', 'tiêu chảy', 'táo bón', 'nôn', 'trớ']
      },
      'mắt tai mũi': {
        pattern: /thuốc\s*mắt|thuốc\s*tai|thuốc\s*mũi|mắt|tai|mũi/i,
        symptoms: ['đau mắt', 'đỏ mắt', 'chảy nước mắt', 'đau tai', 'ù tai', 'nghẹt mũi', 'sổ mũi', 'viêm mũi']
      }
    };
    
    let generalMedicineCategoryRuleBased: string | null = null;
    for (const [category, config] of Object.entries(generalMedicineCategoriesRuleBased)) {
      if (config.pattern.test(lowerCombinedMessage)) {
        const hasSpecificSymptomForCategory = config.symptoms.some(symptom => 
          lowerCombinedMessage.includes(symptom.toLowerCase())
        );
        if (!hasSpecificSymptomForCategory) {
          generalMedicineCategoryRuleBased = category;
          break;
        }
      }
    }
    
    // Nếu chỉ hỏi chung chung về một loại thuốc mà không có triệu chứng cụ thể, hỏi lại triệu chứng
    if (generalMedicineCategoryRuleBased && parsed.hasAge) {
      let clarificationQuestion = '';
      
      switch (generalMedicineCategoryRuleBased) {
        case 'tiêu hóa':
          clarificationQuestion = 'Để tư vấn thuốc tiêu hóa phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n🔹 Men tiêu hóa:\n- Ăn không tiêu\n- Đầy bụng / Chướng bụng\n- Khó tiêu\n- Đi ngoài phân sống\n- Rối loạn tiêu hóa nhẹ\n- Trẻ em ăn uống kém\n\n🔹 Thuốc chống tiêu chảy:\n- Tiêu chảy\n- Đi ngoài phân lỏng\n- Đi ngoài nhiều lần trong ngày\n- Đau bụng kèm tiêu chảy\n\n🔹 Thuốc kháng acid:\n- Ợ chua / Ợ nóng\n- Nóng rát vùng thượng vị\n- Đau dạ dày nhẹ\n- Khó tiêu do tăng acid\n- Trào ngược nhẹ sau ăn\n\n🔹 Thuốc nhuận tràng:\n- Táo bón\n- Đi cầu khó\n- Phân cứng\n- Đi ngoài < 3 lần/tuần\n\n🔹 Thuốc ức chế tiết acid (PPI/H2):\n- Đau dạ dày nhiều / Đau thượng vị kéo dài\n- Trào ngược thường xuyên\n- Ợ chua kéo dài\n- Đau tăng về đêm\n\nBạn có thể mô tả triệu chứng của mình để tôi tư vấn chính xác hơn.';
          break;
        case 'kháng dị ứng':
          clarificationQuestion = 'Để tư vấn thuốc kháng dị ứng phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Ngứa\n- Nổi mề đay\n- Phát ban\n- Hắt hơi\n- Sổ mũi\n- Nghẹt mũi\n- Viêm mũi dị ứng\n- Chảy nước mắt\n- Đỏ mắt\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'kháng viêm':
          clarificationQuestion = 'Để tư vấn thuốc kháng viêm phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Viêm khớp\n- Viêm họng\n- Viêm mũi\n- Sưng đau\n- Đỏ nóng\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'thần kinh':
          clarificationQuestion = 'Để tư vấn thuốc thần kinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau đầu\n- Nhức đầu\n- Chóng mặt\n- Hoa mắt\n- Migraine / Đau nửa đầu\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'cơ xương khớp':
          clarificationQuestion = 'Để tư vấn thuốc cơ xương khớp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau khớp\n- Viêm khớp\n- Đau cơ\n- Cứng khớp\n- Sưng khớp\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'tim mạch':
          clarificationQuestion = 'Để tư vấn thuốc tim mạch/huyết áp phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Tăng huyết áp\n- Hạ huyết áp\n- Đau ngực\n- Nhịp tim nhanh/chậm\n- Hồi hộp\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'giảm đau':
          clarificationQuestion = 'Để tư vấn thuốc giảm đau/hạ sốt phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau đầu\n- Đau cơ\n- Đau khớp\n- Đau răng\n- Sốt\n- Sốt cao\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        case 'kháng sinh':
          clarificationQuestion = 'Để tư vấn thuốc kháng sinh phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Nhiễm khuẩn\n- Viêm nhiễm\n- Sốt\n- Có mủ\n- Đau họng\n- Ho có đờm\n\n⚠️ Lưu ý: Thuốc kháng sinh cần có chỉ định của bác sĩ.';
          break;
        case 'tiêu hóa cho trẻ':
          clarificationQuestion = 'Để tư vấn thuốc tiêu hóa cho trẻ phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng trẻ đang gặp phải:\n\n- Khó tiêu\n- Đầy bụng\n- Đau bụng\n- Tiêu chảy\n- Táo bón\n- Nôn / Trớ\n\nVà vui lòng cho biết tuổi và cân nặng của trẻ.';
          break;
        case 'mắt tai mũi':
          clarificationQuestion = 'Để tư vấn thuốc mắt/tai/mũi phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải:\n\n- Đau mắt / Đỏ mắt / Chảy nước mắt\n- Đau tai / Ù tai\n- Nghẹt mũi / Sổ mũi / Viêm mũi\n\nHoặc bạn có thể mô tả cụ thể tình trạng của bạn.';
          break;
        default:
          clarificationQuestion = 'Để tư vấn thuốc phù hợp và an toàn, bạn vui lòng cho tôi biết cụ thể hơn về triệu chứng bạn đang gặp phải.';
      }
      
      return clarificationQuestion;
    }
    
    // Nếu đã có đủ thông tin (có age) và có triệu chứng cụ thể, gợi ý thuốc ngay
    const isGeneralMedicineQuery = generalMedicineCategoryRuleBased !== null;
    if (parsed.hasAge && hasSymptomKeyword && !isGeneralMedicineQuery) {
      console.log('✅ Rule-based: Has age and symptom, suggesting medicines');
      const suggestedMedicines = await semanticSearch(combinedSymptomMessage);
      if (suggestedMedicines.length > 0) {
        const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
          lowerCombinedMessage.includes(symptom)
        );
        console.log('✅ Rule-based: Suggesting medicines with available info');
        return await formatSymptomBasedResponse(suggestedMedicines, symptomKeywords.length > 0 ? symptomKeywords : ['cảm cúm']);
      }
    }
  }
  
  // 1. Check for dosage questions (liều dùng tham khảo)
  if (lowerMessage.includes('liều dùng') || lowerMessage.includes('uống mấy viên') || 
      lowerMessage.includes('uống như thế nào') || lowerMessage.includes('bao nhiêu viên') ||
      lowerMessage.includes('pha bao nhiêu')) {
    const medicineName = extractMedicineNameFromQuery(userMessage);
    if (medicineName) {
      const dosage = medicineDosageReference[medicineName] || 
                     medicineDosageReference[medicineName.split(' ')[0]];
      if (dosage) {
        return dosage;
      }
      // Try to get from database
      const medicineDetails = await getMedicineDetails(medicineName);
      if (medicineDetails && medicineDetails.dosage) {
        return `Liều dùng tham khảo: ${medicineDetails.dosage}\n\n⚠️ **Lưu ý quan trọng:** Đây chỉ là thông tin tham khảo. Liều dùng cụ thể cần được tư vấn bởi bác sĩ/dược sĩ. Không tự ý thay đổi liều lượng.`;
      }
      return `Tôi không có thông tin liều dùng cụ thể cho "${medicineName}". Vui lòng liên hệ dược sĩ để được tư vấn về liều dùng phù hợp với tình trạng của bạn. ⚠️ Lưu ý: Liều dùng cần được chỉ định bởi bác sĩ/dược sĩ.`;
    }
    return "Vui lòng cho tôi biết tên thuốc bạn muốn hỏi về liều dùng. ⚠️ Lưu ý: Tôi chỉ cung cấp thông tin tham khảo, không thay thế chỉ định của bác sĩ.";
  }
  
  // 2. Check for contraindications and side effects
  if (lowerMessage.includes('chống chỉ định') || lowerMessage.includes('ai không nên uống') ||
      lowerMessage.includes('được không') || lowerMessage.includes('có uống được không')) {
    const medicineName = extractMedicineNameFromQuery(userMessage);
    if (medicineName) {
      const warning = medicineWarnings[medicineName] || 
                     medicineWarnings[medicineName.split(' ')[0]];
      if (warning) {
        let response = `📋 **Thông tin về ${medicineName}:**\n\n`;
        response += `⚠️ **Chống chỉ định:**\n${warning.contraindications}\n\n`;
        if (warning.sideEffects) {
          response += `⚠️ **Tác dụng phụ:**\n${warning.sideEffects}\n\n`;
        }
        response += `📝 **Lưu ý:**\n${warning.notes}\n\n`;
        response += `⚠️ **Quan trọng:** Thông tin trên chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ/dược sĩ trước khi sử dụng.`;
        return response;
      }
      // Try to get from database
      const medicineDetails = await getMedicineDetails(medicineName);
      if (medicineDetails) {
        return formatMedicineDetails(medicineDetails, lowerMessage);
      }
    }
  }
  
  // 3. Check for price and stock queries
  if (lowerMessage.includes('giá') && (lowerMessage.includes('bao nhiêu') || lowerMessage.includes('bao nhiêu tiền'))) {
    const medicineName = extractMedicineNameFromQuery(userMessage);
    if (medicineName) {
      const products = await searchProductsWithFilters([medicineName]);
      if (products.length > 0) {
        let response = `💰 **Thông tin giá của ${medicineName}:**\n\n`;
        products.slice(0, 3).forEach(product => {
          response += `- **${product.name}**\n`;
          if (product.brand) response += `  Thương hiệu: ${product.brand}\n`;
          response += `  Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
          if (product.stockQuantity !== undefined) {
            response += `  Tồn kho: ${product.stockQuantity} ${product.unit || 'sản phẩm'}\n`;
          }
          response += `\n`;
        });
        return response;
      }
      return `Tôi không tìm thấy sản phẩm "${medicineName}" trong hệ thống. Vui lòng kiểm tra lại tên sản phẩm.`;
    }
  }
  
  if (lowerMessage.includes('còn hàng') || lowerMessage.includes('tồn kho') || 
      lowerMessage.includes('còn bao nhiêu') || lowerMessage.includes('còn không')) {
    const medicineName = extractMedicineNameFromQuery(userMessage);
    if (medicineName) {
      const products = await searchProductsWithFilters([medicineName]);
      if (products.length > 0) {
        let response = `📦 **Tình trạng tồn kho:**\n\n`;
        products.slice(0, 3).forEach(product => {
          response += `- **${product.name}**\n`;
          if (product.stockQuantity !== undefined && product.stockQuantity > 0) {
            response += `  ✅ Còn hàng: ${product.stockQuantity} ${product.unit || 'sản phẩm'}\n`;
          } else {
            response += `  ❌ Hết hàng\n`;
          }
          response += `\n`;
        });
        return response;
      }
    }
  }
  
  // 4. Check for brand-specific queries
  if (lowerMessage.includes('của') && (lowerMessage.includes('sanofi') || lowerMessage.includes('dhg') || 
      lowerMessage.includes('dhc') || lowerMessage.includes('gsk') || lowerMessage.includes('abbott'))) {
    const { brand } = extractMedicineKeywords(userMessage);
    if (brand) {
      const products = await searchProductsWithFilters([], { brand });
      if (products.length > 0) {
        return formatProductResponse(products, userMessage);
      }
      return `Tôi không tìm thấy sản phẩm của ${brand} trong hệ thống.`;
    }
  }
  
  // 5. Check for dosage form queries (dạng bào chế)
  if (lowerMessage.includes('dạng') && (lowerMessage.includes('siro') || lowerMessage.includes('gói') || 
      lowerMessage.includes('viên') || lowerMessage.includes('nhỏ mắt') || lowerMessage.includes('xịt'))) {
    const formKeywords = ['siro', 'gói', 'viên', 'nhỏ mắt', 'xịt'].filter(f => lowerMessage.includes(f));
    if (formKeywords.length > 0) {
      const { keywords } = extractMedicineKeywords(userMessage);
      const allKeywords = [...keywords, ...formKeywords];
      const products = await searchProductsWithFilters(allKeywords);
      if (products.length > 0) {
        return formatProductResponse(products, userMessage);
      }
    }
  }
  
  // 6. Check for non-medicine products
  if (lowerMessage.includes('khẩu trang') || lowerMessage.includes('nhiệt kế') || 
      lowerMessage.includes('bông gòn') || lowerMessage.includes('gel rửa tay') ||
      lowerMessage.includes('chăm sóc da')) {
    const { keywords } = extractMedicineKeywords(userMessage);
    const products = await searchProductsWithFilters(keywords);
    if (products.length > 0) {
      return formatProductResponse(products, userMessage);
    }
  }
  
  // 7. Check for practical questions
  if (lowerMessage.includes('gây buồn ngủ') || lowerMessage.includes('buồn ngủ')) {
    if (lowerMessage.includes('không gây buồn ngủ') || lowerMessage.includes('không buồn ngủ')) {
      // Suggest non-drowsy allergy medicines
      const products = await searchProductsWithFilters(['Cetirizine', 'Loratadine', 'Fexofenadine']);
      if (products.length > 0) {
        return `💊 **Thuốc dị ứng không gây buồn ngủ:**\n\n${formatProductResponse(products, userMessage)}\n\n⚠️ Lưu ý: Một số người vẫn có thể cảm thấy buồn ngủ nhẹ. Vui lòng tham khảo ý kiến dược sĩ.`;
      }
    } else {
      return "Một số thuốc dị ứng như Clorpheniramin có thể gây buồn ngủ. Nếu bạn cần thuốc không gây buồn ngủ, tôi có thể gợi ý Cetirizine, Loratadine hoặc Fexofenadine.";
    }
  }
  
  if (lowerMessage.includes('uống sau ăn') || lowerMessage.includes('uống trước ăn') || 
      lowerMessage.includes('uống khi nào')) {
    return "Thông tin về thời điểm uống thuốc (trước/sau ăn) thường được ghi trên bao bì hoặc trong hướng dẫn sử dụng. Vui lòng đọc kỹ hướng dẫn hoặc hỏi dược sĩ để được tư vấn chính xác.";
  }
  
  if (lowerMessage.includes('uống chung với rượu') || lowerMessage.includes('rượu')) {
    return "⚠️ **Cảnh báo:** Không nên uống thuốc chung với rượu. Rượu có thể làm tăng tác dụng phụ của thuốc, gây nguy hiểm cho sức khỏe. Vui lòng tránh uống rượu khi đang dùng thuốc.";
  }
  
  if (lowerMessage.includes('uống buổi tối') || lowerMessage.includes('uống tối')) {
    return "Thời điểm uống thuốc phụ thuộc vào loại thuốc. Một số thuốc nên uống buổi sáng, một số uống buổi tối. Vui lòng đọc hướng dẫn sử dụng hoặc hỏi dược sĩ để được tư vấn chính xác.";
  }
  
  if (lowerMessage.includes('chưa khỏi') || lowerMessage.includes('uống thuốc nhưng')) {
    return "Nếu bạn đã uống thuốc đúng liều và đủ thời gian nhưng chưa khỏi, bạn nên:\n1. Đi khám bác sĩ để được chẩn đoán lại\n2. Không tự ý tăng liều hoặc đổi thuốc\n3. Liên hệ với dược sĩ để được tư vấn\n\n⚠️ Không tự ý điều trị kéo dài mà không có chỉ định của bác sĩ.";
  }
  
  // 1. Semantic Search - Check for symptom-based queries (e.g., "Tôi bị tiêu chảy nhẹ", "Nổi mề đay bị ngứa")
  // QUAN TRỌNG: Chỉ search nếu chưa suggest medicines ở trên (shouldSuggestMedicines = false)
  // This handles natural language queries without exact keywords
  if (!shouldSuggestMedicines) {
  const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
      lowerCombinedMessage.includes(symptom)
  );
  
  // Also check for semantic matches (e.g., "nổi mề đay bị ngứa" should find allergy medicines)
  const semanticMatches = Object.entries(symptomToMedicines).filter(([symptom, data]) => 
      data.keywords.some(keyword => lowerCombinedMessage.includes(keyword))
  );
  
  if (symptomKeywords.length > 0 || semanticMatches.length > 0) {
    try {
      // Use semantic search for better results
        const suggestedMedicines = await semanticSearch(combinedSymptomMessage);
      if (suggestedMedicines.length > 0) {
        return await formatSymptomBasedResponse(suggestedMedicines, symptomKeywords.length > 0 ? symptomKeywords : semanticMatches.map(m => m[0]));
      }
    } catch (error) {
      console.error('Error suggesting medicines by symptom:', error);
    }
    }
  } else {
    console.log('ℹ️ Skipping semantic search - already handled in suggest medicines above');
  }
  
  // 2. Check for detailed medicine information queries
  if (lowerMessage.includes('công dụng') || lowerMessage.includes('dùng để làm gì') || 
      lowerMessage.includes('dùng để trị') || lowerMessage.includes('trị bệnh gì') ||
      lowerMessage.includes('có tác dụng gì') || lowerMessage.includes('dùng vào mục đích gì') ||
      lowerMessage.includes('chữa bệnh gì') || lowerMessage.includes('trị những bệnh nào') ||
      lowerMessage.includes('thành phần') || lowerMessage.includes('chống chỉ định') ||
      lowerMessage.includes('tương tác') || lowerMessage.includes('tác dụng phụ')) {
    const medicineName = extractMedicineNameFromQuery(userMessage);
    if (medicineName) {
      // For usage queries, prioritize generic medicine information
      const isUsageQuery = lowerMessage.includes('công dụng') || lowerMessage.includes('dùng để') || 
                          lowerMessage.includes('tác dụng') || lowerMessage.includes('trị bệnh') ||
                          lowerMessage.includes('chữa bệnh');
      const medicineDetails = await getMedicineDetails(medicineName, isUsageQuery);
      if (medicineDetails) {
        return formatMedicineDetails(medicineDetails, lowerMessage);
      }
      // Try with base name (remove dosage)
      const baseName = medicineName.replace(/\d+\s*(mg|g|ml|%|viên|hộp)/gi, '').trim().split(' ')[0];
      if (baseName && baseName !== medicineName) {
        const medicineDetails2 = await getMedicineDetails(baseName, isUsageQuery);
        if (medicineDetails2) {
          return formatMedicineDetails(medicineDetails2, lowerMessage);
        }
      }
      // Try with keywords
      const { keywords } = extractMedicineKeywords(userMessage);
      if (keywords.length > 0) {
        const medicineDetails3 = await getMedicineDetails(keywords.join(' '), isUsageQuery);
        if (medicineDetails3) {
          return formatMedicineDetails(medicineDetails3, lowerMessage);
        }
      }
      return `Tôi không tìm thấy thông tin chi tiết về "${medicineName}". Vui lòng kiểm tra lại tên thuốc hoặc liên hệ dược sĩ để được tư vấn.`;
    }
    return "Vui lòng cho tôi biết tên thuốc bạn muốn tìm hiểu thông tin chi tiết.";
  }
  
  // 3. Check for purchase history suggestions with recommendations
  if ((lowerMessage.includes('đã mua') || lowerMessage.includes('mua trước') || 
       lowerMessage.includes('lịch sử') || lowerMessage.includes('gợi ý') ||
       lowerMessage.includes('recommendation') || lowerMessage.includes('đề xuất')) && userId) {
    const purchaseHistory = await getUserPurchaseHistory(userId);
    if (purchaseHistory.length > 0) {
      return await formatPurchaseHistorySuggestions(purchaseHistory);
    }
    return "Bạn chưa có lịch sử mua hàng. Hãy thử một số sản phẩm phổ biến của chúng tôi!";
  }
  
  // 4. Extract keywords for medicine/product search with natural language
  // QUAN TRỌNG: Chỉ search products nếu KHÔNG phải follow-up answer với đủ thông tin
  // Nếu đã có đủ thông tin và có symptom, đã được xử lý ở trên (suggest medicines)
  const shouldSkipProductSearch = (isFollowUp || hasAllInfo) && hasSymptomInHistory && parsed.hasAge;
  
  console.log('🔍 Should skip product search?', {
    shouldSkipProductSearch,
    isFollowUp,
    hasAllInfo,
    hasSymptomInHistory,
    'parsed.hasAge': parsed.hasAge
  });
  
  if (!shouldSkipProductSearch) {
  const { keywords, brand, category, ageGroup } = extractMedicineKeywords(userMessage);
  
  // Check if user is asking about a specific medicine/product
  if (keywords.length > 0) {
    try {
      const products = await searchProductsWithFilters(keywords, { brand, category, ageGroup });
      if (products.length > 0) {
        return formatProductResponse(products, userMessage);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
    }
  } else {
    console.log('ℹ️ Skipping product search - already suggested medicines above');
  }
  
  // 5. Handle natural language queries (vague keywords)
  // QUAN TRỌNG: Chỉ search nếu chưa suggest medicines ở trên
  if (!shouldSkipProductSearch) {
  if (lowerMessage.includes('thuốc cảm thông thường') || lowerMessage.includes('thuốc cảm')) {
    const products = await searchProductsWithFilters(['cảm', 'paracetamol', 'decolgen']);
    if (products.length > 0) {
      return formatProductResponse(products, userMessage);
    }
  }
  
  if (lowerMessage.includes('thuốc trị') || lowerMessage.includes('thuốc chữa')) {
    const { keywords: treatmentKeywords } = extractMedicineKeywords(userMessage);
    if (treatmentKeywords.length > 0) {
      const products = await searchProductsWithFilters(treatmentKeywords);
      if (products.length > 0) {
        return formatProductResponse(products, userMessage);
        }
      }
    }
  }
  
  // 6. Handle common questions
  if ((lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) && 
      !lowerMessage.includes('giá') || !lowerMessage.includes('bao nhiêu tiền')) {
    // Already handled above in section 3
  }
  
  if (lowerMessage.includes('còn hàng') || lowerMessage.includes('có hàng')) {
    // Already handled above in section 3
  }
  
  if (lowerMessage.includes('cách dùng') || lowerMessage.includes('liều lượng')) {
    return "Thông tin về cách dùng và liều lượng thuốc cần được tư vấn bởi dược sĩ. Vui lòng liên hệ với chúng tôi để được tư vấn chi tiết. ⚠️ Lưu ý: Tôi chỉ cung cấp thông tin tham khảo, không thay thế chỉ định của bác sĩ.";
  }
  
  if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('theo dõi')) {
    return "Bạn có thể theo dõi đơn hàng của mình trong phần 'Theo dõi đơn hàng' trên website hoặc liên hệ hotline để được hỗ trợ.";
  }
  
  if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
    return "Chúng tôi cung cấp dịch vụ giao hàng tận nơi. Vui lòng cho tôi biết địa chỉ giao hàng để tôi có thể tư vấn phí ship phù hợp.";
  }
  
  if (lowerMessage.includes('giảm giá') || lowerMessage.includes('khuyến mãi') || lowerMessage.includes('deal')) {
    return "Bạn có thể xem các sản phẩm đang giảm giá trong phần 'Săn Deal' trên trang chủ. Chúng tôi thường xuyên có các chương trình khuyến mãi hấp dẫn!";
  }
  
  if (lowerMessage.includes('tư vấn') || lowerMessage.includes('hỏi')) {
    return "Tôi sẵn sàng tư vấn cho bạn! Bạn có thể hỏi tôi về:\n- Thông tin sản phẩm và giá cả\n- Tình trạng tồn kho\n- Công dụng và cách sử dụng\n- Gợi ý thuốc theo triệu chứng\n- Lịch sử mua hàng và gợi ý\n- Chương trình khuyến mãi\n- Theo dõi đơn hàng\n\nBạn muốn biết thông tin gì?";
  }
  
  // QUAN TRỌNG: Trước khi trả về default message, kiểm tra xem có đủ thông tin để gợi ý thuốc không
  // Nếu có symptom và đã có đủ thông tin (age), gợi ý thuốc ngay
  const finalParsed = parsePatientInfo(combinedSymptomMessage, conversationHistory);
  if (finalParsed.hasAge && hasSymptomKeyword) {
    const suggestedMedicines = await semanticSearch(combinedSymptomMessage);
    if (suggestedMedicines.length > 0) {
      const symptomKeywords = Object.keys(symptomToMedicines).filter(symptom => 
        lowerCombinedMessage.includes(symptom)
      );
      console.log('✅ Rule-based: Final check - suggesting medicines with available info');
      return await formatSymptomBasedResponse(suggestedMedicines, symptomKeywords.length > 0 ? symptomKeywords : ['cảm cúm']);
    }
  }
  
  // Default response - chỉ trả về khi thực sự không có gì để làm
  return `Cảm ơn bạn đã liên hệ với Nhà Thuốc Thông Minh! Tôi có thể giúp bạn:
  
- 🔍 Tìm kiếm thông tin về thuốc và sản phẩm
- 💊 Tư vấn thông tin thuốc (công dụng, thành phần, chống chỉ định, tương tác)
- 🤒 Gợi ý thuốc theo triệu chứng nhẹ
- 📦 Kiểm tra giá và tình trạng tồn kho
- 📋 Gợi ý thuốc dựa trên lịch sử mua hàng
- 🎁 Thông tin về chương trình khuyến mãi
- 📦 Hỗ trợ theo dõi đơn hàng

Bạn có thể hỏi tôi bất kỳ câu hỏi nào về sản phẩm hoặc dịch vụ của chúng tôi. Ví dụ: 
- "Tôi bị cảm cúm, có thuốc nào không?"
- "Cho tôi thuốc đau họng dành cho trẻ em"
- "Tìm tất cả thuốc dạ dày của Sanofi"
- "Công dụng của Paracetamol là gì?"`;
}

// Extract medicine/product keywords from user message with natural language support
function extractMedicineKeywords(message: string): { keywords: string[]; brand?: string; category?: string; ageGroup?: string } {
  const lowerMessage = message.toLowerCase();
  const keywords: string[] = [];
  let brand: string | undefined;
  let category: string | undefined;
  let ageGroup: string | undefined;
  
  // Extract brand name (e.g., "của Sanofi", "thuốc Sanofi", "Sanofi")
  const brandPatterns = [
    /(?:của|thuốc|sản phẩm)\s+([A-ZÀ-Ỹ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+[A-ZÀ-Ỹ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+)*)/,
    /\b([A-ZÀ-Ỹ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+[A-ZÀ-Ỹ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+)*)\b/,
  ];
  
  // Known brands list (can be expanded)
  const knownBrands = ['sanofi', 'traphaco', 'domepharm', 'pharmedic', 'dược phẩm', 'pharma', 'glaxosmithkline', 'gsk', 'pfizer', 'novartis'];
  
  for (const pattern of brandPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const potentialBrand = match[1].trim();
      // Check if it's a known brand or contains brand keywords
      if (knownBrands.some(b => potentialBrand.toLowerCase().includes(b.toLowerCase())) ||
          potentialBrand.length > 2 && /^[A-ZÀ-Ỹ]/.test(potentialBrand)) {
        brand = potentialBrand;
        break;
      }
    }
  }
  
  // Also check if message explicitly mentions brand
  for (const knownBrand of knownBrands) {
    if (lowerMessage.includes(knownBrand)) {
      // Try to extract the full brand name
      const brandMatch = message.match(new RegExp(`(${knownBrand}[^\\s]*|\\w+\\s+${knownBrand})`, 'i'));
      if (brandMatch) {
        brand = brandMatch[1];
        break;
      }
    }
  }
  
  // Extract age group (e.g., "trẻ em", "em bé", "bé", "người lớn")
  if (lowerMessage.includes('trẻ em') || lowerMessage.includes('em bé') || lowerMessage.includes('bé') || lowerMessage.includes('trẻ')) {
    ageGroup = 'trẻ em';
  } else if (lowerMessage.includes('người lớn') || lowerMessage.includes('người trưởng thành')) {
    ageGroup = 'người lớn';
  }
  
  // Extract category/condition keywords
  const categoryKeywords: { [key: string]: string } = {
    'đau họng': 'đau họng',
    'ho': 'ho',
    'cảm': 'cảm',
    'sốt': 'sốt',
    'đau đầu': 'đau đầu',
    'dạ dày': 'dạ dày',
    'tiêu hóa': 'tiêu hóa',
    'dị ứng': 'dị ứng',
    'viêm': 'viêm',
    'kháng sinh': 'kháng sinh',
    'vitamin': 'vitamin',
    'bổ sung': 'bổ sung',
  };
  
  for (const [key, value] of Object.entries(categoryKeywords)) {
    if (lowerMessage.includes(key)) {
      category = value;
      keywords.push(value);
      break;
    }
  }
  
  // Extract medicine name patterns
  const medicinePatterns = [
    /(?:tìm|mua|giá|thông tin|về|cho|thuốc)\s+([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+(?:\s+[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+)*)/i,
  ];
  
  for (const pattern of medicinePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const medicineName = match[1].trim();
      // Remove common words
      const cleaned = medicineName
        .replace(/\b(cho|dành cho|của|thuốc|sản phẩm)\b/gi, '')
        .trim();
      if (cleaned.length > 2) {
        keywords.push(cleaned);
      }
    }
  }
  
  // If no specific medicine found, use significant words
  if (keywords.length === 0) {
    const words = lowerMessage.split(/\s+/);
    const stopWords = ['tôi', 'muốn', 'cần', 'có', 'là', 'của', 'về', 'cho', 'với', 'và', 'hoặc', 'thuốc', 'sản phẩm', 'dành'];
    const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 2);
    
    filteredWords.forEach(word => {
      if (word.length > 3) {
        keywords.push(word);
      }
    });
  }
  
  return { keywords, brand, category, ageGroup };
}

// Search products in database with filters
async function searchProductsWithFilters(
  keywords: string[], 
  filters?: { brand?: string; category?: string; ageGroup?: string }
): Promise<any[]> {
  try {
    const db = mongoose.connection.db;
    if (!db) return [];
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    // Build search query
    const searchConditions: any[] = [];
    
    // Keyword search
    if (keywords.length > 0) {
      searchConditions.push({
        $or: keywords.map(keyword => ({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { brand: { $regex: keyword, $options: 'i' } },
          ]
        }))
      });
    }
    
    // Brand filter
    if (filters?.brand) {
      searchConditions.push({
        brand: { $regex: filters.brand, $options: 'i' }
      });
    }
    
    // Category/condition filter
    if (filters?.category) {
      searchConditions.push({
        $or: [
          { name: { $regex: filters.category, $options: 'i' } },
          { description: { $regex: filters.category, $options: 'i' } },
        ]
      });
    }
    
    // Age group filter (for children's medicines)
    if (filters?.ageGroup === 'trẻ em') {
      searchConditions.push({
        $or: [
          { name: { $regex: /trẻ em|trẻ|em bé|bé|pediatric|pediatric|children/i } },
          { description: { $regex: /trẻ em|trẻ|em bé|bé|pediatric|pediatric|children/i } },
        ]
      });
    }
    
    // Build final query
    const query: any = {
      inStock: true,
      stockQuantity: { $gt: 0 }
    };
    
    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }
    
    // Search in products collection
    let products = await productsCollection.find(query)
      .limit(10)
      .toArray();
    
    // If no products found, search in medicines collection
    if (products.length === 0) {
      const medicines = await medicinesCollection.find({
        $and: searchConditions.length > 0 ? searchConditions : [{}]
      })
      .limit(10)
      .toArray();
      
      // Convert medicines to product-like format
      products = medicines.map(med => ({
        _id: med._id,
        name: med.name,
        price: med.price || 0,
        description: med.description || med.indication || '',
        brand: med.brand || '',
        inStock: true,
        stockQuantity: med.stockQuantity || 0,
        unit: med.unit || 'đơn vị',
        imageUrl: med.imageUrl || ''
      }));
    }
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Legacy function for backward compatibility
async function searchProducts(keywords: string[]): Promise<any[]> {
  return searchProductsWithFilters(keywords);
}

// Format product search results as response
function formatProductResponse(products: any[], userMessage: string): string {
  if (products.length === 0) {
    return "Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với tên sản phẩm khác hoặc liên hệ với chúng tôi để được tư vấn.";
  }
  
  let response = `Tôi tìm thấy ${products.length} sản phẩm phù hợp:\n\n`;
  
  products.forEach((product, index) => {
    response += `${index + 1}. **${product.name}**\n`;
    if (product.brand) {
      response += `   Thương hiệu: ${product.brand}\n`;
    }
    if (product.price) {
      response += `   Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
    }
    if (product.description) {
      const shortDesc = product.description.length > 100 
        ? product.description.substring(0, 100) + '...' 
        : product.description;
      response += `   ${shortDesc}\n`;
    }
    if (product.stockQuantity !== undefined) {
      response += `   Tồn kho: ${product.stockQuantity} ${product.unit || 'sản phẩm'}\n`;
    }
    response += '\n';
  });
  
  response += "Bạn có muốn xem thêm thông tin chi tiết về sản phẩm nào không?";
  
  return response;
}

// Get additional medicine information from database
async function enrichMedicineInfo(medicine: any): Promise<any> {
  try {
    const db = mongoose.connection.db;
    if (!db) return medicine;
    
    const medicinesCollection = db.collection('medicines');
    
    // Extract base name (remove dosage info)
    const baseName = medicine.name.replace(/\d+\s*(mg|g|ml|%|viên|hộp)/gi, '').trim().split('_')[0].split(' ')[0];
    
    // Try to find in medicines collection for more details
    const medicineInfo = await medicinesCollection.findOne({
      $or: [
        { name: { $regex: `^${baseName}`, $options: 'i' } },
        { genericName: { $regex: `^${baseName}`, $options: 'i' } },
        { brand: { $regex: `^${baseName}`, $options: 'i' } },
        { name: { $regex: baseName, $options: 'i' } }
      ]
    });
    
    // Get indication - QUAN TRỌNG: Phải là mô tả công dụng, không phải hàm lượng
    let indication = '';
    if (medicineInfo?.indication) {
      indication = medicineInfo.indication;
    } else if (medicine.indication) {
      indication = medicine.indication;
    } else if (medicineInfo?.description) {
      indication = medicineInfo.description;
    } else if (medicine.description) {
      indication = medicine.description;
    } else {
      // Fallback to commonMedicineInfo
      const commonInfo = commonMedicineInfo[baseName] || commonMedicineInfo[medicine.name];
      if (commonInfo) {
        indication = commonInfo.indication || commonInfo.description || '';
      }
    }
    
    // QUAN TRỌNG: Nếu indication chỉ là hàm lượng (chứa "mg" hoặc "g" và không có mô tả), 
    // thì lấy từ commonMedicineInfo hoặc tạo mô tả mặc định
    if (indication && /^\d+(\s*[+\/]\s*\d+)?\s*(mg|g|ml|%)/i.test(indication.trim()) && indication.length < 50) {
      // Có thể là hàm lượng, không phải công dụng
      const commonInfo = commonMedicineInfo[baseName] || commonMedicineInfo[medicine.name];
      if (commonInfo) {
        indication = commonInfo.indication || commonInfo.description || '';
      } else {
        // Tạo mô tả mặc định dựa trên tên thuốc
        if (baseName.toLowerCase().includes('paracetamol') || medicine.name.toLowerCase().includes('paracetamol')) {
          indication = 'Hạ sốt, giảm đau nhẹ đến vừa';
        } else if (baseName.toLowerCase().includes('panadol') || medicine.name.toLowerCase().includes('panadol')) {
          indication = 'Giảm đau, hạ sốt, giảm mệt mỏi';
        } else if (baseName.toLowerCase().includes('efferalgan') || medicine.name.toLowerCase().includes('efferalgan')) {
          indication = 'Hạ sốt, giảm đau nhẹ đến vừa';
        } else if (baseName.toLowerCase().includes('decolgen') || medicine.name.toLowerCase().includes('decolgen')) {
          indication = 'Điều trị triệu chứng cảm cúm: hạ sốt, giảm đau, giảm nghẹt mũi, sổ mũi';
        } else if (baseName.toLowerCase().includes('tiffy') || medicine.name.toLowerCase().includes('tiffy')) {
          indication = 'Giảm nghẹt mũi, sổ mũi, đau đầu do cảm';
        } else if (baseName.toLowerCase().includes('acetylcysteine') || medicine.name.toLowerCase().includes('acetylcysteine')) {
          indication = 'Giúp tiêu đờm (chỉ dùng nếu có ho đờm)';
        } else {
          indication = 'Thông tin đang được cập nhật. Vui lòng liên hệ dược sĩ.';
        }
      }
    }
    
    return {
      ...medicine,
      indication: indication || 'Thông tin đang được cập nhật. Vui lòng liên hệ dược sĩ.',
      contraindication: medicineInfo?.contraindication || medicine.contraindication || '',
      strength: medicineInfo?.strength || medicine.strength || extractStrengthFromName(medicine.name),
      unit: medicineInfo?.unit || medicine.unit || 'đơn vị'
    };
  } catch (error) {
    console.error('Error enriching medicine info:', error);
    return medicine;
  }
}

// Extract strength/dosage from medicine name
function extractStrengthFromName(name: string): string {
  const strengthMatch = name.match(/(\d+(?:\.\d+)?\s*(?:mg|g|ml|%|mcg|iu|ui)(?:\s*[+\/]\s*\d+(?:\.\d+)?\s*(?:mg|g|ml|%|mcg|iu|ui)?)?)/i);
  return strengthMatch ? strengthMatch[1] : '';
}

// Format symptom-based medicine suggestions (improved with specific medicine names)
async function formatSymptomBasedResponse(medicines: any[], symptoms: string[]): Promise<string> {
  if (medicines.length === 0) {
    // Even if no medicines, return format-compliant response
    return `Dưới đây là các thuốc phù hợp với tình trạng của bạn:

1. **Paracetamol** (Hapacol / Panadol)
   - Công dụng: Hạ sốt, giảm đau nhẹ đến vừa
   - Liều: 1 viên 500mg mỗi 4-6 giờ, tối đa 8 viên/ngày
   - Lưu ý: Không dùng quá 4g Paracetamol/ngày

⚠️ Lưu ý chung:
- Không dùng chung nhiều thuốc chứa Paracetamol.
- Nếu sốt cao liên tục >39°C, khó thở, đau ngực → đi khám ngay.
- Đọc kỹ hướng dẫn sử dụng trước khi dùng.

Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi.`;
  }
  
  // QUAN TRỌNG: Phải dùng format bắt buộc
  let response = `Dưới đây là các thuốc phù hợp với tình trạng của bạn:\n\n`;
  
  // Enrich medicine information - Limit to 3 medicines max (để tránh dài dòng)
  const enrichedMedicines = await Promise.all(
    medicines.slice(0, 3).map(med => enrichMedicineInfo(med))
  );
  
  enrichedMedicines.forEach((medicine, index) => {
    response += `${index + 1}. **${medicine.name}**${medicine.brand ? ` (${medicine.brand})` : ''}\n`;
    
    // Công dụng - QUAN TRỌNG: Phải là mô tả công dụng, không phải hàm lượng
    let indication = medicine.indication || medicine.description || '';
    
    // Kiểm tra xem indication có phải là hàm lượng không
    const isOnlyStrength = indication && /^\d+(\s*[+\/]\s*\d+)?\s*(mg|g|ml|%)/i.test(indication.trim()) && indication.length < 50;
    
    // Kiểm tra xem indication có chứa "đang cập nhật" không
    const isUpdating = indication && (indication.includes('đang cập nhật') || indication.includes('cập nhật') || indication.includes('thông tin đang được'));
    
    if (indication && !isOnlyStrength && !isUpdating) {
      const shortIndication = indication.length > 150 
        ? indication.substring(0, 150) + '...' 
        : indication;
      response += `   - Công dụng: ${shortIndication}\n`;
    } else {
      // Nếu indication là hàm lượng hoặc rỗng, tạo mô tả mặc định
      const baseName = medicine.name.replace(/\d+\s*(mg|g|ml|%|viên|hộp)/gi, '').trim().split('_')[0].split(' ')[0].toLowerCase();
      let defaultIndication = '';
      
      if (baseName.includes('paracetamol')) {
        defaultIndication = 'Hạ sốt, giảm đau nhẹ đến vừa';
      } else if (baseName.includes('panadol')) {
        defaultIndication = 'Giảm đau, hạ sốt, giảm mệt mỏi';
      } else if (baseName.includes('efferalgan')) {
        defaultIndication = 'Hạ sốt, giảm đau nhẹ đến vừa';
      } else if (baseName.includes('decolgen')) {
        defaultIndication = 'Điều trị triệu chứng cảm cúm: hạ sốt, giảm đau, giảm nghẹt mũi, sổ mũi';
      } else if (baseName.includes('tiffy')) {
        defaultIndication = 'Giảm nghẹt mũi, sổ mũi, đau đầu do cảm';
      } else if (baseName.includes('acetylcysteine')) {
        defaultIndication = 'Giúp tiêu đờm (chỉ dùng nếu có ho đờm)';
      } else if (baseName.includes('cetirizine') || baseName.includes('cetirizin')) {
        defaultIndication = 'Giảm các triệu chứng dị ứng: ngứa, nổi mề đay, viêm mũi dị ứng, phát ban. Ít gây buồn ngủ.';
      } else if (baseName.includes('loratadine') || baseName.includes('loratadin')) {
        defaultIndication = 'Giảm các triệu chứng dị ứng: viêm mũi dị ứng, mề đay, ngứa. Ít gây buồn ngủ, phù hợp dùng ban ngày.';
      } else if (baseName.includes('fexofenadine') || baseName.includes('fexofenadin')) {
        defaultIndication = 'Giảm các triệu chứng dị ứng: mề đay, viêm mũi dị ứng. Ít gây buồn ngủ, tác dụng kéo dài.';
      } else if (baseName.includes('clorpheniramin') || baseName.includes('chlorpheniramine')) {
        defaultIndication = 'Điều trị các triệu chứng dị ứng: mề đay, ngứa, viêm mũi dị ứng, phát ban. Có thể gây buồn ngủ.';
      } else {
        // Try to get from commonMedicineInfo
        const commonInfo = commonMedicineInfo[medicine.name] || commonMedicineInfo[baseName];
        defaultIndication = commonInfo?.indication || '';
        
        // Nếu vẫn không có, kiểm tra xem có phải là "đang cập nhật" không
        if (!defaultIndication || defaultIndication.includes('đang cập nhật') || defaultIndication.includes('cập nhật')) {
          // Generate mô tả dựa trên tên thuốc nếu có thể
          if (baseName.includes('antihistamin') || baseName.includes('kháng dị ứng')) {
            defaultIndication = 'Giảm các triệu chứng dị ứng: ngứa, mề đay, viêm mũi dị ứng.';
          } else {
            // Không hiển thị "đang cập nhật", để trống hoặc generate mô tả chung
            defaultIndication = 'Thuốc điều trị các triệu chứng dị ứng.';
          }
        }
      }
      
      response += `   - Công dụng: ${defaultIndication}\n`;
    }
    
    // Liều dùng
    const dosage = medicine.dosage || medicineDosageReference[medicine.name] || medicineDosageReference[medicine.name?.split(' ')[0]];
    if (dosage) {
      // Extract just the dosage part, not the warning
      const dosageOnly = dosage.split('⚠️')[0].trim();
      response += `   - Liều: ${dosageOnly}\n`;
    } else {
      response += `   - Liều: Theo hướng dẫn bao bì / hỏi dược sĩ\n`;
    }
    
    // Giá - CHỈ hiển thị nếu có
    if (medicine.price && medicine.price > 0) {
      response += `   💰 Giá: ${medicine.price.toLocaleString('vi-VN')}đ\n`;
    }
    
    // Lưu ý
    if (medicine.contraindication || medicine.sideEffect) {
      response += `   - Lưu ý: ${medicine.contraindication || ''}${medicine.contraindication && medicine.sideEffect ? ' | ' : ''}${medicine.sideEffect || ''}\n`;
    } else {
      // Add default note if needed
      const baseName = medicine.name.replace(/\d+\s*(mg|g|ml|%|viên|hộp)/gi, '').trim().split('_')[0].split(' ')[0];
      if (baseName.toLowerCase().includes('paracetamol')) {
        response += `   - Lưu ý: Không dùng quá 4g Paracetamol/ngày\n`;
      } else if (baseName.toLowerCase().includes('decolgen')) {
        response += `   - Lưu ý: Có thể gây buồn ngủ\n`;
      }
    }
    
    response += '\n';
  });
  
  response += `⚠️ Lưu ý chung:\n`;
  response += `- Không dùng chung nhiều thuốc chứa cùng hoạt chất.\n`;
  response += `- Nếu sốt cao liên tục >39°C, khó thở, đau ngực → đi khám ngay.\n`;
  response += `- Đọc kỹ hướng dẫn sử dụng trước khi dùng.\n\n`;
  response += `Ngoài ra, bạn nên uống nhiều nước, giữ ấm và nghỉ ngơi.`;
  
  return response;
}

// Format detailed medicine information
function formatMedicineDetails(medicine: any, query: string): string {
  // For usage queries, use generic name instead of specific product name
  const displayName = query.includes('công dụng') || query.includes('dùng để') ? 
    (medicine.name.split('_')[0] || medicine.name.split(' ')[0] || medicine.name) : 
    medicine.name;
  
  let response = `📋 **Thông tin chi tiết về ${displayName}:**\n\n`;
  
  if (medicine.brand && !query.includes('công dụng') && !query.includes('dùng để')) {
    response += `🏷️ **Thương hiệu:** ${medicine.brand}\n\n`;
  }
  
  if (query.includes('công dụng') || query.includes('dùng để làm gì') || 
      query.includes('dùng để trị') || query.includes('trị bệnh gì') ||
      query.includes('có tác dụng gì') || query.includes('dùng vào mục đích gì') ||
      query.includes('chữa bệnh gì') || query.includes('trị những bệnh nào')) {
    if (medicine.indication) {
      response += `💊 **Công dụng:**\n${medicine.indication}\n\n`;
    } else if (medicine.description) {
      response += `💊 **Công dụng:**\n${medicine.description}\n\n`;
    } else {
      response += `💊 **Công dụng:** Thông tin đang được cập nhật. Vui lòng liên hệ dược sĩ để được tư vấn chi tiết.\n\n`;
    }
  }
  
  if (query.includes('thành phần')) {
    // Try to extract from description or use generic response
    response += `🧪 **Thành phần:** Thông tin chi tiết về thành phần vui lòng xem trên bao bì sản phẩm hoặc liên hệ dược sĩ.\n\n`;
  }
  
  if (query.includes('chống chỉ định')) {
    if (medicine.contraindication) {
      response += `⚠️ **Chống chỉ định:**\n${medicine.contraindication}\n\n`;
    } else {
      response += `⚠️ **Chống chỉ định:** Thông tin đang được cập nhật. Vui lòng tham khảo ý kiến bác sĩ/dược sĩ.\n\n`;
    }
  }
  
  if (query.includes('tương tác')) {
    if (medicine.interaction) {
      response += `🔗 **Tương tác thuốc:**\n${medicine.interaction}\n\n`;
    } else {
      response += `🔗 **Tương tác thuốc:** Vui lòng thông báo cho bác sĩ/dược sĩ về tất cả các thuốc bạn đang sử dụng để tránh tương tác.\n\n`;
    }
  }
  
  if (query.includes('tác dụng phụ')) {
    if (medicine.sideEffect) {
      response += `⚠️ **Tác dụng phụ:**\n${medicine.sideEffect}\n\n`;
    } else {
      response += `⚠️ **Tác dụng phụ:** Vui lòng đọc kỹ hướng dẫn sử dụng và tham khảo ý kiến bác sĩ nếu có bất kỳ phản ứng bất thường nào.\n\n`;
    }
  }
  
  // Only show price and stock for non-usage queries
  if (!query.includes('công dụng') && !query.includes('dùng để') && 
      !query.includes('tác dụng') && !query.includes('trị bệnh') &&
      !query.includes('chữa bệnh')) {
    if (medicine.price && medicine.price > 0) {
      response += `💰 **Giá:** ${medicine.price.toLocaleString('vi-VN')}đ\n`;
    }
    
    if (medicine.stockQuantity !== undefined) {
      response += `📦 **Tồn kho:** ${medicine.stockQuantity} ${medicine.unit || 'sản phẩm'}\n`;
    }
  }
  
  response += `\n⚠️ **Lưu ý quan trọng:** Thông tin trên chỉ mang tính chất tham khảo. Liều dùng cụ thể cần được tư vấn bởi bác sĩ/dược sĩ. Không tự ý thay đổi liều lượng hoặc ngừng thuốc mà không có chỉ định.`;
  
  return response;
}

// Get recommended medicines based on purchase history
async function getRecommendedMedicines(purchaseHistory: any[]): Promise<any[]> {
  try {
    const recommendedNames = new Set<string>();
    
    // Get recommendations for each purchased medicine
    for (const item of purchaseHistory) {
      const productName = item.productName;
      
      // Check if we have recommendations for this medicine
      for (const [medicine, recommendations] of Object.entries(medicineRecommendations)) {
        if (productName.toLowerCase().includes(medicine.toLowerCase()) || 
            medicine.toLowerCase().includes(productName.toLowerCase())) {
          recommendations.forEach(rec => recommendedNames.add(rec));
        }
      }
    }
    
    if (recommendedNames.size === 0) return [];
    
    // Search for recommended medicines in database
    const db = mongoose.connection.db;
    if (!db) return [];
    
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');
    
    const recommendationArray = Array.from(recommendedNames);
    const searchQueries = recommendationArray.map(name => ({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { brand: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } }
      ]
    }));
    
    let products = await productsCollection.find({
      $or: searchQueries,
      inStock: true,
      stockQuantity: { $gt: 0 }
    })
    .limit(10)
    .toArray();
    
    // If not enough, search in medicines collection
    if (products.length < recommendationArray.length) {
      const medicines = await medicinesCollection.find({
        $or: searchQueries
      })
      .limit(10 - products.length)
      .toArray();
      
      const convertedMedicines = medicines.map(med => ({
        _id: med._id,
        name: med.name,
        price: med.price || 0,
        description: med.description || med.indication || '',
        brand: med.brand || '',
        inStock: true,
        stockQuantity: med.stockQuantity || 0,
        unit: med.unit || 'đơn vị',
        imageUrl: med.imageUrl || ''
      }));
      
      products = [...products, ...convertedMedicines];
    }
    
    return products;
  } catch (error) {
    console.error('Error getting recommended medicines:', error);
    return [];
  }
}

// Format purchase history suggestions with recommendations
async function formatPurchaseHistorySuggestions(history: any[]): Promise<string> {
  // Group by product name and get most recent purchases
  const productMap = new Map();
  
  for (const item of history) {
    const key = item.productName;
    if (!productMap.has(key) || productMap.get(key).lastPurchased < item.lastPurchased) {
      productMap.set(key, item);
    }
  }
  
  const uniqueProducts = Array.from(productMap.values())
    .sort((a, b) => b.lastPurchased - a.lastPurchased)
    .slice(0, 5);
  
  if (uniqueProducts.length === 0) {
    return "Bạn chưa có lịch sử mua hàng. Hãy thử một số sản phẩm phổ biến của chúng tôi!";
  }
  
  let response = `📋 **Dựa trên lịch sử mua hàng của bạn:**\n\n`;
  
  uniqueProducts.forEach((item, index) => {
    const daysAgo = Math.floor((Date.now() - new Date(item.lastPurchased).getTime()) / (1000 * 60 * 60 * 24));
    response += `${index + 1}. **${item.productName}**\n`;
    if (item.brand) {
      response += `   Thương hiệu: ${item.brand}\n`;
    }
    response += `   Đã mua: ${daysAgo} ngày trước\n\n`;
  });
  
  // Get recommended medicines
  const recommendedMedicines = await getRecommendedMedicines(uniqueProducts);
  
  if (recommendedMedicines.length > 0) {
    response += `💡 **Gợi ý thuốc liên quan:**\n\n`;
    recommendedMedicines.slice(0, 5).forEach((med, index) => {
      response += `${index + 1}. **${med.name}**\n`;
      if (med.brand) {
        response += `   Thương hiệu: ${med.brand}\n`;
      }
      if (med.price) {
        response += `   Giá: ${med.price.toLocaleString('vi-VN')}đ\n`;
      }
      response += `\n`;
    });
  }
  
  response += "Bạn có muốn mua lại các sản phẩm này hoặc thử các gợi ý mới không?";
  
  return response;
}

// Analyze prescription image
async function analyzePrescriptionImage(imageBase64: string): Promise<string> {
  try {
    // Save base64 image to temp file
    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid image format');
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
    const timestamp = Date.now();
    const filename = `temp_prescription_${timestamp}.${extension}`;
    
    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const imagePath = path.join(tempDir, filename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(imagePath, buffer);
    
    // Extract text from image using OCR
    console.log('📷 Extracting text from prescription image...');
    const prescriptionText = await extractTextFromImage(imagePath);
    
    // Clean up temp file
    try {
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error('Error deleting temp file:', error);
    }
    
    if (!prescriptionText || prescriptionText.trim().length === 0) {
      return "Xin lỗi, tôi không thể đọc được nội dung từ hình ảnh đơn thuốc. Vui lòng đảm bảo hình ảnh rõ ràng và thử lại.";
    }
    
    // Analyze prescription text to find medicines
    const analysisResult = await analyzePrescriptionText(prescriptionText);
    
    return formatPrescriptionAnalysis(analysisResult);
    
  } catch (error) {
    console.error('Error analyzing prescription image:', error);
    return "Xin lỗi, đã có lỗi xảy ra khi phân tích đơn thuốc. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.";
  }
}

// Analyze prescription text to find medicines
async function analyzePrescriptionText(prescriptionText: string): Promise<any> {
  const foundMedicines: any[] = [];
  const notFoundMedicines: any[] = [];
  
  const lines = prescriptionText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Pattern to match medicine names (e.g., "1) MEDICINE", "1. MEDICINE")
  const medicinePattern = /\d+[\.\)]\s*((?:(?!\s*\d+[\.\)]).)+?)(?=\s*\d+[\.\)]|$)/g;
  
  for (const line of lines) {
    // Skip non-medicine lines
    if (line.includes('ĐƠN THUỐC') || 
        line.includes('Họ tên') || 
        line.includes('Tuổi') || 
        line.includes('Chẩn đoán') ||
        line.includes('Ngày')) {
      continue;
    }
    
    let match;
    medicinePattern.lastIndex = 0;
    
    while ((match = medicinePattern.exec(line)) !== null) {
      const medicineText = match[1].trim();
      
      if (medicineText && medicineText.length > 2 && /[a-zA-ZÀ-ỹ]/.test(medicineText)) {
        // Extract medicine name (remove usage instructions)
        let medicineNameOnly = medicineText;
        const usagePatterns = [
          /\s*-\s*(?:Sáng|Tối|Trưa|Chiều|Ngày)/i,
          /\s*SL:\s*\d+/i,
          /\s*Ghi\s+chú:/i,
          /\s*Uống:/i,
          /\s*Cách\s+dùng:/i,
          /\s*Hướng\s+dẫn:/i,
        ];
        
        for (const pattern of usagePatterns) {
          const usageMatch = medicineNameOnly.match(pattern);
          if (usageMatch && usageMatch.index !== undefined) {
            medicineNameOnly = medicineNameOnly.substring(0, usageMatch.index).trim();
            break;
          }
        }
        
        // Extract brand name from parentheses
        let brandNameFromParentheses: string | null = null;
        const parenthesesMatch = medicineNameOnly.match(/\(([^)]+)\)/);
        if (parenthesesMatch && parenthesesMatch[1]) {
          const contentInParentheses = parenthesesMatch[1].trim();
          const brandMatch = contentInParentheses.match(/^([A-Za-zÀ-ỹ]+(?:\s+[A-Za-zÀ-ỹ]+)?)/);
          if (brandMatch) {
            brandNameFromParentheses = brandMatch[1].trim();
          }
        }
        
        const withoutParentheses = medicineNameOnly.replace(/\([^)]+\)/g, '').trim();
        const primarySearchTerm = brandNameFromParentheses || withoutParentheses;
        
        // Try to find exact match
        let exactMatch = await findExactMatch(primarySearchTerm, medicineNameOnly);
        
        if (!exactMatch && brandNameFromParentheses && withoutParentheses) {
          exactMatch = await findExactMatch(withoutParentheses, medicineNameOnly);
        }
        
        if (exactMatch && exactMatch.product) {
          const product = exactMatch.product;
          foundMedicines.push({
            originalText: medicineNameOnly,
            product: {
              name: product.name || medicineNameOnly,
              price: product.price || 0,
              brand: product.brand || '',
              stockQuantity: product.stockQuantity || 0,
              unit: product.unit || 'đơn vị',
              imageUrl: product.imageUrl || ''
            }
          });
        } else {
          // Try to find similar medicines
          let similarMedicines = await findSimilarMedicines(primarySearchTerm, medicineNameOnly, 3);
          
          if (similarMedicines.length === 0 && brandNameFromParentheses && withoutParentheses) {
            similarMedicines = await findSimilarMedicines(withoutParentheses, medicineNameOnly, 3);
          }
          
          notFoundMedicines.push({
            originalText: medicineNameOnly,
            suggestions: similarMedicines.slice(0, 3).map(med => ({
              name: med.name,
              price: med.price || 0,
              brand: med.brand || ''
            }))
          });
        }
      }
    }
  }
  
  return {
    foundMedicines,
    notFoundMedicines,
    totalFound: foundMedicines.length,
    totalNotFound: notFoundMedicines.length
  };
}

// Format prescription analysis result
function formatPrescriptionAnalysis(analysis: any): string {
  let response = "📋 **Kết quả phân tích đơn thuốc:**\n\n";
  
  if (analysis.totalFound === 0 && analysis.totalNotFound === 0) {
    return "Tôi không tìm thấy thuốc nào trong đơn thuốc. Vui lòng đảm bảo hình ảnh rõ ràng và thử lại.";
  }
  
  if (analysis.totalFound > 0) {
    response += `✅ **Tìm thấy ${analysis.totalFound} thuốc:**\n\n`;
    
    analysis.foundMedicines.forEach((item: any, index: number) => {
      const product = item.product;
      response += `${index + 1}. **${product.name}**\n`;
      if (product.brand) {
        response += `   Thương hiệu: ${product.brand}\n`;
      }
      if (product.price) {
        response += `   Giá: ${product.price.toLocaleString('vi-VN')}đ\n`;
      }
      if (product.stockQuantity !== undefined) {
        response += `   Tồn kho: ${product.stockQuantity} ${product.unit || 'sản phẩm'}\n`;
      }
      response += `   Từ đơn: ${item.originalText}\n\n`;
    });
  }
  
  if (analysis.totalNotFound > 0) {
    response += `⚠️ **${analysis.totalNotFound} thuốc cần tư vấn thêm:**\n\n`;
    analysis.notFoundMedicines.forEach((item: any, index: number) => {
      response += `${index + 1}. ${item.originalText}\n`;
      if (item.suggestions && item.suggestions.length > 0) {
        response += `   Gợi ý: ${item.suggestions.map((s: any) => s.name).join(', ')}\n`;
      }
      response += `\n`;
    });
    response += `Vui lòng liên hệ với dược sĩ để được tư vấn về các thuốc này.\n`;
  }
  
  return response;
}

// Main chat controller
export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, image, conversationHistory = [] } = req.body;
    const userId = (req as any).user?.id;
    
    // Check if image is provided
    if (image && typeof image === 'string' && image.startsWith('data:image/')) {
      console.log('📷 Processing prescription image in chat...');
      const response = await analyzePrescriptionImage(image);
      
      return res.json({
        success: true,
        response: response,
        timestamp: new Date().toISOString(),
        type: 'prescription_analysis'
      });
    }
    
    // Handle text message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message or image is required',
      });
    }
    
    // Generate AI response
    const aiResponse = await generateAIResponse(
      message.trim(),
      conversationHistory,
      userId
    );
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      type: 'text'
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

