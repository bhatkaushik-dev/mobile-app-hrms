/**
 * React Query provider. Wraps the app with the shared QueryClient so any hook
 * (mutations today, cached queries as more modules are ported) can run.
 */
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../api/core/queryClient';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
