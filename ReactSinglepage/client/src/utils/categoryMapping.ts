/**
 * Mapping giữa category trong database (medicines collection) và danh mục trong frontend
 * Dựa trên dữ liệu thực tế từ database và 27 danh mục thuốc trong frontend
 */

/**
 * Mapping từ category trong database -> các label có thể match trong frontend
 * Dựa trên dữ liệu thực tế từ medicines collection
 */
export const categoryMapping: Record<string, string[]> = {
  // Exact matches
  "Thuốc ngừa thai": ["Thuốc ngừa thai"],
  "Thuốc kháng dị ứng": ["Thuốc kháng dị ứng"],
  "Thuốc kháng viêm": ["Thuốc kháng viêm"],
  "Thuốc cảm lạnh": ["Thuốc cảm lạnh"],
  "Thuốc giảm cân": ["Thuốc giảm cân"],
  "Thuốc Mắt/Tai/Mũi": ["Thuốc Mắt/Tai/Mũi", "Thuốc nhỏ mắt", "Xịt mũi"],
  "Thuốc tiêu hóa": ["Thuốc tiêu hóa", "Thuốc tiêu hóa cho trẻ"],
  "Giảm đau, hạ sốt": ["Giảm đau, hạ sốt"],
  "Thuốc thần kinh": ["Thuốc thần kinh"],
  "Dầu, Cao xoa bóp": ["Dầu, Cao xoa bóp"],
  "Vitamin & Khoáng chất": ["Vitamin & Khoáng chất"],
  "Vitamin & Thực phẩm chức năng": ["Vitamin & Khoáng chất"],
  "Thuốc kháng sinh": ["Thuốc kháng sinh"],
  "Thuốc tim mạch, huyết áp": ["Thuốc tim mạch, huyết áp"],
  "Thuốc ho, long đờm": ["Thuốc ho, long đờm"],
  
  // Category chung - "Thuốc Không Kê Đơn" có thể là nhiều loại
  // Nhưng chúng ta sẽ không match nó với tất cả, chỉ match khi không có category cụ thể
  "Thuốc Không Kê Đơn": [], // Không match với bất kỳ danh mục cụ thể nào
};

/**
 * Reverse mapping: từ frontend label -> các category trong database có thể match
 * Để hỗ trợ các danh mục con match với danh mục cha
 */
export const reverseCategoryMapping: Record<string, string[]> = {
  "Thuốc nhỏ mắt": ["Thuốc Mắt/Tai/Mũi"],
  "Xịt mũi": ["Thuốc Mắt/Tai/Mũi"],
  "Thuốc tiêu hóa cho trẻ": ["Thuốc tiêu hóa"],
  "Thuốc dành cho nam": [], // Không có trong database
  "Thuốc da liễu": [], // Không có trong database
  "Thuốc dành cho phụ nữ": [], // Không có trong database
  "Thuốc cơ xương khớp": [], // Không có trong database
  "Thuốc khác": [], // Không có trong database
  "Thuốc tiết niệu": [], // Không có trong database
  "Thuốc tiểu đường": [], // Không có trong database
  "Thuốc ung thư": [], // Không có trong database
  "Chăm sóc vết thương": [], // Không có trong database
  "Sản phẩm trị mụn": [], // Không có trong database
};

/**
 * Tìm label trong frontend từ category trong database
 */
export function getFrontendLabelFromCategory(dbCategory: string): string | null {
  if (!dbCategory) return null;
  
  // Normalize category
  const normalizedCategory = dbCategory.trim();
  
  // Thử exact match trước
  if (categoryMapping[normalizedCategory]) {
    // Trả về label đầu tiên (thường là exact match)
    return categoryMapping[normalizedCategory][0];
  }
  
  // Thử partial match
  for (const [dbCat, labels] of Object.entries(categoryMapping)) {
    if (normalizedCategory.toLowerCase().includes(dbCat.toLowerCase()) ||
        dbCat.toLowerCase().includes(normalizedCategory.toLowerCase())) {
      return labels[0];
    }
  }
  
  // Nếu không tìm thấy, trả về category gốc
  return normalizedCategory;
}

/**
 * Kiểm tra xem category trong database có match với label trong frontend không
 */
export function isCategoryMatch(dbCategory: string, frontendLabel: string): boolean {
  if (!dbCategory || !frontendLabel) return false;
  
  const normalizedDbCategory = dbCategory.trim().toLowerCase();
  const normalizedFrontendLabel = frontendLabel.trim().toLowerCase();
  
  // Exact match (case-insensitive)
  if (normalizedDbCategory === normalizedFrontendLabel) {
    return true;
  }
  
  // Kiểm tra trong mapping (database -> frontend)
  const mappedLabels = categoryMapping[dbCategory.trim()];
  if (mappedLabels && mappedLabels.length > 0) {
    const match = mappedLabels.some(label => 
      label.trim().toLowerCase() === normalizedFrontendLabel
    );
    if (match) return true;
  }
  
  // Kiểm tra reverse mapping (frontend -> database)
  // Ví dụ: "Thuốc nhỏ mắt" (frontend) -> "Thuốc Mắt/Tai/Mũi" (database)
  const reverseMappedCategories = reverseCategoryMapping[frontendLabel.trim()];
  if (reverseMappedCategories && reverseMappedCategories.length > 0) {
    const match = reverseMappedCategories.some(cat => 
      cat.trim().toLowerCase() === normalizedDbCategory
    );
    if (match) return true;
  }
  
  // Partial match - kiểm tra nếu một trong hai chứa cái kia
  // Ví dụ: "Dầu, Cao xoa bóp" match với "Dầu, Cao xoa bóp"
  if (normalizedDbCategory.includes(normalizedFrontendLabel) ||
      normalizedFrontendLabel.includes(normalizedDbCategory)) {
    // Nhưng không match nếu quá khác biệt (ví dụ: "Thuốc" match với mọi thứ)
    const minLength = Math.min(normalizedDbCategory.length, normalizedFrontendLabel.length);
    if (minLength >= 5) { // Chỉ match nếu ít nhất 5 ký tự giống nhau
      return true;
    }
  }
  
  // Special cases - match các biến thể
  const specialMatches: Record<string, string[]> = {
    "dầu, cao xoa bóp": ["dầu, cao xoa bóp"],
    "vitamin & khoáng chất": ["vitamin & khoáng chất", "vitamin & thực phẩm chức năng"],
    "vitamin & thực phẩm chức năng": ["vitamin & khoáng chất"],
    "thuốc mắt/tai/mũi": ["thuốc mắt/tai/mũi", "thuốc nhỏ mắt", "xịt mũi"],
    "thuốc tiêu hóa": ["thuốc tiêu hóa", "thuốc tiêu hóa cho trẻ"],
  };
  
  const specialMatch = specialMatches[normalizedDbCategory];
  if (specialMatch && specialMatch.includes(normalizedFrontendLabel)) {
    return true;
  }
  
  // Kiểm tra reverse special matches
  const reverseSpecialMatches: Record<string, string[]> = {
    "thuốc nhỏ mắt": ["thuốc mắt/tai/mũi"],
    "xịt mũi": ["thuốc mắt/tai/mũi"],
    "thuốc tiêu hóa cho trẻ": ["thuốc tiêu hóa"],
  };
  
  const reverseSpecialMatch = reverseSpecialMatches[normalizedFrontendLabel];
  if (reverseSpecialMatch && reverseSpecialMatch.includes(normalizedDbCategory)) {
    return true;
  }
  
  return false;
}

