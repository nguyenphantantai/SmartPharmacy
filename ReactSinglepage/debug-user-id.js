// Script to debug user ID issue
const API_BASE = 'http://localhost:5000';

async function debugUserID() {
  console.log('Debugging user ID issue...');
  
  try {
    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'newuser@example.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login successful!');
      console.log('User:', loginData.data.user);
      console.log('User ID:', loginData.data.user._id);
      console.log('Token:', loginData.data.token);
      
      // Step 2: Test orders endpoint with detailed logging
      console.log('2. Testing orders endpoint...');
      const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('Orders response status:', ordersResponse.status);
      const ordersData = await ordersResponse.json();
      console.log('Orders data:', ordersData);
      
      // Step 3: Test most-recent endpoint
      console.log('3. Testing most-recent endpoint...');
      const recentResponse = await fetch(`${API_BASE}/api/orders/most-recent`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('Recent response status:', recentResponse.status);
      const recentData = await recentResponse.json();
      console.log('Recent data:', recentData);
      
      // Step 4: Test with different user ID format
      console.log('4. Testing with different user ID format...');
      const testResponse = await fetch(`${API_BASE}/api/orders?userId=${loginData.data.user._id}`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('Test response status:', testResponse.status);
      const testData = await testResponse.json();
      console.log('Test data:', testData);
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run test
debugUserID();
