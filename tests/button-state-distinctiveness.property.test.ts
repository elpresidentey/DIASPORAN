import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import type { ButtonProps } from '@/components/ui/Button';

/**
 * **Feature: ui-enhancement, Property 29: Button State Distinctiveness**
 * **Validates: Requirements 1.3, 8.1**
 * 
 * For any button, all states (default, hover, active, focus, disabled) should be visually distinct
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
}) as fc.Arbitrary<ButtonProps & { children: string }>;

// Helper to extract computed styles for a button
function getButtonStyles(element: HTMLElement) {
  const computedStyle = window.getComputedStyle(element);
  
  return {
    transform: computedStyle.transform,
    opacity: computedStyle.opacity,
    backgroundColor: computedStyle.backgroundColor,
    color: computedStyle.color,
    borderColor: computedStyle.borderColor,
    borderWidth: computedStyle.borderWidth,
    boxShadow: computedStyle.boxShadow,
    cursor: computedStyle.cursor,
    pointerEvents: computedStyle.pointerEvents,
  };
}



// Helper to extract CSS classes that define state-specific styles
function getStateClasses(element: HTMLElement) {
  const classList = Array.from(element.classList);
  
  return {
    hover: classList.filter(c => c.includes('hover:')),
    active: classList.filter(c => c.includes('active:')),
    focus: classList.filter(c => c.includes('focus') || c.includes('ring')),
    disabled: classList.filter(c => c.includes('disabled:')),
  };
}

describe('Property-Based Tests: Button State Distinctiveness', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 29: All button states should have distinct CSS classes defined', () => {
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
            const stateClasses = getStateClasses(button);
            
            // Button should have hover state classes
            expect(stateClasses.hover.length).toBeGreaterThan(0);
            
            // Button should have active state classes
            expect(stateClasses.active.length).toBeGreaterThan(0);
            
            // Button should have focus state classes
            expect(stateClasses.focus.length).toBeGreaterThan(0);
            
            // Button should have disabled state classes
            expect(stateClasses.disabled.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Hover state should have scale transformation defined', () => {
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
            
            // Should have hover:scale class
            const hasHoverScale = classList.some(c => c.includes('hover:scale'));
            expect(hasHoverScale).toBe(true);
            
            // Specifically should scale up on hover (1.02)
            const hasHoverScaleUp = classList.some(c => c.includes('hover:scale-[1.02]'));
            expect(hasHoverScaleUp).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Active state should have scale transformation defined', () => {
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
            
            // Should have active:scale class
            const hasActiveScale = classList.some(c => c.includes('active:scale'));
            expect(hasActiveScale).toBe(true);
            
            // Specifically should scale down on active (0.98)
            const hasActiveScaleDown = classList.some(c => c.includes('active:scale-[0.98]'));
            expect(hasActiveScaleDown).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Focus state should have visible ring indicator', () => {
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
            
            // Should have focus-visible:ring class
            const hasFocusRing = classList.some(c => c.includes('focus-visible:ring'));
            expect(hasFocusRing).toBe(true);
            
            // Should have ring color defined
            const hasRingColor = classList.some(c => c.includes('ring-sky'));
            expect(hasRingColor).toBe(true);
            
            // Should have ring offset
            const hasRingOffset = classList.some(c => c.includes('ring-offset'));
            expect(hasRingOffset).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Disabled state should have reduced opacity', () => {
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
            
            // Should have disabled:opacity class
            const hasDisabledOpacity = classList.some(c => c.includes('disabled:opacity'));
            expect(hasDisabledOpacity).toBe(true);
            
            // Should disable pointer events when disabled
            const hasDisabledPointerEvents = classList.some(c => c.includes('disabled:pointer-events-none'));
            expect(hasDisabledPointerEvents).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Disabled buttons should actually be disabled in the DOM', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Only test disabled or loading buttons
          fc.pre(!!(props.disabled || props.loading));
          
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Should have disabled attribute
            expect(button.hasAttribute('disabled')).toBe(true);
            
            // Should have aria-disabled attribute
            expect(button.getAttribute('aria-disabled')).toBe('true');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Hover and active states should have different scale values', () => {
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
            
            // Extract hover scale value
            const hoverScaleClass = classList.find(c => c.includes('hover:scale-'));
            const activeScaleClass = classList.find(c => c.includes('active:scale-'));
            
            // Both should exist
            expect(hoverScaleClass).toBeTruthy();
            expect(activeScaleClass).toBeTruthy();
            
            // They should be different
            expect(hoverScaleClass).not.toBe(activeScaleClass);
            
            // Hover should scale up (1.02), active should scale down (0.98)
            expect(hoverScaleClass).toContain('1.02');
            expect(activeScaleClass).toContain('0.98');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Each variant should have distinct background or border colors', () => {
    fc.assert(
      fc.property(
        buttonVariantArbitrary,
        fc.string({ minLength: 1, maxLength: 20 }),
        (variant, children) => {
          const { container } = render(
            React.createElement(Button, { variant }, children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Should have background or border color classes
            const hasColorClasses = classList.some(c => 
              c.includes('bg-') || 
              c.includes('border-') ||
              c.includes('from-') || 
              c.includes('to-')
            );
            
            expect(hasColorClasses).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Loading state should be visually distinct from default state', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Only test loading buttons
          fc.pre(!!props.loading);
          
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Should have aria-busy attribute
            expect(button.getAttribute('aria-busy')).toBe('true');
            
            // Should be disabled
            expect(button.hasAttribute('disabled')).toBe(true);
            
            // Should have spinner element
            const spinner = button.querySelector('svg.animate-spin');
            expect(spinner).toBeTruthy();
            
            // Content should be invisible
            const invisibleContent = button.querySelector('.invisible');
            expect(invisibleContent).toBeTruthy();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: All state transitions should have duration defined', () => {
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
            
            // Should have transition-all class
            const hasTransition = classList.some(c => c.includes('transition'));
            expect(hasTransition).toBe(true);
            
            // Should have duration defined
            const hasDuration = classList.some(c => c.includes('duration'));
            expect(hasDuration).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Focus state should be distinct from hover state', () => {
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
            
            // Hover uses scale
            const hasHoverScale = classList.some(c => c.includes('hover:scale'));
            
            // Focus uses ring
            const hasFocusRing = classList.some(c => c.includes('focus-visible:ring'));
            
            // Both should be present
            expect(hasHoverScale).toBe(true);
            expect(hasFocusRing).toBe(true);
            
            // They use different visual properties (scale vs ring)
            // This ensures they are visually distinct
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Disabled state should prevent hover effects', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Only test disabled or loading buttons
          fc.pre(!!(props.disabled || props.loading));
          
          const { container } = render(
            React.createElement(Button, props, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const classList = Array.from(button.classList);
            
            // Should have pointer-events-none when disabled
            const hasPointerEventsNone = classList.some(c => c.includes('disabled:pointer-events-none'));
            expect(hasPointerEventsNone).toBe(true);
            
            // This prevents hover effects from triggering
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Each button state should have at least one unique visual property', () => {
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
            const stateClasses = getStateClasses(button);
            
            // Count total unique state-specific classes
            const totalStateClasses = 
              stateClasses.hover.length +
              stateClasses.active.length +
              stateClasses.focus.length +
              stateClasses.disabled.length;
            
            // Should have multiple state-specific classes
            expect(totalStateClasses).toBeGreaterThan(4);
            
            // Each state category should have at least one class
            expect(stateClasses.hover.length).toBeGreaterThan(0);
            expect(stateClasses.active.length).toBeGreaterThan(0);
            expect(stateClasses.focus.length).toBeGreaterThan(0);
            expect(stateClasses.disabled.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
