const fs = require('fs');
const path = require('path');

const distDir = './dist';
const baseUrl = '/suicide-safety-planning-app';

function fixPaths() {
  console.log('Fixing paths for GitHub Pages deployment...');
  
  // Fix index.html
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Fix asset paths in HTML only (not in JS bundles)
    indexContent = indexContent.replace(/href="\//g, `href="${baseUrl}/`);
    indexContent = indexContent.replace(/src="\//g, `src="${baseUrl}/`);
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed index.html asset paths');
  }
  
  // Create a simple 404.html that redirects to index.html
  const notFoundPath = path.join(distDir, '404.html');
  const notFoundContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Suicide Safety Planner</title>
    <script type="text/javascript">
      // Simple redirect to index.html for GitHub Pages SPA
      var currentPath = window.location.pathname;
      var basePath = '/suicide-safety-planning-app';
      
      // If we're not already at the base path, redirect there
      if (currentPath !== basePath + '/' && currentPath !== basePath) {
        window.location.replace(basePath + '/');
      }
    </script>
  </head>
  <body>
    <p>Redirecting...</p>
  </body>
</html>`;
  
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log('Created 404.html for SPA routing');
  
  console.log('GitHub Pages path fixing complete!');
}

fixPaths();
