/**
 * Accessibility Utilities
 * Provides functions for color contrast validation, focus management, and ARIA helpers
 */

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex colors (e.g., #ffffff)');
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA standards
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  // AA level
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Validate color contrast and return detailed results
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  recommendation: string;
} {
  const ratio = getContrastRatio(foreground, background);
  const meetsAA = meetsContrastRequirement(foreground, background, 'AA', isLargeText);
  const meetsAAA = meetsContrastRequirement(foreground, background, 'AAA', isLargeText);

  let recommendation = '';
  if (!meetsAA) {
    recommendation = `Contrast ratio ${ratio.toFixed(2)}:1 is too low. Minimum required: ${
      isLargeText ? '3:1' : '4.5:1'
    } for WCAG AA.`;
  } else if (!meetsAAA) {
    recommendation = `Meets WCAG AA but not AAA. Consider improving to ${
      isLargeText ? '4.5:1' : '7:1'
    } for better accessibility.`;
  } else {
    recommendation = 'Excellent contrast! Meets WCAG AAA standards.';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    meetsAA,
    meetsAAA,
    recommendation,
  };
}

/**
 * Focus Management Utilities
 */

/**
 * Trap focus within a container element
 * Useful for modals, dialogs, and mobile menus
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not([disabled])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not([disabled])'
  );
  return Array.from(elements);
}

/**
 * Move focus to the first focusable element in a container
 */
export function focusFirstElement(container: HTMLElement): void {
  const focusableElements = getFocusableElements(container);
  focusableElements[0]?.focus();
}

/**
 * Restore focus to a previously focused element
 */
export function createFocusRestorer(): {
  save: () => void;
  restore: () => void;
} {
  let previouslyFocusedElement: HTMLElement | null = null;

  return {
    save: () => {
      previouslyFocusedElement = document.activeElement as HTMLElement;
    },
    restore: () => {
      previouslyFocusedElement?.focus();
    },
  };
}

/**
 * ARIA Attribute Helpers
 */

/**
 * Generate a unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Create ARIA attributes for form inputs with labels and descriptions
 */
export function getFormAriaAttributes(
  inputId: string,
  labelId?: string,
  errorId?: string,
  helperId?: string,
  hasError: boolean = false
): {
  id: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
} {
  const describedBy: string[] = [];

  if (helperId) describedBy.push(helperId);
  if (hasError && errorId) describedBy.push(errorId);

  return {
    id: inputId,
    ...(labelId && { 'aria-labelledby': labelId }),
    ...(describedBy.length > 0 && { 'aria-describedby': describedBy.join(' ') }),
    ...(hasError && { 'aria-invalid': true }),
  };
}

/**
 * Create ARIA attributes for buttons with loading states
 */
export function getButtonAriaAttributes(
  label: string,
  isLoading: boolean = false,
  isDisabled: boolean = false
): {
  'aria-label': string;
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
} {
  return {
    'aria-label': label,
    ...(isLoading && { 'aria-busy': true }),
    ...(isDisabled && { 'aria-disabled': true }),
  };
}

/**
 * Create ARIA live region attributes for dynamic content
 */
export function getLiveRegionAttributes(
  politeness: 'polite' | 'assertive' = 'polite',
  atomic: boolean = true
): {
  'aria-live': 'polite' | 'assertive';
  'aria-atomic': boolean;
} {
  return {
    'aria-live': politeness,
    'aria-atomic': atomic,
  };
}

/**
 * Check if an element meets minimum touch target size (44x44px)
 */
export function meetsTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

/**
 * Validate touch target size and return recommendations
 */
export function validateTouchTarget(element: HTMLElement): {
  width: number;
  height: number;
  meetsRequirement: boolean;
  recommendation: string;
} {
  const rect = element.getBoundingClientRect();
  const meetsRequirement = meetsTouchTargetSize(element);

  let recommendation = '';
  if (!meetsRequirement) {
    const widthDiff = Math.max(0, 44 - rect.width);
    const heightDiff = Math.max(0, 44 - rect.height);
    recommendation = `Touch target is too small. Increase width by ${widthDiff.toFixed(
      0
    )}px and height by ${heightDiff.toFixed(0)}px to meet 44x44px minimum.`;
  } else {
    recommendation = 'Touch target meets minimum size requirement.';
  }

  return {
    width: rect.width,
    height: rect.height,
    meetsRequirement,
    recommendation,
  };
}

/**
 * Check if prefers-reduced-motion is enabled
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create a media query listener for reduced motion preference
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
