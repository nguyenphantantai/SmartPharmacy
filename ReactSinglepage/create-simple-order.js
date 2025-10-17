// Script to create a simple test order for the user
const API_BASE = 'http://localhost:5000';

async function createSimpleOrder() {
  console.log('Creating simple test order...');
  
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
    
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }
    
    console.log('✅ Login successful!');
    const token = loginData.data.token;
    
    // Step 2: Create a simple order using guest checkout endpoint
    console.log('2. Creating order via guest checkout...');
    
    const orderData = {
      items: [
        {
          productId: '68e404e4ac5f7d32f238b924', // Gliclazide 80mg from curl output
          quantity: 1,
          price: 85000
        }
      ],
      shippingAddress: '123 Test Street, Ho Chi Minh City',
      shippingPhone: '0912345678',
      paymentMethod: 'cash',
      notes: 'Test order for order tracking'
    };
    
    // Try guest checkout first (this might work better)
    const guestResponse = await fetch(`${API_BASE}/api/orders/guest-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Guest checkout response:', guestResponse.status, guestResponse.statusText);
    const guestData = await guestResponse.json();
    console.log('Guest checkout data:', guestData);
    
    if (guestData.success) {
      console.log('✅ Guest order created successfully!');
      console.log('Order ID:', guestData.data._id);
      console.log('Order Number:', guestData.data.orderNumber);
      
      // Now try to associate this order with the user
      console.log('3. Associating order with user...');
      const associateResponse = await fetch(`${API_BASE}/api/orders/${guestData.data._id}/associate-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: loginData.data.user._id
        })
      });
      
      console.log('Associate response:', associateResponse.status, associateResponse.statusText);
      const associateData = await associateResponse.json();
      console.log('Associate data:', associateData);
      
      if (associateData.success) {
        console.log('✅ Order associated with user successfully!');
        
        // Test orders endpoint
        console.log('4. Testing orders endpoint...');
        const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const ordersData = await ordersResponse.json();
        console.log('Orders data:', ordersData);
        
        // Test most-recent endpoint
        console.log('5. Testing most-recent endpoint...');
        const recentResponse = await fetch(`${API_BASE}/api/orders/most-recent`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const recentData = await recentResponse.json();
        console.log('Recent data:', recentData);
        
      } else {
        console.log('❌ Failed to associate order with user:', associateData.message);
      }
      
    } else {
      console.log('❌ Failed to create guest order:', guestData.message);
    }
    
  } catch (error) {
    console.error('❌ Failed to create test order:', error);
  }
}

// Run test
createSimpleOrder();
