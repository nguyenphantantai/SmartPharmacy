// Database sản phẩm thuốc mẫu
export interface MedicineProduct {
  id: string;
  name: string;
  activeIngredient: string;
  dosage: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
  description: string;
  requiresPrescription: boolean;
  stock: number;
  category: string;
  alternatives?: string[]; // Các thuốc thay thế
}

// Kết quả phân tích đơn thuốc
export interface PrescriptionAnalysisResult {
  foundMedicines: {
    medicine: MedicineProduct;
    confidence: number; // Độ tin cậy của việc mapping (0-1)
    originalText: string; // Text gốc trong đơn thuốc
  }[];
  notFoundMedicines: {
    originalText: string;
    suggestions: string[];
  }[];
  totalEstimatedPrice: number;
  requiresConsultation: boolean;
  analysisNotes: string[];
}

// Database thuốc mẫu
export const MEDICINE_DATABASE: MedicineProduct[] = [
  {
    id: "med-001",
    name: "Paracetamol 500mg",
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    manufacturer: "Traphaco",
    price: 25000,
    imageUrl: "/images/medicines/paracetamol.jpg",
    description: "Thuốc giảm đau, hạ sốt",
    requiresPrescription: false,
    stock: 100,
    category: "Giảm đau, hạ sốt",
    alternatives: ["Acetaminophen", "Tylenol"]
  },
  {
    id: "med-002",
    name: "Aspirin 81mg",
    activeIngredient: "Aspirin",
    dosage: "81mg",
    manufacturer: "Bayer",
    price: 45000,
    imageUrl: "/images/medicines/aspirin.jpg",
    description: "Thuốc chống viêm, giảm đau",
    requiresPrescription: false,
    stock: 50,
    category: "Chống viêm",
    alternatives: ["Acetylsalicylic acid"]
  },
  {
    id: "med-003",
    name: "Amoxicillin 500mg",
    activeIngredient: "Amoxicillin",
    dosage: "500mg",
    manufacturer: "Stada",
    price: 120000,
    imageUrl: "/images/medicines/amoxicillin.jpg",
    description: "Kháng sinh điều trị nhiễm khuẩn",
    requiresPrescription: true,
    stock: 30,
    category: "Kháng sinh",
    alternatives: ["Penicillin", "Augmentin"]
  },
  {
    id: "med-004",
    name: "Omeprazole 20mg",
    activeIngredient: "Omeprazole",
    dosage: "20mg",
    manufacturer: "AstraZeneca",
    price: 85000,
    imageUrl: "/images/medicines/omeprazole.jpg",
    description: "Thuốc điều trị dạ dày",
    requiresPrescription: false,
    stock: 75,
    category: "Tiêu hóa",
    alternatives: ["Lansoprazole", "Pantoprazole"]
  },
  {
    id: "med-005",
    name: "Calcium Carbonate + Vitamin D3",
    activeIngredient: "Calcium Carbonate + Vitamin D3",
    dosage: "1250mg + 200IU",
    manufacturer: "AGI",
    price: 95000,
    imageUrl: "/images/medicines/calcium.jpg",
    description: "Bổ sung canxi và vitamin D3",
    requiresPrescription: false,
    stock: 60,
    category: "Bổ sung",
    alternatives: ["Calcium Citrate", "Caltrate"]
  },
  {
    id: "med-006",
    name: "Ibuprofen 400mg",
    activeIngredient: "Ibuprofen",
    dosage: "400mg",
    manufacturer: "Pfizer",
    price: 35000,
    imageUrl: "/images/medicines/ibuprofen.jpg",
    description: "Thuốc chống viêm, giảm đau",
    requiresPrescription: false,
    stock: 80,
    category: "Chống viêm",
    alternatives: ["Advil", "Motrin"]
  },
  {
    id: "med-007",
    name: "Cetirizine 10mg",
    activeIngredient: "Cetirizine",
    dosage: "10mg",
    manufacturer: "GSK",
    price: 28000,
    imageUrl: "/images/medicines/cetirizine.jpg",
    description: "Thuốc kháng histamine",
    requiresPrescription: false,
    stock: 90,
    category: "Dị ứng",
    alternatives: ["Loratadine", "Fexofenadine"]
  },
  {
    id: "med-008",
    name: "Metformin 500mg",
    activeIngredient: "Metformin",
    dosage: "500mg",
    manufacturer: "Merck",
    price: 150000,
    imageUrl: "/images/medicines/metformin.jpg",
    description: "Thuốc điều trị tiểu đường",
    requiresPrescription: true,
    stock: 25,
    category: "Nội tiết",
    alternatives: ["Glucophage"]
  },
  // Thuốc từ đơn thuốc thực tế của bạn
  {
    id: "med-009",
    name: "SIMETHICON B 80mg",
    activeIngredient: "Simethicone",
    dosage: "80mg",
    manufacturer: "Bayer",
    price: 45000,
    imageUrl: "/images/medicines/simethicone.jpg",
    description: "Thuốc điều trị đầy hơi, chướng bụng",
    requiresPrescription: false,
    stock: 120,
    category: "Tiêu hóa",
    alternatives: ["Simethicone", "Gas-X", "Mylicon"]
  },
  {
    id: "med-010",
    name: "MALTAGIT 2500mg+500mg",
    activeIngredient: "Maltodextrin + Lactobacillus",
    dosage: "2500mg + 500mg",
    manufacturer: "Sanofi",
    price: 180000,
    imageUrl: "/images/medicines/maltagit.jpg",
    description: "Men tiêu hóa, hỗ trợ tiêu hóa",
    requiresPrescription: false,
    stock: 85,
    category: "Tiêu hóa",
    alternatives: ["Maltodextrin", "Probiotics", "Digestive enzymes"]
  }
];

// Hàm tìm kiếm thuốc với fuzzy matching
export function findMedicineInDatabase(medicineText: string): {
  medicine: MedicineProduct;
  confidence: number;
  originalText: string;
} | null {
  const normalizedText = medicineText.toLowerCase().trim();
  
  // Tìm kiếm chính xác trước
  for (const medicine of MEDICINE_DATABASE) {
    if (medicine.name.toLowerCase().includes(normalizedText) ||
        medicine.activeIngredient.toLowerCase().includes(normalizedText)) {
      return {
        medicine,
        confidence: 0.9,
        originalText: medicineText
      };
    }
  }
  
  // Tìm kiếm fuzzy với alternatives
  for (const medicine of MEDICINE_DATABASE) {
    if (medicine.alternatives) {
      for (const alt of medicine.alternatives) {
        if (alt.toLowerCase().includes(normalizedText) ||
            normalizedText.includes(alt.toLowerCase())) {
          return {
            medicine,
            confidence: 0.7,
            originalText: medicineText
          };
        }
      }
    }
  }
  
  // Tìm kiếm partial match
  for (const medicine of MEDICINE_DATABASE) {
    const words = normalizedText.split(/\s+/);
    const medicineWords = medicine.name.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    for (const word of words) {
      if (medicineWords.some(mw => mw.includes(word) || word.includes(mw))) {
        matchCount++;
      }
    }
    
    if (matchCount > 0 && matchCount / words.length > 0.5) {
      return {
        medicine,
        confidence: 0.5 + (matchCount / words.length) * 0.3,
        originalText: medicineText
      };
    }
  }
  
  return null;
}

// Hàm phân tích đơn thuốc từ text
export function analyzePrescriptionText(prescriptionText: string): PrescriptionAnalysisResult {
  // Tách các dòng và tìm thuốc
  const lines = prescriptionText.split('\n').map(line => line.trim()).filter(line => line);
  
  const foundMedicines: PrescriptionAnalysisResult['foundMedicines'] = [];
  const notFoundMedicines: PrescriptionAnalysisResult['notFoundMedicines'] = [];
  const analysisNotes: string[] = [];
  
  let totalEstimatedPrice = 0;
  let requiresConsultation = false;
  
  for (const line of lines) {
    // Bỏ qua các dòng không phải thuốc
    if (line.includes('ĐƠN THUỐC') || 
        line.includes('Họ tên') || 
        line.includes('Tuổi') || 
        line.includes('Chẩn đoán') ||
        line.includes('Ngày') ||
        line.includes('Bác sĩ')) {
      continue;
    }
    
    // Tìm số thứ tự thuốc (1., 2., etc.)
    const medicineMatch = line.match(/^\d+\.\s*(.+)/);
    if (medicineMatch) {
      const medicineText = medicineMatch[1];
      const result = findMedicineInDatabase(medicineText);
      
      if (result) {
        foundMedicines.push(result);
        totalEstimatedPrice += result.medicine.price;
        
        if (result.medicine.requiresPrescription) {
          analysisNotes.push(`⚠️ ${result.medicine.name} cần đơn bác sĩ`);
          requiresConsultation = true;
        }
        
        if (result.medicine.stock < 10) {
          analysisNotes.push(`⚠️ ${result.medicine.name} sắp hết hàng (còn ${result.medicine.stock} hộp)`);
        }
      } else {
        // Tìm gợi ý thuốc tương tự
        const suggestions = MEDICINE_DATABASE
          .filter(med => med.name.toLowerCase().includes(medicineText.toLowerCase().split(' ')[0]))
          .slice(0, 3)
          .map(med => med.name);
        
        notFoundMedicines.push({
          originalText: medicineText,
          suggestions
        });
        
        requiresConsultation = true;
      }
    }
  }
  
  if (foundMedicines.length === 0) {
    analysisNotes.push("Không tìm thấy thuốc nào trong đơn. Vui lòng liên hệ tư vấn viên.");
    requiresConsultation = true;
  } else if (notFoundMedicines.length > 0) {
    analysisNotes.push(`Tìm thấy ${foundMedicines.length} thuốc, ${notFoundMedicines.length} thuốc cần tư vấn thêm`);
  } else {
    analysisNotes.push(`✅ Tìm thấy tất cả ${foundMedicines.length} thuốc trong đơn`);
  }
  
  return {
    foundMedicines,
    notFoundMedicines,
    totalEstimatedPrice,
    requiresConsultation,
    analysisNotes
  };
}

// Hàm phân tích từ hình ảnh đơn thuốc (mock - trong thực tế sẽ dùng OCR)
export function analyzePrescriptionImage(imageUrl: string): Promise<PrescriptionAnalysisResult> {
  return new Promise((resolve) => {
    // Mock data dựa trên đơn thuốc thực tế của bạn
    setTimeout(() => {
      const mockPrescriptionText = `
ĐƠN THUỐC BHYT
Mã số người bệnh: 3200823
Họ và tên: HÀ THỊ HỘC
Năm sinh: 1957
Giới tính: Nữ
Địa chỉ: Tân Phong, Xã Tân Hội, Thị xã Cai Lậy, Tỉnh Tiền Giang
Thẻ bảo hiểm y tế: GD 4 82 82 220 81487 82196
Mạch: 80 lần/phút
Huyết áp: 130/80 mmHg
Thân nhiệt: 37°C
Chẩn đoán: K21 - Bệnh trào ngược dạ dày - thực quản

1. SIMETHICON B 80mg - Sáng 1 viên, Tối 1 viên - SL: 10 viên
2. MALTAGIT 2500mg+500mg - Sáng 1 gói, Tối 1 gói - SL: 20 gói

Ngày: 03/09/2025
Y, Bác sĩ điều trị: BS. Nguyễn Quốc Tiến
Thời gian: 16:11:05
      `;
      
      resolve(analyzePrescriptionText(mockPrescriptionText));
    }, 2000);
  });
}
