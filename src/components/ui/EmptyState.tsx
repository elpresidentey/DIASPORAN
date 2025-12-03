import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  message: string;
  illustration?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, message, illustration, action, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 min-h-[400px]",
          className
        )}
        role="status"
        aria-live="polite"
      >
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : (
          <DefaultIllustration />
        )}

        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 max-w-md mb-6">{message}</p>

        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

const DefaultIllustration = () => (
  <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-gray-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  </div>
);

export { EmptyState };
