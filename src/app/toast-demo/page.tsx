"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Toast Notification Demo</h1>
          <p className="text-gray-400">
            Test the toast notification system with different variants and features.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Basic Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="success"
              onClick={() =>
                addToast({
                  type: "success",
                  title: "Success!",
                  message: "Your action was completed successfully.",
                })
              }
            >
              Show Success Toast
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                addToast({
                  type: "error",
                  title: "Error occurred",
                  message: "Something went wrong. Please try again.",
                })
              }
            >
              Show Error Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  type: "warning",
                  title: "Warning",
                  message: "Please review your input before proceeding.",
                })
              }
            >
              Show Warning Toast
            </Button>

            <Button
              variant="primary"
              onClick={() =>
                addToast({
                  type: "info",
                  title: "Information",
                  message: "Here's some helpful information for you.",
                })
              }
            >
              Show Info Toast
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Toast with Action</h2>
          <Button
            variant="primary"
            onClick={() =>
              addToast({
                type: "info",
                title: "Update available",
                message: "A new version is ready to install.",
                action: {
                  label: "Update now",
                  onClick: () => alert("Updating..."),
                },
              })
            }
          >
            Show Toast with Action
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Custom Duration</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  type: "info",
                  title: "Quick message",
                  message: "This will disappear in 2 seconds.",
                  duration: 2000,
                })
              }
            >
              2 Second Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  type: "info",
                  title: "Persistent message",
                  message: "This will stay for 10 seconds.",
                  duration: 10000,
                })
              }
            >
              10 Second Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                addToast({
                  type: "info",
                  title: "Manual dismiss only",
                  message: "This won't auto-dismiss. Close it manually or press Escape.",
                  duration: 0,
                })
              }
            >
              No Auto-Dismiss
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Stacking Test</h2>
          <Button
            variant="primary"
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                setTimeout(() => {
                  addToast({
                    type: "info",
                    title: `Toast ${i}`,
                    message: `This is toast number ${i}. Max 3 visible at once.`,
                  });
                }, i * 300);
              }
            }}
          >
            Show 5 Toasts (Max 3 Visible)
          </Button>
        </div>

        <div className="space-y-4 border border-white/10 rounded-lg p-6 bg-white/5">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Four variants: success, error, warning, info</li>
            <li>✓ ARIA live regions for screen reader announcements</li>
            <li>✓ Auto-dismiss with configurable duration</li>
            <li>✓ Swipe to dismiss on mobile (drag horizontally)</li>
            <li>✓ Press Escape key to dismiss all toasts</li>
            <li>✓ Maximum 3 toasts visible at once</li>
            <li>✓ Optional action buttons</li>
            <li>✓ Smooth animations with Framer Motion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
