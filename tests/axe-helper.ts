import { configureAxe, toHaveNoViolations, JestAxeConfigureOptions } from 'jest-axe';
import { expect } from 'vitest';

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Type augmentation for Vitest expect
declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

/**
 * Configure axe for accessibility testing
 * Customize rules and options as needed
 */
export const axe = configureAxe({
  rules: {
    // Customize rules if needed
    // Example: disable specific rules
    // 'color-contrast': { enabled: false },
  },
});

/**
 * Run accessibility tests on a container element
 * Usage: await expectNoA11yViolations(container)
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Run accessibility tests with custom options
 */
export async function runAxeTest(
  container: Element,
  options?: JestAxeConfigureOptions
): Promise<any> {
  const customAxe = configureAxe(options || {});
  return await customAxe(container);
}
