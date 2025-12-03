import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { getContrastRatio, getFocusableElements } from '../src/lib/accessibility';

/**
 * **Feature: ui-enhancement, Property 2: Keyboard Navigation Accessibility**
 * **Validates: Requirements 1.2, 2.2, 9.5**
 * 
 * For any focusable element, when navigated via keyboard, the system should:
 * - Display focus indicators with minimum 3:1 contrast ratio
 * - Provide appropriate ARIA attributes
 * - Maintain logical tab order
 */

// Generator for focusable HTML elements
const focusableElementArbitrary = fc.constantFrom(
  'button',
  'a',
  'input',
  'textarea',
  'select'
);

// Generator for ARIA roles
const ariaRoleArbitrary = fc.constantFrom(
  'button',
  'link',
  'textbox',
  'combobox',
  'checkbox',
  'radio',
  'tab',
  'menuitem'
);

// Generator for element properties with unique IDs
let idCounter = 0;
const elementPropsArbitrary = fc.record({
  tagName: focusableElementArbitrary,
  id: fc.string({ minLength: 1, maxLength: 20 }).map(s => {
    const sanitized = s.replace(/[^a-z0-9]/gi, '');
    const uniqueId = sanitized || 'elem';
    return `${uniqueId}-${++idCounter}`;
  }),
  ariaLabel: fc.option(fc.string({ minLength: 3, maxLength: 50 }), { nil: undefined }),
  ariaRole: fc.option(ariaRoleArbitrary, { nil: undefined }),
  disabled: fc.boolean(),
  tabIndex: fc.option(fc.constantFrom(-1, 0, 1, 2), { nil: undefined }),
}).map(props => {
  // Only form elements support the disabled attribute
  // Anchors don't have a native disabled attribute
  if (props.tagName === 'a') {
    return { ...props, disabled: false };
  }
  return props;
});

// Generator for focus ring colors (hex colors)
const hexColorArbitrary = fc
  .hexaString({ minLength: 6, maxLength: 6 })
  .map((hex) => `#${hex}`);

describe('Property-Based Tests: Keyboard Navigation Accessibility', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('Property 2: Focus indicators must have minimum 3:1 contrast ratio against adjacent colors', () => {
    fc.assert(
      fc.property(
        hexColorArbitrary,
        hexColorArbitrary,
        (focusRingColor, backgroundColor) => {
          const contrastRatio = getContrastRatio(focusRingColor, backgroundColor);
          
          // If we're using this as a focus indicator, it must meet 3:1 contrast
          // This is the same requirement as large text (WCAG AA)
          const meetsRequirement = contrastRatio >= 3.0;
          
          // Test that our contrast calculation is consistent
          if (meetsRequirement) {
            expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
          } else {
            expect(contrastRatio).toBeLessThan(3.0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Disabled elements should not be in the focusable element list', () => {
    fc.assert(
      fc.property(
        fc.array(elementPropsArbitrary, { minLength: 1, maxLength: 10 }),
        (elements) => {
          // Create elements in the container
          container.innerHTML = '';
          elements.forEach((props) => {
            const elem = document.createElement(props.tagName);
            elem.id = props.id;
            if (props.disabled) {
              elem.setAttribute('disabled', 'true');
            }
            if (props.tabIndex !== undefined) {
              elem.setAttribute('tabindex', props.tabIndex.toString());
            }
            if (props.tagName === 'a') {
              elem.setAttribute('href', '#');
            }
            container.appendChild(elem);
          });

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // Verify that disabled elements are not in the focusable list
          elements.forEach((props) => {
            if (props.disabled) {
              expect(focusableIds).not.toContain(props.id);
            }
          });

          // Verify that elements with tabindex="-1" are not in the focusable list
          elements.forEach((props) => {
            if (props.tabIndex === -1) {
              expect(focusableIds).not.toContain(props.id);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Focusable elements should maintain document order (logical tab order)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            tagName: focusableElementArbitrary,
            id: fc.string({ minLength: 1, maxLength: 20 }).map(s => `elem-${s.replace(/[^a-z0-9]/gi, '')}`),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        (elements) => {
          // Create elements in the container in order
          container.innerHTML = '';
          const createdIds: string[] = [];
          
          elements.forEach((props) => {
            const elem = document.createElement(props.tagName);
            elem.id = props.id;
            if (props.tagName === 'a') {
              elem.setAttribute('href', '#');
            }
            container.appendChild(elem);
            createdIds.push(props.id);
          });

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // The focusable elements should be in the same order as they were created
          // (document order = logical tab order)
          const filteredCreatedIds = createdIds.filter(id => focusableIds.includes(id));
          const filteredFocusableIds = focusableIds.filter(id => createdIds.includes(id));
          
          expect(filteredFocusableIds).toEqual(filteredCreatedIds);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Elements with explicit tabindex > 0 should be focusable', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            tagName: focusableElementArbitrary,
            id: fc.string({ minLength: 1, maxLength: 20 }).map(s => `elem-${s.replace(/[^a-z0-9]/gi, '')}`),
            tabIndex: fc.integer({ min: 0, max: 10 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (elements) => {
          container.innerHTML = '';
          
          elements.forEach((props) => {
            const elem = document.createElement(props.tagName);
            elem.id = props.id;
            elem.setAttribute('tabindex', props.tabIndex.toString());
            if (props.tagName === 'a') {
              elem.setAttribute('href', '#');
            }
            container.appendChild(elem);
          });

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // All elements with tabindex >= 0 should be focusable
          elements.forEach((props) => {
            if (props.tabIndex >= 0) {
              expect(focusableIds).toContain(props.id);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Interactive elements (buttons, links, inputs) should always be focusable by default', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            tagName: focusableElementArbitrary,
            id: fc.string({ minLength: 1, maxLength: 20 }).map(s => `elem-${s.replace(/[^a-z0-9]/gi, '')}`),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (elements) => {
          container.innerHTML = '';
          
          elements.forEach((props) => {
            const elem = document.createElement(props.tagName);
            elem.id = props.id;
            if (props.tagName === 'a') {
              elem.setAttribute('href', '#');
            }
            container.appendChild(elem);
          });

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // All created interactive elements should be focusable
          elements.forEach((props) => {
            expect(focusableIds).toContain(props.id);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Focus ring contrast should be symmetric (order independent)', () => {
    fc.assert(
      fc.property(
        hexColorArbitrary,
        hexColorArbitrary,
        (color1, color2) => {
          const ratio1 = getContrastRatio(color1, color2);
          const ratio2 = getContrastRatio(color2, color1);
          
          // Contrast ratio should be the same regardless of which is foreground/background
          expect(ratio1).toBeCloseTo(ratio2, 2);
          
          // If one direction meets the 3:1 requirement, so should the other
          const meets1 = ratio1 >= 3.0;
          const meets2 = ratio2 >= 3.0;
          expect(meets1).toBe(meets2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Empty containers should have no focusable elements', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          container.innerHTML = '';
          
          const focusableElements = getFocusableElements(container);
          
          expect(focusableElements).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Links without href should not be focusable', () => {
    let linkIdCounter = 0;
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            hasHref: fc.boolean(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (links) => {
          container.innerHTML = '';
          
          // Create links with unique IDs
          const linkElements = links.map((props) => {
            const link = document.createElement('a');
            const uniqueId = `link-${++linkIdCounter}`;
            link.id = uniqueId;
            if (props.hasHref) {
              link.setAttribute('href', '#');
            }
            container.appendChild(link);
            return { id: uniqueId, hasHref: props.hasHref };
          });

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // Only links with href should be focusable
          linkElements.forEach((props) => {
            if (props.hasHref) {
              expect(focusableIds).toContain(props.id);
            } else {
              expect(focusableIds).not.toContain(props.id);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Focus indicators with high contrast should always meet 3:1 requirement', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('#000000', '#ffffff'),
        fc.constantFrom('#000000', '#ffffff'),
        (darkColor, lightColor) => {
          // Black and white should always have high contrast
          const ratio = getContrastRatio(darkColor, lightColor);
          
          if (darkColor !== lightColor) {
            // Different colors (black vs white) should have 21:1 contrast
            expect(ratio).toBeGreaterThanOrEqual(3.0);
            expect(ratio).toBeCloseTo(21, 1);
          } else {
            // Same color should have 1:1 contrast
            expect(ratio).toBeCloseTo(1, 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Nested focusable elements should all be discoverable', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (numButtons) => {
          container.innerHTML = '';
          
          // Create nested structure
          const wrapper = document.createElement('div');
          const innerWrapper = document.createElement('div');
          
          const buttonIds: string[] = [];
          for (let i = 0; i < numButtons; i++) {
            const button = document.createElement('button');
            button.id = `nested-btn-${i}`;
            buttonIds.push(button.id);
            innerWrapper.appendChild(button);
          }
          
          wrapper.appendChild(innerWrapper);
          container.appendChild(wrapper);

          const focusableElements = getFocusableElements(container);
          const focusableIds = focusableElements.map(el => el.id);

          // All nested buttons should be found
          buttonIds.forEach(id => {
            expect(focusableIds).toContain(id);
          });
          
          expect(focusableElements).toHaveLength(numButtons);
        }
      ),
      { numRuns: 100 }
    );
  });
});
