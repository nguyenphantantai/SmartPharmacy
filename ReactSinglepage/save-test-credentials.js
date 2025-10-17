// Script to save test user credentials to localStorage for frontend testing
const API_BASE = 'http://localhost:5000';

async function saveTestCredentials() {
  console.log('Getting test user credentials...');
  
  try {
    // Login to get token
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
      
      // Also create a simple HTML file for testing
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Order Tracking</title>
</head>
<body>
    <h1>Test Order Tracking</h1>
    <p>Click the button below to save test credentials and redirect to order tracking page.</p>
    <button onclick="saveCredentials()">Save Test Credentials</button>
    <button onclick="goToOrderTracking()">Go to Order Tracking</button>
    
    <script>
        function saveCredentials() {
            localStorage.setItem('auth_token', '${loginData.data.token}');
            localStorage.setItem('user', '${JSON.stringify(loginData.data.user)}');
            alert('✅ Test credentials saved! You can now test the order tracking page.');
        }
        
        function goToOrderTracking() {
            window.open('http://localhost:3000/track-order', '_blank');
        }
    </script>
</body>
</html>
`;
      
      // Write HTML file
      const fs = require('fs');
      fs.writeFileSync('test-order-tracking.html', htmlContent);
      console.log('\n📄 Created test-order-tracking.html file');
      console.log('Open this file in browser to test order tracking');
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Failed to get credentials:', error);
  }
}

// Run test
saveTestCredentials();
