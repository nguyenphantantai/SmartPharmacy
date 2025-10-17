// Test medicine API
const testMedicineAPI = async () => {
  try {
    console.log('🔍 Testing medicine API...');
    
    const response = await fetch('http://localhost:3000/api/products?category=68e40064316aa063ea1f40b1');
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

testMedicineAPI();
