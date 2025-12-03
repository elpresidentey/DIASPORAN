# Accessibility Utilities

This module provides comprehensive accessibility utilities for the Diasporan application, ensuring WCAG 2.1 AA compliance and excellent user experience for all users.

## Features

### 1. Color Contrast Validation

Validate color contrast ratios to ensure text is readable for users with visual impairments.

```typescript
import { getContrastRatio, meetsContrastRequirement, validateColorContrast } from '@/lib/accessibility';

// Check contrast ratio
const ratio = getContrastRatio('#000000', '#ffffff'); // Returns 21

// Check if colors meet WCAG requirements
const meetsAA = meetsContrastRequirement('#767676', '#ffffff', 'AA', false);

// Get detailed validation results
const result = validateColorContrast('#000000', '#ffffff');
// {
//   ratio: 21,
//   meetsAA: true,
//   meetsAAA: true,
//   recommendation: 'Excellent contrast! Meets WCAG AAA standards.'
// }
```

**WCAG Requirements:**
- Normal text (< 18pt): 4.5:1 for AA, 7:1 for AAA
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 for AA, 4.5:1 for AAA
- Focus indicators: 3:1 minimum

### 2. Focus Management

Utilities for managing keyboard focus in modals, dialogs, and complex UI components.

```typescript
import { trapFocus, getFocusableElements, focusFirstElement, createFocusRestorer } from '@/lib/accessibility';

// Trap focus within a modal
const modal = document.getElementById('modal');
const cleanup = trapFocus(modal);
// When done, call cleanup()

// Get all focusable elements
const focusableElements = getFocusableElements(container);

// Focus the first element
focusFirstElement(container);

// Save and restore focus
const focusRestorer = createFocusRestorer();
focusRestorer.save(); // Save current focus
// ... do something that changes focus
focusRestorer.restore(); // Restore previous focus
```

### 3. ARIA Attribute Helpers

Generate proper ARIA attributes for accessible components.

```typescript
import { 
  generateAriaId, 
  getFormAriaAttributes, 
  getButtonAriaAttributes, 
  getLiveRegionAttributes 
} from '@/lib/accessibility';

// Generate unique IDs for ARIA relationships
const inputId = generateAriaId('email-input');
const labelId = generateAriaId('email-label');

// Form input attributes
const inputAttrs = getFormAriaAttributes(
  inputId,
  labelId,
  'error-id',
  'helper-id',
  true // hasError
);
// Returns: {
//   id: 'email-input',
//   'aria-labelledby': 'email-label',
//   'aria-describedby': 'helper-id error-id',
//   'aria-invalid': true
// }

// Button attributes
const buttonAttrs = getButtonAriaAttributes('Submit form', true, false);
// Returns: {
//   'aria-label': 'Submit form',
//   'aria-busy': true
// }

// Live region for dynamic content
const liveAttrs = getLiveRegionAttributes('assertive', true);
// Returns: {
//   'aria-live': 'assertive',
//   'aria-atomic': true
// }
```

### 4. Touch Target Validation

Ensure interactive elements meet minimum touch target size (44x44px).

```typescript
import { meetsTouchTargetSize, validateTouchTarget } from '@/lib/accessibility';

const button = document.getElementById('my-button');

// Quick check
const meetsSize = meetsTouchTargetSize(button); // true/false

// Detailed validation
const result = validateTouchTarget(button);
// {
//   width: 48,
//   height: 48,
//   meetsRequirement: true,
//   recommendation: 'Touch target meets minimum size requirement.'
// }
```

### 5. Reduced Motion Detection

Respect user preferences for reduced motion.

```typescript
import { prefersReducedMotion, onReducedMotionChange } from '@/lib/accessibility';

// Check if user prefers reduced motion
if (prefersReducedMotion()) {
  // Use instant transitions instead of animations
}

// Listen for changes
const cleanup = onReducedMotionChange((prefersReduced) => {
  if (prefersReduced) {
    // Disable animations
  } else {
    // Enable animations
  }
});

// When done, call cleanup()
```

## Testing with jest-axe

The project includes jest-axe for automated accessibility testing.

```typescript
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from '../tests/axe-helper';

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  await expectNoA11yViolations(container);
});
```

## Best Practices

### Color Contrast
- Always validate text colors against their backgrounds
- Use the `validateColorContrast` function during development
- Aim for AAA compliance when possible

### Focus Management
- Trap focus in modals and dialogs
- Provide visible focus indicators with 3:1 contrast
- Maintain logical tab order
- Use skip links for keyboard navigation

### ARIA Attributes
- Associate labels with form inputs using `htmlFor` and `id`
- Use `aria-describedby` for helper text and errors
- Mark invalid inputs with `aria-invalid`
- Use `aria-live` regions for dynamic content announcements

### Touch Targets
- Ensure all interactive elements are at least 44x44px
- Add padding if the visual element is smaller
- Test on actual touch devices

### Animations
- Always check `prefersReducedMotion()`
- Provide instant alternatives to animations
- Keep animations under 400ms
- Avoid animations that flash more than 3 times per second

## WCAG 2.1 AA Compliance Checklist

- ✅ Color contrast ratios meet requirements
- ✅ Keyboard navigation fully supported
- ✅ Focus indicators visible and meet contrast requirements
- ✅ Touch targets meet minimum size
- ✅ ARIA attributes properly implemented
- ✅ Reduced motion preferences respected
- ✅ Form inputs properly labeled
- ✅ Error messages accessible
- ✅ Dynamic content announced to screen readers

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
