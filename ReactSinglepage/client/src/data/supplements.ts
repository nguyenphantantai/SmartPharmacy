export interface SupplementProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  unit: string;
  imageUrl: string;
  category: string;
  brand: string;
  isNew?: boolean;
}

export const supplementProducts: SupplementProduct[] = [
  {
    id: "1",
    name: "Codatux SYRUP",
    description: "Thực phẩm bảo vệ sức khỏe Codatux Siro Giúp hỗ trợ giảm ho, long đờm",
    price: "180000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191727-0-P00126_5.png",
    category: "Nhóm hô hấp",
    brand: "IMC"
  },
  {
    id: "2",
    name: "Eugica Candy",
    description: "Kẹo ngậm Eugica hỗ trợ làm dịu cổ họng, giảm ho",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm hô hấp",
    brand: "Kolmar"
  },
  {
    id: "3",
    name: "An Tri Vương",
    description: "Viên uống An Trĩ Vương hỗ trợ làm giảm các triệu chứng trĩ",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm dạ dày",
    brand: "Traphaco"
  },
  {
    id: "4",
    name: "Bảo Xuân Gold",
    description: "Thực phẩm bảo vệ sức khỏe Bảo Xuân Gold hỗ trợ cân bằng nội tiết tố nữ",
    price: "280000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Hỗ trợ sinh lý nam nữ",
    brand: "Thai Minh"
  },
  {
    id: "5",
    name: "Lactomin Plus",
    description: "Bột pha uống Lactomin Plus bổ sung vi khuẩn có lợi cho đường ruột",
    price: "250000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm dạ dày",
    brand: "DHG Pharma"
  },
  {
    id: "6",
    name: "Diabetna",
    description: "Thực phẩm bảo vệ sức khỏe Diabetna hỗ trợ ổn định đường huyết",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm đường huyết",
    brand: "Nam Dược"
  },
  {
    id: "7",
    name: "Tràng Phục Linh",
    description: "Viên uống Tràng Phục Linh hỗ trợ giảm các triệu chứng viêm đại tràng",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm dạ dày",
    brand: "Traphaco"
  },
  {
    id: "8",
    name: "NAT C",
    description: "Viên uống NAT C bổ sung Vitamin C tự nhiên, tăng cường sức đề kháng",
    price: "180000",
    unit: "Lọ",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Vitamin và khoáng chất",
    brand: "Mega WeCare"
  },
  {
    id: "9",
    name: "Cologrin Sweetener",
    description: "Đường ăn kiêng Cologrin dành cho người tiểu đường",
    price: "200000",
    unit: "Chai",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm đường huyết",
    brand: "Pharmacity"
  },
  {
    id: "10",
    name: "Thiên Môn Bổ Phổi",
    description: "Thực phẩm bảo vệ sức khỏe Thiên Môn Bổ Phổi hỗ trợ tăng cường chức năng phổi",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm hô hấp",
    brand: "Thai Minh"
  },
  {
    id: "11",
    name: "Bảo Xuân Tuổi 50+",
    description: "Thực phẩm bảo vệ sức khỏe Bảo Xuân Tuổi 50+ hỗ trợ sức khỏe phụ nữ tuổi trung niên",
    price: "280000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Hỗ trợ sinh lý nam nữ",
    brand: "Thai Minh"
  },
  {
    id: "12",
    name: "ĐẠI TRÀNG TÂM BÌNH",
    description: "Viên uống Đại Tràng Tâm Bình hỗ trợ giảm đau bụng, đầy hơi do viêm đại tràng",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm dạ dày",
    brand: "Traphaco"
  },
  {
    id: "13",
    name: "VIÊN Gout TÂM BÌNH",
    description: "Viên uống Gout Tâm Bình hỗ trợ giảm đau nhức xương khớp do gout",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm cơ xương khớp",
    brand: "Traphaco"
  },
  {
    id: "14",
    name: "ÍCH THẬN VƯƠNG",
    description: "Thực phẩm bảo vệ sức khỏe Ích Thận Vương hỗ trợ tăng cường chức năng thận",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm thận tiết niệu",
    brand: "Traphaco"
  },
  {
    id: "15",
    name: "Tràng PLUS Phục Linh",
    description: "Viên uống Tràng PLUS Phục Linh hỗ trợ giảm viêm đại tràng, tăng cường tiêu hóa",
    price: "200000",
    unit: "Hộp",
    imageUrl: "https://production-cdn.pharmacity.io/digital/256x256/plain/e-com/images/ecommerce/20240223191446-0-P00218_1_l.png",
    category: "Nhóm dạ dày",
    brand: "Traphaco"
  }
];
