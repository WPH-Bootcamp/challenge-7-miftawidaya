/**
 * MainLayout Component
 *
 * The primary shell of the application, incorporating the Navbar and Footer.
 * Handles the main scrollable area and provides a consistent structure for pages.
 */

'use client';

import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ReviewDialog } from '@/components/orders/ReviewDialog';

type MainLayoutProps = Readonly<PropsWithChildren>;

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isCheckoutSuccessPage = pathname === '/checkout/success';

  return (
    <div className='relative flex min-h-screen flex-col'>
      {!isAuthPage && !isCheckoutSuccessPage && <Navbar />}
      <main className='grow'>{children}</main>
      {!isAuthPage && !isCheckoutSuccessPage && <Footer />}
      <ReviewDialog />
    </div>
  );
}
