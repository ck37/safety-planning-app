/**
 * Linting Test Suite
 * Runs ESLint checks as part of the test suite to ensure code quality
 */

import { execSync } from 'child_process';
import { join } from 'path';

describe('Code Quality - Linting', () => {
  it('should pass ESLint checks', () => {
    try {
      // Run expo lint which uses the project's ESLint configuration
      const result = execSync('npx expo lint -- --format json', {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Parse the ESLint output
      const lintResults = JSON.parse(result);
      
      // Count total errors and warnings
      let totalErrors = 0;
      let totalWarnings = 0;
      const filesWithIssues: string[] = [];

      lintResults.forEach((fileResult: any) => {
        if (fileResult.errorCount > 0 || fileResult.warningCount > 0) {
          filesWithIssues.push(fileResult.filePath);
          totalErrors += fileResult.errorCount;
          totalWarnings += fileResult.warningCount;
        }
      });

      // Create detailed error message if there are issues
      if (totalErrors > 0) {
        const errorMessage = [
          `ESLint found ${totalErrors} error(s) and ${totalWarnings} warning(s)`,
          `Files with issues: ${filesWithIssues.length}`,
          '',
          'Run "npm run lint" to see detailed output.',
          'Run "expo lint --fix" to automatically fix some issues.'
        ].join('\n');

        throw new Error(errorMessage);
      }

      // Test passes if no errors (warnings are allowed)
      expect(totalErrors).toBe(0);
      
    } catch (error: any) {
      // Handle case where expo lint command fails
      if (error.status !== 0 && error.stdout) {
        try {
          const lintResults = JSON.parse(error.stdout);
          let totalErrors = 0;
          let totalWarnings = 0;
          
          lintResults.forEach((fileResult: any) => {
            totalErrors += fileResult.errorCount;
            totalWarnings += fileResult.warningCount;
          });

          const errorMessage = [
            `ESLint found ${totalErrors} error(s) and ${totalWarnings} warning(s)`,
            '',
            'Run "npm run lint" to see detailed output.',
            'Run "expo lint --fix" to automatically fix some issues.'
          ].join('\n');

          throw new Error(errorMessage);
        } catch (parseError) {
          // If we can't parse the output, throw the original error
          throw new Error(`Linting failed: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  });

  it('should have ESLint configuration file', () => {
    const fs = require('fs');
    const configExists = fs.existsSync(join(process.cwd(), 'eslint.config.js'));
    expect(configExists).toBe(true);
  });

  it('should have lint script in package.json', () => {
    const packageJson = require(join(process.cwd(), 'package.json'));
    expect(packageJson.scripts).toHaveProperty('lint');
    expect(packageJson.scripts.lint).toBeTruthy();
  });
});
