import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorDisplayProps {
  type: "validation" | "network" | "empty" | "system";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
  className?: string;
}

const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
  ({ type, title, message, action, illustration, className }, ref) => {
    const Icon = getIcon(type);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8",
          type === "system" && "min-h-screen",
          className
        )}
        role="alert"
        aria-live="polite"
      >
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : (
          <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/10">
            <Icon className="w-8 h-8 text-gray-500" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
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
ErrorDisplay.displayName = "ErrorDisplay";

function getIcon(type: "validation" | "network" | "empty" | "system") {
  switch (type) {
    case "validation":
      return ValidationIcon;
    case "network":
      return NetworkIcon;
    case "empty":
      return EmptyIcon;
    case "system":
      return SystemErrorIcon;
  }
}

const ValidationIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const NetworkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
    <path d="M8 8L4 4" />
    <path d="M16 8l4-4" />
    <path d="M16 16l4 4" />
    <path d="M8 16l-4 4" />
  </svg>
);

const EmptyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const SystemErrorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export { ErrorDisplay };
