import axios from 'axios';

const BACKEND_URL = 'https://prescripto-backend-wgqr.onrender.com';

async function pingServer() {
  try {
    console.log(`Pinging server at ${new Date().toISOString()}`);
    
    const response = await axios.get(`${BACKEND_URL}/ping`);
    console.log('✅ Server is alive:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Server ping failed:', error.message);
    return false;
  }
}

async function keepAlive() {
  console.log('Starting keep-alive script...');
  
  // Ping immediately
  await pingServer();
  
  // Ping every 4 minutes (240 seconds) to keep server awake
  setInterval(async () => {
    await pingServer();
  }, 240000); // 4 minutes
}

// Start the keep-alive process
keepAlive().catch(console.error); 