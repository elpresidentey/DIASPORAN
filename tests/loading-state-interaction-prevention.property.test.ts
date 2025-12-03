import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/**
 * **Feature: ui-enhancement, Property 16: Loading State Interaction Prevention**
 * **Validates: Requirements 5.3**
 * 
 * For any async action in progress, interactive elements should be disabled until completion
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
  loading: fc.boolean(),
  disabled: fc.boolean(),
  text: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'Button'),
});

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
  label: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Input Label'),
  value: fc.string({ maxLength: 50 }),
  disabled: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
});

describe('Property-Based Tests: Loading State Interaction Prevention', () => {
  it('Property 16: Loading buttons should be disabled', () => {
    fc.assert(
      fc.property(buttonPropsArbitrary, (props) => {
        const { container } = render(
          React.createElement(
            Button,
            {
              variant: props.variant as any,
              size: props.size as any,
              loading: props.loading,
              disabled: props.disabled,
              'data-testid': 'test-button',
            },
            props.text
          )
        );

        const button = container.querySelector('[data-testid="test-button"]') as HTMLButtonElement;
        expect(button).not.toBeNull();

        if (props.loading) {
          // When loading, button should be disabled
          expect(button.disabled).toBe(true);
          expect(button.getAttribute('aria-disabled')).toBe('true');
          expect(button.getAttribute('aria-busy')).toBe('true');
        } else if (props.disabled) {
          // When explicitly disabled, button should be disabled
          expect(button.disabled).toBe(true);
          expect(button.getAttribute('aria-disabled')).toBe('true');
        } else {
          // When not loading and not disabled, button should be enabled
          expect(button.disabled).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading buttons should not respond to click events', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: buttonVariantArbitrary,
          loading: fc.boolean(),
          text: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'Click Me'),
        }),
        (props) => {
          let clickCount = 0;
          const handleClick = () => {
            clickCount++;
          };

          const { container } = render(
            React.createElement(
              Button,
              {
                variant: props.variant as any,
                loading: props.loading,
                onClick: handleClick,
                'data-testid': 'clickable-button',
              },
              props.text
            )
          );

          const button = container.querySelector('[data-testid="clickable-button"]') as HTMLButtonElement;
          expect(button).not.toBeNull();

          // Attempt to click the button
          fireEvent.click(button);

          if (props.loading) {
            // Loading buttons should not trigger click handlers
            expect(clickCount).toBe(0);
          } else {
            // Non-loading buttons should trigger click handlers
            expect(clickCount).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading buttons should have pointer-events-none class', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: buttonVariantArbitrary,
          size: buttonSizeArbitrary,
          loading: fc.constant(true),
        }),
        (props) => {
          const { container } = render(
            React.createElement(
              Button,
              {
                variant: props.variant as any,
                size: props.size as any,
                loading: props.loading,
                'data-testid': 'loading-button',
              },
              'Loading...'
            )
          );

          const button = container.querySelector('[data-testid="loading-button"]') as HTMLButtonElement;
          expect(button).not.toBeNull();

          // Button should have disabled pointer events
          expect(button.className).toContain('disabled:pointer-events-none');
          expect(button.disabled).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading buttons should display spinner overlay', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: buttonVariantArbitrary,
          loading: fc.constant(true),
          text: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'Submit'),
        }),
        (props) => {
          const { container } = render(
            React.createElement(
              Button,
              {
                variant: props.variant as any,
                loading: props.loading,
              },
              props.text
            )
          );

          // Should have a spinner element
          const spinner = container.querySelector('.animate-spin');
          expect(spinner).not.toBeNull();

          // Spinner should be in an absolute positioned container
          const spinnerContainer = spinner?.closest('span');
          expect(spinnerContainer?.className).toContain('absolute');
          expect(spinnerContainer?.className).toContain('inset-0');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading buttons should hide content but preserve layout', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: buttonVariantArbitrary,
          loading: fc.constant(true),
          text: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'Button Text'),
        }),
        (props) => {
          const { container } = render(
            React.createElement(
              Button,
              {
                variant: props.variant as any,
                loading: props.loading,
              },
              props.text
            )
          );

          // Content should be wrapped in a span with invisible class
          const contentSpan = container.querySelector('span.invisible');
          expect(contentSpan).not.toBeNull();
          expect(contentSpan?.textContent).toContain(props.text);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Disabled inputs should have disabled attribute and styling', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: inputTypeArbitrary,
          label: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Test Input'),
          initialValue: fc.string({ maxLength: 20 }),
          disabled: fc.boolean(),
        }),
        (props) => {
          const handleChange = (value: string) => {
            // onChange handler
          };

          const { container } = render(
            React.createElement(Input, {
              type: props.type as any,
              label: props.label,
              value: props.initialValue,
              onChange: handleChange,
              disabled: props.disabled,
              'data-testid': 'test-input',
            })
          );

          const input = container.querySelector('input[data-testid="test-input"]') as HTMLInputElement;
          expect(input).not.toBeNull();

          if (props.disabled) {
            // Disabled input should have disabled attribute
            expect(input.disabled).toBe(true);
            
            // Disabled input should have cursor-not-allowed class
            expect(input.className).toContain('cursor-not-allowed');
            
            // Disabled input should have reduced opacity
            expect(input.className).toContain('opacity-50');
          } else {
            // Enabled input should not have disabled attribute
            expect(input.disabled).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading state should prevent form submission', () => {
    fc.assert(
      fc.property(
        fc.record({
          buttonLoading: fc.boolean(),
          buttonText: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'Submit'),
        }),
        (props) => {
          let submitCount = 0;
          const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            submitCount++;
          };

          const { container } = render(
            React.createElement(
              'form',
              {
                onSubmit: handleSubmit,
                'data-testid': 'test-form',
              },
              React.createElement(
                Button,
                {
                  type: 'submit',
                  loading: props.buttonLoading,
                  'data-testid': 'submit-button',
                },
                props.buttonText
              )
            )
          );

          const form = container.querySelector('[data-testid="test-form"]') as HTMLFormElement;
          const button = container.querySelector('[data-testid="submit-button"]') as HTMLButtonElement;
          
          expect(form).not.toBeNull();
          expect(button).not.toBeNull();

          // Attempt to submit form by clicking button
          fireEvent.click(button);

          if (props.buttonLoading) {
            // Loading button should prevent form submission
            expect(submitCount).toBe(0);
            expect(button.disabled).toBe(true);
          } else {
            // Non-loading button should allow form submission
            expect(submitCount).toBe(1);
            expect(button.disabled).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading or disabled state should be mutually exclusive with enabled state', () => {
    fc.assert(
      fc.property(
        fc.record({
          loading: fc.boolean(),
          disabled: fc.boolean(),
        }),
        (props) => {
          const { container } = render(
            React.createElement(
              Button,
              {
                loading: props.loading,
                disabled: props.disabled,
                'data-testid': 'state-button',
              },
              'Button'
            )
          );

          const button = container.querySelector('[data-testid="state-button"]') as HTMLButtonElement;
          expect(button).not.toBeNull();

          const isInteractive = !props.loading && !props.disabled;
          
          // Button should be disabled if loading OR explicitly disabled
          expect(button.disabled).toBe(!isInteractive);
          
          // aria-disabled should reflect the disabled state
          expect(button.getAttribute('aria-disabled')).toBe((!isInteractive).toString());
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Loading buttons should have aria-busy attribute', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: buttonVariantArbitrary,
          loading: fc.boolean(),
        }),
        (props) => {
          const { container } = render(
            React.createElement(
              Button,
              {
                variant: props.variant as any,
                loading: props.loading,
                'data-testid': 'aria-button',
              },
              'Action'
            )
          );

          const button = container.querySelector('[data-testid="aria-button"]') as HTMLButtonElement;
          expect(button).not.toBeNull();

          if (props.loading) {
            // Loading buttons should have aria-busy="true"
            expect(button.getAttribute('aria-busy')).toBe('true');
          } else {
            // Non-loading buttons should have aria-busy="false"
            expect(button.getAttribute('aria-busy')).toBe('false');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: Multiple interactive elements in loading state should all be disabled', () => {
    fc.assert(
      fc.property(
        fc.record({
          buttonCount: fc.integer({ min: 2, max: 5 }),
          loadingStates: fc.array(fc.boolean(), { minLength: 2, maxLength: 5 }),
        }),
        (props) => {
          const actualCount = Math.min(props.buttonCount, props.loadingStates.length);
          
          const { container } = render(
            React.createElement(
              'div',
              { 'data-testid': 'button-group' },
              Array.from({ length: actualCount }, (_, i) =>
                React.createElement(
                  Button,
                  {
                    key: i,
                    loading: props.loadingStates[i],
                    'data-testid': `button-${i}`,
                  },
                  `Button ${i + 1}`
                )
              )
            )
          );

          // Check each button's state
          for (let i = 0; i < actualCount; i++) {
            const button = container.querySelector(`[data-testid="button-${i}"]`) as HTMLButtonElement;
            expect(button).not.toBeNull();

            if (props.loadingStates[i]) {
              expect(button.disabled).toBe(true);
              expect(button.getAttribute('aria-busy')).toBe('true');
            } else {
              expect(button.disabled).toBe(false);
              expect(button.getAttribute('aria-busy')).toBe('false');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
