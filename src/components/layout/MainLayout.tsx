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

type MainLayoutProps = Readonly<PropsWithChildren>;

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isCheckoutSuccessPage = pathname === '/checkout/success';

  // Pages that should not have Navbar and Footer
  if (isAuthPage || isCheckoutSuccessPage) {
    return <main className='min-h-screen'>{children}</main>;
  }

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Navbar />
      <main className='grow'>{children}</main>
      <Footer />
    </div>
  );
}
