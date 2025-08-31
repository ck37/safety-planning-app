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
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed index.html paths');
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
  
  console.log('GitHub Pages path fixing complete!');
}

fixPaths();
