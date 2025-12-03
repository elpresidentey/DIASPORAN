/**
 * Feature: dettyconnect-bug-fixes, Property 3: Import Path Resolution
 * 
 * Property: For any import statement in TypeScript/JavaScript files, the imported
 * module path should resolve to an existing file when processed by the TypeScript compiler
 * 
 * Validates: Requirements 2.2, 2.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Property 3: Import Path Resolution', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');

  /**
   * Helper function to find all TypeScript/JavaScript files in a directory
   */
  function findSourceFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (!file.startsWith('.') && file !== 'node_modules') {
          findSourceFiles(filePath, fileList);
        }
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  /**
   * Helper function to extract import statements from a file
   */
  function extractImports(filePath: string): Array<{ importPath: string; line: number }> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports: Array<{ importPath: string; line: number }> = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match various import patterns:
      // import ... from "path"
      // import ... from 'path'
      // import("path")
      const importMatch = line.match(/import\s+.*?\s+from\s+["']([^"']+)["']/);
      const dynamicImportMatch = line.match(/import\s*\(\s*["']([^"']+)["']\s*\)/);
      
      if (importMatch) {
        imports.push({ importPath: importMatch[1], line: i + 1 });
      } else if (dynamicImportMatch) {
        imports.push({ importPath: dynamicImportMatch[1], line: i + 1 });
      }
    }

    return imports;
  }

  /**
   * Helper function to resolve an import path to a file system path
   */
  function resolveImportPath(importPath: string, fromFile: string): string | null {
    // Skip external packages (not starting with . or @/)
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      return null; // External package, not a file path
    }

    let resolvedPath: string;

    if (importPath.startsWith('@/')) {
      // Handle path alias @/ -> src/
      const relativePath = importPath.substring(2); // Remove '@/'
      resolvedPath = path.join(srcDir, relativePath);
    } else {
      // Handle relative imports
      const fromDir = path.dirname(fromFile);
      resolvedPath = path.join(fromDir, importPath);
    }

    // Try different extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
    
    for (const ext of extensions) {
      const fullPath = resolvedPath + ext;
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return fullPath;
      }
    }

    // Check if it's a directory with an index file
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
      for (const indexFile of ['index.ts', 'index.tsx', 'index.js', 'index.jsx']) {
        const indexPath = path.join(resolvedPath, indexFile);
        if (fs.existsSync(indexPath)) {
          return indexPath;
        }
      }
    }

    return null; // Could not resolve
  }

  /**
   * Collect all imports from all source files
   */
  const sourceFiles = findSourceFiles(srcDir);
  const allImports: Array<{
    file: string;
    importPath: string;
    line: number;
  }> = [];

  for (const file of sourceFiles) {
    const imports = extractImports(file);
    for (const imp of imports) {
      allImports.push({
        file,
        importPath: imp.importPath,
        line: imp.line,
      });
    }
  }

  // Filter to only local imports (not external packages)
  const localImports = allImports.filter(
    (imp) => imp.importPath.startsWith('.') || imp.importPath.startsWith('@/')
  );

  it('should resolve all local import paths to existing files', () => {
    // Property-based test: for any local import statement in the codebase,
    // the import path should resolve to an existing file
    fc.assert(
      fc.property(
        fc.constantFrom(...localImports),
        (importInfo) => {
          const resolvedPath = resolveImportPath(importInfo.importPath, importInfo.file);
          
          if (!resolvedPath) {
            const relativePath = path.relative(projectRoot, importInfo.file);
            console.error(
              `Import resolution failed:\n` +
              `  File: ${relativePath}:${importInfo.line}\n` +
              `  Import: "${importInfo.importPath}"\n` +
              `  Could not resolve to an existing file`
            );
            return false;
          }

          return true;
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  it('should verify all local imports resolve correctly (exhaustive check)', () => {
    // Additional exhaustive check to provide detailed feedback
    const unresolvedImports: string[] = [];

    for (const importInfo of localImports) {
      const resolvedPath = resolveImportPath(importInfo.importPath, importInfo.file);
      
      if (!resolvedPath) {
        const relativePath = path.relative(projectRoot, importInfo.file);
        unresolvedImports.push(
          `${relativePath}:${importInfo.line} - "${importInfo.importPath}"`
        );
      }
    }

    if (unresolvedImports.length > 0) {
      console.error('\nUnresolved imports found:');
      unresolvedImports.forEach((imp) => console.error(`  ${imp}`));
    }

    expect(unresolvedImports).toEqual([]);
  });

  it('should verify @/ path alias resolves correctly', () => {
    // Specific test for @/ path alias imports
    const aliasImports = localImports.filter((imp) => imp.importPath.startsWith('@/'));

    if (aliasImports.length === 0) {
      // Skip if no alias imports found
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...aliasImports),
        (importInfo) => {
          const resolvedPath = resolveImportPath(importInfo.importPath, importInfo.file);
          
          if (!resolvedPath) {
            console.error(
              `Path alias resolution failed: ${importInfo.importPath} in ${path.relative(projectRoot, importInfo.file)}`
            );
            return false;
          }

          // Verify the resolved path is within the src directory
          const isInSrc = resolvedPath.startsWith(srcDir);
          if (!isInSrc) {
            console.error(
              `Path alias resolved outside src directory: ${importInfo.importPath} -> ${resolvedPath}`
            );
          }

          return isInSrc;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify relative imports resolve correctly', () => {
    // Specific test for relative imports (. or ..)
    const relativeImports = localImports.filter((imp) => imp.importPath.startsWith('.'));

    if (relativeImports.length === 0) {
      // Skip if no relative imports found
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...relativeImports),
        (importInfo) => {
          const resolvedPath = resolveImportPath(importInfo.importPath, importInfo.file);
          
          if (!resolvedPath) {
            console.error(
              `Relative import resolution failed: ${importInfo.importPath} in ${path.relative(projectRoot, importInfo.file)}`
            );
            return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
