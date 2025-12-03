import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from './axe-helper';

/**
 * Example test demonstrating jest-axe usage
 * This shows how to test components for accessibility violations
 */
describe('Accessibility Testing Example', () => {
  it('should have no accessibility violations on a simple button', async () => {
    const { container } = render(
      <button aria-label="Click me">Click</button>
    );

    await expectNoA11yViolations(container);
  });

  it('should have no accessibility violations on a form with proper labels', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        
        <button type="submit">Submit</button>
      </form>
    );

    await expectNoA11yViolations(container);
  });

  it('should have no accessibility violations on a navigation', async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    );

    await expectNoA11yViolations(container);
  });
});
