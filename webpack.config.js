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
  }

  return config;
};
