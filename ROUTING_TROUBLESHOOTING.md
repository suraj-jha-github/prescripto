# Routing Troubleshooting Guide

## Problem
Page reloads and direct URL access still showing "Not Found" error even after implementing multiple solutions.

## Issue Fixed: URL with `/?/` prefix
The URLs were showing as `https://prescripto-v9ae.onrender.com/?/doctors` instead of `https://prescripto-v9ae.onrender.com/doctors`. This was caused by the 404.html redirect script.

### Fix Applied:
- ✅ Removed `frontend/public/404.html` and `admin/public/404.html`
- ✅ Removed routing scripts from `index.html` files
- ✅ Removed conflicting static hosting config files
- ✅ Kept only Express server solution

## Current Solution: Express Server

### Frontend Server (`frontend/server.js`)
```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
});
```

### Admin Server (`admin/server.js`)
```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Admin server running on port ${port}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
});
```

## Files Removed (to fix URL issues):
- ❌ `frontend/public/404.html`
- ❌ `admin/public/404.html`
- ❌ Routing scripts from `index.html` files
- ❌ `frontend/static.json`
- ❌ `admin/static.json`
- ❌ `frontend/netlify.toml`
- ❌ `admin/netlify.toml`

## Files Kept:
- ✅ `frontend/server.js` - Express server
- ✅ `admin/server.js` - Express server
- ✅ `frontend/package.json` - Updated with Express
- ✅ `admin/package.json` - Updated with Express
- ✅ `render.yaml` - Updated configuration
- ✅ `_redirects` files (as backup)

## Deployment Steps

### 1. Update Render Configuration
- Change frontend and admin from "Static Site" to "Web Service"
- Use the new `render.yaml` configuration
- Set build command: `cd frontend && npm install && npm run build`
- Set start command: `cd frontend && npm start`

### 2. Environment Variables
Make sure these are set in Render:
- `NODE_ENV=production`
- `PORT` (Render will set this automatically)

### 3. Dependencies
Express has been added to both frontend and admin package.json files.

## Testing Steps

### Local Testing
```bash
# Frontend
cd frontend
npm install
npm run build
npm start

# Admin
cd admin
npm install
npm run build
npm start
```

### Expected URLs (no `/?/` prefix):
- ✅ `http://localhost:3000/` - Home
- ✅ `http://localhost:3000/doctors` - Doctors list
- ✅ `http://localhost:3000/login` - Login
- ✅ `http://localhost:3001/` - Admin home
- ✅ `http://localhost:3001/admin-dashboard` - Admin dashboard

## Troubleshooting

### If still not working:

1. **Check Render Logs**
   - Look for build errors
   - Check if Express server is starting
   - Verify port configuration
   - Look for the console.log messages

2. **Verify File Structure**
   ```
   frontend/
   ├── dist/           # Built files
   ├── server.js       # Express server
   └── package.json    # Updated with Express
   ```

3. **Check Package.json**
   - Ensure Express is in dependencies
   - Verify start script is `node server.js`

4. **Clear Browser Cache**
   - Hard refresh (Ctrl+F5)
   - Clear browser cache completely

## Expected Result

After deploying with Express servers:
- ✅ All routes work on direct access
- ✅ Page reloads work correctly
- ✅ Browser navigation works
- ✅ Deep linking works
- ✅ No more "Not Found" errors
- ✅ No `/?/` prefix in URLs
- ✅ Clean URLs like `/doctors`, `/admin-dashboard`

## Fallback Options

If Express servers don't work:

1. **Switch to Hash Router**
2. **Use a different hosting platform** (Vercel, Netlify)
3. **Implement server-side rendering** (Next.js) 