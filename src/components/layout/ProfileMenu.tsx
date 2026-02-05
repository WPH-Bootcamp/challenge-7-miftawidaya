/**
 * ProfileMenu Component
 *
 * A dropdown menu offering quick access to user account management and settings.
 * Displays user overview along with links for tracking orders and profile details.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MarkerPin01, File05, ArrowCircleBrokenLeft } from '@untitledui/icons';
import { useLogout } from '@/services/queries/useAuth';
import { cn } from '@/lib/utils';

type ProfileMenuProps = Readonly<{
  /** User display name */
  name: string;
  /** User avatar URL */
  avatarUrl?: string;
  /** Whether the parent header is in a scrolled (solid) state */
  isScrolled?: boolean;
}>;

export function ProfileMenu({
  name,
  avatarUrl,
  isScrolled = false,
}: ProfileMenuProps) {
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='group flex cursor-pointer items-center gap-3 outline-hidden'>
          <Avatar className='group-hover:ring-brand-primary size-10 transition-all group-hover:ring-2 group-hover:ring-offset-2 md:size-12'>
            <AvatarImage src={avatarUrl || undefined} alt={name} />
            <AvatarFallback className='bg-brand-primary text-base-white'>
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              'duration-header hidden text-lg font-semibold transition-colors md:block',
              isScrolled
                ? 'group-hover:text-brand-primary text-neutral-950'
                : 'text-base-white group-hover:text-brand-primary'
            )}
          >
            {name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-dropdown z-dropdown shadow-card flex flex-col gap-3 rounded-2xl border-none p-4'
        align='end'
        sideOffset={12}
      >
        <DropdownMenuLabel className='p-0'>
          <Link
            href='/profile'
            className='hover:text-brand-primary group flex items-center gap-2 p-0 outline-hidden transition-colors'
          >
            <Avatar className='group-hover:ring-brand-primary size-9 transition-all group-hover:ring-2 group-hover:ring-offset-2'>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className='bg-brand-primary text-base-white text-xs'>
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className='text-md font-bold tracking-tight'>{name}</span>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='mx-0 my-0 h-px bg-neutral-200' />
        <div className='flex flex-col gap-3'>
          <DropdownMenuItem
            asChild
            className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-950'
          >
            <Link href='/profile'>
              <MarkerPin01 className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium'>Delivery Address</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-900'
          >
            <Link href='/orders'>
              <File05 className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium'>My Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-950'
            onSelect={() => logout()}
          >
            <ArrowCircleBrokenLeft className='size-5' strokeWidth={2} />
            <span className='text-sm font-medium'>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
