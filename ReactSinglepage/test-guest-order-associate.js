// Script to test guest order and then associate with user
const API_BASE = 'http://localhost:5000';

async function testGuestOrderThenAssociate() {
  console.log('Testing guest order then associate with user...');
  
  try {
    // Step 1: Create guest order
    console.log('1. Creating guest order...');
    
    const guestOrderData = {
      items: [
        {
          productId: '68e404e4ac5f7d32f238b924', // Gliclazide 80mg
          quantity: 1,
          price: 85000
        }
      ],
      shippingAddress: '123 Test Street, Ho Chi Minh City',
      shippingPhone: '0912345678',
      paymentMethod: 'cash',
      notes: 'Test order for order tracking'
    };
    
    const guestResponse = await fetch(`${API_BASE}/api/orders/guest-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestOrderData)
    });
    
    console.log('Guest order response status:', guestResponse.status);
    const guestData = await guestResponse.json();
    console.log('Guest order result:', guestData);
    
    if (guestData.success) {
      console.log('✅ Guest order created successfully!');
      console.log('Order ID:', guestData.data._id);
      console.log('Order Number:', guestData.data.orderNumber);
      
      // Step 2: Login to get token
      console.log('2. Logging in...');
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
        const token = loginData.data.token;
        const userId = loginData.data.user._id;
        
        // Step 3: Update guest order to associate with user
        console.log('3. Associating guest order with user...');
        
        const associateResponse = await fetch(`${API_BASE}/api/orders/${guestData.data._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId
          })
        });
        
        console.log('Associate response status:', associateResponse.status);
        const associateData = await associateResponse.json();
        console.log('Associate result:', associateData);
        
        if (associateData.success) {
          console.log('✅ Order associated with user successfully!');
          
          // Step 4: Test orders endpoint
          console.log('4. Testing orders endpoint...');
          const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const ordersData = await ordersResponse.json();
          console.log('Orders data:', ordersData);
          
          // Step 5: Test most-recent endpoint
          console.log('5. Testing most-recent endpoint...');
          const recentResponse = await fetch(`${API_BASE}/api/orders/most-recent`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const recentData = await recentResponse.json();
          console.log('Recent data:', recentData);
          
          console.log('\n🎉 SUCCESS! User now has an order.');
          console.log('You can test the order tracking page!');
          
        } else {
          console.log('❌ Failed to associate order with user:', associateData.message);
        }
        
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
      
    } else {
      console.log('❌ Failed to create guest order:', guestData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testGuestOrderThenAssociate();
