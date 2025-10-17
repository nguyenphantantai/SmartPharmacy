import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      imageUrl: String
    }));
    
    const products = await Product.find({}).limit(10).select('name imageUrl');
    console.log(`Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`- ${p.name}: ${p.imageUrl}`);
    });
    
    if (products.length === 0) {
      console.log('No products found in database');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProducts();
