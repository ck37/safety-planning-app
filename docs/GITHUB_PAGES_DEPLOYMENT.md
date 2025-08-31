# Complete GitHub Pages Implementation Plan

## Phase 1: Configuration Updates

### 1.1 Update `package.json` Scripts
Add these scripts to your existing `package.json`:

```json
{
  "scripts": {
    "web:build": "expo export:web",
    "web:serve": "npx serve dist",
    "deploy:gh-pages": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1"
  }
}
```

### 1.2 Update `app.json` for GitHub Pages
Modify your `app.json` to support GitHub Pages subdirectory:

```json
{
  "expo": {
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "assetBundlePatterns": [
      "**/*"
    ]
  }
}
```

### 1.3 Create `metro.config.js`
Add Metro configuration for web builds:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
```

## Phase 2: GitHub Actions Workflow

### 2.1 Create `.github/workflows/deploy-gh-pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
        
    - name: Install dependencies
      run: bun install
      
    - name: Build web app
      run: bun run web:build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

## Phase 3: Repository Configuration

### 3.1 Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "GitHub Actions" as source
4. Save configuration

### 3.2 Update Repository Settings
- Ensure Actions have write permissions
- Enable Pages deployment from Actions

## Phase 4: Web-Specific Adaptations

### 4.1 Create `web/index.html` (if needed)
Custom HTML template for better web experience:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover" />
    <title>Suicide Safety Planner</title>
    <meta name="description" content="A compassionate, evidence-based mobile application for mental health crisis support" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/favicon.png" />
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### 4.2 Add Web Fallbacks in Components
Update components to handle web-specific limitations:

```typescript
// Example for BiometricAuth.tsx
const BiometricAuth = () => {
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    // Fallback to password/PIN for web
    return <WebAuthFallback />;
  }
  
  // Native biometric auth
  return <NativeBiometricAuth />;
};
```

## Phase 5: Testing & Optimization

### 5.1 Local Testing Commands
```bash
# Build and test locally
bun run web:build
bun run web:serve

# Open http://localhost:3000 to test
```

### 5.2 Performance Optimizations
- Enable code splitting in Metro config
- Optimize images for web
- Add service worker for offline support (optional)

## Phase 6: Documentation Updates

### 6.1 Update README.md
Add deployment section:

```markdown
## 🌐 Live Demo

View the live web version: [https://ck37.github.io/suicide-safety-planning-app/](https://ck37.github.io/suicide-safety-planning-app/)

### Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the main branch.

To deploy manually:
```bash
bun run web:build
bun run deploy:gh-pages
```

## Implementation Timeline

**Total Time: ~2-3 hours**

1. **Configuration (30 min)**: Update package.json, app.json, create metro.config.js
2. **GitHub Actions (15 min)**: Create workflow file
3. **Repository Setup (10 min)**: Enable Pages, configure permissions
4. **Web Adaptations (60-90 min)**: Add fallbacks for native features
5. **Testing (30 min)**: Local testing and deployment verification
6. **Documentation (15 min)**: Update README

## Expected Results

After implementation:
- **Live URL**: `https://ck37.github.io/suicide-safety-planning-app/`
- **Auto-deployment**: Updates within 2-3 minutes of pushing to main
- **Cross-platform access**: Works on all devices with browsers
- **Professional sharing**: Clean URL for collaborators

## Next Steps

Ready to implement? I recommend we:

1. Start with Phase 1 (Configuration Updates)
2. Test locally before setting up GitHub Actions
3. Deploy and verify the live site
4. Add web-specific adaptations as needed

Would you like me to help you implement this step by step? We can start by updating the configuration files and testing the build process locally.
