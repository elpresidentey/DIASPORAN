import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "animate-pulse bg-white/10 rounded-lg",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "rounded-lg",
        card: "rounded-3xl",
      },
      animation: {
        pulse: "animate-pulse",
        wave: "animate-shimmer bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]",
        none: "animate-none",
      },
    },
    defaultVariants: {
      variant: "rectangular",
      animation: "pulse",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animation, width, height, style, ...props }, ref) => {
    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height && { height: typeof height === "number" ? `${height}px` : height }),
    };

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={inlineStyles}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
