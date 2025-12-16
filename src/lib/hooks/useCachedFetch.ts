import { useQuery } from '@tanstack/react-query';

interface FetchOptions {
    endpoint: string;
    params?: Record<string, string>;
    queryKey: string[];
    enabled?: boolean;
}

/**
 * Custom hook for fetching data with React Query
 * Provides automatic caching, background refetching, and instant loading
 */
export function useCachedFetch<T = any>(options: FetchOptions) {
    const { endpoint, params = {}, queryKey, enabled = true } = options;

    return useQuery({
        queryKey,
        queryFn: async (): Promise<T> => {
            const searchParams = new URLSearchParams(params);
            const url = `${endpoint}?${searchParams}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch from ${endpoint}`);
            }

            const data = await response.json();

            if (data.success) {
                // Handle both direct array and paginated response
                // Our APIs return: { success: true, data: { data: [...], pagination: {...} } }
                if (data.data && data.data.data && Array.isArray(data.data.data)) {
                    // Paginated response structure
                    return data.data.data as T;
                } else if (Array.isArray(data.data)) {
                    // Direct array response
                    return data.data as T;
                } else {
                    // Fallback to empty array
                    console.warn('Unexpected API response structure:', data);
                    return [] as T;
                }
            } else {
                throw new Error(data.error?.message || 'Failed to load data');
            }
        },
        enabled,
        staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
        gcTime: 30 * 60 * 1000, // 30 minutes - cache persists longer
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Use cached data instantly, don't refetch
        refetchOnReconnect: false, // Don't refetch on reconnect
    });
}
