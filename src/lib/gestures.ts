/**
 * Touch Gesture Support
 * Provides utilities for handling touch gestures
 */

import { useEffect, useRef, useCallback } from 'react';

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchEvent {
  scale: number;
  center: { x: number; y: number };
}

export interface TapEvent {
  x: number;
  y: number;
  timestamp: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureHandlers {
  onSwipe?: (event: SwipeEvent) => void;
  onPinch?: (event: PinchEvent) => void;
  onTap?: (event: TapEvent) => void;
  onDoubleTap?: (event: TapEvent) => void;
  onLongPress?: (event: TapEvent) => void;
}

interface GestureOptions {
  swipeThreshold?: number; // Minimum distance for swipe (default: 50px)
  velocityThreshold?: number; // Minimum velocity for swipe (default: 0.3px/ms)
  doubleTapDelay?: number; // Max time between taps for double tap (default: 300ms)
  longPressDelay?: number; // Time to trigger long press (default: 500ms)
  pinchThreshold?: number; // Minimum scale change for pinch (default: 0.1)
}

const DEFAULT_OPTIONS: Required<GestureOptions> = {
  swipeThreshold: 50,
  velocityThreshold: 0.3,
  doubleTapDelay: 300,
  longPressDelay: 500,
  pinchThreshold: 0.1,
};

/**
 * Hook for handling touch gestures
 */
export function useGestures(
  handlers: GestureHandlers,
  options: GestureOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const lastTap = useRef<TapEvent | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  const getTouchPoint = useCallback((touch: Touch): TouchPoint => {
    return {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }, []);

  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getPinchDistance = useCallback((touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getPinchCenter = useCallback(
    (touches: TouchList): { x: number; y: number } => {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    },
    []
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = getTouchPoint(e.touches[0]);
        touchStart.current = touch;
        touchEnd.current = null;

        // Start long press timer
        if (handlers.onLongPress) {
          longPressTimer.current = setTimeout(() => {
            if (touchStart.current && !touchEnd.current) {
              handlers.onLongPress!({
                x: touch.x,
                y: touch.y,
                timestamp: touch.timestamp,
              });
            }
          }, opts.longPressDelay);
        }
      } else if (e.touches.length === 2) {
        // Pinch gesture start
        initialPinchDistance.current = getPinchDistance(e.touches);
        
        // Cancel long press
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
    },
    [handlers, opts.longPressDelay, getTouchPoint, getPinchDistance]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // Cancel long press on move
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (e.touches.length === 2 && handlers.onPinch && initialPinchDistance.current) {
        // Handle pinch gesture
        const currentDistance = getPinchDistance(e.touches);
        const scale = currentDistance / initialPinchDistance.current;

        if (Math.abs(scale - 1) > opts.pinchThreshold) {
          const center = getPinchCenter(e.touches);
          handlers.onPinch({ scale, center });
        }
      }
    },
    [handlers, opts.pinchThreshold, getPinchDistance, getPinchCenter]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Cancel long press
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!touchStart.current) return;

      if (e.changedTouches.length === 1) {
        const touch = getTouchPoint(e.changedTouches[0]);
        touchEnd.current = touch;

        const distance = getDistance(touchStart.current, touch);
        const duration = touch.timestamp - touchStart.current.timestamp;
        const velocity = duration > 0 ? distance / duration : 0;

        // Check for swipe
        if (
          handlers.onSwipe &&
          distance >= opts.swipeThreshold &&
          velocity >= opts.velocityThreshold
        ) {
          const dx = touch.x - touchStart.current.x;
          const dy = touch.y - touchStart.current.y;

          let direction: SwipeEvent['direction'];
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
          } else {
            direction = dy > 0 ? 'down' : 'up';
          }

          handlers.onSwipe({
            direction,
            distance,
            velocity,
            duration,
          });
        }
        // Check for tap
        else if (distance < opts.swipeThreshold) {
          const tapEvent: TapEvent = {
            x: touch.x,
            y: touch.y,
            timestamp: touch.timestamp,
          };

          // Check for double tap
          if (
            handlers.onDoubleTap &&
            lastTap.current &&
            touch.timestamp - lastTap.current.timestamp < opts.doubleTapDelay
          ) {
            handlers.onDoubleTap(tapEvent);
            lastTap.current = null;
          } else {
            if (handlers.onTap) {
              handlers.onTap(tapEvent);
            }
            lastTap.current = tapEvent;
          }
        }
      }

      // Reset pinch
      initialPinchDistance.current = null;
      touchStart.current = null;
    },
    [handlers, opts, getTouchPoint, getDistance]
  );

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return ref;
}

/**
 * Hook for simple swipe detection
 */
export function useSwipe(
  onSwipe: (direction: SwipeEvent['direction']) => void,
  options?: GestureOptions
) {
  return useGestures(
    {
      onSwipe: (event) => onSwipe(event.direction),
    },
    options
  );
}

/**
 * Hook for pinch zoom detection
 */
export function usePinch(
  onPinch: (scale: number) => void,
  options?: GestureOptions
) {
  return useGestures(
    {
      onPinch: (event) => onPinch(event.scale),
    },
    options
  );
}

/**
 * Hook for tap detection
 */
export function useTap(
  onTap: () => void,
  onDoubleTap?: () => void,
  options?: GestureOptions
) {
  return useGestures(
    {
      onTap: () => onTap(),
      onDoubleTap: onDoubleTap ? () => onDoubleTap() : undefined,
    },
    options
  );
}
