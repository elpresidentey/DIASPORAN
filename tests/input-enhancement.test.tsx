import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';
import React from 'react';

describe('Enhanced Input Component', () => {
  it('renders with label and associates it correctly', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Email Address"
        value=""
        onChange={handleChange}
        type="email"
      />
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('displays required indicator when required prop is true', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Password"
        value=""
        onChange={handleChange}
        type="password"
        required
      />
    );

    const requiredIndicator = screen.getByLabelText('required');
    expect(requiredIndicator).toBeDefined();
    expect(requiredIndicator.textContent).toBe('*');
  });

  it('displays error message and sets aria-invalid when error prop is provided', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Username"
        value=""
        onChange={handleChange}
        error="Username is required"
      />
    );

    const errorMessage = screen.getByRole('alert');
    const input = screen.getByRole('textbox');
    
    expect(errorMessage).toBeDefined();
    expect(errorMessage.textContent).toContain('Username is required');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('displays helper text when provided and no error', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Email"
        value=""
        onChange={handleChange}
        helperText="We'll never share your email"
      />
    );

    const helperText = screen.getByText("We'll never share your email");
    expect(helperText).toBeDefined();
  });

  it('associates helper text with input via aria-describedby', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Email"
        value=""
        onChange={handleChange}
        helperText="Enter your email address"
      />
    );

    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    
    expect(describedBy).toBeDefined();
    expect(describedBy).toContain('helper');
  });

  it('associates error message with input via aria-describedby', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Email"
        value=""
        onChange={handleChange}
        error="Invalid email format"
      />
    );

    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    
    expect(describedBy).toBeDefined();
    expect(describedBy).toContain('error');
  });

  it('has minimum 44px height for touch targets', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    
    // h-14 in Tailwind is 3.5rem = 56px, which exceeds the 44px minimum
    expect(input.className).toContain('h-14');
  });

  it('applies disabled styles when disabled prop is true', () => {
    const handleChange = (value: string) => {};
    render(
      <Input
        label="Disabled Input"
        value=""
        onChange={handleChange}
        disabled
      />
    );

    const input = screen.getByRole('textbox');
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('supports legacy usage without label (backward compatibility)', () => {
    render(
      <Input
        placeholder="Search..."
        type="text"
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeDefined();
  });
});
