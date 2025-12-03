/**
 * Responsive Design System
 * Provides utilities and hooks for responsive behavior
 */

import { useEffect, useState, useCallback } from 'react';

// Breakpoint definitions (mobile < 640px, tablet 640-1024px, desktop > 1024px)
export const breakpoints = {
  mobile: 640,
  tablet: 1024,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

/**
 * Get current breakpoint based on window width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width < breakpoints.mobile) {
    return 'mobile';
  } else if (width < breakpoints.tablet) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Get current orientation
 */
export function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Hook to get current breakpoint
 * Updates when window is resized
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if current viewport matches a specific breakpoint
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to detect mobile devices
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.mobile - 1}px)`);
}

/**
 * Hook to detect tablet devices
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`
  );
}

/**
 * Hook to detect desktop devices
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.tablet}px)`);
}

/**
 * Hook to get current orientation
 * Updates when device orientation changes
 */
export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === 'undefined') return 'landscape';
    return getOrientation(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      setOrientation(getOrientation(window.innerWidth, window.innerHeight));
    };

    // Listen to both resize and orientationchange events
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Hook to get viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Hook for touch device detection
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
  }, []);

  return isTouch;
}

/**
 * Responsive value selector
 * Returns different values based on current breakpoint
 */
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop: T;
}): T {
  const breakpoint = useBreakpoint();

  if (breakpoint === 'mobile' && values.mobile !== undefined) {
    return values.mobile;
  }
  if (breakpoint === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  return values.desktop;
}

/**
 * Utility to generate responsive class names
 */
export function responsiveClass(
  base: string,
  responsive?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }
): string {
  if (!responsive) return base;

  const classes = [base];

  if (responsive.mobile) {
    classes.push(`max-sm:${responsive.mobile}`);
  }
  if (responsive.tablet) {
    classes.push(`sm:max-lg:${responsive.tablet}`);
  }
  if (responsive.desktop) {
    classes.push(`lg:${responsive.desktop}`);
  }

  return classes.join(' ');
}
