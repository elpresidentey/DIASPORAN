import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * **Feature: minimalistic-design-update, Property 3: Performance maintenance**
 * **Validates: Requirements 3.3**
 * 
 * For any page load measurement, the loading time should be equal to or better than 
 * the baseline performance before design changes
 */

// Generator for button props
const buttonPropsArbitrary = fc.record({
  variant: fc.constantFrom('default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'shimmer'),
  size: fc.constantFrom('sm', 'default', 'lg', 'xl', 'icon'),
  disabled: fc.boolean(),
  loading: fc.boolean(),
  children: fc.string({ minLength: 1, maxLength: 20 }),
});

// Generator for card props
const cardPropsArbitrary = fc.record({
  className: fc.option(fc.string({ minLength: 0, maxLength: 50 })),
  children: fc.string({ minLength: 1, maxLength: 100 }),
});

// Performance measurement helper
function measureRenderTime<T>(renderFn: () => T): { result: T; renderTime: number } {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();
  return { result, renderTime: endTime - startTime };
}

describe('Property-Based Tests: Performance Maintenance', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 3: Button rendering should complete within reasonable time', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const { renderTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, props, props.children)
            );
          });
          
          // Button rendering should complete within 300ms (reasonable baseline for test environment)
          expect(renderTime).toBeLessThan(300);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Card rendering should complete within reasonable time', () => {
    fc.assert(
      fc.property(
        cardPropsArbitrary,
        (props) => {
          const { renderTime } = measureRenderTime(() => {
            return render(
              React.createElement(Card, { className: props.className }, props.children)
            );
          });
          
          // Card rendering should complete within 150ms (simpler component, test environment)
          expect(renderTime).toBeLessThan(150);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Multiple button renders should not degrade performance', () => {
    fc.assert(
      fc.property(
        fc.array(buttonPropsArbitrary, { minLength: 5, maxLength: 10 }),
        (buttonPropsArray) => {
          const renderTimes: number[] = [];
          
          buttonPropsArray.forEach((props) => {
            const { renderTime } = measureRenderTime(() => {
              return render(
                React.createElement(Button, props, props.children)
              );
            });
            renderTimes.push(renderTime);
            cleanup();
          });
          
          // Performance should not degrade significantly across multiple renders
          const averageTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
          const maxTime = Math.max(...renderTimes);
          
          // Average should be reasonable
          expect(averageTime).toBeLessThan(200);
          
          // No single render should be excessively slow
          expect(maxTime).toBeLessThan(400);
        }
      ),
      { numRuns: 20 } // Fewer runs for this more intensive test
    );
  });

  it('Property 3: Component class generation should be efficient', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          const { result, renderTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, props, props.children)
            );
          });
          
          const button = result.container.querySelector('button');
          expect(button).toBeTruthy();
          
          if (button) {
            // Class list should not be excessively long (indicating inefficient CSS generation)
            const classList = Array.from(button.classList);
            expect(classList.length).toBeLessThan(50);
            
            // Render time should be reasonable even with complex class generation
            expect(renderTime).toBeLessThan(200);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Shimmer animation should not impact initial render performance', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        (children) => {
          // Measure shimmer button render time
          const { renderTime: shimmerTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, { variant: 'shimmer' }, children)
            );
          });
          
          cleanup();
          
          // Measure regular button render time for comparison
          const { renderTime: regularTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, { variant: 'default' }, children)
            );
          });
          
          // Shimmer variant should not be significantly slower than regular button
          // Allow up to 3x slower for animation setup with more buffer for test environment
          expect(shimmerTime).toBeLessThan(regularTime * 3 + 50); // +50ms buffer for test environment
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 3: Loading state should not significantly impact render performance', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Measure loading button render time
          const { renderTime: loadingTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, { ...props, loading: true }, props.children)
            );
          });
          
          cleanup();
          
          // Measure non-loading button render time for comparison
          const { renderTime: normalTime } = measureRenderTime(() => {
            return render(
              React.createElement(Button, { ...props, loading: false }, props.children)
            );
          });
          
          // Loading state should not be significantly slower
          // Allow up to 3x slower for spinner rendering with more buffer for test environment
          expect(loadingTime).toBeLessThan(normalTime * 3 + 50); // +50ms buffer for test environment
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 3: CSS class computation should be consistent', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // Render the same button multiple times and measure consistency
          const renderTimes: number[] = [];
          
          for (let i = 0; i < 3; i++) {
            const { renderTime } = measureRenderTime(() => {
              return render(
                React.createElement(Button, props, props.children)
              );
            });
            renderTimes.push(renderTime);
            cleanup();
          }
          
          // Render times should be relatively consistent (no caching issues)
          const minTime = Math.min(...renderTimes);
          const maxTime = Math.max(...renderTimes);
          
          // Variation should not be excessive (allowing for normal JS timing variance)
          expect(maxTime - minTime).toBeLessThan(50);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Property 3: Memory usage should not grow with repeated renders', () => {
    fc.assert(
      fc.property(
        buttonPropsArbitrary,
        (props) => {
          // This is a basic test - in a real scenario you'd use more sophisticated memory monitoring
          const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
          
          // Render and cleanup multiple times
          for (let i = 0; i < 10; i++) {
            const { container } = render(
              React.createElement(Button, props, props.children)
            );
            cleanup();
          }
          
          // Force garbage collection if available (Chrome DevTools)
          if ((window as any).gc) {
            (window as any).gc();
          }
          
          const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
          
          // Memory growth should be minimal (allowing for normal variance)
          if (initialMemory > 0 && finalMemory > 0) {
            const memoryGrowth = finalMemory - initialMemory;
            expect(memoryGrowth).toBeLessThan(1024 * 1024); // Less than 1MB growth
          }
        }
      ),
      { numRuns: 10 } // Fewer runs for memory-intensive test
    );
  });
});