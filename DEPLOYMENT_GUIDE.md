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
   - `https://prescripto-admin-khrp.onrender.com` (your admin dashboard)
   - `http://localhost:5173` (local development)
   - `http://localhost:3000` (local development)
   - `http://127.0.0.1:5173` (local development)
   - `http://127.0.0.1:3000` (local development)

## SPA Routing Fix

### Problem
When you reload any page or directly access URLs like `/doctors`, `/admin/dashboard`, etc., you get a "Not Found" error. This happens because the server doesn't know how to handle client-side routes.

### Solution Applied

1. **Created `_redirects` files** in both frontend and admin directories:
   ```
   /*    /index.html   200
   ```
   This tells the server to serve `index.html` for all routes and let React Router handle the routing.

2. **Created `render.yaml`** for proper deployment configuration with routing rules.

### Files Created:
- `frontend/_redirects`
- `frontend/public/_redirects`
- `admin/_redirects`
- `admin/public/_redirects`
- `render.yaml`

## Deployment Checklist

### Backend (Render.com)

1. **Environment Variables** - Ensure these are set in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_admin_password
   ```

2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### Frontend (Render.com)

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: None required for frontend

### Admin Dashboard (Render.com)

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: None required for admin frontend

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
  "allowedOrigins": ["https://prescripto-v9ae.onrender.com", "https://prescripto-admin-khrp.onrender.com", ...]
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

### 4. Test Admin Endpoints
Visit: `https://prescripto-backend-wgqr.onrender.com/api/admin/dashboard`
Expected response:
```json
{
  "success": true,
  "dashData": {...}
}
```

## Troubleshooting

### If CORS Error Persists

1. **Check Browser Console** for specific error messages
2. **Verify Frontend URL** - Ensure it matches exactly: `https://prescripto-v9ae.onrender.com`
3. **Verify Admin URL** - Ensure it matches exactly: `https://prescripto-admin-khrp.onrender.com`
4. **Clear Browser Cache** - Hard refresh (Ctrl+F5)
5. **Check Network Tab** - Look for preflight OPTIONS requests

### If 502 Bad Gateway

1. **Check Render Logs** - Look for startup errors
2. **Verify Environment Variables** - All required variables must be set
3. **Check Database Connection** - Ensure MongoDB URI is correct
4. **Check Port Configuration** - Render uses `process.env.PORT`

### Common Issues

1. **Environment Variables Missing**:
   - Check Render dashboard → Environment tab
   - Ensure all variables are set correctly
   - Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set for admin login

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

### Test Admin Locally
```bash
cd admin
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

# Test admin dashboard endpoint
curl https://prescripto-backend-wgqr.onrender.com/api/admin/dashboard
```

## Next Steps

1. **Deploy the updated backend** with the new CORS configuration
2. **Test the health endpoint** to verify server is running
3. **Test the frontend** to ensure API calls work
4. **Test the admin dashboard** to ensure admin functionality works
5. **Monitor logs** in Render dashboard for any errors

## Support

If issues persist:
1. Check Render deployment logs
2. Verify all environment variables are set
3. Test endpoints individually
4. Check browser network tab for detailed error information
