/**
 * Responsive Design Tests
 * 
 * Tests responsive design across all breakpoints for theme toggle and hero section
 * Requirements: 4.5, 5.1, 5.4
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Hero from '@/components/Hero';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Viewport configurations for testing
const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 800 },
  largeDesktop: { width: 1920, height: 1080 },
};

// Helper to set viewport size
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// Helper to get computed styles
const getComputedDimensions = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  return {
    width: parseFloat(styles.width),
    height: parseFloat(styles.height),
    minWidth: parseFloat(styles.minWidth),
    minHeight: parseFloat(styles.minHeight),
  };
};

describe('Responsive Design - Theme Toggle', () => {
  beforeEach(() => {
    // Reset viewport to default
    setViewport(1280, 800);
  });

  it('should meet minimum touch target size (44x44px) on mobile', () => {
    setViewport(viewports.mobile.width, viewports.mobile.height);
    
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    const dimensions = getComputedDimensions(button!);
    
    // Verify minimum touch target size
    expect(dimensions.minWidth).toBeGreaterThanOrEqual(44);
    expect(dimensions.minHeight).toBeGreaterThanOrEqual(44);
  });

  it('should remain accessible on tablet devices', () => {
    setViewport(viewports.tablet.width, viewports.tablet.height);
    
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Toggle theme'));
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('should maintain touch target size in landscape orientation', () => {
    setViewport(viewports.mobileLandscape.width, viewports.mobileLandscape.height);
    
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    const dimensions = getComputedDimensions(button!);
    
    expect(dimensions.minWidth).toBeGreaterThanOrEqual(44);
    expect(dimensions.minHeight).toBeGreaterThanOrEqual(44);
  });

  it('should be visible and accessible on all screen sizes', () => {
    Object.entries(viewports).forEach(([name, { width, height }]) => {
      setViewport(width, height);
      
      const { container } = render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = container.querySelector('button');
      expect(button, `Theme toggle should be visible on ${name}`).toBeInTheDocument();
      
      // Verify it's not hidden
      const styles = window.getComputedStyle(button!);
      expect(styles.display, `Theme toggle should not be hidden on ${name}`).not.toBe('none');
      expect(styles.visibility, `Theme toggle should be visible on ${name}`).not.toBe('hidden');
    });
  });
});

describe('Responsive Design - Hero Section', () => {
  beforeEach(() => {
    setViewport(1280, 800);
    // Mock navigator properties for device detection
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: 4,
    });
  });

  it('should render hero section on mobile devices', () => {
    setViewport(viewports.mobile.width, viewports.mobile.height);
    
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    // Check for main heading text appears at least once
    expect(screen.getAllByText(/Your Ultimate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Detty December Guide/i).length).toBeGreaterThan(0);
  });

  it('should render hero section on tablet devices', () => {
    setViewport(viewports.tablet.width, viewports.tablet.height);
    
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    expect(screen.getAllByText(/Your Ultimate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Detty December Guide/i).length).toBeGreaterThan(0);
  });

  it('should render hero section on desktop devices', () => {
    setViewport(viewports.desktop.width, viewports.desktop.height);
    
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    expect(screen.getAllByText(/Your Ultimate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Detty December Guide/i).length).toBeGreaterThan(0);
  });

  it('should display CTA buttons on all screen sizes', () => {
    Object.entries(viewports).forEach(([name, { width, height }]) => {
      setViewport(width, height);
      
      const { container } = render(
        <ThemeProvider>
          <Hero />
        </ThemeProvider>
      );

      const exploreButtons = screen.getAllByText(/Explore Events/i);
      const watchButtons = screen.getAllByText(/Watch Video/i);
      
      expect(exploreButtons.length, `Explore button should be visible on ${name}`).toBeGreaterThan(0);
      expect(watchButtons.length, `Watch button should be visible on ${name}`).toBeGreaterThan(0);
    });
  });

  it('should display trust badges on all screen sizes', () => {
    Object.entries(viewports).forEach(([name, { width, height }]) => {
      setViewport(width, height);
      
    render(
        <ThemeProvider>
          <Hero />
        </ThemeProvider>
      );

      expect(screen.getAllByText(/10,000\+ travelers/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/5\.0 Rating/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/24\/7 Support/i).length).toBeGreaterThan(0);
    });
  });

  it('should handle landscape orientation on mobile', () => {
    setViewport(viewports.mobileLandscape.width, viewports.mobileLandscape.height);
    
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    expect(screen.getAllByText(/Your Ultimate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Explore Events/i).length).toBeGreaterThan(0);
  });

  it('should handle landscape orientation on tablet', () => {
    setViewport(viewports.tabletLandscape.width, viewports.tabletLandscape.height);
    
    render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    expect(screen.getAllByText(/Your Ultimate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Explore Events/i).length).toBeGreaterThan(0);
  });
});

describe('Layout Stability During Theme Switch', () => {
  beforeEach(() => {
    setViewport(1280, 800);
  });

  it('should not cause layout shift when switching themes', async () => {
    const { container, rerender } = render(
      <ThemeProvider>
        <div>
          <ThemeToggle />
          <Hero />
        </div>
      </ThemeProvider>
    );

    // Get initial dimensions
    const initialHeight = container.firstChild?.clientHeight;
    const initialWidth = container.firstChild?.clientWidth;

    // Simulate theme change by adding dark class
    document.documentElement.classList.add('dark');
    
    // Rerender
    rerender(
      <ThemeProvider>
        <div>
          <ThemeToggle />
          <Hero />
        </div>
      </ThemeProvider>
    );

    await waitFor(() => {
      const newHeight = container.firstChild?.clientHeight;
      const newWidth = container.firstChild?.clientWidth;

      // Verify no layout shift occurred
      expect(newHeight).toBe(initialHeight);
      expect(newWidth).toBe(initialWidth);
    });

    // Cleanup
    document.documentElement.classList.remove('dark');
  });

  it('should maintain button positions during theme switch', async () => {
    const { container } = render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    const exploreButton = screen.getByText(/Explore Events/i);
    const initialRect = exploreButton.getBoundingClientRect();

    // Simulate theme change
    document.documentElement.classList.add('dark');

    await waitFor(() => {
      const newRect = exploreButton.getBoundingClientRect();
      
      // Verify button position hasn't shifted
      expect(Math.abs(newRect.top - initialRect.top)).toBeLessThan(1);
      expect(Math.abs(newRect.left - initialRect.left)).toBeLessThan(1);
    });

    // Cleanup
    document.documentElement.classList.remove('dark');
  });
});

describe('Touch Target Validation', () => {
  it('should ensure all interactive elements meet minimum size on mobile', () => {
    setViewport(viewports.mobile.width, viewports.mobile.height);
    
    const { container } = render(
      <ThemeProvider>
        <div>
          <ThemeToggle />
          <Hero />
        </div>
      </ThemeProvider>
    );

    // Get all buttons
    const buttons = container.querySelectorAll('button, a[href]');
    
    buttons.forEach((button) => {
      const el = button as HTMLElement;
      const dimensions = getComputedDimensions(el);
      const styles = window.getComputedStyle(el);
      
      // Skip if element is hidden
      if (styles.display === 'none' || styles.visibility === 'hidden') {
        return;
      }

      const hasMinSize = dimensions.width >= 44 && dimensions.height >= 44;
      const hasMinDimensions = dimensions.minWidth >= 44 || dimensions.minHeight >= 44;
      
      expect(
        hasMinSize || hasMinDimensions,
        `Interactive element should meet 44x44px minimum touch target size`
      ).toBe(true);
    });
  });
});

describe('Responsive Typography', () => {
  it('should scale hero heading appropriately across breakpoints', () => {
    const breakpoints = [
      { name: 'mobile', ...viewports.mobile, expectedMinSize: 32 },
      { name: 'tablet', ...viewports.tablet, expectedMinSize: 48 },
      { name: 'desktop', ...viewports.desktop, expectedMinSize: 56 },
    ];

    breakpoints.forEach(({ name, width, height, expectedMinSize }) => {
      setViewport(width, height);
      
      const { container } = render(
        <ThemeProvider>
          <Hero />
        </ThemeProvider>
      );

      const heading = container.querySelector('h1');
      expect(heading).toBeInTheDocument();

      const styles = window.getComputedStyle(heading!);
      const fontSize = parseFloat(styles.fontSize);

      expect(
        fontSize,
        `Font size on ${name} should be at least ${expectedMinSize}px`
      ).toBeGreaterThanOrEqual(expectedMinSize);
    });
  });
});

describe('Container Responsiveness', () => {
  it('should apply appropriate padding on mobile', () => {
    setViewport(viewports.mobile.width, viewports.mobile.height);
    
    const { container } = render(
      <ThemeProvider>
        <Hero />
      </ThemeProvider>
    );

    const section = container.querySelector('section');
    const innerContainer = section?.querySelector('.container');
    
    expect(innerContainer).toBeInTheDocument();
    
    const styles = window.getComputedStyle(innerContainer!);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);

    // Verify appropriate padding exists
    expect(paddingLeft).toBeGreaterThan(0);
    expect(paddingRight).toBeGreaterThan(0);
  });

  it('should not overflow viewport on any screen size', () => {
    Object.entries(viewports).forEach(([name, { width, height }]) => {
      setViewport(width, height);
      
      const { container } = render(
        <ThemeProvider>
          <Hero />
        </ThemeProvider>
      );

      const section = container.querySelector('section');
      const rect = section?.getBoundingClientRect();

      expect(
        rect?.width,
        `Hero section should not exceed viewport width on ${name}`
      ).toBeLessThanOrEqual(width);
    });
  });
});
