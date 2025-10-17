// Script to activate existing user
const API_BASE = 'http://localhost:5000';

async function activateExistingUser() {
  console.log('=== ACTIVATING EXISTING USER ===');
  
  try {
    // Try different credentials that might work
    const credentials = [
      { email: 'newuser@example.com', password: '123456' },
      { email: 'test@example.com', password: '123456' },
      { email: 'user@example.com', password: '123456' }
    ];
    
    for (const cred of credentials) {
      console.log(`Trying login with: ${cred.email}`);
      
      const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cred)
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful!');
        console.log('User ID:', loginData.data.user._id);
        console.log('User active:', loginData.data.user.isActive);
        console.log('Token:', loginData.data.token.substring(0, 20) + '...');
        
        // Test orders API
        const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${loginData.data.token}`
          }
        });
        
        console.log('Orders API status:', ordersResponse.status);
        if (ordersResponse.ok) {
          console.log('✅ Orders API working!');
        } else {
          const errorData = await ordersResponse.json();
          console.log('❌ Orders API error:', errorData);
        }
        
        return;
      } else {
        const errorData = await loginResponse.json();
        console.log(`❌ Login failed: ${errorData.message}`);
      }
    }
    
    console.log('❌ All login attempts failed');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

activateExistingUser();
