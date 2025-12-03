import * as React from "react"
import { cn } from "@/lib/utils"

// Enhanced Input Props with label, error, and helper text
export interface EnhancedInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  name?: string;
}

// Legacy Input Props for backward compatibility
export interface LegacyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: never;
}

export type InputProps = EnhancedInputProps | LegacyInputProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    // Always call hooks at the top level
    const generatedId = React.useId();
    
    // Check if this is the enhanced version (has label prop)
    if ('label' in props && props.label) {
      const { 
        className, 
        type = 'text', 
        label,
        placeholder,
        error,
        helperText,
        required = false,
        disabled = false,
        value,
        onChange,
        id,
        name,
        ...restProps 
      } = props as EnhancedInputProps;

      // Use provided ID or generated one
      const inputId = id || generatedId;
      const errorId = `${inputId}-error`;
      const helperId = `${inputId}-helper`;
      
      // Determine which description IDs to use
      const describedBy = [];
      if (helperText) describedBy.push(helperId);
      if (error) describedBy.push(errorId);
      const ariaDescribedBy = describedBy.length > 0 ? describedBy.join(' ') : undefined;

      return (
        <div className={cn("w-full", className)}>
          {/* Label */}
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-pink-500 ml-1" aria-label="required">*</span>}
          </label>

          {/* Input Field */}
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              // Base styles - minimum 44px height for touch targets
              "flex h-14 w-full rounded-2xl border-2 px-5 py-3 text-base text-foreground placeholder:text-muted-foreground",
              "transition-all duration-300 backdrop-blur-sm",
              "focus-visible:outline-none",
              // Default state
              !error && "border-border bg-input dark:border-white/10 dark:bg-white/5",
              // Hover state
              !error && !disabled && "hover:border-border/80 dark:hover:border-white/20",
              // Focus state with glow effect
              !error && "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 focus-visible:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
              // Error state with proper contrast
              error && "border-red-500 bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500 focus-visible:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
              // Disabled state
              disabled && "cursor-not-allowed opacity-50",
            )}
            ref={ref}
            {...restProps}
          />

          {/* Helper Text */}
          {helperText && !error && (
            <p 
              id={helperId}
              className="mt-2 text-sm text-muted-foreground"
            >
              {helperText}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p 
              id={errorId}
              className="mt-2 text-sm text-red-400 flex items-center gap-1"
              role="alert"
            >
              <svg 
                className="w-4 h-4 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </p>
          )}
        </div>
      )
    }

    // Legacy mode - simple input without label
    const { className, type, ...restProps } = props as LegacyInputProps;
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border-2 border-border bg-input px-5 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 focus-visible:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-border/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20",
          className
        )}
        ref={ref}
        {...restProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
