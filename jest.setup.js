// Jest setup file
// This file is run before each test file

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock global objects that might be needed
global.fetch = jest.fn();

// Setup any global test utilities here
