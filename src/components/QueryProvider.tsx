"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
                        gcTime: 10 * 60 * 1000, // Cache for 10 minutes
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        refetchOnMount: false, // Don't refetch on component mount if data exists
                        retry: 1, // Only retry once on failure
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
