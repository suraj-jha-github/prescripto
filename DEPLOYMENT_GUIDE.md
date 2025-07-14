# Deployment Guide - Prescripto Hospital Management System

## CORS Error Resolution

### Problem
You're experiencing a CORS error after deployment:
```
Access to XMLHttpRequest at 'https://prescripto-backend-wgqr.onrender.com/api/doctor/list' 
from origin 'https://prescripto-v9ae.onrender.com' has been blocked by CORS policy
```

### Solution Applied

1. **Updated CORS Configuration** in `backend/server.js`:
   - Added specific allowed origins including your frontend domain
   - Removed conflicting CORS configurations
   - Added proper error handling for CORS issues

2. **Allowed Origins**:
   - `https://prescripto-v9ae.onrender.com` (your frontend)
   - `http://localhost:5173` (local development)
   - `http://localhost:3000` (local development)
   - `http://127.0.0.1:5173` (local development)
   - `http://127.0.0.1:3000` (local development)

## Deployment Checklist

### Backend (Render.com)

1. **Environment Variables** - Ensure these are set in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### Frontend (Render.com)

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: None required for frontend

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

### 3. Test API Endpoint
Visit: `https://prescripto-backend-wgqr.onrender.com/api/doctor/list`
Expected response:
```json
{
  "success": true,
  "doctors": [...]
}
```

## Troubleshooting

### If CORS Error Persists

1. **Check Browser Console** for specific error messages
2. **Verify Frontend URL** - Ensure it matches exactly: `https://prescripto-v9ae.onrender.com`
3. **Clear Browser Cache** - Hard refresh (Ctrl+F5)
4. **Check Network Tab** - Look for preflight OPTIONS requests

### If 502 Bad Gateway

1. **Check Render Logs** - Look for startup errors
2. **Verify Environment Variables** - All required variables must be set
3. **Check Database Connection** - Ensure MongoDB URI is correct
4. **Check Port Configuration** - Render uses `process.env.PORT`

### Common Issues

1. **Environment Variables Missing**:
   - Check Render dashboard → Environment tab
   - Ensure all variables are set correctly

2. **Database Connection Issues**:
   - Verify MongoDB URI format
   - Check if MongoDB Atlas IP whitelist includes Render

3. **Build Failures**:
   - Check package.json dependencies
   - Verify Node.js version compatibility

## Debug Commands

### Test Backend Locally
```bash
cd backend
npm install
npm start
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### Test API Calls
```bash
# Test health endpoint
curl https://prescripto-backend-wgqr.onrender.com/health

# Test CORS endpoint
curl https://prescripto-backend-wgqr.onrender.com/test-cors

# Test doctor list endpoint
curl https://prescripto-backend-wgqr.onrender.com/api/doctor/list
```

## Next Steps

1. **Deploy the updated backend** with the new CORS configuration
2. **Test the health endpoint** to verify server is running
3. **Test the frontend** to ensure API calls work
4. **Monitor logs** in Render dashboard for any errors

## Support

If issues persist:
1. Check Render deployment logs
2. Verify all environment variables are set
3. Test endpoints individually
4. Check browser network tab for detailed error information 