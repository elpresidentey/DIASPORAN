"use client";

import { useRouter } from "next/navigation";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorDisplay
      type="system"
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist. It might have been moved or deleted."
      action={{
        label: "Go Home",
        onClick: () => router.push("/"),
      }}
      illustration={
        <div className="mb-6 flex items-center justify-center w-32 h-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
      }
    />
  );
}
