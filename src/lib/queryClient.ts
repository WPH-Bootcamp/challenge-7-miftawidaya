import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * @description Centralized query client with global default options.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Default 1 minute (safeguard)
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
