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
  
  // Create 404.html for GitHub Pages SPA routing
  const notFoundPath = path.join(distDir, '404.html');
  const notFoundContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Suicide Safety Planner</title>
    <script type="text/javascript">
      // GitHub Pages SPA routing for subdirectory deployment
      // For https://username.github.io/repo-name/ deployment
      var pathSegmentsToKeep = 1;

      var l = window.location;
      var pathArray = l.pathname.split('/');
      
      // For subdirectory deployment, we need to preserve the repo name
      // and redirect internal routes properly
      if (pathArray.length > 2) {
        // We have a route beyond the repo name, redirect to index with hash
        var repoName = pathArray[1]; // 'suicide-safety-planning-app'
        var route = pathArray.slice(2).join('/');
        
        var redirectUrl = l.protocol + '//' + l.hostname + '/' + repoName + '/?/' + route;
        if (l.search) {
          redirectUrl += '&' + l.search.slice(1).replace(/&/g, '~and~');
        }
        if (l.hash) {
          redirectUrl += l.hash;
        }
        
        l.replace(redirectUrl);
      }
    </script>
  </head>
  <body>
  </body>
</html>`;
  
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log('Created 404.html for SPA routing');
  
  // Add routing script to index.html
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    const routingScript = `
    <script type="text/javascript">
      // GitHub Pages SPA routing for Expo Router subdirectory deployment
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          
          // For subdirectory deployment, preserve the base path
          var basePath = '/suicide-safety-planning-app';
          var newPath = basePath + decoded;
          
          window.history.replaceState(null, null, newPath + l.hash);
        }
      }(window.location))
    </script>`;
    
    indexContent = indexContent.replace('</head>', routingScript + '\n</head>');
    fs.writeFileSync(indexPath, indexContent);
    console.log('Added routing script to index.html');
  }
  
  console.log('GitHub Pages path fixing complete!');
}

fixPaths();
