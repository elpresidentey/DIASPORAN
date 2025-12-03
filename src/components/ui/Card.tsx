import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-3xl border transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card backdrop-blur-md text-card-foreground dark:border-white/10 dark:bg-white/5",
        interactive:
          "border-border bg-card backdrop-blur-md text-card-foreground cursor-pointer hover:border-border/80 hover:bg-card/80 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10",
        elevated:
          "border-border bg-card backdrop-blur-md text-card-foreground shadow-lg hover:shadow-xl hover:shadow-purple-500/20 dark:border-white/10 dark:bg-white/5",
        flat: "border-border bg-card text-card-foreground dark:border-white/10 dark:bg-white/5",
      },
      hoverable: {
        true: "hover:border-border/80 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 dark:hover:border-white/20",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  clickable?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hoverable,
      clickable,
      loading,
      ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = clickable || !!onClick;
    const shouldHover = hoverable || isInteractive;

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant: isInteractive ? "interactive" : variant,
            hoverable: shouldHover,
          }),
          loading && "opacity-50 pointer-events-none",
          isInteractive && "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black",
          className
        )}
        onClick={onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={ariaLabel}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as any);
                }
              }
            : undefined
        }
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-3 p-6 sm:p-8", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-card-foreground",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm sm:text-base text-muted-foreground leading-relaxed", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 sm:p-8 sm:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center justify-between p-6 pt-0 sm:p-8 sm:pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
