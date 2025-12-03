/**
 * Feature: dettyconnect-bug-fixes, Property 6: TypeScript Compilation Success
 * 
 * Property: For any TypeScript file in the project, running the TypeScript compiler
 * should produce no syntax or type errors
 * 
 * Validates: Requirements 3.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Property 6: TypeScript Compilation Success', () => {
  const projectRoot = path.resolve(__dirname, '..');

  /**
   * Helper function to find all TypeScript files in a directory
   */
  function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, and other build directories
        if (!file.startsWith('.') && file !== 'node_modules') {
          findTypeScriptFiles(filePath, fileList);
        }
      } else if (file.match(/\.(ts|tsx)$/)) {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  /**
   * Helper function to check TypeScript compilation for the entire project
   */
  function checkTypeScriptCompilation(): { success: boolean; errors: string[] } {
    try {
      // Run TypeScript compiler in noEmit mode (type checking only)
      execSync('npx tsc --noEmit', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      return { success: true, errors: [] };
    } catch (error: any) {
      // TypeScript compilation failed
      const output = error.stdout || error.stderr || error.message || '';
      
      // Parse errors from output
      const errorLines = output
        .split('\n')
        .filter((line: string) => line.includes('error TS'))
        .slice(0, 10); // Limit to first 10 errors for readability
      
      return {
        success: false,
        errors: errorLines.length > 0 ? errorLines : [output.substring(0, 500)],
      };
    }
  }

  /**
   * Helper function to validate basic TypeScript syntax in a file
   */
  function validateTypeScriptSyntax(filePath: string): { valid: boolean; error?: string } {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check that the file is not empty
      if (content.trim().length === 0) {
        return { valid: false, error: 'File is empty' };
      }
      
      // Check for balanced braces and brackets
      if (!checkBalancedBraces(content)) {
        return { valid: false, error: 'Mismatched braces or brackets' };
      }
      
      // Check for unclosed JSX tags (basic check)
      if (filePath.endsWith('.tsx')) {
        const jsxIssue = checkBasicJSXSyntax(content);
        if (jsxIssue) {
          return { valid: false, error: jsxIssue };
        }
      }
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Read error: ${error instanceof Error ? error.message : String(error)}`,
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
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")
      .replace(/`(?:[^`\\]|\\.)*`/g, '``')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    
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

  /**
   * Helper function to check basic JSX syntax issues
   */
  function checkBasicJSXSyntax(content: string): string | null {
    // Remove strings and comments
    const cleaned = content
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")
      .replace(/`(?:[^`\\]|\\.)*`/g, '``')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Check for common JSX issues
    // Look for opening tags without closing tags (simplified check)
    const openTags = cleaned.match(/<[A-Z][a-zA-Z0-9.]*(?:\s[^>]*)?>/g) || [];
    const closeTags = cleaned.match(/<\/[A-Z][a-zA-Z0-9.]*>/g) || [];
    const selfClosingTags = cleaned.match(/<[A-Z][a-zA-Z0-9.]*(?:\s[^>]*)?\/>/g) || [];
    
    // Simple heuristic: number of open tags should roughly match close tags + self-closing tags
    const openCount = openTags.length;
    const closeCount = closeTags.length + selfClosingTags.length;
    
    // Allow some tolerance for fragments and other special cases
    if (Math.abs(openCount - closeCount) > 5) {
      return 'Possible unclosed JSX elements';
    }
    
    return null;
  }

  // Collect all TypeScript files
  const typeScriptFiles = findTypeScriptFiles(projectRoot);

  it('should compile all TypeScript files without errors', () => {
    // Property-based test: the entire TypeScript project should compile without errors
    const result = checkTypeScriptCompilation();
    
    if (!result.success) {
      console.error('\nTypeScript compilation errors found:');
      result.errors.forEach((error) => console.error(error));
    }
    
    expect(result.success).toBe(true);
  });

  it('should verify all TypeScript files exist and are readable', () => {
    // Property-based test: for any TypeScript file in the project,
    // it should exist and be readable
    fc.assert(
      fc.property(
        fc.constantFrom(...typeScriptFiles),
        (filePath) => {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(projectRoot, filePath);
            
            // File should not be empty
            if (content.trim().length === 0) {
              console.error(`\nFile is empty: ${relativePath}`);
              return false;
            }
            
            return true;
          } catch (error) {
            const relativePath = path.relative(projectRoot, filePath);
            console.error(`\nCannot read file: ${relativePath}`);
            console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
            return false;
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  it('should verify TypeScript files have valid extensions', () => {
    // Property-based test: all TypeScript files should have .ts or .tsx extension
    fc.assert(
      fc.property(
        fc.constantFrom(...typeScriptFiles),
        (filePath) => {
          const hasValidExtension = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
          
          if (!hasValidExtension) {
            const relativePath = path.relative(projectRoot, filePath);
            console.error(`\nInvalid TypeScript file extension: ${relativePath}`);
          }
          
          return hasValidExtension;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify project compiles with tsc --noEmit', () => {
    // This is the definitive test - if TypeScript compiler says it's valid, it's valid
    const result = checkTypeScriptCompilation();
    
    if (!result.success) {
      console.error('\n=== TypeScript Compilation Errors ===');
      result.errors.forEach((error) => console.error(error));
      console.error('=====================================\n');
    }
    
    expect(result.success).toBe(true);
  });
});
