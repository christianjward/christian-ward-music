#!/bin/bash

# This script prepares the project for Netlify deployment

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Create client/dist directory if it doesn't exist
mkdir -p client/dist

# Create _redirects in client/dist
echo "/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200" > client/dist/_redirects

# Create a temporary prebuild directory where we'll put all Netlify specific files
mkdir -p netlify-deploy
mkdir -p netlify-deploy/client
mkdir -p netlify-deploy/functions

# Copy necessary files
cp -r client netlify-deploy/
cp -r server netlify-deploy/
cp -r shared netlify-deploy/
cp -r netlify netlify-deploy/
cp netlify.toml netlify-deploy/
cp package.json netlify-deploy/
cp drizzle.config.ts netlify-deploy/
cp tsconfig.json netlify-deploy/
cp vite.config.ts netlify-deploy/
cp tailwind.config.ts netlify-deploy/
cp postcss.config.js netlify-deploy/
cp theme.json netlify-deploy/

# Create dist directory if it doesn't exist
mkdir -p dist

# Create a ZIP file from the prebuild directory
cd netlify-deploy
zip -r ../dist/christian-ward-music.zip .
cd ..

# Clean up
rm -rf netlify-deploy

echo "ZIP file created in dist/christian-ward-music.zip"
echo ""
echo "==== DEPLOYMENT INSTRUCTIONS ===="
echo "1. Download the ZIP file from dist/christian-ward-music.zip"
echo "2. Extract the ZIP file on your local machine"
echo "3. Log in to Netlify (netlify.com)"
echo "4. Click 'New site from Git'"
echo "5. Connect to your Git repository containing the extracted files"
echo "6. Follow the deployment instructions in the README.md file"
echo ""
echo "Alternatively, you can upload the ZIP file directly to Netlify as a manual deploy."