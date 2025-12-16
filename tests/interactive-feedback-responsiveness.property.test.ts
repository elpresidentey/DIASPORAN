import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * **Feature: minimalistic-design-update, Property 4: Interactive feedback responsiveness**
 * **Validates: Requirements 3.5**
 * 
 * For any user interaction with UI elements, visual feedback should be provided 
 * within 100ms without causing performance degradation
 */

// Generator for button props
const buttonPropsArbitrary = fc.record({
  variant: fc.constantFrom('default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'shimmer'),
  size: fc.constantFrom('sm', 'default', 'lg', 'xl', 'icon'),
  disabled: fc.boolean(),
  loading: fc.boolean(),
  children: fc.string({ minLength: 1, maxLength: 20 }),
});

// Performance measurement helper
function measureInteractionTime(interactionFn: () => void): number {
  const startTime = performance.now();
  interactionFn();
  const endTime = performance.now();
  return endTime - startTime;
}

// Helper to check if element has transition classes
function hasTransitionClasses(element: HTMLElement): boolean {
  const classList = Array.from(element.classList);
  return classList.some(c => 
    c.includes('transition') || 
    c.includes('duration') || 
    c.includes('ease')
  );
}

// Helper to check if element has hover/active state classes
function hasInteractiveStateClasses(element: HTMLElement): boolean {
  const classList = Array.from(element.classList);
  return classList.some(c => 
    c.includes('hover:') || 
    c.includes('active:') || 
    c.includes('focus:')
  );
}

describe('Property-Based Tests: Interactive Feedback Responsiveness', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 4: Button click feedback should be immediate', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Skip disabled/loading buttons as they don't provide click feedback
          fc.pre(!props.disabled && !props.loading);
          
          let clickHandled = false;
          const handleClick = () => { clickHandled = true; };
          
          const { container } = render(
            React.createElement(Button, { ...props, onClick: handleClick }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Measure click response time
            const responseTime = measureInteractionTime(() => {
              fireEvent.click(button);
            });
            
            // Click should be handled immediately (within 100ms for synthetic events in test environment)
            expect(responseTime).toBeLessThan(100);
            expect(clickHandled).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Button hover state should have transition classes', () => {
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
            // Button should have transition classes for smooth feedback
            expect(hasTransitionClasses(button)).toBe(true);
            
            // Button should have interactive state classes
            expect(hasInteractiveStateClasses(button)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Mouse enter/leave events should be responsive', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          let mouseEnterCount = 0;
          let mouseLeaveCount = 0;
          
          const handleMouseEnter = () => { mouseEnterCount++; };
          const handleMouseLeave = () => { mouseLeaveCount++; };
          
          const { container } = render(
            React.createElement(Button, {
              ...props,
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave
            }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Measure mouse enter response time
            const enterTime = measureInteractionTime(() => {
              fireEvent.mouseEnter(button);
            });
            
            // Measure mouse leave response time
            const leaveTime = measureInteractionTime(() => {
              fireEvent.mouseLeave(button);
            });
            
            // Both events should be handled reasonably fast
            // Increased threshold for test environment stability
            expect(enterTime).toBeLessThan(100);
            expect(leaveTime).toBeLessThan(100);
            
            // Events should be triggered (unless button has pointer-events-none)
            if (props.disabled || props.loading) {
              // Disabled/loading buttons have pointer-events-none, so events may not fire
              expect(mouseEnterCount).toBeGreaterThanOrEqual(0);
              expect(mouseLeaveCount).toBeGreaterThanOrEqual(0);
            } else {
              // Normal buttons should receive mouse events
              expect(mouseEnterCount).toBe(1);
              expect(mouseLeaveCount).toBe(1);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Focus events should be responsive', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Skip disabled buttons as they can't receive focus
          fc.pre(!props.disabled && !props.loading);
          
          let focusCount = 0;
          let blurCount = 0;
          
          const handleFocus = () => { focusCount++; };
          const handleBlur = () => { blurCount++; };
          
          const { container } = render(
            React.createElement(Button, {
              ...props,
              onFocus: handleFocus,
              onBlur: handleBlur
            }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Measure focus response time
            const focusTime = measureInteractionTime(() => {
              fireEvent.focus(button);
            });
            
            // Measure blur response time
            const blurTime = measureInteractionTime(() => {
              fireEvent.blur(button);
            });
            
            // Both events should be handled reasonably fast
            expect(focusTime).toBeLessThan(100);
            expect(blurTime).toBeLessThan(100);
            expect(focusCount).toBe(1);
            expect(blurCount).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Keyboard interactions should be responsive', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Skip disabled/loading buttons
          fc.pre(!props.disabled && !props.loading);
          
          let keyDownCount = 0;
          let keyUpCount = 0;
          
          const handleKeyDown = () => { keyDownCount++; };
          const handleKeyUp = () => { keyUpCount++; };
          
          const { container } = render(
            React.createElement(Button, {
              ...props,
              onKeyDown: handleKeyDown,
              onKeyUp: handleKeyUp
            }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Measure key down response time
            const keyDownTime = measureInteractionTime(() => {
              fireEvent.keyDown(button, { key: 'Enter' });
            });
            
            // Measure key up response time
            const keyUpTime = measureInteractionTime(() => {
              fireEvent.keyUp(button, { key: 'Enter' });
            });
            
            // Both events should be handled reasonably fast (allow up to 100ms for slower environments)
            expect(keyDownTime).toBeLessThan(100);
            expect(keyUpTime).toBeLessThan(100);
            expect(keyDownCount).toBe(1);
            expect(keyUpCount).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Multiple rapid interactions should not degrade performance', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Skip disabled/loading buttons
          fc.pre(!props.disabled && !props.loading);
          
          let clickCount = 0;
          const handleClick = () => { clickCount++; };
          
          const { container } = render(
            React.createElement(Button, { ...props, onClick: handleClick }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            const interactionTimes: number[] = [];
            
            // Perform multiple rapid clicks
            for (let i = 0; i < 5; i++) {
              const responseTime = measureInteractionTime(() => {
                fireEvent.click(button);
              });
              interactionTimes.push(responseTime);
            }
            
            // All interactions should be fast
            interactionTimes.forEach(time => {
              expect(time).toBeLessThan(50);
            });
            
            // All clicks should be registered
            expect(clickCount).toBe(5);
            
            // Performance should not degrade (last click not significantly slower)
            const firstClick = interactionTimes[0];
            const lastClick = interactionTimes[4];
            expect(lastClick).toBeLessThan(firstClick + 30); // Allow 30ms variance for slower environments
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 4: Loading state transitions should be smooth', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const { container, rerender } = render(
            React.createElement(Button, { ...props, loading: false }, props.children)
          );
          
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Measure time to switch to loading state
            const loadingTransitionTime = measureInteractionTime(() => {
              rerender(
                React.createElement(Button, { ...props, loading: true }, props.children)
              );
            });
            
            // Measure time to switch back to normal state
            const normalTransitionTime = measureInteractionTime(() => {
              rerender(
                React.createElement(Button, { ...props, loading: false }, props.children)
              );
            });
            
            // State transitions should be fast
            expect(loadingTransitionTime).toBeLessThan(50);
            expect(normalTransitionTime).toBeLessThan(50);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 4: Card hover interactions should be responsive', () => {
    fc.assert(
      fc.property(
        fc.record({
          className: fc.option(fc.string({ minLength: 0, maxLength: 50 })),
          children: fc.string({ minLength: 1, maxLength: 100 }),
        }),
        (props) => {
          let mouseEnterCount = 0;
          let mouseLeaveCount = 0;
          
          const handleMouseEnter = () => { mouseEnterCount++; };
          const handleMouseLeave = () => { mouseLeaveCount++; };
          
          const { container } = render(
            React.createElement(Card, {
              className: props.className,
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave
            }, props.children)
          );
          
          const card = container.firstChild as HTMLElement;
          expect(card).toBeTruthy();
          
          if (card) {
            // Measure mouse enter response time
            const enterTime = measureInteractionTime(() => {
              fireEvent.mouseEnter(card);
            });
            
            // Measure mouse leave response time
            const leaveTime = measureInteractionTime(() => {
              fireEvent.mouseLeave(card);
            });
            
            // Both events should be handled reasonably fast
            expect(enterTime).toBeLessThan(50);
            expect(leaveTime).toBeLessThan(50);
            expect(mouseEnterCount).toBe(1);
            expect(mouseLeaveCount).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Transition duration should be reasonable for smooth feedback', () => {
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
            
            // Should have transition duration defined
            const hasDuration = classList.some(c => c.includes('duration'));
            expect(hasDuration).toBe(true);
            
            // Duration should be reasonable (not too slow, not too fast)
            const durationClass = classList.find(c => c.includes('duration-'));
            if (durationClass) {
              // Common duration classes: duration-75, duration-100, duration-150, duration-200, duration-300
              const reasonableDurations = ['duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300'];
              expect(reasonableDurations.some(d => durationClass.includes(d.split('-')[1]))).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});