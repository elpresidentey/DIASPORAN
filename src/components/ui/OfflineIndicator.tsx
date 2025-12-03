import * as React from "react";
import { cn } from "@/lib/utils";

export interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator = React.forwardRef<HTMLDivElement, OfflineIndicatorProps>(
  ({ className }, ref) => {
    const [isOnline, setIsOnline] = React.useState(
      typeof window !== "undefined" ? window.navigator.onLine : true
    );

    React.useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);

    if (isOnline) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm text-yellow-950 px-4 py-2 text-center text-sm font-medium",
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          <span>You are currently offline. Some features may be unavailable.</span>
        </div>
      </div>
    );
  }
);
OfflineIndicator.displayName = "OfflineIndicator";

export { OfflineIndicator };
