import mongoose from 'mongoose';
import { config } from '../config/index.js';
import fs from 'fs';
import path from 'path';

interface Category {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  slug: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  children?: Category[];
}

interface CategoryTree {
  category: Category;
  children: CategoryTree[];
  productCount?: number;
  medicineCount?: number;
}

async function readCategories() {
  try {
    // Kết nối MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    // Đọc collection categories
    console.log('📚 Reading categories collection...');
    console.log('='.repeat(80));
    
    const categoriesCollection = db.collection('categories');
    const allCategories = await categoriesCollection.find({}).toArray();
    
    console.log(`✅ Found ${allCategories.length} categories\n`);

    // Đọc collection subcategories (nếu có)
    let subcategories: any[] = [];
    try {
      const subcategoriesCollection = db.collection('subcategories');
      subcategories = await subcategoriesCollection.find({}).toArray();
      console.log(`✅ Found ${subcategories.length} subcategories\n`);
    } catch (error: any) {
      console.log('⚠️  Collection subcategories may not exist\n');
    }

    // Đọc số lượng sản phẩm và thuốc trong mỗi category
    const productsCollection = db.collection('products');
    const medicinesCollection = db.collection('medicines');

    // Xây dựng cây categories (parent-child relationship)
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // Tạo map cho tất cả categories
    for (const cat of allCategories) {
      const categoryTree: CategoryTree = {
        category: cat as any,
        children: [],
      };
      categoryMap.set(cat._id.toString(), categoryTree);
    }

    // Xây dựng cây
    for (const cat of allCategories) {
      const categoryTree = categoryMap.get(cat._id.toString())!;
      
      // Đếm số sản phẩm trong category này
      const productCount = await productsCollection.countDocuments({
        categoryId: cat._id
      });
      categoryTree.productCount = productCount;

      // Đếm số thuốc trong category này (tìm theo category name trong medicines collection)
      const medicineCount = await medicinesCollection.countDocuments({
        $or: [
          { category: cat.name },
          { mainCategory: cat.name },
          { categoryName: cat.name }
        ]
      });
      categoryTree.medicineCount = medicineCount;

      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId.toString());
        if (parent) {
          parent.children.push(categoryTree);
        } else {
          // Parent không tồn tại, coi như root
          rootCategories.push(categoryTree);
        }
      } else {
        // Không có parent, là root category
        rootCategories.push(categoryTree);
      }
    }

    // Hiển thị cấu trúc cây
    console.log('\n📊 CATEGORY TREE STRUCTURE:');
    console.log('='.repeat(80));
    
    function printTree(node: CategoryTree, level: number = 0) {
      const indent = '  '.repeat(level);
      const icon = level === 0 ? '📁' : '  └─';
      console.log(`${indent}${icon} ${node.category.name} (${node.category.slug})`);
      if (node.category.description) {
        console.log(`${indent}    📝 ${node.category.description}`);
      }
      console.log(`${indent}    📦 Products: ${node.productCount || 0} | 💊 Medicines: ${node.medicineCount || 0}`);
      console.log(`${indent}    🆔 ID: ${node.category._id}`);
      if (node.category.parentId) {
        console.log(`${indent}    👆 Parent ID: ${node.category.parentId}`);
      }
      console.log('');

      for (const child of node.children) {
        printTree(child, level + 1);
      }
    }

    for (const root of rootCategories) {
      printTree(root);
    }

    // Hiển thị danh sách phẳng (flat list)
    console.log('\n📋 FLAT CATEGORY LIST:');
    console.log('='.repeat(80));
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
      console.log(`   Slug: ${cat.slug}`);
      console.log(`   Icon: ${cat.icon}`);
      if (cat.description) {
        console.log(`   Description: ${cat.description}`);
      }
      if (cat.parentId) {
        const parent = allCategories.find(c => c._id.toString() === cat.parentId?.toString());
        console.log(`   Parent: ${parent?.name || 'Unknown'} (${cat.parentId})`);
      } else {
        console.log(`   Parent: None (Root category)`);
      }
      console.log(`   Active: ${cat.isActive ? '✅' : '❌'}`);
      console.log(`   ID: ${cat._id}`);
      console.log('');
    });

    // Hiển thị subcategories (nếu có)
    if (subcategories.length > 0) {
      console.log('\n📚 SUBCATEGORIES:');
      console.log('='.repeat(80));
      subcategories.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.name || 'N/A'}`);
        console.log(`   ID: ${sub._id}`);
        if (sub.categoryId) {
          const parent = allCategories.find(c => c._id.toString() === sub.categoryId?.toString());
          console.log(`   Category: ${parent?.name || 'Unknown'} (${sub.categoryId})`);
        }
        if (sub.description) {
          console.log(`   Description: ${sub.description}`);
        }
        console.log('');
      });
    }

    // Export ra file JSON
    const outputDir = path.join(process.cwd(), 'category-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputData = {
      timestamp: new Date().toISOString(),
      totalCategories: allCategories.length,
      totalSubcategories: subcategories.length,
      categories: allCategories.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        parentId: cat.parentId?.toString(),
        isActive: cat.isActive,
        createdAt: cat.createdAt
      })),
      subcategories: subcategories.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        categoryId: sub.categoryId?.toString(),
        description: sub.description,
        ...sub
      })),
      tree: rootCategories.map(root => convertTreeToJSON(root))
    };

    const jsonPath = path.join(outputDir, `categories_${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`\n💾 Exported to: ${jsonPath}`);

    // Export danh sách categories dạng text
    const textPath = path.join(outputDir, `categories_${new Date().toISOString().split('T')[0]}.txt`);
    let textOutput = 'CATEGORIES AND SUBCATEGORIES\n';
    textOutput += '='.repeat(80) + '\n\n';
    textOutput += `Total Categories: ${allCategories.length}\n`;
    textOutput += `Total Subcategories: ${subcategories.length}\n\n`;
    
    textOutput += 'CATEGORY TREE:\n';
    textOutput += '-'.repeat(80) + '\n';
    for (const root of rootCategories) {
      textOutput += printTreeToText(root, 0);
    }
    
    textOutput += '\n\nFLAT CATEGORY LIST:\n';
    textOutput += '-'.repeat(80) + '\n';
    allCategories.forEach((cat, index) => {
      textOutput += `${index + 1}. ${cat.name} (${cat.slug})\n`;
      if (cat.description) {
        textOutput += `   ${cat.description}\n`;
      }
      if (cat.parentId) {
        const parent = allCategories.find(c => c._id.toString() === cat.parentId?.toString());
        textOutput += `   Parent: ${parent?.name || 'Unknown'}\n`;
      }
      textOutput += '\n';
    });

    if (subcategories.length > 0) {
      textOutput += '\nSUBCATEGORIES:\n';
      textOutput += '-'.repeat(80) + '\n';
      subcategories.forEach((sub, index) => {
        textOutput += `${index + 1}. ${sub.name || 'N/A'}\n`;
        if (sub.categoryId) {
          const parent = allCategories.find(c => c._id.toString() === sub.categoryId?.toString());
          textOutput += `   Category: ${parent?.name || 'Unknown'}\n`;
        }
        textOutput += '\n';
      });
    }

    fs.writeFileSync(textPath, textOutput, 'utf-8');
    console.log(`💾 Exported text to: ${textPath}`);

    // Đóng kết nối
    await mongoose.connection.close();
    console.log('\n✅ Done! Database connection closed.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function convertTreeToJSON(node: CategoryTree): any {
  return {
    category: {
      id: node.category._id.toString(),
      name: node.category.name,
      slug: node.category.slug,
      icon: node.category.icon,
      description: node.category.description,
      parentId: node.category.parentId?.toString(),
      isActive: node.category.isActive,
      createdAt: node.category.createdAt
    },
    productCount: node.productCount,
    medicineCount: node.medicineCount,
    children: node.children.map(child => convertTreeToJSON(child))
  };
}

function printTreeToText(node: CategoryTree, level: number = 0): string {
  let output = '';
  const indent = '  '.repeat(level);
  const prefix = level === 0 ? '📁' : '  └─';
  output += `${indent}${prefix} ${node.category.name} (${node.category.slug})\n`;
  if (node.category.description) {
    output += `${indent}    ${node.category.description}\n`;
  }
  output += `${indent}    Products: ${node.productCount || 0} | Medicines: ${node.medicineCount || 0}\n`;
  output += '\n';

  for (const child of node.children) {
    output += printTreeToText(child, level + 1);
  }

  return output;
}

// Chạy script
readCategories().catch(console.error);

