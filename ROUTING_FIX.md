# SPA Routing Fix Guide

## Problem
When you reload any page or directly access URLs like `/doctors`, `/admin/dashboard`, etc., you get a "Not Found" error. This is a common issue with Single Page Applications (SPAs) deployed on static hosting platforms.

## Root Cause
Static hosting servers don't know about client-side routes. When you access `/doctors` directly, the server looks for a file called `doctors` but doesn't find it, so it returns a 404 error.

## Solution

### 1. Create `_redirects` Files

**For Frontend:**
Create `frontend/_redirects`:
```
/*    /index.html   200
```

**For Admin:**
Create `admin/_redirects`:
```
/*    /index.html   200
```

### 2. Alternative: Create in Public Directory

**For Frontend:**
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

**For Admin:**
Create `admin/public/_redirects`:
```
/*    /index.html   200
```

### 3. Render Configuration

Create `render.yaml` in the root directory:
```yaml
services:
  # Frontend
  - type: web
    name: prescripto-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

  # Admin Dashboard
  - type: web
    name: prescripto-admin
    env: static
    buildCommand: cd admin && npm install && npm run build
    staticPublishPath: admin/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### 4. Alternative Configurations

**Netlify (if using Netlify):**
Create `frontend/netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Create `admin/netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## How It Works

1. **`_redirects` file**: Tells the server to serve `index.html` for all routes
2. **React Router**: Takes over and handles the client-side routing
3. **Result**: All routes work correctly, even on page reload

## Testing

After deployment, test these scenarios:

### Frontend Routes
- ✅ `/` - Home page
- ✅ `/doctors` - Doctors list
- ✅ `/doctors/General physician` - Filtered doctors
- ✅ `/login` - Login page
- ✅ `/appointment/:docId` - Appointment page
- ✅ `/my-appointments` - User appointments
- ✅ `/my-profile` - User profile
- ✅ `/about` - About page
- ✅ `/contact` - Contact page

### Admin Routes
- ✅ `/` - Admin home
- ✅ `/admin-dashboard` - Admin dashboard
- ✅ `/all-appointments` - All appointments
- ✅ `/add-doctor` - Add doctor form
- ✅ `/doctor-list` - Doctors list
- ✅ `/doctor-dashboard` - Doctor dashboard
- ✅ `/doctor-appointments` - Doctor appointments
- ✅ `/doctor-profile` - Doctor profile

## Deployment Steps

1. **Add the files** created above to your repository
2. **Commit and push** the changes
3. **Redeploy** on Render
4. **Test** all routes by:
   - Directly accessing URLs
   - Reloading pages
   - Using browser back/forward buttons

## Troubleshooting

### If routing still doesn't work:

1. **Check file locations**: Ensure `_redirects` files are in the correct directories
2. **Verify deployment**: Check if files were included in the build
3. **Clear cache**: Hard refresh (Ctrl+F5) or clear browser cache
4. **Check Render logs**: Look for any build or deployment errors

### Alternative approach:

If `_redirects` doesn't work, try creating a `public/_redirects` file instead.

## Files Created

- ✅ `frontend/_redirects`
- ✅ `frontend/public/_redirects`
- ✅ `admin/_redirects`
- ✅ `admin/public/_redirects`
- ✅ `render.yaml`
- ✅ `frontend/netlify.toml`
- ✅ `admin/netlify.toml`

## Expected Result

After implementing these fixes:
- ✅ All routes work on direct access
- ✅ Page reloads work correctly
- ✅ Browser back/forward buttons work
- ✅ Deep linking works
- ✅ No more "Not Found" errors 