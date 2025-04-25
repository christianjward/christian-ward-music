# Netlify Deployment Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" button in the top right and select "New repository"
3. Name your repository (e.g., "christian-ward-music")
4. Choose "Public" and click "Create repository"
5. Follow the instructions to push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/christian-ward-music.git
git push -u origin main
```

## Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/) and sign in
2. Click "New site from Git"
3. Select "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Find and select your "christian-ward-music" repository

## Step 3: Configure Build Settings

The settings should be automatically detected from your netlify.toml file, but verify:

- Build command: `cd client && npm install && npm run build`
- Publish directory: `client/dist`
- Functions directory: `netlify/functions`

## Step 4: Deploy!

1. Click "Deploy site"
2. Wait for the build and deployment to complete
3. Once deployed, click on the generated .netlify.app URL to view your site

## Step 5: Test Your Site

1. Test the home page
2. Test the tracks page 
3. Test the admin page (login with admin/admin123)
4. Test API endpoints

## Troubleshooting

If you encounter issues after deployment:

1. In the Netlify dashboard, go to "Deploys" and click on your most recent deploy
2. Check the deploy log for any errors
3. If there are build errors, fix them in your code, push to GitHub, and Netlify will automatically redeploy
4. If the build succeeds but you're still getting "Page not found" errors, check:
   - The Function logs in Netlify
   - Your browser's developer console for any errors

Remember that the _redirects file and netlify.toml should handle routing, but if issues persist, you can manually add redirect rules in the Netlify dashboard.