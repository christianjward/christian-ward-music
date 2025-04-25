#!/bin/bash
# Script to prepare and create a ZIP file for Netlify deployment

echo "Creating ZIP file for Netlify deployment..."
bash scripts/create-zip.sh

echo ""
echo "=== DEPLOYMENT INSTRUCTIONS ==="
echo "1. Download the ZIP file from dist/christian-ward-music.zip"
echo "2. Extract the ZIP file on your local machine"
echo "3. Log in to Netlify (netlify.com)"
echo "4. Click 'New site from Git'"
echo "5. Connect to your Git repository containing the extracted files"
echo "6. Follow the deployment instructions in the README.md file"
echo ""
echo "Alternatively, you can upload the ZIP file directly to Netlify as a manual deploy."
echo "For more information, visit: https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git"
echo ""