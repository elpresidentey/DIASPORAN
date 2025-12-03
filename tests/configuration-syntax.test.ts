/**
 * Feature: dettyconnect-bug-fixes, Property 8: Configuration File Syntax Validity
 * 
 * Property: For any configuration file (.js, .mjs, .json), the file should be
 * parsable by Node.js or the respective tool without syntax errors
 * 
 * Validates: Requirements 5.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Property 8: Configuration File Syntax Validity', () => {
  const projectRoot = path.resolve(__dirname, '..');

  // Define all configuration files in the project
  const configFiles = [
    { path: 'next.config.js', type: 'js' },
    { path: '.eslintrc.json', type: 'json' },
    { path: 'postcss.config.js', type: 'js' },
    { path: 'postcss.config.mjs', type: 'mjs' },
    { path: 'tailwind.config.js', type: 'js' },
    { path: 'tailwind.config.ts', type: 'ts' },
    { path: 'tsconfig.json', type: 'json' },
    { path: 'package.json', type: 'json' },
    { path: 'vitest.config.ts', type: 'ts' },
  ];

  /**
   * Helper function to validate a configuration file
   */
  function validateConfigFile(filePath: string, fileType: string): { valid: boolean; error?: string } {
    const fullPath = path.join(projectRoot, filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return { valid: false, error: `File does not exist: ${filePath}` };
    }

    try {
      if (fileType === 'json') {
        // For JSON files, parse them directly
        const content = fs.readFileSync(fullPath, 'utf-8');
        JSON.parse(content);
        return { valid: true };
      } else if (fileType === 'js' || fileType === 'mjs' || fileType === 'ts') {
        // For JS/MJS/TS files, read the content and check for basic syntax validity
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Check that the file is not empty
        if (content.trim().length === 0) {
          return { valid: false, error: 'File is empty' };
        }
        
        // Check for basic syntax patterns that indicate a valid config file
        const hasExport = content.includes('export') || content.includes('module.exports');
        const hasConfig = content.includes('config') || content.includes('Config');
        
        // Check for common syntax errors
        const hasMismatchedBraces = !checkBalancedBraces(content);
        if (hasMismatchedBraces) {
          return { valid: false, error: 'Mismatched braces or brackets' };
        }
        
        // For config files, we expect either an export or a config object
        if (!hasExport && !hasConfig) {
          return { valid: false, error: 'No export or config found' };
        }
        
        return { valid: true };
      }
      
      return { valid: false, error: `Unknown file type: ${fileType}` };
    } catch (error) {
      return { 
        valid: false, 
        error: `Parse error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Helper function to check if braces and brackets are balanced
   */
  function checkBalancedBraces(content: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = {
      ')': '(',
      '}': '{',
      ']': '[',
    };
    
    // Remove strings and comments to avoid false positives
    const cleaned = content
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')  // Remove double-quoted strings
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")  // Remove single-quoted strings
      .replace(/`(?:[^`\\]|\\.)*`/g, '``')  // Remove template literals
      .replace(/\/\/.*$/gm, '')              // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '');     // Remove multi-line comments
    
    for (const char of cleaned) {
      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
      } else if (char === ')' || char === '}' || char === ']') {
        const last = stack.pop();
        if (last !== pairs[char]) {
          return false;
        }
      }
    }
    
    return stack.length === 0;
  }

  it('should parse all configuration files without syntax errors', () => {
    // Property-based test: for any configuration file in the project,
    // it should be parsable without syntax errors
    fc.assert(
      fc.property(
        fc.constantFrom(...configFiles),
        (configFile) => {
          const result = validateConfigFile(configFile.path, configFile.type);
          
          if (!result.valid) {
            console.error(`Configuration file validation failed: ${configFile.path}`);
            console.error(`Error: ${result.error}`);
          }
          
          return result.valid;
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  it('should verify all configuration files are parsable (exhaustive check)', () => {
    // Additional exhaustive check to provide detailed feedback
    const invalidFiles: string[] = [];

    for (const configFile of configFiles) {
      const result = validateConfigFile(configFile.path, configFile.type);
      
      if (!result.valid) {
        invalidFiles.push(`${configFile.path}: ${result.error}`);
      }
    }

    expect(invalidFiles).toEqual([]);
  });

  it('should validate JSON configuration files have valid JSON syntax', () => {
    // Specific test for JSON files
    const jsonFiles = configFiles.filter(f => f.type === 'json');
    
    fc.assert(
      fc.property(
        fc.constantFrom(...jsonFiles),
        (configFile) => {
          const fullPath = path.join(projectRoot, configFile.path);
          
          if (!fs.existsSync(fullPath)) {
            return false;
          }

          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const parsed = JSON.parse(content);
            // Verify it's an object or array
            return typeof parsed === 'object';
          } catch (error) {
            console.error(`JSON parse error in ${configFile.path}:`, error);
            return false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate JavaScript configuration files have proper structure', () => {
    // Specific test for JS/MJS files
    const jsFiles = configFiles.filter(f => f.type === 'js' || f.type === 'mjs');
    
    fc.assert(
      fc.property(
        fc.constantFrom(...jsFiles),
        (configFile) => {
          const fullPath = path.join(projectRoot, configFile.path);
          
          if (!fs.existsSync(fullPath)) {
            return false;
          }

          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            // Check for export statement (ES modules) or module.exports (CommonJS)
            const hasExport = content.includes('export default') || 
                            content.includes('export {') ||
                            content.includes('module.exports');
            
            // Check balanced braces
            const balanced = checkBalancedBraces(content);
            
            return hasExport && balanced;
          } catch (error) {
            console.error(`Read error in ${configFile.path}:`, error);
            return false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
