import clsx from 'clsx';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
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
    <html lang='en'>
      <body className={clsx(nunito.variable, 'antialiased')}>{children}</body>
    </html>
  );
}
