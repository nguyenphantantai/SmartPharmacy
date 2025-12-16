/**
 * Script để đọc và hiển thị dữ liệu từ các collections:
 * - dosageforms
 * - subcategories
 * - categories (nếu có)
 * 
 * Cách chạy:
 * npx ts-node src/utils/readMetadataCollections.ts
 * hoặc
 * node dist/utils/readMetadataCollections.js (sau khi compile)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../config/index.js';

// Load environment variables
dotenv.config();

interface CollectionItem {
  _id: mongoose.Types.ObjectId;
  name?: string;
  nameEn?: string;
  nameVi?: string;
  description?: string;
  [key: string]: any;
}

async function readMetadataCollections() {
  try {
    // Kết nối MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    // Đọc collection dosageforms
    console.log('📚 Reading dosageforms collection...');
    console.log('=' .repeat(80));
    try {
      const dosageFormsCollection = db.collection('dosageforms');
      const dosageForms = await dosageFormsCollection.find({}).toArray();
      
      console.log(`✅ Found ${dosageForms.length} dosage forms:\n`);
      
      if (dosageForms.length > 0) {
        console.log('Sample data structure:');
        console.log(JSON.stringify(dosageForms[0], null, 2));
        console.log('\nAll dosage forms:');
        dosageForms.forEach((item: CollectionItem, index: number) => {
          console.log(`${index + 1}. ID: ${item._id}`);
          console.log(`   Name: ${item.name || 'N/A'}`);
          console.log(`   Name EN: ${item.nameEn || 'N/A'}`);
          console.log(`   Name VI: ${item.nameVi || 'N/A'}`);
          console.log(`   Description: ${item.description || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('⚠️  Collection dosageforms is empty or does not exist\n');
      }
    } catch (error: any) {
      console.error('❌ Error reading dosageforms:', error.message);
      console.log('⚠️  Collection dosageforms may not exist\n');
    }

    // Đọc collection subcategories
    console.log('\n📚 Reading subcategories collection...');
    console.log('='.repeat(80));
    try {
      const subcategoriesCollection = db.collection('subcategories');
      const subcategories = await subcategoriesCollection.find({}).toArray();
      
      console.log(`✅ Found ${subcategories.length} subcategories:\n`);
      
      if (subcategories.length > 0) {
        console.log('Sample data structure:');
        console.log(JSON.stringify(subcategories[0], null, 2));
        console.log('\nAll subcategories:');
        subcategories.forEach((item: CollectionItem, index: number) => {
          console.log(`${index + 1}. ID: ${item._id}`);
          console.log(`   Name: ${item.name || 'N/A'}`);
          console.log(`   Name EN: ${item.nameEn || 'N/A'}`);
          console.log(`   Name VI: ${item.nameVi || 'N/A'}`);
          console.log(`   Description: ${item.description || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('⚠️  Collection subcategories is empty or does not exist\n');
      }
    } catch (error: any) {
      console.error('❌ Error reading subcategories:', error.message);
      console.log('⚠️  Collection subcategories may not exist\n');
    }

    // Đọc collection categories (optional)
    console.log('\n📚 Reading categories collection...');
    console.log('='.repeat(80));
    try {
      const categoriesCollection = db.collection('categories');
      const categories = await categoriesCollection.find({}).toArray();
      
      console.log(`✅ Found ${categories.length} categories:\n`);
      
      if (categories.length > 0) {
        console.log('Sample data structure:');
        console.log(JSON.stringify(categories[0], null, 2));
        console.log('\nAll categories (first 10):');
        categories.slice(0, 10).forEach((item: CollectionItem, index: number) => {
          console.log(`${index + 1}. ID: ${item._id}`);
          console.log(`   Name: ${item.name || 'N/A'}`);
          console.log(`   Name EN: ${item.nameEn || 'N/A'}`);
          console.log(`   Name VI: ${item.nameVi || 'N/A'}`);
          console.log(`   Description: ${item.description || 'N/A'}`);
          console.log('');
        });
        if (categories.length > 10) {
          console.log(`... and ${categories.length - 10} more items\n`);
        }
      } else {
        console.log('⚠️  Collection categories is empty or does not exist\n');
      }
    } catch (error: any) {
      console.error('❌ Error reading categories:', error.message);
      console.log('⚠️  Collection categories may not exist\n');
    }

    // Tổng kết
    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    
    try {
      const dosageFormsCount = await db.collection('dosageforms').countDocuments();
      console.log(`   - dosageforms: ${dosageFormsCount} items`);
    } catch {
      console.log(`   - dosageforms: collection does not exist`);
    }
    
    try {
      const subcategoriesCount = await db.collection('subcategories').countDocuments();
      console.log(`   - subcategories: ${subcategoriesCount} items`);
    } catch {
      console.log(`   - subcategories: collection does not exist`);
    }
    
    try {
      const categoriesCount = await db.collection('categories').countDocuments();
      console.log(`   - categories: ${categoriesCount} items`);
    } catch {
      console.log(`   - categories: collection does not exist`);
    }

    console.log('\n✅ Done!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  readMetadataCollections()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { readMetadataCollections };

