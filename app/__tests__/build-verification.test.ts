/**
 * Build Verification Tests
 * These tests ensure the app configuration and basic setup is correct
 */

describe('Build Verification', () => {
  it('should have valid app configuration', () => {
    const appConfig = require('../../app.json');
    
    expect(appConfig).toBeDefined();
    expect(appConfig.expo).toBeDefined();
    expect(appConfig.expo.name).toBe('Suicide Safety Planner');
    expect(appConfig.expo.slug).toBe('suicide-safety-planner');
    expect(appConfig.expo.version).toBeDefined();
  });

  it('should have valid package.json', () => {
    const packageJson = require('../../package.json');
    
    expect(packageJson).toBeDefined();
    expect(packageJson.name).toBeDefined();
    expect(packageJson.version).toBeDefined();
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.expo).toBeDefined();
    expect(packageJson.dependencies.react).toBeDefined();
    expect(packageJson.dependencies['react-native']).toBeDefined();
  });

  it('should have TypeScript configuration', () => {
    const tsConfig = require('../../tsconfig.json');
    
    expect(tsConfig).toBeDefined();
    expect(tsConfig.compilerOptions).toBeDefined();
    expect(tsConfig.extends).toBeDefined();
  });

  it('should have Jest configuration', () => {
    const jestConfig = require('../../jest.config.js');
    
    expect(jestConfig).toBeDefined();
    expect(jestConfig.preset).toBe('ts-jest');
    expect(jestConfig.moduleNameMapper).toBeDefined();
    expect(jestConfig.transformIgnorePatterns).toBeDefined();
    expect(jestConfig.testEnvironment).toBe('node');
  });

  it('should have proper test scripts in package.json', () => {
    const packageJson = require('../../package.json');
    
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts['test:coverage']).toBeDefined();
    expect(packageJson.scripts['test:ci']).toBeDefined();
    expect(packageJson.scripts['build-check']).toBeDefined();
  });
});
