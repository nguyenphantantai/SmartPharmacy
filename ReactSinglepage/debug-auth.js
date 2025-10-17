// Debug script to check authentication
console.log('=== AUTH DEBUG ===');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 0);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
  
  // Check user info
  const userInfo = localStorage.getItem('user_info');
  console.log('User info exists:', !!userInfo);
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      console.log('User:', user);
    } catch (e) {
      console.log('User info parse error:', e);
    }
  }
} else {
  console.log('Not in browser environment');
}

// Test API call
async function testAPI() {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response status:', response.status);
    const text = await response.text();
    console.log('API Response:', text);
  } catch (error) {
    console.log('API Error:', error);
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  testAPI();
}
