'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <div className='custom-container mx-auto flex flex-col items-center gap-10 py-32'>
      <div className='flex w-full max-w-2xl flex-col gap-10 rounded-3xl border border-neutral-100 bg-white p-10 shadow-sm'>
        <div className='flex flex-col items-center gap-6'>
          <div className='relative size-32 overflow-hidden rounded-full border-4 border-neutral-50'>
            {user.avatar && user.avatar !== '' ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className='object-cover'
              />
            ) : (
              <div className='text-display-xs flex h-full w-full items-center justify-center bg-neutral-100 font-bold text-neutral-400'>
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className='text-center'>
            <h1 className='text-display-xs font-extrabold text-neutral-950'>
              {user.name}
            </h1>
            <p className='text-md text-neutral-500'>{user.email}</p>
          </div>
        </div>

        <div className='flex flex-col gap-6 font-semibold'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-600'>Full Name</label>
            <Input defaultValue={user.name} className='h-12 rounded-xl' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-600'>Email Address</label>
            <Input
              defaultValue={user.email}
              disabled
              className='h-12 rounded-xl bg-neutral-50'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-600'>Phone Number</label>
            <Input defaultValue={user.phone} className='h-12 rounded-xl' />
          </div>

          <Button className='text-md mt-4 h-14 rounded-full font-bold'>
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
