'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState, useMemo } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes (reduces unnecessary API calls during navigation)
            staleTime: 5 * 60 * 1000,
            // Cache is kept for 24 hours
            gcTime: 24 * 60 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const persister = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createSyncStoragePersister({
      storage: window.localStorage,
      key: 'REALESTWAY_QUERY_CACHE',
    });
  }, []);

  if (persister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ 
          persister,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }}
      >
        {children}
      </PersistQueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
