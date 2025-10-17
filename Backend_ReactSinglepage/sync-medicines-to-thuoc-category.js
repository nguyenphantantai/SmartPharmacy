import mongoose from 'mongoose';
import { connectDB } from './src/config/database.ts';

// Define Medicine schema
const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  genericName: { type: String, required: true, trim: true },
  manufacturerId: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  strength: { type: String, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  purchasePrice: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  minStock: { type: Number, default: 10, min: 0 },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'medicines' });

const Medicine = mongoose.model('Medicine', MedicineSchema);

// Define Product and Category schemas
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  imageUrl: { type: String, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, trim: true },
  unit: { type: String, trim: true },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  isHot: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isPrescription: { type: Boolean, default: false },
  expirationDate: { type: Date },
  manufacturingDate: { type: Date },
  batchNumber: { type: String, trim: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'products' });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: 'Package' },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'categories' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function syncMedicinesToThuocCategory() {
  try {
    await connectDB();
    console.log('🔗 Connected to database');

    // Find or create "Thuốc" category
    let thuocCategory = await Category.findOne({ slug: 'thuoc' });
    if (!thuocCategory) {
      thuocCategory = await Category.create({
        name: 'Thuốc',
        icon: 'Pill',
        slug: 'thuoc',
        description: 'Danh mục thuốc và dược phẩm',
      });
      console.log('✅ Created "Thuốc" category');
    } else {
      console.log('✅ Found existing "Thuốc" category');
    }

    // Get all medicines from admin
    const medicines = await Medicine.find({});
    console.log(`📦 Found ${medicines.length} medicines in admin`);

    let syncedCount = 0;
    let updatedCount = 0;

    for (const medicine of medicines) {
      // Check if product already exists
      let existingProduct = await Product.findOne({ name: medicine.name });
      
      if (existingProduct) {
        // Update existing product to ensure it's in "Thuốc" category
        if (existingProduct.categoryId.toString() !== thuocCategory._id.toString()) {
          await Product.findByIdAndUpdate(existingProduct._id, {
            categoryId: thuocCategory._id,
            updatedAt: new Date(),
          });
          console.log(`🔄 Updated category for: ${medicine.name}`);
          updatedCount++;
        } else {
          console.log(`✅ Already in correct category: ${medicine.name}`);
        }
      } else {
              // Create new product
              const newProduct = await Product.create({
                name: medicine.name,
                description: medicine.genericName,
                price: medicine.salePrice,
                originalPrice: medicine.purchasePrice,
                discountPercentage: medicine.purchasePrice > medicine.salePrice ? 
                                    Math.round(((medicine.purchasePrice - medicine.salePrice) / medicine.purchasePrice) * 100) : 0,
                imageUrl: '/medicine-images/default-medicine.jpg',
                categoryId: thuocCategory._id,
                brand: medicine.manufacturerId || 'Unknown',
                unit: medicine.unit,
                inStock: medicine.stock > 0,
                stockQuantity: medicine.stock,
                isHot: false,
                isNew: true,
                isPrescription: medicine.name.toLowerCase().includes('prescription') || 
                               medicine.genericName.toLowerCase().includes('prescription') ||
                               medicine.category.toLowerCase().includes('kê đơn'),
                expirationDate: medicine.expiryDate,
                manufacturingDate: medicine.createdAt,
                batchNumber: 'MED-' + medicine._id.toString().slice(-8),
              });
        console.log(`✅ Created new product: ${medicine.name}`);
        syncedCount++;
      }
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`✅ Created: ${syncedCount} new products`);
    console.log(`🔄 Updated: ${updatedCount} existing products`);
    
    // Verify final count
    const totalProductsInThuoc = await Product.countDocuments({ categoryId: thuocCategory._id });
    console.log(`📊 Total products in "Thuốc" category: ${totalProductsInThuoc}`);

  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Disconnected from database.');
  }
}

syncMedicinesToThuocCategory();
