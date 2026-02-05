'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import { RootState } from '@/features/store';
import { Button } from '@/components/ui/button';
import { ProfileSidebar } from '@/components/user/ProfileSidebar';

/**
 * ProfileInfoRow - Displays a label-value pair for profile information
 */
function ProfileInfoRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | undefined;
}>) {
  return (
    <div className='flex h-7 items-center justify-between md:h-7.5'>
      <span className='text-md font-medium tracking-[-0.03em] text-neutral-950 md:text-lg'>
        {label}
      </span>
      <span className='text-md font-bold tracking-[-0.02em] text-neutral-950 md:text-lg'>
        {value || '-'}
      </span>
    </div>
  );
}

/**
 * ProfilePage Component
 * @description User profile page showing personal information with sidebar on desktop
 */
export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <div className='custom-container mx-auto flex flex-col gap-6 py-20 md:flex-row md:items-start md:gap-8 md:py-32'>
      {/* Desktop Sidebar - Hidden on mobile */}
      <ProfileSidebar />

      {/* Main Content (Frame 72) */}
      <div className='flex min-w-0 flex-1 grow flex-col gap-6 md:max-w-131'>
        {/* Page Title (Profile) */}
        <h1 className='text-display-xs md:text-display-lg leading-9 font-extrabold text-neutral-950 md:leading-10.5'>
          Profile
        </h1>

        {/* Profile Card (Frame 71) */}
        <div className='shadow-card flex w-full flex-col gap-6 rounded-2xl bg-white p-4 md:p-[20px]'>
          {/* Profile Info Wrapper (Frame 70) */}
          <div className='flex w-full flex-col gap-3 md:gap-3'>
            {/* Avatar (Ellipse 3) */}
            <div className='relative size-16 shrink-0 overflow-hidden rounded-full'>
              {user.avatar && user.avatar !== '' ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='flex size-full items-center justify-center bg-neutral-200 text-xl font-bold text-neutral-500'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info Rows (Frame 53, 54, 55) */}
            <ProfileInfoRow label='Name' value={user.name} />
            <ProfileInfoRow label='Email' value={user.email} />
            <ProfileInfoRow label='Nomor Handphone' value={user.phone} />
          </div>

          {/* Update Button (Button) */}
          <Button className='bg-brand-primary hover:bg-brand-primary/90 h-11 w-full rounded-full text-base font-bold text-neutral-50'>
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
