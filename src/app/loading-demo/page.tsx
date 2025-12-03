"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LoadingDemoPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setShowContent(false);
    setProgress(0);

    // Simulate progress over 4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setShowContent(true);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient-purple-pink">
            Loading State Components
          </h1>
          <p className="text-gray-400 text-lg">
            Comprehensive loading indicators for better user experience
          </p>
        </div>

        {/* Spinner Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Spinner Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Sizes</h3>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-sm text-gray-400">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="md" />
                    <span className="text-sm text-gray-400">Medium</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                    <span className="text-sm text-gray-400">Large</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Colors</h3>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="primary" />
                    <span className="text-sm text-gray-400">Primary</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="secondary" />
                    <span className="text-sm text-gray-400">Secondary</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="white" />
                    <span className="text-sm text-gray-400">White</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Loader Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Text Skeleton</h3>
                <div className="space-y-2">
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Circular Skeleton</h3>
                <div className="flex gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="circular" width={80} height={80} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Rectangular Skeleton</h3>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Card Skeleton</h3>
                <Skeleton variant="card" width="100%" height={300} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Animation Variants</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Pulse (default)</p>
                    <Skeleton variant="rectangular" width="100%" height={60} animation="pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Wave</p>
                    <Skeleton variant="rectangular" width="100%" height={60} animation="wave" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">None</p>
                    <Skeleton variant="rectangular" width="100%" height={60} animation="none" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Determinate Progress</h3>
                <div className="space-y-4">
                  <Progress value={25} showLabel label="Uploading files..." />
                  <Progress value={50} showLabel label="Processing data..." />
                  <Progress value={75} showLabel label="Almost done..." />
                  <Progress value={100} showLabel label="Complete!" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Indeterminate Progress</h3>
                <Progress indeterminate label="Loading..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Loading Flow Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Button onClick={simulateLoading} disabled={loading} variant="primary">
                {loading ? "Loading..." : "Start Loading Demo"}
              </Button>

              {loading && (
                <div className="space-y-6">
                  <Progress value={progress} showLabel label="Loading content..." />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton variant="circular" width={60} height={60} />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="60%" />
                      </div>
                    </div>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton variant="card" height={150} />
                      <Skeleton variant="card" height={150} />
                      <Skeleton variant="card" height={150} />
                    </div>
                  </div>
                </div>
              )}

              {showContent && !loading && (
                <div className="animate-fade-in-up space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Content Loaded Successfully!</h3>
                      <p className="text-gray-400">All data has been fetched and rendered.</p>
                    </div>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-gray-300">
                        This demonstrates the smooth transition from loading state to content.
                        The skeleton loaders match the layout of the actual content for a seamless experience.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Button Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>Button Loading States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>
                Loading...
              </Button>
              <Button variant="secondary" loading>
                Processing
              </Button>
              <Button variant="outline" loading>
                Submitting
              </Button>
              <Button variant="destructive" loading>
                Deleting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timing Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Loading State Timing Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Loading indicators appear within 100ms</p>
                  <p className="text-sm text-gray-400">Immediate feedback for user actions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Skeleton screens match content layout</p>
                  <p className="text-sm text-gray-400">Reduces perceived loading time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Interactive elements disabled during loading</p>
                  <p className="text-sm text-gray-400">Prevents duplicate actions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Smooth fade-in transitions to content</p>
                  <p className="text-sm text-gray-400">300ms transition duration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Progress indicators for operations &gt; 3 seconds</p>
                  <p className="text-sm text-gray-400">Shows estimated time or percentage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
