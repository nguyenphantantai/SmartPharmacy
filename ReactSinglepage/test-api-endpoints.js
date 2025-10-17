const testAPIs = async () => {
  const endpoints = [
    'http://localhost:5000/api/products',
    'http://localhost:5000/api/products/hot', 
    'http://localhost:5000/api/products/new'
  ];
  
  console.log('🔍 Testing API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint}: ${response.status} - ${data.data?.products?.length || data.data?.length || 0} products`);
      } else {
        console.log(`❌ ${endpoint}: ${response.status} - ${data.message}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
    }
  }
};

testAPIs();
