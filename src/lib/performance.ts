/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure a function is called at most once in a specified time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load a component with a minimum display time for loading state
 * This prevents flash of loading state for fast connections
 */
export async function lazyLoadWithMinDelay<T>(
  importFunc: () => Promise<T>,
  minDelay: number = 200
): Promise<T> {
  const [module] = await Promise.all([
    importFunc(),
    new Promise((resolve) => setTimeout(resolve, minDelay)),
  ]);
  return module;
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Measure and log performance metrics
 */
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined' || !window.performance) {
    fn();
    return;
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-measure`;

  performance.mark(startMark);
  fn();
  performance.mark(endMark);

  try {
    performance.measure(measureName, startMark, endMark);
    const measure = performance.getEntriesByName(measureName)[0];
    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
  } catch (e) {
    // Silently fail if performance API is not available
  }
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if the device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get connection speed estimate
 */
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'medium';
  }

  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;

  if (effectiveType === '4g') return 'fast';
  if (effectiveType === '3g') return 'medium';
  return 'slow';
}
