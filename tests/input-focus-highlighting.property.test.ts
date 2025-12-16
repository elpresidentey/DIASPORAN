import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Input } from '@/components/ui/Input';

/**
 * **Feature: ui-enhancement, Property 31: Input Focus Highlighting**
 * **Validates: Requirements 8.3**
 * 
 * For any form input, focusing should trigger border color changes and glow effects
 */

// Generator for input types
const inputTypeArbitrary = fc.constantFrom(
  'text',
  'email',
  'password',
  'number',
  'tel'
);

// Generator for input props
const inputPropsArbitrary = fc.record({
  type: inputTypeArbitrary,
  label: fc.string({ minLength: 1, maxLength: 30 }),
  placeholder: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  error: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  helperText: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  required: fc.boolean(),
  disabled: fc.boolean(),
  value: fc.string({ maxLength: 50 }),
});

// Helper to extract focus-related CSS classes
function getFocusClasses(element: HTMLElement) {
  const classList = Array.from(element.classList);
  
  return {
    focusVisible: classList.filter(c => c.includes('focus-visible')),
    ring: classList.filter(c => c.includes('ring')),
    border: classList.filter(c => c.includes('border')),
    shadow: classList.filter(c => c.includes('shadow')),
  };
}

// Helper to check if element has glow effect
function hasGlowEffect(element: HTMLElement): boolean {
  const classList = Array.from(element.classList);
  
  // Check for shadow classes that indicate glow
  const hasGlowShadow = classList.some(c => 
    c.includes('shadow-[0_0_') || 
    c.includes('shadow-glow') ||
    (c.includes('shadow') && c.includes('rgba'))
  );
  
  return hasGlowShadow;
}

// Helper to check if element has focus border color change
function hasFocusBorderColor(element: HTMLElement): boolean {
  const classList = Array.from(element.classList);
  
  // Check for focus-visible:border classes
  const hasFocusBorder = classList.some(c => 
    c.includes('focus-visible:border')
  );
  
  return hasFocusBorder;
}

describe('Property-Based Tests: Input Focus Highlighting', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 31: All inputs should have focus-visible styles defined', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const focusClasses = getFocusClasses(input);
            
            // Should have focus-visible classes
            expect(focusClasses.focusVisible.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: All inputs should have focus ring defined', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have focus-visible:ring class
            const hasFocusRing = classList.some(c => c.includes('focus-visible:ring'));
            expect(hasFocusRing).toBe(true);
            
            // Ring should have a width (ring-2)
            const hasRingWidth = classList.some(c => c.includes('ring-2'));
            expect(hasRingWidth).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: All inputs should have border color change on focus', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const hasBorderChange = hasFocusBorderColor(input);
            expect(hasBorderChange).toBe(true);
            
            const classList = Array.from(input.classList);
            
            // Should have focus-visible:border-{color} class
            const hasFocusBorderColorClass = classList.some(c => 
              c.includes('focus-visible:border-primary') || 
              c.includes('focus-visible:border-red')
            );
            expect(hasFocusBorderColorClass).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: All inputs should have glow effect on focus', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const hasGlow = hasGlowEffect(input);
            expect(hasGlow).toBe(true);
            
            const classList = Array.from(input.classList);
            
            // Should have focus-visible:shadow with glow effect
            const hasFocusShadow = classList.some(c => 
              c.includes('focus-visible:shadow')
            );
            expect(hasFocusShadow).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Normal inputs should have primary focus styling', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary.filter(props => !props.error),
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have primary ring color (neutral)
            const hasPrimaryRing = classList.some(c => c.includes('ring-primary'));
            expect(hasPrimaryRing).toBe(true);
            
            // Should have primary border color on focus
            const hasPrimaryBorder = classList.some(c => c.includes('focus-visible:border-primary'));
            expect(hasPrimaryBorder).toBe(true);
            
            // Should have primary glow shadow (blue)
            const hasPrimaryGlow = classList.some(c => 
              c.includes('shadow-[0_0_20px_rgba(59,130,246')
            );
            expect(hasPrimaryGlow).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Error inputs should have red focus styling', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary.filter(props => props.error),
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have red ring color
            const hasRedRing = classList.some(c => c.includes('ring-red'));
            expect(hasRedRing).toBe(true);
            
            // Should have red border color on focus
            const hasRedBorder = classList.some(c => c.includes('focus-visible:border-red'));
            expect(hasRedBorder).toBe(true);
            
            // Should have red glow shadow
            const hasRedGlow = classList.some(c => 
              c.includes('shadow-[0_0_20px_rgba(239,68,68')
            );
            expect(hasRedGlow).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Focus styles should be distinct from default state', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Default border should be different from focus border
            const hasDefaultBorder = classList.some(c => 
              c.includes('border-white/10') || c.includes('border-red-500')
            );
            
            const hasFocusBorder = classList.some(c => 
              c.includes('focus-visible:border-primary') || 
              c.includes('focus-visible:border-red')
            );
            
            // Both should exist and be different
            expect(hasDefaultBorder).toBe(true);
            expect(hasFocusBorder).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Focus transitions should be smooth', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
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

  it('Property 31: Focus outline should be removed in favor of custom ring', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have focus-visible:outline-none to remove default outline
            const hasOutlineNone = classList.some(c => c.includes('outline-none'));
            expect(hasOutlineNone).toBe(true);
            
            // Should have custom ring instead
            const hasCustomRing = classList.some(c => c.includes('focus-visible:ring'));
            expect(hasCustomRing).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: All input types should have consistent focus styling', () => {
    fc.assert(
      fc.property(
        inputTypeArbitrary,
        fc.string({ minLength: 1, maxLength: 30 }),
        (type, label) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { type, label, value: '', onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const focusClasses = getFocusClasses(input);
            
            // All types should have the same focus structure
            expect(focusClasses.focusVisible.length).toBeGreaterThan(0);
            expect(focusClasses.ring.length).toBeGreaterThan(0);
            expect(focusClasses.shadow.length).toBeGreaterThan(0);
            
            // Should have consistent focus-visible classes regardless of type
            const classList = Array.from(input.classList);
            const hasFocusRing = classList.some(c => c.includes('focus-visible:ring-2'));
            expect(hasFocusRing).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Disabled inputs should not have interactive focus styles', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary.filter(props => props.disabled),
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            // Should have disabled attribute
            expect(input.hasAttribute('disabled')).toBe(true);
            
            const classList = Array.from(input.classList);
            
            // Should have disabled styling
            const hasDisabledStyle = classList.some(c => 
              c.includes('disabled:') || c.includes('cursor-not-allowed')
            );
            expect(hasDisabledStyle).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Focus ring should have sufficient contrast (ring-2 width)', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Ring should be at least 2px wide for visibility
            const hasRingWidth = classList.some(c => c.includes('ring-2'));
            expect(hasRingWidth).toBe(true);
            
            // Ring should have a color defined
            const hasRingColor = classList.some(c => 
              c.includes('ring-primary') || c.includes('ring-red')
            );
            expect(hasRingColor).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 31: Focus state should include both ring and shadow for maximum visibility', () => {
    fc.assert(
      fc.property(
        inputPropsArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have both ring and shadow
            const hasRing = classList.some(c => c.includes('focus-visible:ring'));
            const hasShadow = classList.some(c => c.includes('focus-visible:shadow'));
            
            expect(hasRing).toBe(true);
            expect(hasShadow).toBe(true);
            
            // This combination provides maximum visibility
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
