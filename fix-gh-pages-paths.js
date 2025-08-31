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
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment,
      // e.g. https://www.foo.tld/one/two?a=b&c=d#qwe, becomes
      // https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
      // Note: this 404.html file must be at least 512 bytes for it to work
      // with Internet Explorer (it is currently > 512 bytes)

      // If you're creating a Project Pages site and NOT using a custom domain,
      // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
      // This way the code will only replace the route part and not the real directory.
      // This script will NOT work if your site is hosted in a subdirectory,
      // for example: https://username.github.io/repo-name/
      // In this case, you would set pathSegmentsToKeep to 1 (or 2, 3, etc).
      var pathSegmentsToKeep = 1;

      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
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
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script checks to see if a redirect is present in the query string,
      // converts it back into the correct url and adds it to the
      // browser's history using window.history.replaceState(...),
      // which won't cause the browser to attempt to load the new url.
      // When the single page app is loaded further down in this file,
      // the correct url will be waiting in the browser's history for
      // the single page app to route accordingly.
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
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
