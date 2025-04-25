# Netlify Deployment Instructions

## Step-by-Step Guide to Fix the "Page not found" Error

### 1. Upload the Fixed ZIP File

First, download the newly generated ZIP file from the dist/ directory. This file includes:
- Updated netlify.toml with correct redirects
- Client-side _redirects file for SPA routing
- Fixed API function code with correct route order

### 2. Deploy to Netlify

Once you have the ZIP file:

1. Log in to Netlify.com
2. Go to "Sites" and select your site (or create a new one)
3. Click "Deploys" in the top navigation
4. Find the "Manual deploy" section (usually at the bottom)
5. Drag and drop the ZIP file into the designated area or click to browse and select it
6. Wait for the deployment to complete

### 3. Verify Function Settings

After deployment:
1. Go to "Site settings" > "Functions"
2. Ensure "Functions directory" is set to `netlify/functions`
3. Click "Save"

### 4. Check Redirects & Rewrites

1. Go to "Site settings" > "Build & deploy" > "Post processing"
2. Scroll down to "Asset optimization"
3. Ensure "Bundle CSS" and "Bundle JS" are enabled
4. Go to "Site settings" > "Deploys" > "Deploy contexts"
5. Confirm "Production branch" is set correctly

### 5. Manually Add Redirects If Needed

If you still see routing errors:

1. Go to "Site settings" > "Redirects"
2. Click "Add redirect rule"
3. From: `/api/*`
4. To: `/.netlify/functions/api/:splat`
5. Status: `200`
6. Click "Add"
7. Add another redirect rule:
8. From: `/*`
9. To: `/index.html`
10. Status: `200`
11. Click "Add"

### 6. Test Your Site

Now visit:
- The homepage: `https://your-site-name.netlify.app/`
- The tracks page: `https://your-site-name.netlify.app/tracks`
- The admin interface: `https://your-site-name.netlify.app/admin`
  - Login with username: `admin` password: `admin123`

### 7. Still Not Working?

If you continue to see issues:

1. Try a "Clear cache and redeploy" from the Deploys tab
2. Check the Function Logs in Netlify to see if there are any errors
3. Ensure there are no CORS issues by checking browser console logs

Remember, your site combines a static frontend with serverless functions on Netlify, which requires proper redirect rules to work correctly.

## Need More Help?

These steps have been carefully designed to fix the routing issues with Netlify SPA deployments. If you're still having trouble, please provide me with:
1. The specific error message you're seeing
2. Which pages are giving you a 404
3. Screenshots of your Netlify configuration
4. Any error messages in the browser console