/**
 * Single shared QueryClient for the app. Kept in its own module so both the
 * provider and any imperative cache access (e.g. clearing on sign-out) use the
 * same instance.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
