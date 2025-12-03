import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getContrastRatio,
  meetsContrastRequirement,
  validateColorContrast,
  trapFocus,
  getFocusableElements,
  focusFirstElement,
  createFocusRestorer,
  generateAriaId,
  getFormAriaAttributes,
  getButtonAriaAttributes,
  getLiveRegionAttributes,
  meetsTouchTargetSize,
  validateTouchTarget,
  prefersReducedMotion,
} from '../src/lib/accessibility';

describe('Color Contrast Utilities', () => {
  it('should calculate correct contrast ratio for black and white', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBe(21);
  });

  it('should calculate correct contrast ratio for same colors', () => {
    const ratio = getContrastRatio('#ffffff', '#ffffff');
    expect(ratio).toBe(1);
  });

  it('should handle colors without # prefix', () => {
    const ratio = getContrastRatio('000000', 'ffffff');
    expect(ratio).toBe(21);
  });

  it('should throw error for invalid color format', () => {
    expect(() => getContrastRatio('invalid', '#ffffff')).toThrow('Invalid color format');
  });

  it('should validate WCAG AA compliance for normal text', () => {
    // Black on white should pass
    expect(meetsContrastRequirement('#000000', '#ffffff', 'AA', false)).toBe(true);
    
    // Light gray on white should fail
    expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AA', false)).toBe(false);
  });

  it('should validate WCAG AA compliance for large text', () => {
    // Lower threshold for large text
    expect(meetsContrastRequirement('#767676', '#ffffff', 'AA', true)).toBe(true);
  });

  it('should provide detailed contrast validation results', () => {
    const result = validateColorContrast('#000000', '#ffffff');
    
    expect(result.ratio).toBe(21);
    expect(result.meetsAA).toBe(true);
    expect(result.meetsAAA).toBe(true);
    expect(result.recommendation).toContain('AAA');
  });

  it('should provide recommendations for poor contrast', () => {
    const result = validateColorContrast('#cccccc', '#ffffff');
    
    expect(result.meetsAA).toBe(false);
    expect(result.recommendation).toContain('too low');
  });
});

describe('Focus Management Utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should get all focusable elements in a container', () => {
    container.innerHTML = `
      <button>Button 1</button>
      <a href="#">Link</a>
      <input type="text" />
      <button disabled>Disabled</button>
      <div tabindex="-1">Not focusable</div>
    `;

    const focusable = getFocusableElements(container);
    expect(focusable).toHaveLength(3); // button, link, input (not disabled button or tabindex -1)
  });

  it('should focus first element in container', () => {
    container.innerHTML = `
      <button id="first">First</button>
      <button id="second">Second</button>
    `;

    focusFirstElement(container);
    expect(document.activeElement?.id).toBe('first');
  });

  it('should trap focus within container', () => {
    container.innerHTML = `
      <button id="first">First</button>
      <button id="second">Second</button>
      <button id="last">Last</button>
    `;

    const cleanup = trapFocus(container);
    
    // First element should be focused
    expect(document.activeElement?.id).toBe('first');
    
    cleanup();
  });

  it('should save and restore focus', () => {
    const button = document.createElement('button');
    button.id = 'test-button';
    document.body.appendChild(button);
    button.focus();

    const focusRestorer = createFocusRestorer();
    focusRestorer.save();

    // Focus something else
    const otherButton = document.createElement('button');
    document.body.appendChild(otherButton);
    otherButton.focus();

    expect(document.activeElement).toBe(otherButton);

    // Restore focus
    focusRestorer.restore();
    expect(document.activeElement).toBe(button);

    document.body.removeChild(button);
    document.body.removeChild(otherButton);
  });
});

describe('ARIA Attribute Helpers', () => {
  it('should generate unique ARIA IDs', () => {
    const id1 = generateAriaId('test');
    const id2 = generateAriaId('test');
    
    expect(id1).not.toBe(id2);
    expect(id1).toContain('test');
  });

  it('should create form ARIA attributes without error', () => {
    const attrs = getFormAriaAttributes('input-1', 'label-1', undefined, 'helper-1', false);
    
    expect(attrs.id).toBe('input-1');
    expect(attrs['aria-labelledby']).toBe('label-1');
    expect(attrs['aria-describedby']).toBe('helper-1');
    expect(attrs['aria-invalid']).toBeUndefined();
  });

  it('should create form ARIA attributes with error', () => {
    const attrs = getFormAriaAttributes('input-1', 'label-1', 'error-1', 'helper-1', true);
    
    expect(attrs['aria-describedby']).toBe('helper-1 error-1');
    expect(attrs['aria-invalid']).toBe(true);
  });

  it('should create button ARIA attributes', () => {
    const attrs = getButtonAriaAttributes('Submit form', false, false);
    
    expect(attrs['aria-label']).toBe('Submit form');
    expect(attrs['aria-busy']).toBeUndefined();
  });

  it('should create button ARIA attributes with loading state', () => {
    const attrs = getButtonAriaAttributes('Submit form', true, false);
    
    expect(attrs['aria-busy']).toBe(true);
  });

  it('should create live region attributes', () => {
    const attrs = getLiveRegionAttributes('assertive', true);
    
    expect(attrs['aria-live']).toBe('assertive');
    expect(attrs['aria-atomic']).toBe(true);
  });
});

describe('Touch Target Utilities', () => {
  it('should validate touch target size meets requirement', () => {
    const element = document.createElement('button');
    element.style.width = '48px';
    element.style.height = '48px';
    element.style.display = 'block';
    document.body.appendChild(element);

    // Mock getBoundingClientRect for testing
    element.getBoundingClientRect = () => ({
      width: 48,
      height: 48,
      top: 0,
      left: 0,
      bottom: 48,
      right: 48,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const result = meetsTouchTargetSize(element);
    expect(result).toBe(true);

    document.body.removeChild(element);
  });

  it('should validate touch target size fails requirement', () => {
    const element = document.createElement('button');
    element.style.width = '32px';
    element.style.height = '32px';
    document.body.appendChild(element);

    // Mock getBoundingClientRect for testing
    element.getBoundingClientRect = () => ({
      width: 32,
      height: 32,
      top: 0,
      left: 0,
      bottom: 32,
      right: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const result = meetsTouchTargetSize(element);
    expect(result).toBe(false);

    document.body.removeChild(element);
  });

  it('should provide detailed touch target validation', () => {
    const element = document.createElement('button');
    element.style.width = '40px';
    element.style.height = '40px';
    document.body.appendChild(element);

    // Mock getBoundingClientRect for testing
    element.getBoundingClientRect = () => ({
      width: 40,
      height: 40,
      top: 0,
      left: 0,
      bottom: 40,
      right: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const result = validateTouchTarget(element);
    
    expect(result.meetsRequirement).toBe(false);
    expect(result.recommendation).toContain('too small');

    document.body.removeChild(element);
  });
});

describe('Reduced Motion Utilities', () => {
  it('should check prefers-reduced-motion', () => {
    const result = prefersReducedMotion();
    expect(typeof result).toBe('boolean');
  });
});
