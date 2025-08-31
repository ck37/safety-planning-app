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
    
    // Fix asset paths
    indexContent = indexContent.replace(/href="\//g, `href="${baseUrl}/`);
    indexContent = indexContent.replace(/src="\//g, `src="${baseUrl}/`);
    
    // Add GitHub Pages routing script to index.html
    const indexRoutingScript = `
    <script>
      // GitHub Pages routing fix for index.html
      (function(l) {
        if (l.search) {
          var q = {};
          l.search.slice(1).split('&').forEach(function(v) {
            var a = v.split('=');
            q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
          });
          if (q.p !== undefined) {
            window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + (q.p || '') +
              (q.q ? ('?' + q.q) : '') +
              l.hash
            );
          }
        }
      }(window.location))
    </script>
    `;
    
    indexContent = indexContent.replace('</head>', indexRoutingScript + '</head>');
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed index.html paths and added routing script');
  }
  
  // Fix JavaScript bundle paths
  const expoDir = path.join(distDir, '_expo');
  if (fs.existsSync(expoDir)) {
    function fixJsFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          fixJsFiles(filePath);
        } else if (file.endsWith('.js')) {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Fix asset loading paths
          content = content.replace(/"\/_expo\//g, `"${baseUrl}/_expo/`);
          content = content.replace(/'\/assets\//g, `'${baseUrl}/assets/`);
          content = content.replace(/"\//g, `"${baseUrl}/`);
          
          fs.writeFileSync(filePath, content);
          console.log(`Fixed paths in ${file}`);
        }
      });
    }
    
    fixJsFiles(expoDir);
  }
  
  // Create 404.html for GitHub Pages SPA routing
  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(indexPath)) {
    let notFoundContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add script to handle client-side routing
    const routingScript = `
    <script>
      // GitHub Pages SPA routing fix
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
    </script>
    `;
    
    notFoundContent = notFoundContent.replace('</head>', routingScript + '</head>');
    fs.writeFileSync(notFoundPath, notFoundContent);
    console.log('Created 404.html for SPA routing');
  }
  
  console.log('GitHub Pages path fixing complete!');
}

fixPaths();
