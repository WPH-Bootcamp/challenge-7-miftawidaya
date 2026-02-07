/**
 * Footer Component
 *
 * Provides site-wide navigation links, branding, and social media connectivity.
 * Implements a responsive multi-column layout for enhanced content discovery.
 */

'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Logo } from '@/components/icons';

const EXPLORE_LINKS = [
  { label: 'All Food', href: '/resto' },
  { label: 'Nearby', href: '/nearby' },
  { label: 'Discount', href: '/discount' },
  { label: 'Best Seller', href: '/best-seller' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'Lunch', href: '/lunch' },
];

const HELP_LINKS = [
  { label: 'How to Order', href: '/how-to-order' },
  { label: 'Payment Methods', href: '/payment-methods' },
  { label: 'Track My Order', href: '/track-order' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'ri:facebook-fill', href: '#' },
  { name: 'Instagram', icon: 'ri:instagram-line', href: '#' },
  { name: 'LinkedIn', icon: 'ri:linkedin-fill', href: '#' },
  { name: 'TikTok', icon: 'ri:tiktok-fill', href: '#' },
];

export function Footer() {
  return (
    <footer className='border-t border-neutral-300 bg-neutral-950 py-10 md:py-20'>
      <div className='custom-container mx-auto flex flex-col gap-6 md:flex-row md:justify-between md:gap-17'>
        {/* Brand & Description Column */}
        <div className='flex flex-col gap-10 md:w-95 md:shrink-0'>
          <div className='flex flex-col gap-5.5'>
            <Link href='/' className='flex items-center gap-4'>
              <Logo className='text-brand-primary size-10.5' />
              <span className='text-display-md font-extrabold text-white'>
                Foody
              </span>
            </Link>
            <p className='text-neutral-25 md:text-md text-sm leading-7 tracking-tight md:leading-7.5'>
              Enjoy homemade flavors & chef's signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              <span className='text-neutral-25 md:text-md text-sm font-bold md:font-extrabold'>
                Follow on Social Media
              </span>
            </div>
            <div className='flex gap-3'>
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className='hover:border-brand-primary hover:bg-brand-primary/10 group flex size-10 items-center justify-center rounded-full border border-neutral-800 transition-all'
                  aria-label={`Follow us on ${social.name}`}
                >
                  <Icon
                    icon={social.icon}
                    className='text-neutral-25 group-hover:text-brand-primary size-5 transition-colors'
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className='flex gap-4 md:gap-16'>
          {/* Explore Column */}
          <div className='flex flex-1 flex-col gap-4 md:w-50 md:flex-none md:gap-5'>
            <span className='text-neutral-25 md:text-md text-sm font-bold md:font-extrabold'>
              Explore
            </span>
            <ul className='flex flex-col gap-4'>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-neutral-25 md:text-md hover:text-brand-primary cursor-pointer text-sm transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div className='flex flex-1 flex-col gap-4 md:w-50 md:flex-none md:gap-5'>
            <span className='text-neutral-25 md:text-md text-sm font-bold md:font-extrabold'>
              Help
            </span>
            <ul className='flex flex-col gap-4'>
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-neutral-25 md:text-md hover:text-brand-primary cursor-pointer text-sm transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
