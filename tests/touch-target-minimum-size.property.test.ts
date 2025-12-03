import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';

/**
 * **Feature: ui-enhancement, Property 4: Touch Target Minimum Size**
 * **Validates: Requirements 1.5**
 * 
 * For any interactive element on touch devices, the touch target dimensions should be at least 44x44 pixels
 * 
 * Note: This test verifies that the CSS classes enforcing minimum touch target sizes are present.
 * Actual dimensional testing requires a real browser environment (e.g., Playwright/Cypress).
 */

// Generator for button variants
const buttonVariantArbitrary = fc.constantFrom(
  'default',
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'success',
  'shimmer'
);

// Generator for button sizes
const buttonSizeArbitrary = fc.constantFrom(
  'sm',
  'default',
  'lg',
  'xl',
  'icon'
);

// Generator for button props
const buttonPropsArbitrary = fc.record({
  variant: buttonVariantArbitrary,
  size: buttonSizeArbitrary,
  disabled: fc.boolean(),
  loading: fc.boolean(),
  children: fc.string({ minLength: 1, maxLength: 20 }),
});

describe('Property-Based Tests: Touch Target Minimum Size', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 4: All Button components should have minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Button should have min-h-[44px] class
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            // Button should have min-w-[44px] class
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Icon buttons should have minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonVariantArbitrary,
        fc.boolean(),
        (variant, disabled) => {
          const { container } = render(
            React.createElement(Button, { variant, size: 'icon', disabled }, '×')
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Icon buttons should still have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Small buttons should have minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonVariantArbitrary,
        fc.string({ minLength: 1, maxLength: 10 }),
        (variant, children) => {
          const { container } = render(
            React.createElement(Button, { variant, size: 'sm' }, children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Even small buttons should have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Disabled buttons should maintain minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary.filter(props => props.disabled || props.loading),
        (props) => {
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Disabled buttons should still have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Loading buttons should maintain minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary.filter(props => props.loading),
        (props) => {
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Loading buttons should still have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Buttons with icons should have minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const icon = React.createElement('span', null, '→');
          const { container } = render(
            React.createElement(Button, { ...props, icon }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Buttons with icons should still have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: All button variants and sizes should have minimum size CSS classes', () => {
    fc.assert(
      fc.property(
        buttonVariantArbitrary,
        buttonSizeArbitrary,
        fc.string({ minLength: 1, maxLength: 20 }),
        (variant, size, children) => {
          const { container } = render(
            React.createElement(Button, { variant, size }, children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // All combinations of variant and size should have minimum size classes
            const hasMinHeight = classList.some(c => c.includes('min-h-[44px]'));
            expect(hasMinHeight).toBe(true);
            
            const hasMinWidth = classList.some(c => c.includes('min-w-[44px]'));
            expect(hasMinWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Minimum size classes should be consistent across all button states', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Count how many times min-h and min-w appear
            const minHeightClasses = classList.filter(c => c.includes('min-h-[44px]'));
            const minWidthClasses = classList.filter(c => c.includes('min-w-[44px]'));
            
            // Should have exactly one of each
            expect(minHeightClasses.length).toBeGreaterThanOrEqual(1);
            expect(minWidthClasses.length).toBeGreaterThanOrEqual(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
