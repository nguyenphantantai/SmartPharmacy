import { connectDB } from './src/config/database.js';
import { Category, Product } from './src/models/schema.js';

async function checkMedicineCategory() {
  await connectDB();
  
  // Tìm category thuốc
  const medicineCategory = await Category.findOne({ slug: 'thuoc' });
  console.log('Medicine category:', medicineCategory);
  
  if (medicineCategory) {
    // Đếm số thuốc trong category này
    const medicineCount = await Product.countDocuments({ categoryId: medicineCategory._id });
    console.log('Medicine count:', medicineCount);
    
    // Lấy một vài thuốc mẫu
    const sampleMedicines = await Product.find({ categoryId: medicineCategory._id }).limit(3);
    console.log('Sample medicines:', sampleMedicines.map(m => ({
      name: m.name,
      imageUrl: m.imageUrl,
      categoryId: m.categoryId
    })));
  }
  
  process.exit(0);
}

checkMedicineCategory().catch(console.error);
