'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Restaurant } from '@/types';
import { ROUTES } from '@/config/routes';

type RestaurantCardProps = Readonly<{
  restaurant: Restaurant;
  className?: string;
}>;

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Link
      href={ROUTES.RESTAURANT_DETAIL(restaurant.id)}
      className={cn(
        'group shadow-card flex flex-row items-center gap-2 rounded-2xl bg-white p-3 transition-all hover:scale-[1.01] md:gap-3 md:p-4',
        className
      )}
    >
      {/* Thumbnail Container */}
      <div className='size-restaurant-thumb-mobile md:size-restaurant-thumb-desktop relative shrink-0 overflow-hidden rounded-xl bg-neutral-100'>
        <Image
          src={restaurant.image || '/images/placeholder.png'}
          alt={restaurant.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 90px, 120px'
        />
      </div>

      {/* Info Container */}
      <div className='me-2 flex min-w-0 flex-1 flex-col items-start gap-0.5'>
        {/* Restaurant Name */}
        <h3 className='text-md line-clamp-1 font-extrabold tracking-tight text-neutral-950 md:text-lg md:tracking-[-0.02em]'>
          {restaurant.name}
        </h3>

        {/* Rating Row */}
        <div className='flex items-center gap-1'>
          <Icon icon='ri:star-fill' className='text-rating size-6' />
          <span className='md:text-md text-sm font-medium text-neutral-950 md:tracking-[-0.03em]'>
            {restaurant.rating}
          </span>
        </div>

        {/* Location & Distance Row */}
        <div className='flex items-center gap-1.5'>
          <span className='md:text-md line-clamp-1 text-sm font-normal tracking-[-0.02em] text-neutral-950'>
            {restaurant.place}
          </span>
          <div className='size-0.5 shrink-0 rounded-full bg-neutral-950' />
          <span className='md:text-md shrink-0 text-sm font-normal tracking-[-0.02em] text-neutral-950'>
            {restaurant.distance} km
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className='shadow-card flex flex-row items-center gap-2 rounded-2xl bg-white p-3 md:gap-3 md:p-4'>
      <div className='size-restaurant-thumb-mobile md:size-restaurant-thumb-desktop shrink-0 animate-pulse rounded-xl bg-neutral-100' />
      <div className='flex flex-1 flex-col gap-2'>
        <div className='h-7 w-3/4 animate-pulse rounded bg-neutral-100' />
        <div className='h-6 w-1/4 animate-pulse rounded bg-neutral-100' />
        <div className='h-6 w-1/2 animate-pulse rounded bg-neutral-100' />
      </div>
    </div>
  );
}
