// Test medicine API response structure
const testMedicineAPIStructure = async () => {
  try {
    console.log('🔍 Testing medicine API structure...');
    
    const response = await fetch('http://localhost:3000/api/products?category=68e40064316aa063ea1f40b1');
    const data = await response.json();
    
    console.log('Response structure:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testMedicineAPIStructure();
