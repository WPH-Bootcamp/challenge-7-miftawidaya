import * as React from 'react';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { Providers } from './providers';
import { MainLayout } from '@/components/layout/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Foody | Discover the Best Restaurants Near You',
    template: '%s | Foody',
  },
  description:
    "Homemade flavors & chef's signature dishes, freshly prepared daily. Order online or find the nearest Foody restaurant.",
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={nunito.variable} suppressHydrationWarning>
      <body className='font-sans antialiased' suppressHydrationWarning>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
