// Script to create order directly for the user
const API_BASE = 'http://localhost:5000';

async function createUserOrder() {
  console.log('Creating order for user...');
  
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
    
    // Step 2: Create order directly for user
    console.log('2. Creating order for user...');
    
    const orderData = {
      items: [
        {
          productId: '68e404e4ac5f7d32f238b924', // Gliclazide 80mg
          quantity: 2,
          price: 85000
        }
      ],
      shippingAddress: '123 Test Street, Ho Chi Minh City',
      shippingPhone: '0912345678',
      paymentMethod: 'cash',
      notes: 'Test order for order tracking'
    };
    
    const orderResponse = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Order response:', orderResponse.status, orderResponse.statusText);
    const orderResult = await orderResponse.json();
    console.log('Order data:', orderResult);
    
    if (orderResult.success) {
      console.log('✅ Order created successfully!');
      console.log('Order ID:', orderResult.data._id);
      console.log('Order Number:', orderResult.data.orderNumber);
      
      // Test orders endpoint
      console.log('3. Testing orders endpoint...');
      const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const ordersData = await ordersResponse.json();
      console.log('Orders data:', ordersData);
      
      // Test most-recent endpoint
      console.log('4. Testing most-recent endpoint...');
      const recentResponse = await fetch(`${API_BASE}/api/orders/most-recent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const recentData = await recentResponse.json();
      console.log('Recent data:', recentData);
      
      console.log('\n🎉 SUCCESS! User now has an order.');
      console.log('You can test the order tracking page with these credentials:');
      console.log('Email: newuser@example.com');
      console.log('Password: 123456');
      
    } else {
      console.log('❌ Failed to create order:', orderResult.message);
    }
    
  } catch (error) {
    console.error('❌ Failed to create order:', error);
  }
}

// Run test
createUserOrder();
