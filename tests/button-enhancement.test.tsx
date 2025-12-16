import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import React from 'react';

/**
 * Test suite for enhanced Button component
 * Validates Requirements: 1.1, 1.3, 1.5
 */
describe('Enhanced Button Component', () => {
  it('should render with loading state and spinner overlay', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('should have proper ARIA attributes', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render with icon', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    render(<Button icon={icon}>With Icon</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('should have minimum touch target size (44x44px)', () => {
    render(<Button>Touch Target</Button>);
    const button = screen.getByRole('button');
    
    // Check that the button has min-h-[44px] and min-w-[44px] classes
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
  });

  it('should support all visual states through classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    
    // Check hover scale class
    expect(button.className).toContain('hover:scale-[1.02]');
    
    // Check active scale class
    expect(button.className).toContain('active:scale-[0.98]');
    
    // Check focus-visible ring
    expect(button.className).toContain('focus-visible:ring-2');
    expect(button.className).toContain('focus-visible:ring-sky-500');
    
    // Check disabled state
    rerender(<Button disabled>Disabled</Button>);
    button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
  });

  it('should support keyboard interaction (native button behavior)', () => {
    render(<Button>Keyboard Button</Button>);
    const button = screen.getByRole('button');
    
    // Native button elements support keyboard interaction by default
    expect(button.tagName).toBe('BUTTON');
  });

  it('should hide content when loading', () => {
    render(<Button loading>Loading Content</Button>);
    const button = screen.getByRole('button');
    
    // Content should be invisible when loading
    const contentSpan = button.querySelector('span.invisible');
    expect(contentSpan).toBeInTheDocument();
  });

  it('should support all button variants', () => {
    const variants = ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'shimmer'] as const;
    
    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('should support all button sizes', () => {
    const sizes = ['sm', 'default', 'lg', 'xl', 'icon'] as const;
    
    sizes.forEach(size => {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });
});
