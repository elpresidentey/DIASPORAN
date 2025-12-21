import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02] min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-slate-100",

        primary:
          "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",

        secondary:
          "bg-muted text-muted-foreground hover:bg-muted/80 border border-border hover:shadow-md",

        outline:
          "border-2 border-border bg-transparent hover:bg-muted text-foreground hover:border-border/80",

        ghost: "hover:bg-muted text-foreground",

        destructive: "bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg dark:bg-gray-600 dark:hover:bg-gray-700",

        success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg dark:bg-green-600 dark:hover:bg-green-700",

        shimmer:
          "relative overflow-hidden bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
      },

      size: {
        default: "h-11 px-8 py-2.5",
        sm: "h-11 px-6 py-2 text-sm",
        lg: "h-12 px-10 py-3",
        xl: "h-14 px-12 py-3.5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, disabled, children, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        style={{ minWidth: 44, minHeight: 44, ...(style || {}) }}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
            <Spinner className="h-5 w-5" />
          </span>
        )}
        <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
          {icon && <span className="inline-flex" aria-hidden="true">{icon}</span>}
          {children}
        </span>
        {variant === "shimmer" && !loading && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={{ x: "-150%" }}
            animate={{ x: ["-150%", "150%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute -inset-y-6 -left-1/2 w-1/4 rotate-12 bg-white/20 blur-lg"></span>
          </motion.span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
