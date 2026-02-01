'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: Readonly<AuthLayoutProps>) {
  return (
    <div className='relative flex min-h-screen w-full bg-white font-sans'>
      {/* Left Column (Desktop) - Background Image */}
      <div className='relative hidden w-1/2 md:block'>
        <Image
          src='/images/bg-auth.jpg'
          alt='Auth Background'
          fill
          className='object-cover object-center'
          priority
        />
      </div>

      {/* Right Column / Mobile Container */}
      <div className='flex w-full flex-col items-center px-6 py-10 md:w-1/2 md:justify-center md:px-20 lg:px-30'>
        <div
          className={cn(
            'flex w-full max-w-86.25 flex-col gap-4 md:max-w-93.5 md:gap-5',
            className
          )}
        >
          {/* Logo Section */}
          <Link href='/' className='flex items-center gap-3 md:gap-4'>
            <Logo className='text-brand-primary size-8 md:size-10.5' />
            <span className='text-display-xs md:text-display-md font-extrabold text-neutral-950'>
              Foody
            </span>
          </Link>

          {/* Welcome Section */}
          <div className='flex flex-col gap-1 md:gap-1.5'>
            <h1 className='text-display-xs md:text-display-sm font-extrabold text-neutral-950'>
              {title}
            </h1>
            <p className='md:text-md text-sm leading-loose font-medium text-neutral-950'>
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
