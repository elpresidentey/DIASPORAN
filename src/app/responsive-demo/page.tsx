'use client';

import { useState } from 'react';
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useOrientation,
  useViewport,
  useIsTouchDevice,
  useResponsiveValue,
} from '@/lib/responsive';
import {
  useSwipe,
  usePinch,
  useTap,
} from '@/lib/gestures';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ResponsiveDemoPage() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const orientation = useOrientation();
  const { width, height } = useViewport();
  const isTouch = useIsTouchDevice();

  const columns = useResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 3,
  });

  // Gesture states
  const [swipeDirection, setSwipeDirection] = useState<string>('None');
  const [pinchScale, setPinchScale] = useState<number>(1);
  const [tapCount, setTapCount] = useState<number>(0);

  // Gesture refs
  const swipeRef = useSwipe((direction) => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection('None'), 2000);
  });

  const pinchRef = usePinch((scale) => {
    setPinchScale(scale);
  });

  const tapRef = useTap(
    () => setTapCount((c) => c + 1),
    () => {
      setTapCount((c) => c + 2);
      alert('Double tap detected!');
    }
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Responsive Design Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Testing breakpoints, orientation, and touch gestures
          </p>
        </div>

        {/* Current State */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Current Viewport State
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-gray-400">Breakpoint:</p>
              <p className="text-xl font-semibold text-white">{breakpoint}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Dimensions:</p>
              <p className="text-xl font-semibold text-white">
                {width} × {height}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Orientation:</p>
              <p className="text-xl font-semibold text-white">{orientation}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Device Type:</p>
              <p className="text-xl font-semibold text-white">
                {isTouch ? 'Touch Device' : 'Non-Touch Device'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Responsive Columns:</p>
              <p className="text-xl font-semibold text-white">{columns}</p>
            </div>
          </div>
        </Card>

        {/* Breakpoint Indicators */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Breakpoint Detection
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isMobile
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <p className="font-semibold">Mobile</p>
              <p className="text-sm text-gray-400">&lt; 640px</p>
              <p className="text-xs mt-2">
                {isMobile ? '✓ Active' : '○ Inactive'}
              </p>
            </div>
            <div
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isTablet
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <p className="font-semibold">Tablet</p>
              <p className="text-sm text-gray-400">640px - 1024px</p>
              <p className="text-xs mt-2">
                {isTablet ? '✓ Active' : '○ Inactive'}
              </p>
            </div>
            <div
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isDesktop
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <p className="font-semibold">Desktop</p>
              <p className="text-sm text-gray-400">&gt; 1024px</p>
              <p className="text-xs mt-2">
                {isDesktop ? '✓ Active' : '○ Inactive'}
              </p>
            </div>
          </div>
        </Card>

        {/* Responsive Grid */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Responsive Grid Layout
          </h2>
          <p className="text-gray-400 mb-4">
            This grid adapts: 1 column on mobile, 2 on tablet, 3 on desktop
          </p>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30 text-center"
              >
                <p className="text-2xl font-bold">Item {num}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Touch Gestures */}
        {isTouch && (
          <Card variant="elevated" className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Touch Gesture Detection
            </h2>

            {/* Swipe */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Swipe Gesture</h3>
              <div
                ref={swipeRef as any}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-lg border-2 border-purple-500/30 text-center"
              >
                <p className="text-xl mb-2">Swipe in any direction</p>
                <p className="text-3xl font-bold text-purple-400">
                  {swipeDirection}
                </p>
              </div>
            </div>

            {/* Pinch */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Pinch Gesture</h3>
              <div
                ref={pinchRef as any}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-lg border-2 border-purple-500/30 text-center"
              >
                <p className="text-xl mb-2">Pinch to zoom</p>
                <div
                  className="inline-block transition-transform"
                  style={{ transform: `scale(${pinchScale})` }}
                >
                  <p className="text-3xl font-bold text-purple-400">
                    Scale: {pinchScale.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tap */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Tap Gesture (Single & Double)
              </h3>
              <div
                ref={tapRef as any}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-lg border-2 border-purple-500/30 text-center"
              >
                <p className="text-xl mb-2">Tap or double tap</p>
                <p className="text-3xl font-bold text-purple-400">
                  Taps: {tapCount}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Orientation Demo */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Orientation Handling
          </h2>
          <p className="text-gray-400 mb-4">
            Rotate your device to see the layout adapt
          </p>
          <div
            className={`flex gap-4 ${
              orientation === 'portrait' ? 'flex-col' : 'flex-row'
            }`}
          >
            <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30">
              <p className="font-semibold">Box 1</p>
              <p className="text-sm text-gray-400">
                {orientation === 'portrait' ? 'Stacked' : 'Side by side'}
              </p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-500/30">
              <p className="font-semibold">Box 2</p>
              <p className="text-sm text-gray-400">
                {orientation === 'portrait' ? 'Stacked' : 'Side by side'}
              </p>
            </div>
          </div>
        </Card>

        {/* Touch Target Size Demo */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Touch Target Sizes
          </h2>
          <p className="text-gray-400 mb-4">
            All interactive elements meet the 44×44px minimum for touch devices
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              size={isTouch ? 'default' : 'sm'}
              className={isTouch ? 'min-h-[44px] min-w-[44px]' : ''}
            >
              Touch Optimized
            </Button>
            <Button
              variant="secondary"
              size={isTouch ? 'default' : 'sm'}
              className={isTouch ? 'min-h-[44px] min-w-[44px]' : ''}
            >
              Button 2
            </Button>
            <Button
              variant="outline"
              size={isTouch ? 'default' : 'sm'}
              className={isTouch ? 'min-h-[44px] min-w-[44px]' : ''}
            >
              Button 3
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Testing Instructions
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <p className="font-semibold text-white">Resize Window:</p>
              <p>
                Resize your browser window to see breakpoint changes and
                responsive grid adaptation
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Rotate Device:</p>
              <p>
                On mobile/tablet, rotate your device to test orientation
                handling
              </p>
            </div>
            {isTouch && (
              <div>
                <p className="font-semibold text-white">Touch Gestures:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Swipe in any direction on the swipe box</li>
                  <li>Pinch to zoom on the pinch box</li>
                  <li>Tap or double tap on the tap box</li>
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}