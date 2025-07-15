# Backend Connectivity Issues Fix

## Problem
Backend experiences intermittent connectivity issues:
- Works for a while after deployment
- Then starts giving network errors
- Works again after some time
- Cycle repeats

This is common with Render's free tier hosting where services can go to sleep.

## Root Causes

### 1. Render Free Tier Sleep
- Services go to sleep after 15 minutes of inactivity
- Take time to wake up when accessed
- Causes intermittent connectivity

### 2. Network Timeouts
- Long response times during wake-up
- Connection timeouts
- No retry logic in frontend

### 3. No Keep-Alive Mechanism
- Server goes idle
- No regular pings to keep it awake

## Solutions Applied

### 1. Backend Keep-Alive Mechanism
```javascript
// Keep alive mechanism to prevent sleep
let keepAliveInterval;

// Start keep alive mechanism
keepAliveInterval = setInterval(() => {
  console.log('Keep alive ping - Server uptime:', process.uptime());
}, 300000); // Ping every 5 minutes

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

### 2. Frontend Retry Logic
```javascript
// Retry function for API calls
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};
```

### 3. Better Error Handling
- Different error messages for different error types
- Timeout handling
- Network error detection
- Loading states

### 4. Keep-Alive Script
Created `backend/keep-alive.js` to ping server regularly:
```javascript
// Ping every 4 minutes to keep server awake
setInterval(async () => {
  await pingServer();
}, 240000); // 4 minutes
```

## Implementation Details

### Backend Changes (`backend/server.js`)
- ✅ Added keep-alive interval
- ✅ Added `/ping` endpoint
- ✅ Enhanced health check with uptime
- ✅ Graceful shutdown handling
- ✅ Better logging

### Frontend Changes (`frontend/src/context/AppContext.jsx`)
- ✅ Added retry logic for API calls
- ✅ Added timeout configuration (10 seconds)
- ✅ Better error messages
- ✅ Loading states
- ✅ Different error handling for different scenarios

### Keep-Alive Script (`backend/keep-alive.js`)
- ✅ Pings server every 4 minutes
- ✅ Logs server status
- ✅ Handles connection errors

## Testing Steps

### 1. Test Backend Keep-Alive
Visit: `https://prescripto-backend-wgqr.onrender.com/ping`
Expected response:
```json
{
  "message": "Server is alive",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Test Health Endpoint
Visit: `https://prescripto-backend-wgqr.onrender.com/health`
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "Server is running",
  "cors": "Configured for production",
  "allowedOrigins": [...],
  "uptime": 123.456
}
```

### 3. Run Keep-Alive Script
```bash
cd backend
node keep-alive.js
```

## Deployment Steps

### 1. Deploy Updated Backend
- Deploy the updated `backend/server.js`
- Check Render logs for keep-alive messages
- Verify `/ping` endpoint works

### 2. Deploy Updated Frontend
- Deploy the updated `frontend/src/context/AppContext.jsx`
- Test retry logic
- Check error messages

### 3. Set Up Keep-Alive (Optional)
- Run the keep-alive script on a separate server
- Or use a service like UptimeRobot to ping `/ping` endpoint

## Expected Results

After implementing these fixes:
- ✅ Backend stays awake longer
- ✅ Frontend retries failed requests
- ✅ Better error messages for users
- ✅ Reduced network errors
- ✅ Faster response times after inactivity

## Monitoring

### Check Render Logs
- Look for keep-alive ping messages
- Monitor uptime values
- Check for connection errors

### Monitor Frontend
- Check browser console for retry attempts
- Monitor error message types
- Track loading states

## Fallback Options

If issues persist:

1. **Upgrade to Render Paid Plan** (no sleep)
2. **Use a different hosting platform** (Railway, Heroku)
3. **Implement server-side rendering** (Next.js)
4. **Use a CDN** to cache responses

## Files Modified

- ✅ `backend/server.js` - Added keep-alive mechanism
- ✅ `frontend/src/context/AppContext.jsx` - Added retry logic
- ✅ `backend/keep-alive.js` - Keep-alive script
- ✅ Better error handling and logging 