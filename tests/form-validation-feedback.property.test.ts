import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Input } from '@/components/ui/Input';

/**
 * **Feature: ui-enhancement, Property 26: Form Validation Feedback**
 * **Validates: Requirements 7.3**
 * 
 * For any invalid form submission, errors should be highlighted inline with descriptive messages
 */

// Generator for error messages (non-empty strings with actual content)
const errorMessageArbitrary = fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0);

// Generator for input types
const inputTypeArbitrary = fc.constantFrom(
  'text',
  'email',
  'password',
  'number',
  'tel'
);

// Generator for input props with errors
const inputWithErrorArbitrary = fc.record({
  type: inputTypeArbitrary,
  label: fc.string({ minLength: 1, maxLength: 30 }),
  value: fc.string({ maxLength: 50 }),
  error: errorMessageArbitrary,
  placeholder: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  helperText: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  required: fc.boolean(),
});

describe('Property-Based Tests: Form Validation Feedback', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 26: All inputs with errors should display the error message inline', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          // Error message should be present in the DOM
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          if (errorElement) {
            // Error message should contain the error text
            expect(errorElement.textContent).toContain(props.error);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All inputs with errors should have aria-invalid="true"', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            // Input should be marked as invalid
            expect(input.getAttribute('aria-invalid')).toBe('true');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All error messages should be associated with input via aria-describedby', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          const errorElement = container.querySelector('[role="alert"]');
          
          expect(input).toBeTruthy();
          expect(errorElement).toBeTruthy();
          
          if (input && errorElement) {
            const describedBy = input.getAttribute('aria-describedby');
            const errorId = errorElement.getAttribute('id');
            
            // aria-describedby should reference the error element
            expect(describedBy).toBeTruthy();
            expect(errorId).toBeTruthy();
            expect(describedBy).toContain(errorId!);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All inputs with errors should have visual highlighting (border color)', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have red border for error state
            const hasErrorBorder = classList.some(c => c.includes('border-red'));
            expect(hasErrorBorder).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All error messages should have appropriate color styling', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          if (errorElement) {
            const classList = Array.from(errorElement.classList);
            
            // Error text should be styled with red color
            const hasErrorColor = classList.some(c => c.includes('text-red'));
            expect(hasErrorColor).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All error messages should include an error icon', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          if (errorElement) {
            // Should contain an SVG icon
            const icon = errorElement.querySelector('svg');
            expect(icon).toBeTruthy();
            
            if (icon) {
              // Icon should be hidden from screen readers
              expect(icon.getAttribute('aria-hidden')).toBe('true');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Error messages should be positioned inline below the input', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          if (errorElement) {
            const classList = Array.from(errorElement.classList);
            
            // Should have top margin to position below input
            const hasTopMargin = classList.some(c => c.includes('mt-'));
            expect(hasTopMargin).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Error state should override helper text display', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          // Only test inputs with helper text
          fc.pre(!!props.helperText);
          
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          // Helper text should not be visible when error is present
          // Find helper text by looking for elements that are not role="alert"
          const allParagraphs = container.querySelectorAll('p');
          const helperElements = Array.from(allParagraphs).filter(
            p => p.getAttribute('role') !== 'alert'
          );
          
          // No helper text should be displayed when error is present
          expect(helperElements.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Inputs without errors should not have aria-invalid="true"', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: inputTypeArbitrary,
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ maxLength: 50 }),
          error: fc.constant(undefined),
        }),
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            // Input should be marked as valid (aria-invalid="false")
            expect(input.getAttribute('aria-invalid')).toBe('false');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Inputs without errors should not display error messages', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: inputTypeArbitrary,
          label: fc.string({ minLength: 1, maxLength: 30 }),
          value: fc.string({ maxLength: 50 }),
          error: fc.constant(undefined),
        }),
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          // No error element should be present
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeFalsy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Error messages should be descriptive (non-empty)', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          if (errorElement) {
            // Error message should not be empty
            const errorText = errorElement.textContent || '';
            expect(errorText.trim().length).toBeGreaterThan(0);
            
            // Should contain the actual error message
            expect(errorText).toContain(props.error);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Error styling should provide sufficient visual distinction', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const input = container.querySelector('input');
          expect(input).toBeTruthy();
          
          if (input) {
            const classList = Array.from(input.classList);
            
            // Should have multiple error indicators:
            // 1. Red border
            const hasRedBorder = classList.some(c => c.includes('border-red'));
            expect(hasRedBorder).toBe(true);
            
            // 2. Error background
            const hasErrorBg = classList.some(c => c.includes('bg-red'));
            expect(hasErrorBg).toBe(true);
            
            // 3. Focus ring for error state
            const hasErrorRing = classList.some(c => c.includes('ring-red'));
            expect(hasErrorRing).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: Error messages should be announced to screen readers via role="alert"', () => {
    fc.assert(
      fc.property(
        inputWithErrorArbitrary,
        (props) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { ...props, onChange })
          );
          
          const errorElement = container.querySelector('[role="alert"]');
          expect(errorElement).toBeTruthy();
          
          // role="alert" ensures screen readers announce the error
          if (errorElement) {
            expect(errorElement.getAttribute('role')).toBe('alert');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 26: All input types should support error validation feedback consistently', () => {
    fc.assert(
      fc.property(
        inputTypeArbitrary,
        errorMessageArbitrary,
        fc.string({ minLength: 1, maxLength: 30 }),
        (type, error, label) => {
          const onChange = () => {};
          const { container } = render(
            React.createElement(Input, { type, label, value: '', error, onChange })
          );
          
          const input = container.querySelector('input');
          const errorElement = container.querySelector('[role="alert"]');
          
          // All types should display errors consistently
          expect(input).toBeTruthy();
          expect(errorElement).toBeTruthy();
          
          if (input && errorElement) {
            expect(input.getAttribute('aria-invalid')).toBe('true');
            expect(errorElement.textContent).toContain(error);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
