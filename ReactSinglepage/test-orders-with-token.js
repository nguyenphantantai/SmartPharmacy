// Script to test orders API with valid token
const API_BASE = 'http://localhost:5000';

async function testOrdersAPI() {
  console.log('=== TESTING ORDERS API ===');
  
  // First login to get token
  const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'newuser@example.com',
      password: '123456'
    })
  });
  
  if (!loginResponse.ok) {
    console.log('❌ Login failed');
    return;
  }
  
  const loginData = await loginResponse.json();
  const token = loginData.data.token;
  const userId = loginData.data.user._id;
  
  console.log('✅ Login successful');
  console.log('User ID:', userId);
  console.log('Token:', token.substring(0, 20) + '...');
  
  // Test orders API
  console.log('\n--- Testing GET /api/orders ---');
  const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Orders API Status:', ordersResponse.status);
  if (ordersResponse.ok) {
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders API working!');
    console.log('Orders count:', ordersData.data?.length || 0);
  } else {
    const errorData = await ordersResponse.json();
    console.log('❌ Orders API error:', errorData);
  }
  
  // Test create order
  console.log('\n--- Testing POST /api/orders ---');
  const createOrderResponse = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        {
          productId: '68e404e4ac5f7d32f238b924',
          quantity: 1,
          price: 85000
        }
      ],
      shippingAddress: '123 Test Street, Ho Chi Minh City',
      shippingPhone: '0912345678',
      paymentMethod: 'cash',
      notes: 'Test order from script'
    })
  });
  
  console.log('Create Order Status:', createOrderResponse.status);
  if (createOrderResponse.ok) {
    const orderData = await createOrderResponse.json();
    console.log('✅ Create order successful!');
    console.log('Order ID:', orderData.data._id);
    console.log('Order Number:', orderData.data.orderNumber);
  } else {
    const errorData = await createOrderResponse.json();
    console.log('❌ Create order error:', errorData);
  }
}

testOrdersAPI().catch(console.error);
