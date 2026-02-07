'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';

import { store } from '@/features/store';
import { queryClient } from '@/lib/queryClient';
import { CartSync } from '@/components/cart/CartSync';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { LocationProvider } from '@/context/LocationContext';

/**
 * Global App Providers
 * @description Wraps the application with necessary context providers (Redux, React Query).
 */
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <AuthInitializer>
            <CartSync />
            {children}
          </AuthInitializer>
        </LocationProvider>
        {/* React Query Devtools - Only visible in development */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
