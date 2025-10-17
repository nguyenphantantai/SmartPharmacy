// Test medicine API with categorySlug
const testMedicineAPIWithSlug = async () => {
  try {
    console.log('🔍 Testing medicine API with categorySlug...');
    
    const response = await fetch('http://localhost:3000/api/products?categorySlug=thuoc');
    const data = await response.json();
    
    console.log('Medicine products count:', data.length);
    console.log('Sample medicines:', data.slice(0, 3).map(p => ({
      name: p.name,
      imageUrl: p.imageUrl
    })));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testMedicineAPIWithSlug();
