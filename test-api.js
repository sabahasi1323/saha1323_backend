const axios = require('axios')

async function testAPI() {
  try {
    // Test login
    console.log('Testing login...')
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    })
    
    console.log('Login successful:', loginResponse.data)
    const token = loginResponse.data.token
    
    // Test customers with token
    console.log('Testing customers endpoint...')
    const customersResponse = await axios.get('http://localhost:5000/api/customers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('Customers found:', customersResponse.data.length)
    console.log('First customer:', customersResponse.data[0])
    
    // Test dashboard
    console.log('Testing dashboard endpoint...')
    const dashboardResponse = await axios.get('http://localhost:5000/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('Dashboard stats:', dashboardResponse.data)
    
  } catch (error) {
    console.error('API Test Error:', error.response?.data || error.message)
  }
}

testAPI()
