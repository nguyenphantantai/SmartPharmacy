// Script to test frontend with current user and debug errors
const API_BASE = 'http://localhost:5000';

async function testFrontendWithDebug() {
  console.log('Testing frontend with debug info...');
  
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
      console.log('Token:', loginData.data.token);
      
      // Test orders endpoint with detailed error info
      console.log('2. Testing orders endpoint...');
      const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('Orders response status:', ordersResponse.status);
      console.log('Orders response headers:', Object.fromEntries(ordersResponse.headers.entries()));
      
      const ordersData = await ordersResponse.json();
      console.log('Orders data:', ordersData);
      
      // Test most-recent endpoint with detailed error info
      console.log('3. Testing most-recent endpoint...');
      const recentResponse = await fetch(`${API_BASE}/api/orders/most-recent`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      console.log('Recent response status:', recentResponse.status);
      console.log('Recent response headers:', Object.fromEntries(recentResponse.headers.entries()));
      
      const recentData = await recentResponse.json();
      console.log('Recent data:', recentData);
      
      console.log('\n🎉 Frontend testing ready!');
      console.log('Test credentials:');
      console.log('Email: newuser@example.com');
      console.log('Password: 123456');
      
      // Create localStorage script
      const localStorageScript = `
// Run this in browser console to save test credentials
localStorage.setItem('auth_token', '${loginData.data.token}');
localStorage.setItem('user', '${JSON.stringify(loginData.data.user)}');
console.log('✅ Test credentials saved to localStorage');
console.log('You can now test the order tracking page!');
`;
      
      console.log('\n📋 Copy and paste this script into browser console:');
      console.log(localStorageScript);
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testFrontendWithDebug();
