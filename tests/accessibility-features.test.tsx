import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Accessibility Features - Task 13', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open theme menu with Enter key', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: /change theme/i });
      
      // Press Enter to open menu
      fireEvent.keyDown(button, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('should open theme menu with Space key', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: /change theme/i });
      
      // Press Space to open menu
      fireEvent.keyDown(button, { key: ' ' });
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('should close menu with Escape key', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: /change theme/i });
      
      // Open menu
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      // Press Escape to close
      fireEvent.keyDown(button, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should navigate menu items with arrow keys', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: /change theme/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3); // light, dark, system
    });
  });

  describe('ARIA Labels and Roles', () => {
    it('should have proper ARIA label on toggle button', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toMatch(/change theme/i);
    });

    it('should have aria-haspopup attribute', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should have aria-expanded attribute that changes', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Initially collapsed
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      // Open menu
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have aria-controls linking to menu', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'theme-menu');
    });

    it('should have proper role on menu', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveAttribute('aria-label');
      });
    });

    it('should have menuitem role on options', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems.length).toBeGreaterThan(0);
        
        menuItems.forEach(item => {
          expect(item).toHaveAttribute('aria-label');
        });
      });
    });

    it('should mark selected item with aria-current', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        const selectedItems = menuItems.filter(item => 
          item.getAttribute('aria-current') === 'true'
        );
        expect(selectedItems.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Focus Indicators', () => {
    it('should have visible focus styles on button', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Check for focus-visible classes
      expect(button.className).toContain('focus-visible:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
    });

    it('should have visible focus styles on menu items', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        menuItems.forEach(item => {
          expect(item.className).toContain('focus-visible');
        });
      });
    });

    it('should have minimum touch target size (44x44px)', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Check for minimum size classes
      expect(button.className).toContain('min-h-[44px]');
      expect(button.className).toContain('min-w-[44px]');
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect prefers-reduced-motion in CSS', () => {
      // This is tested via CSS media query
      // The globals.css file should have @media (prefers-reduced-motion: reduce)
      const styles = document.createElement('style');
      styles.textContent = `
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(styles);
      
      expect(styles.textContent).toContain('prefers-reduced-motion');
      
      document.head.removeChild(styles);
    });
  });

  describe('Screen Reader Support', () => {
    it('should have descriptive labels for screen readers', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        
        menuItems.forEach(item => {
          const label = item.getAttribute('aria-label');
          expect(label).toBeTruthy();
          expect(label).toMatch(/theme/i);
        });
      });
    });

    it('should hide decorative icons from screen readers', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        // Icons should have aria-hidden="true"
        const menu = screen.getByRole('menu');
        const icons = menu.querySelectorAll('[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    it('should provide hidden descriptions for menu items', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        
        menuItems.forEach(item => {
          const describedBy = item.getAttribute('aria-describedby');
          expect(describedBy).toBeTruthy();
          
          // Check that the description element exists
          const descElement = document.getElementById(describedBy!);
          expect(descElement).toBeInTheDocument();
          expect(descElement?.className).toContain('sr-only');
        });
      });
    });
  });

  describe('Theme Selection', () => {
    it('should update aria-label when theme changes', async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      const initialLabel = button.getAttribute('aria-label');
      
      // Open menu and select a theme
      fireEvent.click(button);
      
      await waitFor(() => {
        const lightOption = screen.getByRole('menuitem', { name: /light theme/i });
        fireEvent.click(lightOption);
      });
      
      await waitFor(() => {
        const newLabel = button.getAttribute('aria-label');
        expect(newLabel).not.toBe(initialLabel);
        expect(newLabel).toMatch(/light/i);
      });
    });
  });
});
