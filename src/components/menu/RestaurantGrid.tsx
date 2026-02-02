'use client';

import * as React from 'react';
import { RestaurantCard, RestaurantCardSkeleton } from './RestaurantCard';
import { Restaurant } from '@/types';
import { cn } from '@/lib/utils';

interface RestaurantGridProps {
  restaurants?: Restaurant[];
  isLoading?: boolean;
  className?: string;
  columns?: number;
}

export function RestaurantGrid({
  restaurants,
  isLoading,
  className,
  columns = 3,
}: Readonly<RestaurantGridProps>) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4 md:gap-5',
          columns === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2',
          className
        )}
      >
        {['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'].map((id) => (
          <RestaurantCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (!restaurants?.length) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <p className='text-lg font-bold text-neutral-950'>
          No restaurant found
        </p>
        <p className='text-sm text-neutral-500'>
          Try adjusting your filters or search.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4 md:gap-5',
        columns === 3
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
        className
      )}
    >
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
