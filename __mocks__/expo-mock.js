// Mock for Expo modules
module.exports = {
  // Mock expo-router
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  
  // Mock expo-linking
  openURL: jest.fn(),
  
  // Mock expo-constants
  Constants: {
    expoConfig: {
      name: 'Test App',
      slug: 'test-app',
    },
  },
  
  // Mock expo-linear-gradient
  LinearGradient: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('div', props, children);
  },
  
  // Mock other expo modules as needed
  SplashScreen: {
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
  },
};
