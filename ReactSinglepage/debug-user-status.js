// Script to check user status in database
const API_BASE = 'http://localhost:5000';

async function checkUserStatus() {
  console.log('=== CHECKING USER STATUS ===');
  
  // First login to get token
  const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'newuser@example.com',
      password: '123456'
    })
  });
  
  if (!loginResponse.ok) {
    console.log('❌ Login failed:', loginResponse.status);
    return;
  }
  
  const loginData = await loginResponse.json();
  console.log('✅ Login successful:', loginData);
  
  const token = loginData.data.token;
  const userId = loginData.data.user._id;
  
  console.log('Token:', token.substring(0, 20) + '...');
  console.log('User ID:', userId);
  
  // Check user status
  const userResponse = await fetch(`${API_BASE}/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (userResponse.ok) {
    const userData = await userResponse.json();
    console.log('✅ User data:', userData);
    console.log('User active:', userData.data.isActive);
  } else {
    console.log('❌ Failed to get user data:', userResponse.status);
  }
  
  // Test orders API
  const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('Orders API status:', ordersResponse.status);
  if (!ordersResponse.ok) {
    const errorData = await ordersResponse.json();
    console.log('Orders API error:', errorData);
  }
}

checkUserStatus().catch(console.error);
