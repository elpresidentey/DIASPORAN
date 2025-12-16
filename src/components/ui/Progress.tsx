import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100
  max?: number;
  showLabel?: boolean;
  label?: string;
  indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      showLabel = false,
      label,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {label || "Loading..."}
            </span>
            {!indeterminate && showLabel && (
              <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10"
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || "Loading progress"}
        >
          {indeterminate ? (
            <div
              className="h-full w-1/3 animate-[progress_1.5s_ease-in-out_infinite] bg-gradient-to-r from-primary to-accent"
              style={{
                animation: "progress 1.5s ease-in-out infinite",
              }}
            />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
