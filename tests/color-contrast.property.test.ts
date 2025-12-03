import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getContrastRatio,
  meetsContrastRequirement,
  validateColorContrast,
} from '../src/lib/accessibility';

/**
 * **Feature: ui-enhancement, Property 3: Color Contrast Compliance**
 * **Validates: Requirements 2.1, 1.4**
 * 
 * For any text content or form element, the color contrast ratio should meet or exceed:
 * - 4.5:1 for normal text (WCAG AA)
 * - 3:1 for large text (WCAG AA)
 * - 3:1 for focus indicators
 */

// Generator for valid hex colors
const hexColorArbitrary = fc
  .hexaString({ minLength: 6, maxLength: 6 })
  .map((hex) => `#${hex}`);

// Generator for color pairs with their expected contrast level
const colorPairArbitrary = fc.record({
  foreground: hexColorArbitrary,
  background: hexColorArbitrary,
  isLargeText: fc.boolean(),
});

describe('Property-Based Tests: Color Contrast Compliance', () => {
  it('Property 3: Contrast ratio should always be between 1 and 21', () => {
    fc.assert(
      fc.property(hexColorArbitrary, hexColorArbitrary, (color1, color2) => {
        const ratio = getContrastRatio(color1, color2);
        
        // Contrast ratio must be between 1 (same color) and 21 (black vs white)
        expect(ratio).toBeGreaterThanOrEqual(1);
        expect(ratio).toBeLessThanOrEqual(21);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Contrast ratio should be symmetric', () => {
    fc.assert(
      fc.property(hexColorArbitrary, hexColorArbitrary, (color1, color2) => {
        const ratio1 = getContrastRatio(color1, color2);
        const ratio2 = getContrastRatio(color2, color1);
        
        // Contrast ratio should be the same regardless of order
        expect(ratio1).toBeCloseTo(ratio2, 2);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Same colors should always have contrast ratio of 1', () => {
    fc.assert(
      fc.property(hexColorArbitrary, (color) => {
        const ratio = getContrastRatio(color, color);
        
        // Same color should have minimum contrast
        expect(ratio).toBeCloseTo(1, 2);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: WCAG AA normal text requires minimum 4.5:1 contrast', () => {
    fc.assert(
      fc.property(colorPairArbitrary, ({ foreground, background, isLargeText }) => {
        const ratio = getContrastRatio(foreground, background);
        const meetsAA = meetsContrastRequirement(foreground, background, 'AA', isLargeText);
        
        // If it meets AA for normal text, ratio must be >= 4.5
        // If it meets AA for large text, ratio must be >= 3.0
        if (meetsAA) {
          if (isLargeText) {
            expect(ratio).toBeGreaterThanOrEqual(3.0);
          } else {
            expect(ratio).toBeGreaterThanOrEqual(4.5);
          }
        } else {
          // If it doesn't meet AA, ratio must be below threshold
          if (isLargeText) {
            expect(ratio).toBeLessThan(3.0);
          } else {
            expect(ratio).toBeLessThan(4.5);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: WCAG AAA has stricter requirements than AA', () => {
    fc.assert(
      fc.property(colorPairArbitrary, ({ foreground, background, isLargeText }) => {
        const meetsAA = meetsContrastRequirement(foreground, background, 'AA', isLargeText);
        const meetsAAA = meetsContrastRequirement(foreground, background, 'AAA', isLargeText);
        
        // If it meets AAA, it must also meet AA (AAA is stricter)
        if (meetsAAA) {
          expect(meetsAA).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Large text has lower contrast requirements than normal text', () => {
    fc.assert(
      fc.property(hexColorArbitrary, hexColorArbitrary, (foreground, background) => {
        const ratio = getContrastRatio(foreground, background);
        const meetsAANormal = meetsContrastRequirement(foreground, background, 'AA', false);
        const meetsAALarge = meetsContrastRequirement(foreground, background, 'AA', true);
        
        // If normal text passes, large text must also pass (lower threshold)
        if (meetsAANormal) {
          expect(meetsAALarge).toBe(true);
        }
        
        // Large text can pass when normal text fails (between 3:1 and 4.5:1)
        if (ratio >= 3.0 && ratio < 4.5) {
          expect(meetsAALarge).toBe(true);
          expect(meetsAANormal).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: validateColorContrast should provide consistent results with meetsContrastRequirement', () => {
    fc.assert(
      fc.property(colorPairArbitrary, ({ foreground, background, isLargeText }) => {
        const validation = validateColorContrast(foreground, background, isLargeText);
        const meetsAA = meetsContrastRequirement(foreground, background, 'AA', isLargeText);
        const meetsAAA = meetsContrastRequirement(foreground, background, 'AAA', isLargeText);
        
        // Validation results should match individual checks
        expect(validation.meetsAA).toBe(meetsAA);
        expect(validation.meetsAAA).toBe(meetsAAA);
        
        // Ratio should be the same
        const directRatio = getContrastRatio(foreground, background);
        expect(validation.ratio).toBeCloseTo(directRatio, 2);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Focus indicators must meet 3:1 contrast (same as large text)', () => {
    fc.assert(
      fc.property(hexColorArbitrary, hexColorArbitrary, (focusColor, adjacentColor) => {
        const ratio = getContrastRatio(focusColor, adjacentColor);
        const meetsFocusRequirement = meetsContrastRequirement(focusColor, adjacentColor, 'AA', true);
        
        // Focus indicators use the same 3:1 threshold as large text
        if (ratio >= 3.0) {
          expect(meetsFocusRequirement).toBe(true);
        } else {
          expect(meetsFocusRequirement).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Black and white should always have maximum contrast', () => {
    fc.assert(
      fc.property(fc.constant('#000000'), fc.constant('#ffffff'), (black, white) => {
        const ratio = getContrastRatio(black, white);
        
        // Black and white should have 21:1 contrast
        expect(ratio).toBeCloseTo(21, 1);
        expect(meetsContrastRequirement(black, white, 'AAA', false)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Validation should always provide a recommendation', () => {
    fc.assert(
      fc.property(colorPairArbitrary, ({ foreground, background, isLargeText }) => {
        const validation = validateColorContrast(foreground, background, isLargeText);
        
        // Recommendation should always be a non-empty string
        expect(validation.recommendation).toBeTruthy();
        expect(typeof validation.recommendation).toBe('string');
        expect(validation.recommendation.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
