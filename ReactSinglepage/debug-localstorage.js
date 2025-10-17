// Script to check token and user in localStorage
console.log('=== CHECKING LOCALSTORAGE ===');
console.log('Auth Token:', localStorage.getItem('auth_token'));
console.log('User Data:', localStorage.getItem('user'));

// Check if token exists
const token = localStorage.getItem('auth_token');
const user = localStorage.getItem('user');

if (!token) {
  console.log('❌ No auth token found!');
} else {
  console.log('✅ Auth token found:', token.substring(0, 20) + '...');
}

if (!user) {
  console.log('❌ No user data found!');
} else {
  console.log('✅ User data found:', JSON.parse(user));
}

// Test API call with current token
if (token) {
  fetch('http://localhost:5000/api/orders', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Response Data:', data);
  })
  .catch(error => {
    console.log('API Error:', error);
  });
}
