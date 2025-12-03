"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay
      type="system"
      title="Something went wrong"
      message="We encountered an unexpected error. Please try again or contact support if the problem persists."
      action={{
        label: "Try Again",
        onClick: reset,
      }}
      illustration={
        <div className="mb-6 flex items-center justify-center w-32 h-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      }
    />
  );
}
