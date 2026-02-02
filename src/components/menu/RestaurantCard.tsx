'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Restaurant } from '@/types';
import { ROUTES } from '@/config/routes';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Link
      href={ROUTES.RESTAURANT_DETAIL(restaurant.id)}
      className={cn(
        'group flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 transition-all hover:shadow-lg',
        className
      )}
    >
      {/* Image Container */}
      <div className='relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100'>
        <Image
          src={restaurant.image || '/images/placeholder.png'}
          alt={restaurant.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, 300px'
        />
      </div>

      {/* Info */}
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-md line-clamp-1 font-bold text-neutral-950'>
            {restaurant.name}
          </h3>
          <div className='flex shrink-0 items-center gap-1'>
            <Icon icon='ri:star-fill' className='text-rating size-4' />
            <span className='text-xs font-bold text-neutral-950'>
              {restaurant.rating}
            </span>
          </div>
        </div>

        <p className='line-clamp-1 text-xs font-medium text-neutral-500'>
          {restaurant.place} • {restaurant.distance} km
        </p>
      </div>
    </Link>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm'>
      <div className='aspect-square w-full animate-pulse rounded-xl bg-neutral-100' />
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <div className='h-5 w-3/4 animate-pulse rounded bg-neutral-100' />
          <div className='h-5 w-1/8 animate-pulse rounded bg-neutral-100' />
        </div>
        <div className='h-4 w-1/2 animate-pulse rounded bg-neutral-100' />
      </div>
    </div>
  );
}
