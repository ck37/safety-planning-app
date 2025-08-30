/**
 * Linting Test Suite
 * Runs ESLint checks as part of the test suite to ensure code quality
 */

import { execSync } from 'child_process';
import { join } from 'path';

describe('Code Quality - Linting', () => {
  it('should pass ESLint checks', () => {
    try {
      // Run eslint directly since expo lint may not return valid JSON
      const result = execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --format json', {
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
          'Run "npx eslint . --ext .ts,.tsx,.js,.jsx --fix" to automatically fix some issues.'
        ].join('\n');

        throw new Error(errorMessage);
      }

      // Test passes if no errors (warnings are allowed)
      expect(totalErrors).toBe(0);
      
    } catch (error: any) {
      // Handle case where eslint command fails
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
            'Run "npx eslint . --ext .ts,.tsx,.js,.jsx --fix" to automatically fix some issues.'
          ].join('\n');

          throw new Error(errorMessage);
        } catch {
          // If we can't parse the output, throw the original error
          throw new Error(`Linting failed: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  });

  it('should have ESLint configuration file', async () => {
    const fs = await import('fs');
    const configExists = fs.existsSync(join(process.cwd(), 'eslint.config.js'));
    expect(configExists).toBe(true);
  });

  it('should have lint script in package.json', async () => {
    const packageJson = await import(join(process.cwd(), 'package.json'));
    expect(packageJson.default.scripts).toHaveProperty('lint');
    expect(packageJson.default.scripts.lint).toBeTruthy();
  });
});
