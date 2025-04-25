#!/bin/bash
# Run the download script to create a ZIP file for Netlify deployment

# Run the download script as an ES module
node "$(dirname "$0")/download.js"

echo "ZIP file created in dist/christian-ward-music.zip"
echo "You can download this file and deploy it to Netlify."