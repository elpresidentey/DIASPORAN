import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { Toast } from '@/components/ui/Toast';

/**
 * **Feature: ui-enhancement, Property 24: Error Message Completeness**
 * **Validates: Requirements 7.1**
 * 
 * For any error state, the error message should include a clear description and suggested action
 */

// Generator for error notification data with required completeness
const errorNotificationArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  message: fc.option(fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), { nil: undefined }),
  actionLabel: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
});

describe('Property-Based Tests: Error Message Completeness', () => {
  it('Property 24: All error messages should include a clear description (title)', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Check that the title (clear description) is displayed
          const titleElement = toast.querySelector('.text-sm.font-semibold');
          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.textContent).toBe(errorData.title);
          expect(titleElement?.textContent?.trim().length).toBeGreaterThan(0);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: All error messages should include a suggested action', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { container, unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          // Check that an action button (suggested action) is present
          const actionButton = container.querySelector('button:not([aria-label])');
          expect(actionButton).toBeInTheDocument();
          expect(actionButton?.tagName).toBe('BUTTON');
          // Compare trimmed values since browser rendering may normalize whitespace
          expect(actionButton?.textContent?.trim()).toBe(errorData.actionLabel.trim());
          expect(actionButton?.textContent?.trim().length).toBeGreaterThan(0);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages should have both description and action for completeness', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { container, unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = container.querySelector('[role="alert"]');
          expect(toast).toBeInTheDocument();
          
          // Verify both components of completeness are present:
          // 1. Clear description (title)
          const titleElement = toast?.querySelector('.text-sm.font-semibold');
          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.textContent).toBe(errorData.title);
          
          // 2. Suggested action (action button)
          const actionButton = toast?.querySelector('button:not([aria-label])');
          expect(actionButton).toBeInTheDocument();
          expect(actionButton?.tagName).toBe('BUTTON');
          // Compare trimmed values since browser rendering may normalize whitespace
          expect(actionButton?.textContent?.trim()).toBe(errorData.actionLabel.trim());

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages with additional details should display them', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary.filter(data => data.message !== undefined),
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Additional message details should be displayed
          const messageElement = toast.querySelector('.text-sm.opacity-90');
          expect(messageElement).toBeInTheDocument();
          expect(messageElement?.textContent).toBe(errorData.message);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages should use error variant styling', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Verify error styling is applied
          expect(toast).toHaveClass('border-red-500/50');
          expect(toast).toHaveClass('bg-red-950/90');
          expect(toast).toHaveClass('text-red-50');

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages should include an error icon', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Check that an error icon is present
          const iconContainer = toast.querySelector('.flex-shrink-0');
          expect(iconContainer).toBeInTheDocument();
          
          const icon = iconContainer?.querySelector('svg');
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveClass('h-5');
          expect(icon).toHaveClass('w-5');

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error action buttons should be interactive', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { container, unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const actionButton = container.querySelector('button:not([aria-label])');
          expect(actionButton).toBeInTheDocument();
          
          // Action button should be interactive
          expect(actionButton?.tagName).toBe('BUTTON');
          expect(actionButton).not.toBeDisabled();
          
          // Should have focus styling
          const classList = Array.from(actionButton?.classList || []);
          const hasFocusRing = classList.some(c => c.includes('focus:ring'));
          expect(hasFocusRing).toBe(true);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages should be accessible with ARIA attributes', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Check ARIA attributes for accessibility
          expect(toast).toHaveAttribute('role', 'alert');
          expect(toast).toHaveAttribute('aria-live', 'assertive');
          expect(toast).toHaveAttribute('aria-atomic', 'true');

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error messages should have consistent structure', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          
          // Should have icon container
          const iconContainer = toast.querySelector('.flex-shrink-0');
          expect(iconContainer).toBeInTheDocument();
          
          // Should have content container
          const contentContainer = toast.querySelector('.flex-1');
          expect(contentContainer).toBeInTheDocument();
          
          // Should have close button
          const closeButton = toast.querySelector('button[aria-label="Close notification"]');
          expect(closeButton).toBeInTheDocument();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 24: Error descriptions should be non-empty and meaningful', () => {
    fc.assert(
      fc.property(
        errorNotificationArbitrary,
        (errorData) => {
          const { unmount } = render(
            <Toast
              id="test-error-toast"
              variant="error"
              title={errorData.title}
              message={errorData.message}
              action={{
                label: errorData.actionLabel,
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          const titleElement = toast.querySelector('.text-sm.font-semibold');
          
          // Description should be non-empty
          expect(titleElement?.textContent).toBeTruthy();
          expect(titleElement?.textContent?.trim().length).toBeGreaterThan(0);
          
          // Should match the provided title
          expect(titleElement?.textContent).toBe(errorData.title);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
