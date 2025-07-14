# CORS Troubleshooting Guide

## Problem
CORS errors are occurring again after deployment:
```
Access to XMLHttpRequest at 'https://prescripto-backend-wgqr.onrender.com/api/user/get-profile' 
from origin 'https://prescripto-v9ae.onrender.com' has been blocked by CORS policy
```

## Root Causes

### 1. Backend Server Not Running (502 Bad Gateway)
- The backend server might not be starting properly
- Environment variables might be missing
- Database connection might be failing

### 2. CORS Configuration Not Deployed
- The updated CORS configuration might not be deployed
- Render might be serving an old version

### 3. Preflight Request Issues
- OPTIONS requests might not be handled properly
- Headers might be missing

## Solutions Applied

### 1. Enhanced CORS Configuration
```javascript
// More permissive CORS for debugging
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS check for origin:', origin);
    
    // Allow requests with no origin
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Temporarily allow all origins for debugging
      callback(null, true);
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'aToken', 'dToken', 'X-Requested-With', 'Origin', 'Accept']
}));
```

### 2. Enhanced Manual CORS Headers
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  
  const origin = req.headers.origin;
  
  // Allow all origins temporarily for debugging
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token, aToken, dToken');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }
  next();
});
```

### 3. Better Logging
- Added console.log statements to track CORS checks
- Added logging for OPTIONS requests
- Added startup logging

## Testing Steps

### 1. Test Backend Health
Visit: `https://prescripto-backend-wgqr.onrender.com/health`
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Server is running",
  "cors": "Configured for production",
  "allowedOrigins": ["https://prescripto-v9ae.onrender.com", ...]
}
```

### 2. Test CORS Endpoint
Visit: `https://prescripto-backend-wgqr.onrender.com/test-cors`
Expected response:
```json
{
  "message": "CORS is working!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Test API Endpoints
Visit: `https://prescripto-backend-wgqr.onrender.com/api/doctor/list`
Expected response:
```json
{
  "success": true,
  "doctors": [...]
}
```

### 4. Run Test Script
```bash
cd backend
node test-backend.js
```

## Troubleshooting Steps

### 1. Check Render Logs
- Go to Render dashboard
- Check backend service logs
- Look for startup errors
- Check for CORS-related logs

### 2. Verify Environment Variables
Make sure these are set in Render:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### 3. Check Database Connection
- Verify MongoDB URI is correct
- Check if MongoDB Atlas IP whitelist includes Render
- Look for database connection errors in logs

### 4. Test Locally
```bash
cd backend
npm install
npm start
```
Then test: `http://localhost:3001/health`

## Common Issues

### 1. 502 Bad Gateway
- Backend server not starting
- Missing environment variables
- Database connection issues

### 2. CORS Still Blocked
- Old deployment still running
- Browser cache issues
- Network issues

### 3. Preflight Request Failing
- OPTIONS method not handled
- Headers not properly set
- Server not responding to OPTIONS

## Debugging Commands

### Test Backend from Command Line
```bash
# Test health endpoint
curl https://prescripto-backend-wgqr.onrender.com/health

# Test CORS endpoint
curl https://prescripto-backend-wgqr.onrender.com/test-cors

# Test doctor list
curl https://prescripto-backend-wgqr.onrender.com/api/doctor/list
```

### Test with Browser
1. Open browser developer tools
2. Go to Network tab
3. Try to access the frontend
4. Look for failed requests
5. Check response headers

## Expected Results

After deploying the enhanced CORS configuration:
- ✅ No CORS errors in browser console
- ✅ API calls work from frontend
- ✅ Preflight requests succeed
- ✅ Backend logs show CORS checks
- ✅ Health endpoint returns proper response

## Fallback Options

If CORS issues persist:

1. **Switch to Hash Router** (avoids some CORS issues)
2. **Use a different hosting platform** (Vercel, Netlify)
3. **Implement server-side rendering** (Next.js)
4. **Use a proxy server** to handle CORS

## Files Modified

- ✅ `backend/server.js` - Enhanced CORS configuration
- ✅ `backend/test-backend.js` - Test script
- ✅ Better logging and debugging 