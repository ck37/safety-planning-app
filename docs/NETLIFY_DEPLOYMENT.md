# Netlify Deployment Guide

This guide explains how to deploy the Suicide Safety Planning App to Netlify, providing an alternative to GitHub Pages deployment.

## 🚀 Quick Start

### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository to Netlify**
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Connect your GitHub account and select this repository
   - Netlify will automatically detect the `netlify.toml` configuration

2. **Automatic Configuration**
   - Build command: `bun run web:build:netlify` (automatically detected)
   - Publish directory: `dist` (automatically detected)
   - Node.js version: 20 (configured in netlify.toml)

3. **Deploy**
   - Click "Deploy site"
   - Your app will be available at a generated URL like `https://amazing-app-123456.netlify.app`
   - You can customize the subdomain in site settings

### Option 2: Manual Deployment via CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   # or
   bun add -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   # Build the app
   bun run web:build:netlify
   
   # Deploy to preview URL
   bun run deploy:netlify:preview
   
   # Deploy to production
   bun run deploy:netlify
   ```

## 📋 Configuration Details

### netlify.toml Configuration

The project includes a `netlify.toml` file with optimized settings:

```toml
[build]
  base = "."
  publish = "dist"
  command = "bun run web:build:netlify"

[build.environment]
  NODE_VERSION = "20"
  BUN_VERSION = "latest"

# SPA redirect rules
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Build Scripts

The following npm/bun scripts are available:

- `web:build:netlify` - Build for Netlify (without GitHub Pages path fixes)
- `deploy:netlify` - Deploy to production
- `deploy:netlify:preview` - Deploy to preview URL

## 🔧 Environment Variables

If your app requires environment variables, set them in Netlify:

1. Go to Site settings → Environment variables
2. Add variables like:
   - `NODE_ENV=production`
   - `EXPO_PUBLIC_API_URL=https://your-api.com`

## 🌐 Custom Domain

To use a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

## 🔄 Continuous Deployment

### Automatic Deployments

Once connected to GitHub:
- **Production**: Deploys automatically on pushes to `main` branch
- **Preview**: Creates preview deployments for pull requests
- **Branch deploys**: Optional deploys for other branches

### Deploy Contexts

Different build settings for different contexts:

- **Production**: `NODE_ENV=production`
- **Deploy previews**: `NODE_ENV=development`
- **Branch deploys**: `NODE_ENV=development`

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails with Bun**
   ```bash
   # If Bun isn't available, fallback to npm
   # Update netlify.toml build command to:
   command = "npm run web:build:netlify"
   ```

2. **404 Errors on Refresh**
   - Ensure the SPA redirect rule is in `netlify.toml`
   - Check that `publish = "dist"` matches your build output

3. **Assets Not Loading**
   - Verify the build output in the `dist` directory
   - Check that all assets are included in the build

4. **Environment Variables Not Working**
   - Ensure variables are prefixed with `EXPO_PUBLIC_` for client-side access
   - Check they're set in Netlify site settings

### Build Debugging

To debug build issues locally:

```bash
# Test the exact build command Netlify uses
bun run web:build:netlify

# Serve locally to test
bun run web:serve

# Check build output
ls -la dist/
```

## 📊 Performance Optimization

### Netlify Features

The configuration includes:

- **Caching**: Static assets cached for 1 year
- **Security Headers**: XSS protection, content type sniffing prevention
- **Compression**: Automatic gzip/brotli compression
- **CDN**: Global content delivery network

### Additional Optimizations

Consider enabling:

- **Asset Optimization**: Automatic image optimization
- **Bundle Analysis**: Monitor bundle size
- **Analytics**: Track site performance

## 🔐 Security

### Headers Configuration

Security headers are automatically applied:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### HTTPS

- Automatic HTTPS certificates
- HTTP to HTTPS redirects
- HSTS headers for enhanced security

## 📈 Monitoring

### Deploy Notifications

Set up notifications for:
- Successful deployments
- Failed builds
- Performance regressions

### Analytics

Enable Netlify Analytics for:
- Page views and unique visitors
- Top pages and referrers
- Core Web Vitals

## 🆚 Netlify vs GitHub Pages

| Feature | Netlify | GitHub Pages |
|---------|---------|--------------|
| **Custom domains** | ✅ Free HTTPS | ✅ Free HTTPS |
| **Build minutes** | 300/month free | Unlimited |
| **Deploy previews** | ✅ PR previews | ❌ |
| **Environment variables** | ✅ | ❌ |
| **Serverless functions** | ✅ | ❌ |
| **Form handling** | ✅ | ❌ |
| **Analytics** | ✅ (paid) | ❌ |
| **A/B testing** | ✅ (paid) | ❌ |

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** - Enable error tracking and analytics
2. **Configure notifications** - Get alerts for deploy status
3. **Optimize performance** - Use Netlify's optimization features
4. **Set up staging** - Use branch deploys for testing

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **Community Forum**: https://community.netlify.com
- **Status Page**: https://netlifystatus.com

---

**Ready to deploy?** Follow the Quick Start guide above, and your app will be live on Netlify in minutes!
