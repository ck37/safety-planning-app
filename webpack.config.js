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
    
    // Set the base URL for the router
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Configure history API fallback for SPA routing
    if (config.devServer) {
      config.devServer.historyApiFallback = {
        rewrites: [
          { from: /^\/suicide-safety-planning-app\/.*$/, to: '/suicide-safety-planning-app/index.html' }
        ]
      };
    }
  }

  return config;
};
