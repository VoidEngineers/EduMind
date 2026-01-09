import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryProviderProps } from './types';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache data for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
        },
        mutations: {
            // Retry mutations once
            retry: 1,
        },
    },
});


/**
 * React Query Provider
 * Wraps the app with QueryClientProvider for data fetching and caching
 */
export function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Show React Query DevTools in development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
