/**
 * Feature: dettyconnect-bug-fixes, Property 4: JSX Element Closure
 * 
 * Property: For any JSX element in a React component file, the element should
 * have a matching closing tag or be properly self-closed
 * 
 * Validates: Requirements 3.1
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

describe('Property 4: JSX Element Closure', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');

  /**
   * Helper function to find all React component files (TSX/JSX)
   */
  function findComponentFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          findComponentFiles(filePath, fileList);
        }
      } else if (file.match(/\.(tsx|jsx)$/)) {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  /**
   * Check if a file has JSX syntax errors using TypeScript compiler
   */
  function hasJSXErrors(filePath: string): { hasErrors: boolean; errors: string[] } {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.JSX
    );

    const errors: string[] = [];

    // Check for parse diagnostics (syntax errors)
    const diagnostics = (sourceFile as any).parseDiagnostics || [];
    
    for (const diagnostic of diagnostics) {
      if (diagnostic.file) {
        const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start || 0);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        errors.push(`Line ${line + 1}: ${message}`);
      }
    }

    return {
      hasErrors: errors.length > 0,
      errors
    };
  }

  it('should have all JSX elements properly closed in all component files', () => {
    const componentFiles = findComponentFiles(srcDir);
    
    expect(componentFiles.length).toBeGreaterThan(0);
    
    const filesWithErrors: { file: string; errors: string[] }[] = [];

    // Check each component file for JSX closure errors
    for (const filePath of componentFiles) {
      const { hasErrors, errors } = hasJSXErrors(filePath);
      
      if (hasErrors) {
        const relativePath = path.relative(projectRoot, filePath);
        filesWithErrors.push({ file: relativePath, errors });
      }
    }

    // If there are files with errors, create a detailed error message
    if (filesWithErrors.length > 0) {
      const errorMessage = filesWithErrors
        .map(({ file, errors }) => `${file}:\n${errors.map(e => `  - ${e}`).join('\n')}`)
        .join('\n\n');
      
      if (filesWithErrors.length > 0) {
        throw new Error(`Found JSX closure errors in ${filesWithErrors.length} file(s):\n\n${errorMessage}`);
      }
      expect(filesWithErrors.length).toBe(0);
    }
  });
});
