"use client";

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Prefetches data for key pages in the background
 * This makes navigation feel instant even on first visit
 */
export function DataPrefetcher() {
    const queryClient = useQueryClient();

    const prefetchData = useCallback(async () => {
        // Prefetch Events
        queryClient.prefetchQuery({
            queryKey: ['events', ''],
            queryFn: async () => {
                const response = await fetch('/api/events?limit=20');
                if (!response.ok) throw new Error('Failed to prefetch events');
                const data = await response.json();
                return Array.isArray(data.data) ? data.data : (data.data?.data || []);
            },
            staleTime: 5 * 60 * 1000,
        });

        // Prefetch Flights
        queryClient.prefetchQuery({
            queryKey: ['flights', ''],
            queryFn: async () => {
                const response = await fetch('/api/flights?limit=20');
                if (!response.ok) throw new Error('Failed to prefetch flights');
                const data = await response.json();
                return Array.isArray(data.data) ? data.data : (data.data?.data || []);
            },
            staleTime: 5 * 60 * 1000,
        });

        // Prefetch Stays
        queryClient.prefetchQuery({
            queryKey: ['stays', ''],
            queryFn: async () => {
                const response = await fetch('/api/stays?limit=20');
                if (!response.ok) throw new Error('Failed to prefetch stays');
                const data = await response.json();
                return Array.isArray(data.data) ? data.data : (data.data?.data || []);
            },
            staleTime: 5 * 60 * 1000,
        });

        console.log('✅ Prefetched data for Events, Flights, and Stays');
    }, [queryClient]);

    useEffect(() => {
        // Wait 2 seconds after page load, then prefetch
        const timer = setTimeout(() => {
            prefetchData();
        }, 2000);

        return () => clearTimeout(timer);
    }, [prefetchData]);

    return null; // This component doesn't render anything
}
