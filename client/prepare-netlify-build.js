import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively search for all .tsx and .ts files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to replace @/ imports with relative imports
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const dirName = path.dirname(filePath);
    const srcDir = path.resolve('./src');
    const relativePathToSrc = path.relative(dirName, srcDir);
    
    // Fix common import patterns
    const relPath = relativePathToSrc ? `${relativePathToSrc}/` : './';
    
    // Replace @/ with the relative path to src directory
    content = content.replace(/@\//g, relPath);
    
    // Also handle any @assets/ paths
    content = content.replace(/@assets\//g, `${relPath}assets/`);
    
    // Search for other problematic imports
    const importRegex = /import\s+(?:(?:[^"'{}]+\s+from\s+)|(?:[^"']+,\s*)?{[^}]*}\s+from\s+)["']([^"']+)["']/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('@') && !importPath.startsWith('@tanstack') && !importPath.startsWith('@hookform')) {
        console.log(`Warning: Found problematic import path: ${importPath} in ${filePath}`);
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Processed file: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Preparing files for Netlify build...');
  
  // Process all source files
  const srcDir = path.resolve('./src');
  const files = findFiles(srcDir);
  
  files.forEach(file => {
    processFile(file);
  });
  
  // Ensure the public directory exists
  const publicDir = path.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Create redirects file for client-side routing
  const redirectsPath = path.join(publicDir, '_redirects');
  fs.writeFileSync(redirectsPath, `
# Netlify redirects file
/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200
  `.trim());
  
  console.log('File preparation complete!');
}

main();