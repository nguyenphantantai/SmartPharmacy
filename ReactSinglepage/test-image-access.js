// Test script to check if medicine images are accessible
const testImageAccess = async () => {
  try {
    console.log('🔍 Testing image access...');
    
    // Test direct backend access
    const backendResponse = await fetch('http://localhost:5000/medicine-images/Paracetamol_500mg.jpg');
    console.log('Backend (5000):', backendResponse.status, backendResponse.statusText);
    
    // Test proxy access
    const proxyResponse = await fetch('http://localhost:3000/medicine-images/Paracetamol_500mg.jpg');
    console.log('Proxy (3000):', proxyResponse.status, proxyResponse.statusText);
    
    // Test API access
    const apiResponse = await fetch('http://localhost:3000/api/products');
    console.log('API (3000):', apiResponse.status, apiResponse.statusText);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testImageAccess();
