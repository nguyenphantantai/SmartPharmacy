// Test frontend simulation
const testFrontendSimulation = async () => {
  const API_BASE = 'http://localhost:5000';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1NDc2MzY2YjhkMGE2ZDgwYjQ5MjkiLCJpYXQiOjE3NTk4NjA3NzMsImV4cCI6MTc2MDQ2NTU3M30.G2mIfZEh0lmlbb2bMM-990qwvenZMnsi2OLb-2atRJY';
  
  // Simulate frontend checkout process
  console.log('Simulating frontend checkout process...');
  
  try {
    // Simulate cart items
    const items = [
      {
        product: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Product',
          price: '100000'
        },
        quantity: 1
      }
    ];
    
    // Simulate order data
    const orderData = {
      items: items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: parseInt(item.product.price)
      })),
      shippingAddress: 'Test Address',
      shippingPhone: '0123456789',
      paymentMethod: 'cash',
      notes: 'Test order'
    };
    
    console.log('Order data:', orderData);
    
    // Simulate API request
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Headers:', headers);
    
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Result:', result);
    
    // Simulate frontend response handling
    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('Order number:', result.data.orderNumber);
      console.log('Order ID:', result.data._id);
    } else {
      console.log('❌ Order creation failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testFrontendSimulation();
