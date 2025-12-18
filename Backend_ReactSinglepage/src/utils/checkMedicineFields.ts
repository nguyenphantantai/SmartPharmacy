import mongoose from 'mongoose';
import { config } from '../config/index.js';

async function checkMedicineFields() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const medicinesCollection = db.collection('medicines');
    
    // Tìm "Siro Ích Nhi" và "Siro Appeton Lysine"
    const siroIchNhi = await medicinesCollection.findOne({ 
      name: { $regex: /Siro Ích Nhi/i } 
    });
    
    const siroAppeton = await medicinesCollection.findOne({ 
      name: { $regex: /Siro Appeton Lysine/i } 
    });

    console.log('='.repeat(80));
    console.log('📋 CẤU TRÚC DỮ LIỆU THỰC TẾ TRONG DATABASE');
    console.log('='.repeat(80));
    
    if (siroIchNhi) {
      console.log('\n🔹 Siro Ích Nhi:');
      console.log('  - name:', siroIchNhi.name);
      console.log('  - category:', siroIchNhi.category);
      console.log('  - mainCategory:', siroIchNhi.mainCategory);
      console.log('  - categoryName:', siroIchNhi.categoryName);
      console.log('  - subcategory:', siroIchNhi.subcategory);
      console.log('  - subcategoryName:', siroIchNhi.subcategoryName);
      console.log('  - medicineGroup:', siroIchNhi.medicineGroup);
      console.log('  - group:', siroIchNhi.group);
      console.log('  - dosageForm:', siroIchNhi.dosageForm);
      console.log('  - form:', siroIchNhi.form);
      console.log('  - dosage:', siroIchNhi.dosage);
      console.log('  - route:', siroIchNhi.route);
      console.log('  - administrationRoute:', siroIchNhi.administrationRoute);
      console.log('\n  📦 Tất cả các fields:');
      Object.keys(siroIchNhi).forEach(key => {
        if (typeof siroIchNhi[key] === 'string' && siroIchNhi[key].length < 200) {
          console.log(`    - ${key}: ${siroIchNhi[key]}`);
        }
      });
    } else {
      console.log('\n❌ Không tìm thấy "Siro Ích Nhi"');
    }

    if (siroAppeton) {
      console.log('\n🔹 Siro Appeton Lysine:');
      console.log('  - name:', siroAppeton.name);
      console.log('  - category:', siroAppeton.category);
      console.log('  - mainCategory:', siroAppeton.mainCategory);
      console.log('  - categoryName:', siroAppeton.categoryName);
      console.log('  - subcategory:', siroAppeton.subcategory);
      console.log('  - subcategoryName:', siroAppeton.subcategoryName);
      console.log('  - medicineGroup:', siroAppeton.medicineGroup);
      console.log('  - group:', siroAppeton.group);
      console.log('  - dosageForm:', siroAppeton.dosageForm);
      console.log('  - form:', siroAppeton.form);
      console.log('  - dosage:', siroAppeton.dosage);
      console.log('  - route:', siroAppeton.route);
      console.log('  - administrationRoute:', siroAppeton.administrationRoute);
      console.log('\n  📦 Tất cả các fields:');
      Object.keys(siroAppeton).forEach(key => {
        if (typeof siroAppeton[key] === 'string' && siroAppeton[key].length < 200) {
          console.log(`    - ${key}: ${siroAppeton[key]}`);
        }
      });
    } else {
      console.log('\n❌ Không tìm thấy "Siro Appeton Lysine"');
    }

    // So sánh 4 điều kiện
    if (siroIchNhi && siroAppeton) {
      console.log('\n' + '='.repeat(80));
      console.log('🔍 SO SÁNH 4 ĐIỀU KIỆN:');
      console.log('='.repeat(80));
      
      const cat1 = (siroIchNhi.category || siroIchNhi.mainCategory || siroIchNhi.categoryName || '').trim();
      const cat2 = (siroAppeton.category || siroAppeton.mainCategory || siroAppeton.categoryName || '').trim();
      console.log(`\n1. Danh mục (Category):`);
      console.log(`   Siro Ích Nhi: "${cat1}"`);
      console.log(`   Siro Appeton: "${cat2}"`);
      console.log(`   ✅ Khớp: ${cat1.toLowerCase() === cat2.toLowerCase() ? 'CÓ' : 'KHÔNG'}`);
      
      const sub1 = (siroIchNhi.subcategory || siroIchNhi.subcategoryName || siroIchNhi.medicineGroup || siroIchNhi.group || '').trim();
      const sub2 = (siroAppeton.subcategory || siroAppeton.subcategoryName || siroAppeton.medicineGroup || siroAppeton.group || '').trim();
      console.log(`\n2. Nhóm thuốc (Subcategory):`);
      console.log(`   Siro Ích Nhi: "${sub1}"`);
      console.log(`   Siro Appeton: "${sub2}"`);
      console.log(`   ✅ Khớp: ${sub1.toLowerCase() === sub2.toLowerCase() ? 'CÓ' : 'KHÔNG'}`);
      
      const form1 = (siroIchNhi.dosageForm || siroIchNhi.form || siroIchNhi.dosage || '').trim();
      const form2 = (siroAppeton.dosageForm || siroAppeton.form || siroAppeton.dosage || '').trim();
      console.log(`\n3. Dạng bào chế (Dosage Form):`);
      console.log(`   Siro Ích Nhi: "${form1}"`);
      console.log(`   Siro Appeton: "${form2}"`);
      console.log(`   ✅ Khớp: ${form1.toLowerCase() === form2.toLowerCase() ? 'CÓ' : 'KHÔNG'}`);
      
      const route1 = (siroIchNhi.route || siroIchNhi.administrationRoute || '').trim();
      const route2 = (siroAppeton.route || siroAppeton.administrationRoute || '').trim();
      console.log(`\n4. Cách dùng (Route):`);
      console.log(`   Siro Ích Nhi: "${route1}"`);
      console.log(`   Siro Appeton: "${route2}"`);
      console.log(`   ✅ Khớp: ${route1.toLowerCase() === route2.toLowerCase() ? 'CÓ' : 'KHÔNG'}`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Done! Database connection closed.');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkMedicineFields().catch(console.error);

