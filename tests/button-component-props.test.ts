/**
 * Feature: dettyconnect-bug-fixes, Property 7: Button Component Props Validity
 * 
 * Property: For any Button component usage, the combination of props should be
 * valid according to the Button component's prop types
 * 
 * Validates: Requirements 3.4
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

describe('Property 7: Button Component Props Validity', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');

  /**
   * Valid Button component variants based on the Button component definition
   */
  const VALID_VARIANTS = new Set([
    'default',
    'primary',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'success',
    'shimmer',
  ]);

  /**
   * Valid Button component sizes based on the Button component definition
   */
  const VALID_SIZES = new Set([
    'default',
    'sm',
    'lg',
    'xl',
    'icon',
  ]);

  /**
   * Valid Button component props including ButtonHTMLAttributes
   */
  const VALID_BUTTON_PROPS = new Set([
    // Button-specific props
    'variant',
    'size',
    'asChild',
    'className',
    'loading',
    'icon',
    
    // Standard button HTML attributes
    'type',
    'disabled',
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseDown',
    'onMouseUp',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onKeyPress',
    'tabIndex',
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-hidden',
    'aria-expanded',
    'aria-pressed',
    'aria-disabled',
    'data-testid',
    'title',
    'id',
    'name',
    'value',
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'autoFocus',
    'ref',
    'key',
    'children',
    'style',
  ]);

  /**
   * Find all TSX files in the project
   */
  function findTSXFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          findTSXFiles(filePath, fileList);
        }
      } else if (file.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  /**
   * Extract Button component usages from a TSX file
   */
  function extractButtonComponents(filePath: string): Array<{
    props: Map<string, string | null>;
    line: number;
  }> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    const buttonComponents: Array<{
      props: Map<string, string | null>;
      line: number;
    }> = [];

    function visit(node: ts.Node) {
      // Check for JSX opening elements like <Button>
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tagName = node.tagName.getText(sourceFile);
        
        // Check if it's a Button component
        if (tagName === 'Button') {
          const props = new Map<string, string | null>();
          const attributes = ts.isJsxOpeningElement(node) 
            ? node.attributes.properties 
            : node.attributes.properties;

          for (const attr of attributes) {
            if (ts.isJsxAttribute(attr) && attr.name) {
              const propName = attr.name.getText(sourceFile);
              let propValue: string | null = null;

              if (attr.initializer) {
                if (ts.isStringLiteral(attr.initializer)) {
                  propValue = attr.initializer.text;
                } else if (ts.isJsxExpression(attr.initializer) && attr.initializer.expression) {
                  propValue = attr.initializer.expression.getText(sourceFile);
                }
              }

              props.set(propName, propValue);
            } else if (ts.isJsxSpreadAttribute(attr)) {
              // Spread attributes are generally safe
              props.set('...(spread)', null);
            }
          }

          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          buttonComponents.push({
            props,
            line: line + 1,
          });
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return buttonComponents;
  }

  /**
   * Validate that a prop name is valid for Button components
   */
  function isValidButtonProp(propName: string): boolean {
    // Spread attributes are allowed
    if (propName === '...(spread)') {
      return true;
    }

    // Check if it's a valid button prop
    if (VALID_BUTTON_PROPS.has(propName)) {
      return true;
    }

    // Allow data-* attributes
    if (propName.startsWith('data-')) {
      return true;
    }

    // Allow aria-* attributes
    if (propName.startsWith('aria-')) {
      return true;
    }

    // Allow on* event handlers
    if (propName.startsWith('on')) {
      return true;
    }

    return false;
  }

  /**
   * Validate variant prop value
   */
  function isValidVariant(value: string | null): boolean {
    if (value === null) {
      return true; // No value means default will be used
    }

    // Remove quotes if present
    const cleanValue = value.replace(/['"]/g, '');
    
    // Check if it's a direct variant value
    if (VALID_VARIANTS.has(cleanValue)) {
      return true;
    }

    // Handle conditional expressions (ternary operators)
    // Extract string literals from expressions like: i === 0 ? "outline" : "ghost"
    const stringLiteralRegex = /["']([^"']+)["']/g;
    const matches = [...value.matchAll(stringLiteralRegex)];
    
    if (matches.length > 0) {
      // If we found string literals in the expression, validate each one
      return matches.every(match => VALID_VARIANTS.has(match[1]));
    }

    // If it's a variable or complex expression without string literals,
    // we can't validate it statically, so we assume it's valid
    return true;
  }

  /**
   * Validate size prop value
   */
  function isValidSize(value: string | null): boolean {
    if (value === null) {
      return true; // No value means default will be used
    }

    // Remove quotes if present
    const cleanValue = value.replace(/['"]/g, '');
    
    // Check if it's a direct size value
    if (VALID_SIZES.has(cleanValue)) {
      return true;
    }

    // Handle conditional expressions (ternary operators)
    // Extract string literals from expressions like: isLarge ? "lg" : "sm"
    const stringLiteralRegex = /["']([^"']+)["']/g;
    const matches = [...value.matchAll(stringLiteralRegex)];
    
    if (matches.length > 0) {
      // If we found string literals in the expression, validate each one
      return matches.every(match => VALID_SIZES.has(match[1]));
    }

    // If it's a variable or complex expression without string literals,
    // we can't validate it statically, so we assume it's valid
    return true;
  }

  it('should have valid props on all Button components', () => {
    const tsxFiles = findTSXFiles(srcDir);
    expect(tsxFiles.length).toBeGreaterThan(0);

    const invalidUsages: Array<{
      file: string;
      invalidProps: string[];
      line: number;
    }> = [];

    // Check each TSX file for Button component usage
    for (const filePath of tsxFiles) {
      const buttonComponents = extractButtonComponents(filePath);

      for (const usage of buttonComponents) {
        const invalidProps: string[] = [];

        for (const [propName] of usage.props) {
          if (!isValidButtonProp(propName)) {
            invalidProps.push(propName);
          }
        }

        if (invalidProps.length > 0) {
          const relativePath = path.relative(projectRoot, filePath);
          invalidUsages.push({
            file: relativePath,
            invalidProps,
            line: usage.line,
          });
        }
      }
    }

    // If there are invalid usages, create a detailed error message
    if (invalidUsages.length > 0) {
      const errorMessage = invalidUsages
        .map(
          ({ file, invalidProps, line }) =>
            `${file}:${line} - <Button> has invalid props: ${invalidProps.join(', ')}`
        )
        .join('\n');

      if (invalidUsages.length > 0) {
        throw new Error(`Found Button components with invalid props:\n${errorMessage}`);
      }
      expect(invalidUsages.length).toBe(0);
    }
  });

  it('should have valid variant values on all Button components', () => {
    const tsxFiles = findTSXFiles(srcDir);

    const invalidVariants: Array<{
      file: string;
      variant: string;
      line: number;
    }> = [];

    for (const filePath of tsxFiles) {
      const buttonComponents = extractButtonComponents(filePath);

      for (const usage of buttonComponents) {
        const variantValue = usage.props.get('variant');
        
        if (variantValue !== undefined && !isValidVariant(variantValue)) {
          const relativePath = path.relative(projectRoot, filePath);
          invalidVariants.push({
            file: relativePath,
            variant: variantValue || 'undefined',
            line: usage.line,
          });
        }
      }
    }

    if (invalidVariants.length > 0) {
      const errorMessage = invalidVariants
        .map(
          ({ file, variant, line }) =>
            `${file}:${line} - <Button> has invalid variant: ${variant}`
        )
        .join('\n');

      if (invalidVariants.length > 0) {
        throw new Error(`Found Button components with invalid variants:\n${errorMessage}`);
      }
      expect(invalidVariants.length).toBe(0);
    }
  });

  it('should have valid size values on all Button components', () => {
    const tsxFiles = findTSXFiles(srcDir);

    const invalidSizes: Array<{
      file: string;
      size: string;
      line: number;
    }> = [];

    for (const filePath of tsxFiles) {
      const buttonComponents = extractButtonComponents(filePath);

      for (const usage of buttonComponents) {
        const sizeValue = usage.props.get('size');
        
        if (sizeValue !== undefined && !isValidSize(sizeValue)) {
          const relativePath = path.relative(projectRoot, filePath);
          invalidSizes.push({
            file: relativePath,
            size: sizeValue || 'undefined',
            line: usage.line,
          });
        }
      }
    }

    if (invalidSizes.length > 0) {
      const errorMessage = invalidSizes
        .map(
          ({ file, size, line }) =>
            `${file}:${line} - <Button> has invalid size: ${size}`
        )
        .join('\n');

      if (invalidSizes.length > 0) {
        throw new Error(`Found Button components with invalid sizes:\n${errorMessage}`);
      }
      expect(invalidSizes.length).toBe(0);
    }
  });

  it('should have Button components properly imported', () => {
    const tsxFiles = findTSXFiles(srcDir);
    
    const filesWithButtonComponents: string[] = [];
    const filesWithoutImport: string[] = [];

    for (const filePath of tsxFiles) {
      const buttonComponents = extractButtonComponents(filePath);
      
      if (buttonComponents.length > 0) {
        filesWithButtonComponents.push(filePath);
        
        // Check if the file imports Button
        const content = fs.readFileSync(filePath, 'utf-8');
        const hasButtonImport = 
          content.includes('import { Button }') ||
          content.includes('import * as Button') ||
          content.includes('from "@/components/ui/Button"') ||
          content.includes('from "@/components/ui/button"') ||
          content.includes("from '@/components/ui/Button'") ||
          content.includes("from '@/components/ui/button'") ||
          content.includes('from "./ui/button"') ||
          content.includes('from "./ui/Button"') ||
          content.includes("from './ui/button'") ||
          content.includes("from './ui/Button'");

        if (!hasButtonImport) {
          const relativePath = path.relative(projectRoot, filePath);
          filesWithoutImport.push(relativePath);
        }
      }
    }

    if (filesWithoutImport.length > 0) {
      const errorMessage = filesWithoutImport.join('\n');
      if (filesWithoutImport.length > 0) {
        throw new Error(`Files using Button components without importing:\n${errorMessage}`);
      }
      expect(filesWithoutImport.length).toBe(0);
    }
  });
});
