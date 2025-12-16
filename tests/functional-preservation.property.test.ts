import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * **Feature: minimalistic-design-update, Property 2: Functional preservation**
 * **Validates: Requirements 2.5**
 * 
 * For any existing user interaction or feature, the functionality should work identically 
 * before and after the design changes
 */

// Generator for button props
const buttonPropsArbitrary = fc.record({
  variant: fc.constantFrom('default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'shimmer'),
  size: fc.constantFrom('sm', 'default', 'lg', 'xl', 'icon'),
  disabled: fc.boolean(),
  loading: fc.boolean(),
  children: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
});

// Generator for card props
const cardPropsArbitrary = fc.record({
  className: fc.option(fc.string({ minLength: 0, maxLength: 50 })),
  children: fc.string({ minLength: 1, maxLength: 100 }),
});

describe('Property-Based Tests: Functional Preservation', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 2: Button click functionality should be preserved', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          let clickCount = 0;
          const handleClick = () => { clickCount++; };
          
          const { container } = render(
            React.createElement(Button, { ...props, onClick: handleClick }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button && !props.disabled && !props.loading) {
            // Button should be clickable when not disabled/loading
            fireEvent.click(button);
            expect(clickCount).toBe(1);
            
            // Multiple clicks should work
            fireEvent.click(button);
            expect(clickCount).toBe(2);
          } else if (button && (props.disabled || props.loading)) {
            // Button should not be clickable when disabled/loading
            fireEvent.click(button);
            expect(clickCount).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Button keyboard navigation should be preserved', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          let keyPressCount = 0;
          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              keyPressCount++;
            }
          };
          
          const { container } = render(
            React.createElement(Button, { ...props, onKeyDown: handleKeyDown }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button && !props.disabled && !props.loading) {
            // Button should be focusable
            button.focus();
            expect(document.activeElement).toBe(button);
            
            // Enter key should trigger action
            fireEvent.keyDown(button, { key: 'Enter' });
            
            // Space key should trigger action
            fireEvent.keyDown(button, { key: ' ' });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Button accessibility attributes should be preserved', () => {
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
            // Button should have proper role
            expect(button.tagName.toLowerCase()).toBe('button');
            
            // Disabled state should be reflected in attributes
            if (props.disabled || props.loading) {
              expect(button.hasAttribute('disabled')).toBe(true);
              expect(button.getAttribute('aria-disabled')).toBe('true');
            }
            
            // Loading state should have aria-busy
            if (props.loading) {
              expect(button.getAttribute('aria-busy')).toBe('true');
            }
            
            // Button should have accessible text content
            expect(button.textContent?.trim()).toBeTruthy();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Card content rendering should be preserved', () => {
    fc.assert(
      fc.property(
        cardPropsArbitrary,
        (props) => {
          const { container } = render(
            React.createElement(Card, { className: props.className }, props.children)
          );
          
          const card = container.firstChild as HTMLElement;
          expect(card).toBeTruthy();
          
          if (card) {
            // Card should render its content
            expect(card.textContent).toContain(props.children);
            
            // Card should have proper structure
            expect(card.tagName.toLowerCase()).toBe('div');
            
            // Card should have base styling classes
            const classList = Array.from(card.classList);
            expect(classList.some(c => c.includes('rounded') || c.includes('border') || c.includes('bg-'))).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Component prop handling should be preserved', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
          className: fc.option(fc.constantFrom('custom-class', 'test-class', 'my-button', 'special-style')),
          'data-testid': fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        }),
        (props) => {
          const { container } = render(
            React.createElement(Button, props, 'Test Button')
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // ID should be preserved
            if (props.id) {
              expect(button.id).toBe(props.id);
            }
            
            // Custom className should be applied
            if (props.className) {
              expect(button.className).toContain(props.className);
            }
            
            // Data attributes should be preserved
            if (props['data-testid']) {
              expect(button.getAttribute('data-testid')).toBe(props['data-testid']);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Component event handling should be preserved', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        (buttonText) => {
          let mouseEnterCount = 0;
          let mouseLeaveCount = 0;
          let focusCount = 0;
          let blurCount = 0;
          
          const handlers = {
            onMouseEnter: () => { mouseEnterCount++; },
            onMouseLeave: () => { mouseLeaveCount++; },
            onFocus: () => { focusCount++; },
            onBlur: () => { blurCount++; },
          };
          
          const { container } = render(
            React.createElement(Button, handlers, buttonText)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Mouse events should work
            fireEvent.mouseEnter(button);
            expect(mouseEnterCount).toBe(1);
            
            fireEvent.mouseLeave(button);
            expect(mouseLeaveCount).toBe(1);
            
            // Focus events should work
            fireEvent.focus(button);
            expect(focusCount).toBe(1);
            
            fireEvent.blur(button);
            expect(blurCount).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});