"use client";

import { useState } from "react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { Button } from "@/components/ui/Button";

export default function ErrorDemoPage() {
  const [showOffline, setShowOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {showOffline && <OfflineIndicator />}

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Error & Empty State Components
        </h1>

        <div className="mb-8 flex justify-center gap-4">
          <Button
            onClick={() => setShowOffline(!showOffline)}
            variant="outline"
          >
            {showOffline ? "Hide" : "Show"} Offline Indicator
          </Button>
        </div>

        <div className="grid gap-12">
          {/* Validation Error */}
          <section className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Validation Error</h2>
            <ErrorDisplay
              type="validation"
              title="Invalid Input"
              message="Please check your form and correct the highlighted errors before submitting."
              action={{
                label: "Review Form",
                onClick: () => alert("Reviewing form..."),
              }}
            />
          </section>

          {/* Network Error */}
          <section className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Network Error</h2>
            <ErrorDisplay
              type="network"
              title="Connection Failed"
              message="Unable to connect to the server. Please check your internet connection and try again."
              action={{
                label: `Retry (${retryCount})`,
                onClick: () => {
                  setRetryCount(retryCount + 1);
                  alert("Retrying connection...");
                },
              }}
            />
          </section>

          {/* Empty State */}
          <section className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Empty State</h2>
            <EmptyState
              title="No Results Found"
              message="We couldn't find any items matching your search. Try adjusting your filters or search terms."
              action={{
                label: "Clear Filters",
                onClick: () => alert("Clearing filters..."),
              }}
            />
          </section>

          {/* System Error */}
          <section className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">System Error</h2>
            <ErrorDisplay
              type="system"
              title="500 - Internal Server Error"
              message="Something went wrong on our end. Our team has been notified and is working to fix the issue."
              action={{
                label: "Go Home",
                onClick: () => (window.location.href = "/"),
              }}
            />
          </section>

          {/* Custom Empty State with Illustration */}
          <section className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Custom Empty State
            </h2>
            <EmptyState
              title="No Events Yet"
              message="Start planning your Detty December adventure by browsing our exciting events."
              action={{
                label: "Browse Events",
                onClick: () => (window.location.href = "/events"),
              }}
              illustration={
                <div className="mb-6 flex items-center justify-center w-32 h-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}
