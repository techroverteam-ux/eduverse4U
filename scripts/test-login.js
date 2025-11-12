const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3001/auth/login', {
      email: 'superadmin@demo.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-tenant': 'platform'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

testLogin();