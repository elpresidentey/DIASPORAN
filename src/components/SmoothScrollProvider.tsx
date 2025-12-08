"use client";

import { useEffect, ReactNode } from 'react';
import { initSmoothScroll, scrollToHashOnLoad } from '@/lib/smoothScroll';

interface SmoothScrollProviderProps {
    children: ReactNode;
    duration?: number;
    offset?: number;
}

/**
 * Provider component that initializes smooth scrolling for the entire app
 * Uses faster JavaScript-based scrolling instead of CSS scroll-behavior
 */
export function SmoothScrollProvider({
    children,
    duration = 600, // Fast 600ms (vs CSS default ~1000ms+)
    offset = 80
}: SmoothScrollProviderProps) {
    useEffect(() => {
        // Initialize smooth scroll for all anchor links
        const cleanup = initSmoothScroll({ duration, offset });

        // Scroll to hash on initial load
        scrollToHashOnLoad({ duration, offset });

        // Cleanup on unmount
        return cleanup;
    }, [duration, offset]);

    return <>{children}</>;
}
