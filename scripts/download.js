// Script to create a downloadable ZIP of the project for Netlify
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(distDir, 'christian-ward-music.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Archive created: ${archive.pointer()} total bytes`);
  console.log('ZIP file has been created in the dist/ directory');
});

// Handle warnings and errors
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Create _redirects file for Netlify
const redirectsContent = `/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200`;
fs.writeFileSync(path.join(__dirname, '../client/public/_redirects'), redirectsContent);

// Add client directory
archive.directory(path.join(__dirname, '../client'), 'client');

// Add server files
archive.directory(path.join(__dirname, '../server'), 'server');

// Add shared directory
archive.directory(path.join(__dirname, '../shared'), 'shared');

// Add uploads directory if it exists
const uploadsDir = path.join(__dirname, '../uploads');
if (fs.existsSync(uploadsDir)) {
  archive.directory(uploadsDir, 'uploads');
} else {
  fs.mkdirSync(uploadsDir, { recursive: true });
  archive.directory(uploadsDir, 'uploads');
}

// Add configuration files
archive.file(path.join(__dirname, '../netlify.toml'), { name: 'netlify.toml' });
archive.file(path.join(__dirname, '../package.json'), { name: 'package.json' });
archive.file(path.join(__dirname, '../drizzle.config.ts'), { name: 'drizzle.config.ts' });
archive.file(path.join(__dirname, '../tsconfig.json'), { name: 'tsconfig.json' });
archive.file(path.join(__dirname, '../vite.config.ts'), { name: 'vite.config.ts' });
archive.file(path.join(__dirname, '../tailwind.config.ts'), { name: 'tailwind.config.ts' });
archive.file(path.join(__dirname, '../postcss.config.js'), { name: 'postcss.config.js' });
archive.file(path.join(__dirname, '../theme.json'), { name: 'theme.json' });

// Add a README with deployment instructions
const readmeContent = `# Christian Ward Music

## Deployment Instructions for Netlify

### Option 1: Deploy Frontend Only

1. Extract this ZIP file
2. Log in to Netlify and click "New site from Git"
3. Connect to your Git repository
4. Set Build command: \`cd client && npm run build\`
5. Set Publish directory: \`client/dist\`
6. Click "Deploy site"

### Option 2: Deploy Full Stack (Frontend + API)

1. Extract this ZIP file
2. Log in to Netlify and click "New site from Git"
3. Connect to your Git repository
4. The netlify.toml file will handle the configuration
5. Click "Deploy site"
6. Go to Site settings > Functions > Set directory to "netlify/functions"

## Adding New Tracks

To add new tracks without code changes:

1. Go to Netlify site settings > Functions
2. Use the admin interface at yourdomain.netlify.app/admin
3. Log in with the default admin credentials:
   - Username: admin
   - Password: admin123

## File Structure

- \`client/\`: Frontend React application
- \`server/\`: Backend Express API
- \`shared/\`: Shared types and schemas
- \`uploads/\`: Music track files
- \`netlify/functions/\`: Serverless functions for Netlify deployment
`;

// Add the README file
archive.append(readmeContent, { name: 'README.md' });

// Create redirects file in client/dist for Netlify
const clientDistDir = path.join(__dirname, '../client/dist');
if (!fs.existsSync(clientDistDir)) {
  fs.mkdirSync(clientDistDir, { recursive: true });
}
fs.writeFileSync(path.join(clientDistDir, '_redirects'), 
  `/api/*  /.netlify/functions/api/:splat  200
/*      /index.html                     200`);

// Add the _redirects file to the archive
archive.file(path.join(clientDistDir, '_redirects'), { name: 'client/dist/_redirects' });

// Add the netlify.toml file at the root level
archive.append(`[build]
  command = "cd client && npm run build"
  publish = "client/dist"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`, { name: 'netlify.toml' });

// Finalize the archive
archive.finalize();