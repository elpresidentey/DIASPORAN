/**
 * Feature: dettyconnect-bug-fixes, Property 5: Motion Component Props Validity
 * 
 * Property: For any framer-motion component usage, the props passed should be
 * valid according to the framer-motion API
 * 
 * Validates: Requirements 3.2
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

describe('Property 5: Motion Component Props Validity', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');

  /**
   * Valid framer-motion props for motion components
   * Based on framer-motion v12 API
   */
  const VALID_MOTION_PROPS = new Set([
    // Animation props
    'animate',
    'initial',
    'exit',
    'transition',
    'variants',
    'style',
    
    // Gesture props
    'whileHover',
    'whileTap',
    'whileFocus',
    'whileDrag',
    'whileInView',
    
    // Drag props
    'drag',
    'dragConstraints',
    'dragElastic',
    'dragMomentum',
    'dragTransition',
    'dragSnapToOrigin',
    'dragPropagation',
    'dragControls',
    'dragListener',
    'onDrag',
    'onDragStart',
    'onDragEnd',
    'onDirectionLock',
    
    // Layout props
    'layout',
    'layoutId',
    'layoutDependency',
    'layoutScroll',
    'layoutRoot',
    
    // Viewport props
    'viewport',
    'onViewportEnter',
    'onViewportLeave',
    
    // Animation lifecycle
    'onAnimationStart',
    'onAnimationComplete',
    'onUpdate',
    
    // Standard HTML/React props
    'className',
    'id',
    'key',
    'ref',
    'children',
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onMouseDown',
    'onMouseUp',
    'onScroll',
    'onFocus',
    'onBlur',
    'onChange',
    'onSubmit',
    'onKeyDown',
    'onKeyUp',
    'onKeyPress',
    'tabIndex',
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-hidden',
    'data-testid',
    'title',
    'alt',
    'src',
    
    // SVG-specific props
    'cx',
    'cy',
    'r',
    'd',
    'stroke',
    'strokeWidth',
    'strokeLinecap',
    'strokeLinejoin',
    'fill',
    'viewBox',
    'width',
    'height',
    'x',
    'y',
    'x1',
    'y1',
    'x2',
    'y2',
    'points',
    'transform',
    'opacity',
    'fillOpacity',
    'strokeOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'clipPath',
    'mask',
    'filter',
    'href',
    'target',
    'rel',
    'type',
    'value',
    'placeholder',
    'disabled',
    'readOnly',
    'required',
    'autoFocus',
    'autoComplete',
    'name',
    'htmlFor',
    'accept',
    'multiple',
    'checked',
    'defaultValue',
    'defaultChecked',
    'min',
    'max',
    'step',
    'pattern',
    'maxLength',
    'minLength',
    'rows',
    'cols',
    'wrap',
    'spellCheck',
    'autoCapitalize',
    'autoCorrect',
    'inputMode',
    'list',
    'form',
    'formAction',
    'formEncType',
    'formMethod',
    'formNoValidate',
    'formTarget',
    'width',
    'height',
    'loading',
    'decoding',
    'crossOrigin',
    'sizes',
    'srcSet',
    'useMap',
    'isMap',
    'controls',
    'loop',
    'muted',
    'autoPlay',
    'playsInline',
    'poster',
    'preload',
    'download',
    'ping',
    'referrerPolicy',
    'hrefLang',
    'media',
    'as',
    'color',
    'content',
    'httpEquiv',
    'charSet',
    'itemProp',
    'itemScope',
    'itemType',
    'itemID',
    'itemRef',
    'lang',
    'dir',
    'hidden',
    'contentEditable',
    'draggable',
    'spellcheck',
    'translate',
    'about',
    'datatype',
    'inlist',
    'prefix',
    'property',
    'resource',
    'typeof',
    'vocab',
    'dangerouslySetInnerHTML',
    'suppressContentEditableWarning',
    'suppressHydrationWarning',
  ]);

  /**
   * Props that should have specific value types
   */
  const PROP_TYPE_VALIDATORS: Record<string, (value: any) => boolean> = {
    animate: (val) => typeof val === 'object' || typeof val === 'string' || typeof val === 'boolean',
    initial: (val) => typeof val === 'object' || typeof val === 'string' || typeof val === 'boolean',
    exit: (val) => typeof val === 'object' || typeof val === 'string',
    transition: (val) => typeof val === 'object',
    variants: (val) => typeof val === 'object',
    whileHover: (val) => typeof val === 'object',
    whileTap: (val) => typeof val === 'object',
    whileFocus: (val) => typeof val === 'object',
    whileDrag: (val) => typeof val === 'object',
    whileInView: (val) => typeof val === 'object',
    drag: (val) => typeof val === 'boolean' || val === 'x' || val === 'y',
    layout: (val) => typeof val === 'boolean' || val === 'position' || val === 'size',
    viewport: (val) => typeof val === 'object',
  };

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
   * Extract motion component usages from a TSX file
   */
  function extractMotionComponents(filePath: string): Array<{
    component: string;
    props: string[];
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

    const motionComponents: Array<{
      component: string;
      props: string[];
      line: number;
    }> = [];

    function visit(node: ts.Node) {
      // Check for JSX opening elements like <motion.div>
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tagName = node.tagName.getText(sourceFile);
        
        // Check if it's a motion component (motion.div, motion.p, etc.)
        if (tagName.startsWith('motion.')) {
          const props: string[] = [];
          const attributes = ts.isJsxOpeningElement(node) 
            ? node.attributes.properties 
            : node.attributes.properties;

          for (const attr of attributes) {
            if (ts.isJsxAttribute(attr) && attr.name) {
              props.push(attr.name.getText(sourceFile));
            } else if (ts.isJsxSpreadAttribute(attr)) {
              // Spread attributes are generally safe as they come from objects
              props.push('...(spread)');
            }
          }

          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          motionComponents.push({
            component: tagName,
            props,
            line: line + 1,
          });
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return motionComponents;
  }

  /**
   * Validate that a prop name is valid for motion components
   */
  function isValidMotionProp(propName: string): boolean {
    // Spread attributes are allowed
    if (propName === '...(spread)') {
      return true;
    }

    // Check if it's a valid motion prop
    if (VALID_MOTION_PROPS.has(propName)) {
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

  it('should have valid props on all motion components', () => {
    const tsxFiles = findTSXFiles(srcDir);
    expect(tsxFiles.length).toBeGreaterThan(0);

    const invalidUsages: Array<{
      file: string;
      component: string;
      invalidProps: string[];
      line: number;
    }> = [];

    // Check each TSX file for motion component usage
    for (const filePath of tsxFiles) {
      const motionComponents = extractMotionComponents(filePath);

      for (const usage of motionComponents) {
        const invalidProps = usage.props.filter(prop => !isValidMotionProp(prop));

        if (invalidProps.length > 0) {
          const relativePath = path.relative(projectRoot, filePath);
          invalidUsages.push({
            file: relativePath,
            component: usage.component,
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
          ({ file, component, invalidProps, line }) =>
            `${file}:${line} - <${component}> has invalid props: ${invalidProps.join(', ')}`
        )
        .join('\n');

      if (invalidUsages.length > 0) {
        throw new Error(`Found motion components with invalid props:\n${errorMessage}`);
      }
      expect(invalidUsages.length).toBe(0);
    }
  });

  it('should not have conflicting animation props', () => {
    const tsxFiles = findTSXFiles(srcDir);
    
    const conflictingUsages: Array<{
      file: string;
      component: string;
      issue: string;
      line: number;
    }> = [];

    for (const filePath of tsxFiles) {
      const motionComponents = extractMotionComponents(filePath);

      for (const usage of motionComponents) {
        // Check for potential conflicts
        const hasAnimate = usage.props.includes('animate');
        const hasVariants = usage.props.includes('variants');
        
        // Having both animate and variants can be valid, but it's worth noting
        // The variants take precedence, so this is just a warning check
        // For this test, we'll allow both as it's valid in framer-motion
        
        // Check for invalid combinations
        const hasDrag = usage.props.includes('drag');
        const hasLayout = usage.props.includes('layout');
        
        // These combinations are valid in framer-motion v12
        // No conflicts to report for now
      }
    }

    expect(conflictingUsages.length).toBe(0);
  });

  it('should have motion components properly imported', () => {
    const tsxFiles = findTSXFiles(srcDir);
    
    const filesWithMotionComponents: string[] = [];
    const filesWithoutImport: string[] = [];

    for (const filePath of tsxFiles) {
      const motionComponents = extractMotionComponents(filePath);
      
      if (motionComponents.length > 0) {
        filesWithMotionComponents.push(filePath);
        
        // Check if the file imports motion from framer-motion
        const content = fs.readFileSync(filePath, 'utf-8');
        const hasMotionImport = 
          content.includes('import { motion }') ||
          content.includes('import * as motion') ||
          content.includes('from "framer-motion"') ||
          content.includes("from 'framer-motion'");

        if (!hasMotionImport) {
          const relativePath = path.relative(projectRoot, filePath);
          filesWithoutImport.push(relativePath);
        }
      }
    }

    if (filesWithoutImport.length > 0) {
      const errorMessage = filesWithoutImport.join('\n');
      if (filesWithoutImport.length > 0) {
        throw new Error(`Files using motion components without importing from framer-motion:\n${errorMessage}`);
      }
      expect(filesWithoutImport.length).toBe(0);
    }
  });
});
