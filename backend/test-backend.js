import axios from 'axios';

const BACKEND_URL = 'https://prescripto-backend-wgqr.onrender.com';

async function testBackend() {
  console.log('Testing backend endpoints...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data);
    
    // Test CORS endpoint
    console.log('\n2. Testing CORS endpoint...');
    const corsResponse = await axios.get(`${BACKEND_URL}/test-cors`);
    console.log('✅ CORS endpoint working:', corsResponse.data);
    
    // Test doctor list endpoint
    console.log('\n3. Testing doctor list endpoint...');
    const doctorResponse = await axios.get(`${BACKEND_URL}/api/doctor/list`);
    console.log('✅ Doctor list endpoint working:', doctorResponse.data.success);
    
    // Test user profile endpoint (without token)
    console.log('\n4. Testing user profile endpoint...');
    try {
      const profileResponse = await axios.get(`${BACKEND_URL}/api/user/get-profile`);
      console.log('✅ User profile endpoint working:', profileResponse.data);
    } catch (error) {
      console.log('⚠️ User profile endpoint requires token (expected):', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎉 Backend is working properly!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBackend(); 