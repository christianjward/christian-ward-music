// This script runs after the build to ensure the _redirects file is in the dist folder
const fs = require('fs');
const path = require('path');

// Define paths
const sourceRedirectsPath = path.join(__dirname, 'public', '_redirects');
const distRedirectsPath = path.join(__dirname, 'dist', '_redirects');
const sourceNetlifyTomlPath = path.join(__dirname, 'public', 'netlify.toml');
const distNetlifyTomlPath = path.join(__dirname, 'dist', 'netlify.toml');

// Copy _redirects file
if (fs.existsSync(sourceRedirectsPath)) {
  try {
    fs.copyFileSync(sourceRedirectsPath, distRedirectsPath);
    console.log('✅ _redirects file copied to dist folder');
  } catch (err) {
    console.error('❌ Error copying _redirects file:', err);
    
    // Fallback: Create the file directly
    try {
      const redirectsContent = `/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200`;
      fs.writeFileSync(distRedirectsPath, redirectsContent);
      console.log('✅ _redirects file created in dist folder');
    } catch (err) {
      console.error('❌ Error creating _redirects file:', err);
    }
  }
} else {
  // Create _redirects file if it doesn't exist
  try {
    const redirectsContent = `/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200`;
    fs.writeFileSync(distRedirectsPath, redirectsContent);
    console.log('✅ _redirects file created in dist folder');
  } catch (err) {
    console.error('❌ Error creating _redirects file:', err);
  }
}

// Copy netlify.toml file if it exists
if (fs.existsSync(sourceNetlifyTomlPath)) {
  try {
    fs.copyFileSync(sourceNetlifyTomlPath, distNetlifyTomlPath);
    console.log('✅ netlify.toml file copied to dist folder');
  } catch (err) {
    console.error('❌ Error copying netlify.toml file:', err);
  }
}

console.log('📦 Postbuild process completed!');