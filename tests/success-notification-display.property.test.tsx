import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { Toast } from '@/components/ui/Toast';

/**
 * **Feature: ui-enhancement, Property 32: Success Notification Display**
 * **Validates: Requirements 8.4**
 * 
 * For any successful action completion, a success notification with icon and appropriate color should be displayed
 */

// Generator for success notification data
const successNotificationArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  message: fc.option(fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), { nil: undefined }),
  hasAction: fc.boolean(),
});

describe('Property-Based Tests: Success Notification Display', () => {
  it('Property 32: Success notifications should always display with appropriate icon and color', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              action={notificationData.hasAction ? {
                label: 'Action',
                onClick: () => {},
              } : undefined}
              onDismiss={() => {}}
            />
          );

          // Check that the toast is displayed
          const toasts = screen.getAllByRole('alert');
          const toast = toasts[toasts.length - 1]; // Get the most recent toast
          expect(toast).toBeInTheDocument();

          // Check that the title is displayed (using the toast element to avoid conflicts)
          const titleElement = toast.querySelector('.text-sm.font-semibold');
          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.textContent).toBe(notificationData.title);

          // Check that the message is displayed if provided
          if (notificationData.message) {
            const messageElement = toast.querySelector('.text-sm.opacity-90');
            expect(messageElement).toBeInTheDocument();
            expect(messageElement?.textContent).toBe(notificationData.message);
          }

          // Check that the toast has success styling (green colors)
          expect(toast).toHaveClass('border-green-500/50');
          expect(toast).toHaveClass('bg-green-950/90');
          expect(toast).toHaveClass('text-green-50');

          // Check that an icon is present (SVG element)
          const icon = toast.querySelector('svg');
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveClass('h-5');
          expect(icon).toHaveClass('w-5');

          // Check that the icon is a success icon (checkmark circle)
          const iconPath = icon?.querySelector('path');
          expect(iconPath).toBeInTheDocument();
          expect(iconPath).toHaveAttribute('fill-rule', 'evenodd');
          expect(iconPath).toHaveAttribute('clip-rule', 'evenodd');

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success notifications should have appropriate color scheme', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');

          // Verify success color classes are applied
          const classList = Array.from(toast.classList);
          
          // Should have green border
          expect(classList.some(c => c.includes('border-green'))).toBe(true);
          
          // Should have green background
          expect(classList.some(c => c.includes('bg-green'))).toBe(true);
          
          // Should have green text
          expect(classList.some(c => c.includes('text-green'))).toBe(true);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success notifications should display action button when provided', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary.filter(data => data.hasAction),
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              action={{
                label: 'Action',
                onClick: () => {},
              }}
              onDismiss={() => {}}
            />
          );

          // Check that action button is displayed
          const actionButton = screen.getByText('Action');
          expect(actionButton).toBeInTheDocument();
          expect(actionButton.tagName).toBe('BUTTON');

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success notifications should have ARIA attributes for accessibility', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');

          // Check ARIA attributes
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

  it('Property 32: Success notifications should have close button', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              onDismiss={() => {}}
            />
          );

          // Check that close button is present
          const closeButton = screen.getByLabelText('Close notification');
          expect(closeButton).toBeInTheDocument();
          expect(closeButton.tagName).toBe('BUTTON');

          // Check that close button has an icon
          const closeIcon = closeButton.querySelector('svg');
          expect(closeIcon).toBeInTheDocument();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success notifications should display all provided content', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              action={notificationData.hasAction ? {
                label: 'Action',
                onClick: () => {},
              } : undefined}
              onDismiss={() => {}}
            />
          );

          // Get the most recent toast
          const toasts = screen.getAllByRole('alert');
          const toast = toasts[toasts.length - 1];

          // Title should always be displayed
          const titleElement = toast.querySelector('.text-sm.font-semibold');
          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.textContent).toBe(notificationData.title);

          // Message should be displayed if provided
          if (notificationData.message) {
            const messageElement = toast.querySelector('.text-sm.opacity-90');
            expect(messageElement).toBeInTheDocument();
            expect(messageElement?.textContent).toBe(notificationData.message);
          }

          // Action should be displayed if provided
          if (notificationData.hasAction) {
            const actionButton = toast.querySelector('button:not([aria-label])');
            expect(actionButton).toBeInTheDocument();
            expect(actionButton?.textContent).toBe('Action');
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success icon should be visually distinct from other notification types', () => {
    const { unmount: unmountSuccess } = render(
      <Toast
        id="success-toast"
        variant="success"
        title="Success"
        onDismiss={() => {}}
      />
    );

    const successToast = screen.getByRole('alert');
    const successIcon = successToast.querySelector('svg');
    const successPath = successIcon?.querySelector('path');
    const successPathD = successPath?.getAttribute('d');

    unmountSuccess();
    cleanup();

    // Render error toast for comparison
    const { unmount: unmountError } = render(
      <Toast
        id="error-toast"
        variant="error"
        title="Error"
        onDismiss={() => {}}
      />
    );

    const errorToast = screen.getByRole('alert');
    const errorIcon = errorToast.querySelector('svg');
    const errorPath = errorIcon?.querySelector('path');
    const errorPathD = errorPath?.getAttribute('d');

    // Icons should be different
    expect(successPathD).not.toBe(errorPathD);
    expect(successPathD).toBeTruthy();
    expect(errorPathD).toBeTruthy();

    unmountError();
    cleanup();
  });

  it('Property 32: Success notifications should have consistent structure', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
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

  it('Property 32: Success notifications should use correct variant styling', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');

          // Verify the toast has the success variant classes
          const hasSuccessBorder = toast.className.includes('border-green-500/50');
          const hasSuccessBackground = toast.className.includes('bg-green-950/90');
          const hasSuccessText = toast.className.includes('text-green-50');

          expect(hasSuccessBorder).toBe(true);
          expect(hasSuccessBackground).toBe(true);
          expect(hasSuccessText).toBe(true);

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 32: Success notifications should always include an icon', () => {
    fc.assert(
      fc.property(
        successNotificationArbitrary,
        (notificationData) => {
          const { unmount } = render(
            <Toast
              id="test-toast"
              variant="success"
              title={notificationData.title}
              message={notificationData.message}
              onDismiss={() => {}}
            />
          );

          const toast = screen.getByRole('alert');
          const icons = toast.querySelectorAll('svg');

          // Should have at least 2 SVGs: one for the success icon, one for the close button
          expect(icons.length).toBeGreaterThanOrEqual(2);

          // The first icon should be the success icon (in the flex-shrink-0 container)
          const iconContainer = toast.querySelector('.flex-shrink-0');
          const successIcon = iconContainer?.querySelector('svg');
          expect(successIcon).toBeInTheDocument();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
