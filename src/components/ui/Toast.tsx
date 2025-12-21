import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg backdrop-blur-md transition-all",
  {
    variants: {
      variant: {
        success: "border-green-500/50 bg-green-950/90 text-green-50 dark:border-green-500/50 dark:bg-green-950/90 dark:text-green-50 light:border-green-500/30 light:bg-green-100/90 light:text-green-900",
        error: "border-gray-500/50 bg-gray-950/90 text-gray-50 dark:border-gray-500/50 dark:bg-gray-950/90 dark:text-gray-50 light:border-gray-500/30 light:bg-gray-100/90 light:text-gray-900",
        warning: "border-yellow-500/50 bg-yellow-950/90 text-yellow-50 dark:border-yellow-500/50 dark:bg-yellow-950/90 dark:text-yellow-50 light:border-yellow-500/30 light:bg-yellow-100/90 light:text-yellow-900",
        info: "border-blue-500/50 bg-blue-950/90 text-blue-50 dark:border-blue-500/50 dark:bg-blue-950/90 dark:text-blue-50 light:border-blue-500/30 light:bg-blue-100/90 light:text-blue-900",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, variant, title, message, action, onDismiss }, ref) => {
    const Icon = getIcon(variant || "info");

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 100) {
        onDismiss(id);
      }
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        className={cn(toastVariants({ variant }))}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex-shrink-0" aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="text-sm font-semibold">{title}</div>
          {message && <div className="text-sm opacity-90">{message}</div>}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onDismiss(id)}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </motion.div>
    );
  }
);
Toast.displayName = "Toast";

function getIcon(variant: "success" | "error" | "warning" | "info") {
  switch (variant) {
    case "success":
      return SuccessIcon;
    case "error":
      return ErrorIcon;
    case "warning":
      return WarningIcon;
    case "info":
      return InfoIcon;
  }
}

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

export { Toast, toastVariants };
