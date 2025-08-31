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
    
    // Ensure a <base> tag exists so the router and relative imports resolve under the GitHub Pages subpath
    if (!/<base\s+href=/.test(indexContent)) {
      indexContent = indexContent.replace('<head>', `<head>\n    <base href="${baseUrl}/">`);
    }
    
    // Inject a small client-side path rewrite that runs before the app bundle.
    // It rewrites URLs like "/suicide-safety-planning-app/edit-plan" -> "/edit-plan"
    // so the client-side router (expo-router) matches routes correctly when hosted on a subpath.
    if (!/window\\.__GH_PAGES_PATH_FIX__/.test(indexContent)) {
      const rewriteScript = `<script>window.__GH_PAGES_PATH_FIX__=true;(function(){try{var base=document.querySelector('base')?.getAttribute('href')||'/';base=base.replace(/\\/$/,'');var p=window.location.pathname; if(base && p.indexOf(base)===0){var newPath=p.slice(base.length)||'/';history.replaceState({},document.title,newPath+window.location.search+window.location.hash);} }catch(e){console.warn('gh-pages-path-rewrite',e);} })();</script>`;
      indexContent = indexContent.replace('</head>', `${rewriteScript}\n</head>`);
    }
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Fixed index.html asset paths, added <base> tag, and injected path-rewrite script');
  }
  
  // Create 404.html as a copy of index.html to preserve deep links on GitHub Pages
  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    fs.writeFileSync(notFoundPath, indexHtml);
    console.log('Created 404.html as a copy of index.html for SPA routing');
  } else {
    console.warn('index.html not found; skipping 404.html creation');
  }
  
  console.log('GitHub Pages path fixing complete!');
}

fixPaths();
