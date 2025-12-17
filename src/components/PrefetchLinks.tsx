"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Component to prefetch important routes for faster navigation
 * This improves perceived performance by loading pages in the background
 */
export function PrefetchLinks() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch main navigation routes after initial page load
    const prefetchRoutes = () => {
      const routes = [
        "/flights",
        "/stays",
        "/events",
        "/transport",
        "/destinations",
        "/blog",
        "/currency",
        "/weather",
        "/safety",
      ];

      // Prefetch routes with a slight delay to not block initial render
      routes.forEach((route, index) => {
        setTimeout(() => {
          router.prefetch(route);
        }, 100 * (index + 1));
      });
    };

    // Start prefetching after page is idle
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(prefetchRoutes);
      } else {
        setTimeout(prefetchRoutes, 1000);
      }
    }
  }, [router]);

  return null;
}
