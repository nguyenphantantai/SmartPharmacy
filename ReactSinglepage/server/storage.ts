import { type Product, type InsertProduct, type Category, type InsertCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getHotDeals(): Promise<Product[]>;
  getTopSelling(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { name: "Tư vấn mua thuốc", icon: "fas fa-capsules", slug: "tu-van-mua-thuoc" },
      { name: "Hệ thống dược sĩ", icon: "fas fa-heartbeat", slug: "he-thong-duoc-si" },
      { name: "Mã giảm giá hàng", icon: "fas fa-percentage", slug: "ma-giam-gia" },
      { name: "Kiểm tra sức khỏe", icon: "fas fa-shipping-fast", slug: "kiem-tra-suc-khoe" },
      { name: "Chăm đẹp chuẩn", icon: "fas fa-spa", slug: "cham-dep-chuan" },
      { name: "Deal hot tháng 9", icon: "fas fa-fire", slug: "deal-hot-thang-9" },
      { name: "Lịch sử Đơn vàng", icon: "fas fa-history", slug: "lich-su-don-vang" },
    ];

    categories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, { id, ...cat });
    });

    // Seed products
    const products = [
      {
        name: "BANILA CO Clean it Zero Sáp tẩy trang giúp làm sạch",
        description: "Sáp tẩy trang làm sạch sâu, loại bỏ mọi vết trang điểm",
        price: "298000",
        originalPrice: "340000",
        discountPercentage: 12,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Chăm sóc da",
        brand: "BANILA CO",
        unit: "Hộp",
        isNew: true,
      },
      {
        name: "Enterosgermina Gut Defense 20ml/5ml",
        description: "Hỗ trợ tiêu hóa, tăng cường hệ vi sinh đường ruột",
        price: "174000",
        originalPrice: "204000",
        discountPercentage: 30,
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Tiêu hóa",
        brand: "Enterosgermina",
        unit: "Hộp",
      },
      {
        name: "Siro NATURE'S WAY Kids Smart DROPS",
        description: "Vitamin tổng hợp cho trẻ em, tăng cường sức đề kháng",
        price: "338000",
        originalPrice: "395000",
        discountPercentage: 14,
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Mẹ và bé",
        brand: "NATURE'S WAY",
        unit: "Chai",
        isHot: true,
      },
      {
        name: "Nước Súc Miệng LISTERINE Cool Mint",
        description: "Nước súc miệng kháng khuẩn, thơm mát",
        price: "84500",
        originalPrice: "168400",
        discountPercentage: 50,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Chăm sóc răng miệng",
        brand: "LISTERINE",
        unit: "Chai",
      },
      {
        name: "Kem dưỡng ẩm cấp ẩm căng mọng da L'oreal",
        description: "Kem dưỡng ẩm chuyên sâu cho da khô",
        price: "299000",
        originalPrice: "399000",
        discountPercentage: 25,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Chăm sóc da",
        brand: "L'oreal",
        unit: "Hộp",
      },
      {
        name: "Pharmaton Energy (Hộp 30 viên)",
        description: "Tăng cường năng lượng, giảm mệt mỏi",
        price: "224000",
        originalPrice: "249000",
        discountPercentage: 10,
        imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Vitamin & khoáng chất",
        brand: "Pharmaton",
        unit: "Hộp",
        isNew: true,
      },
      {
        name: "Torriden DIVE IN Soothing Aqua Serum",
        description: "Serum cấp ẩm làm dịu da, phù hợp mọi loại da",
        price: "332000",
        originalPrice: "499000",
        discountPercentage: 33,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Chăm sóc da",
        brand: "Torriden",
        unit: "Hộp",
        isHot: true,
      },
      {
        name: "Thực Phẩm Bảo Vệ Sức Khỏe Nectar NMN",
        description: "Chống lão hóa, tăng cường sức khỏe tế bào",
        price: "3950000",
        originalPrice: "6170000",
        discountPercentage: 36,
        imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Thực phẩm chức năng",
        brand: "Nectar",
        unit: "Hộp",
        isHot: true,
      },
      {
        name: "Paula's Choice Tinh Chất Thấu Nha Lê Chăn",
        description: "Tinh chất làm sáng da, mờ thâm nám",
        price: "1248000",
        originalPrice: "1950000",
        discountPercentage: 36,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Chăm sóc da",
        brand: "Paula's Choice",
        unit: "Chai",
        isHot: true,
      },
      {
        name: "Thực phẩm bảo vệ sức khỏe Tim Tâm An",
        description: "Hỗ trợ tim mạch, tăng cường tuần hoàn máu",
        price: "125000",
        originalPrice: null,
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Thực phẩm chức năng",
        brand: "Tim Tâm An",
        unit: "Hộp",
      },
      {
        name: "Bổ sung FERROLIP bổ sung sắt (40 viên)",
        description: "Bổ sung sắt, điều trị thiếu máu do thiếu sắt",
        price: "360000",
        originalPrice: null,
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Vitamin & khoáng chất",
        brand: "FERROLIP",
        unit: "Hộp",
      },
      {
        name: "Strepsils Throat Irritation & Cough",
        description: "Viên ngậm trị ho, đau họng",
        price: "27500",
        originalPrice: null,
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
        category: "Thuốc điều trị",
        brand: "Strepsils",
        unit: "Vỉ",
      },
    ];

    products.forEach(product => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
        inStock: true,
        createdAt: new Date(),
      });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  async getHotDeals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.isHot || product.discountPercentage > 20
    );
  }

  async getTopSelling(): Promise<Product[]> {
    // Simulate top selling by returning some products
    return Array.from(this.products.values()).slice(0, 6);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      inStock: true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
