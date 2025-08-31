const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Set the public path for GitHub Pages
      mode: env.mode || 'production',
    },
    argv
  );

  // Configure for GitHub Pages subdirectory
  if (env.mode === 'production') {
    config.output.publicPath = '/suicide-safety-planning-app/';
    
    // Ensure proper base URL handling for client-side routing
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Add environment variable for base URL
    config.plugins = config.plugins || [];
    
    // Try to get webpack from the existing config or require it
    let webpack;
    try {
      // First try to find webpack in the existing plugins
      const existingDefinePlugin = config.plugins.find(plugin => 
        plugin && plugin.constructor && plugin.constructor.name === 'DefinePlugin'
      );
      
      if (existingDefinePlugin) {
        // Use the same constructor as existing DefinePlugin
        webpack = { DefinePlugin: existingDefinePlugin.constructor };
      } else {
        // Fallback to requiring webpack
        webpack = require('webpack');
      }
    } catch (error) {
      console.warn('Could not load webpack, skipping DefinePlugin setup:', error.message);
      return config;
    }
    
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.EXPO_BASE_URL': JSON.stringify('/suicide-safety-planning-app'),
        'process.env.EXPO_PUBLIC_URL': JSON.stringify('https://ck37.github.io/suicide-safety-planning-app'),
      })
    );
  }

  return config;
};
