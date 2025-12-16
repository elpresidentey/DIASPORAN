import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-3",
      },
      color: {
        primary: "text-primary",
        secondary: "text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, label = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <div className={cn(spinnerVariants({ size, color }))} aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
