'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MarkerPin01, File05, ArrowCircleBrokenLeft } from '@untitledui/icons';

import { useLogout } from '@/services/queries/useAuth';
import { RootState } from '@/features/store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Navigation items for profile sidebar
 */
const NAV_ITEMS = [
  {
    href: '/profile',
    label: 'Delivery Address',
    icon: MarkerPin01,
  },
  {
    href: '/orders',
    label: 'My Orders',
    icon: File05,
  },
] as const;

type ProfileSidebarProps = Readonly<{
  className?: string;
}>;

/**
 * ProfileSidebar Component
 * @description Reusable sidebar for user profile pages (Orders, Delivery Address, Profile).
 * Displays user avatar, name, and navigation links.
 * Only visible on desktop (md breakpoint and above).
 */
export function ProfileSidebar({ className }: ProfileSidebarProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const logout = useLogout();

  if (!user) return null;

  return (
    <aside
      className={cn(
        'shadow-card hidden w-60 shrink-0 flex-col items-start justify-center gap-6 self-start rounded-2xl bg-white p-5 md:flex',
        className
      )}
    >
      {/* User Profile */}
      <Link
        href='/profile'
        className='group flex items-center gap-2 transition-colors'
      >
        <Avatar className='group-hover:ring-brand-primary size-12 transition-all group-hover:ring-2 group-hover:ring-offset-2'>
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback className='bg-brand-primary text-base-white text-sm'>
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className='group-hover:text-brand-primary text-lg font-bold tracking-tight text-neutral-950 transition-colors'>
          {user.name}
        </span>
      </Link>

      {/* Divider */}
      <div className='h-px w-full bg-neutral-200' />

      {/* Navigation */}
      <nav className='flex flex-col gap-6'>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex cursor-pointer items-center gap-2 transition-colors',
                isActive
                  ? 'text-brand-primary'
                  : 'text-neutral-950 hover:text-neutral-700'
              )}
            >
              <IconComponent className='size-6' strokeWidth={2} />
              <span className='text-md font-medium tracking-tight'>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          type='button'
          onClick={() => logout()}
          className='flex cursor-pointer items-center gap-2 text-neutral-950 transition-colors hover:text-neutral-700'
        >
          <ArrowCircleBrokenLeft className='size-6' strokeWidth={2} />
          <span className='text-md font-medium tracking-tight'>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
/**
 * ProfileSidebarSkeleton Component
 * @description Loading placeholder for ProfileSidebar to prevent layout shift.
 */
export function ProfileSidebarSkeleton({ className }: ProfileSidebarProps) {
  return (
    <div
      className={cn(
        'shadow-card hidden w-60 shrink-0 flex-col gap-6 rounded-2xl bg-white p-5 md:flex',
        className
      )}
    >
      <div className='flex items-center gap-2'>
        <Skeleton className='size-12 rounded-full' />
        <Skeleton className='h-6 w-24' />
      </div>
      <div className='h-px w-full bg-neutral-200' />
      <nav className='flex flex-col gap-6'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='flex items-center gap-2'>
            <Skeleton className='size-6 rounded-md' />
            <Skeleton className='h-5 w-32' />
          </div>
        ))}
      </nav>
    </div>
  );
}
