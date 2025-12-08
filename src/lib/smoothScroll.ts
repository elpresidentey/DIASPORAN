/**
 * Custom smooth scroll utility with faster, configurable animation
 */

interface SmoothScrollOptions {
    duration?: number; // Duration in milliseconds
    offset?: number; // Offset from top (for fixed headers)
    easing?: (t: number) => number; // Easing function
}

/**
 * Easing function for smooth animation
 * Uses easeInOutCubic for a natural feel
 */
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Smoothly scroll to a target element or position
 */
export function smoothScrollTo(
    target: string | number | HTMLElement,
    options: SmoothScrollOptions = {}
): void {
    const {
        duration = 600, // Fast 600ms duration (default CSS is ~1000ms+)
        offset = 80, // Account for fixed navbar
        easing = easeInOutCubic,
    } = options;

    // Get target position
    let targetPosition: number;

    if (typeof target === 'number') {
        targetPosition = target;
    } else if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (!element) {
            console.warn(`Element not found: ${target}`);
            return;
        }
        targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    } else {
        targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easing(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

/**
 * Initialize smooth scroll for all anchor links on the page
 */
export function initSmoothScroll(options: SmoothScrollOptions = {}): () => void {
    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;

        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        // Check if target exists
        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        e.preventDefault();
        smoothScrollTo(href, options);

        // Update URL without jumping
        if (history.pushState) {
            history.pushState(null, '', href);
        } else {
            window.location.hash = href;
        }
    };

    document.addEventListener('click', handleClick);

    // Return cleanup function
    return () => {
        document.removeEventListener('click', handleClick);
    };
}

/**
 * Scroll to element on page load if hash is present
 */
export function scrollToHashOnLoad(options: SmoothScrollOptions = {}): void {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash) return;

    // Wait for page to fully load
    window.addEventListener('load', () => {
        setTimeout(() => {
            smoothScrollTo(hash, options);
        }, 100);
    });
}
