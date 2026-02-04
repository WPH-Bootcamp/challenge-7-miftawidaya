'use client';

import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

import type { MenuItem, Review } from '@/types';

/**
 * StarRating
 */
export function StarRating({
  rating,
  size = 'sm',
}: Readonly<{
  rating: number;
  size?: 'sm' | 'md';
}>) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon='ri:star-fill'
          className={cn(
            size === 'sm' ? 'size-4' : 'size-5',
            star <= rating ? 'text-rating' : 'text-neutral-200'
          )}
        />
      ))}
    </div>
  );
}

/**
 * MenuCard
 */
export function MenuCard({
  item,
  onAdd,
  quantity = 0,
  onIncrement,
  onDecrement,
  isLoading,
}: Readonly<{
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
  quantity?: number;
  onIncrement?: (item: MenuItem) => void;
  onDecrement?: (item: MenuItem) => void;
  isLoading?: boolean;
}>) {
  return (
    <div className='shadow-card flex flex-col overflow-hidden rounded-3xl bg-white transition-all hover:shadow-md'>
      {/* Image Area - 1:1 ratio */}
      <div className='relative aspect-square w-full overflow-hidden bg-neutral-100'>
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          className='object-cover'
          fallbackIconSize='md'
        />
      </div>

      {/* Content Area */}
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center justify-between gap-2'>
          {/* Left: Name + Price */}
          <div className='flex flex-col gap-0.5 overflow-hidden'>
            <h4 className='md:text-md line-clamp-1 text-sm font-medium text-neutral-950'>
              {item.name}
            </h4>
            <span className='text-md font-extrabold text-neutral-950 md:text-lg'>
              Rp{item.price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Right: Action Area */}
          <div className='h-9 w-28.5 shrink-0 md:h-10 md:w-30.75'>
            {quantity === 0 ? (
              <button
                type='button'
                onClick={() => onAdd?.(item)}
                disabled={isLoading}
                className='bg-brand-primary md:text-md flex size-full items-center justify-center rounded-full text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                Add
              </button>
            ) : (
              <div className='flex size-full items-center justify-between'>
                {/* Decrease Button */}
                <button
                  type='button'
                  onClick={() => onDecrement?.(item)}
                  disabled={isLoading}
                  className='flex size-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-950 transition-colors hover:bg-neutral-50 disabled:opacity-50 md:size-10'
                  aria-label='Decrease quantity'
                >
                  <Icon icon='ri:subtract-line' className='size-5 md:size-6' />
                </button>

                {/* Quantity Text */}
                <span className='text-md w-4 text-center font-bold text-neutral-950 md:text-lg'>
                  {quantity}
                </span>

                {/* Increase Button */}
                <button
                  type='button'
                  onClick={() => onIncrement?.(item)}
                  disabled={isLoading}
                  className='bg-brand-primary flex size-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:size-10'
                  aria-label='Increase quantity'
                >
                  <Icon icon='ri:add-line' className='size-5 md:size-6' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ReviewCard - displays user review with avatar, name, date, rating, and comment
 */
export function ReviewCard({ review }: Readonly<{ review: Review }>) {
  return (
    <div className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4'>
      {/* Header: Avatar + Info */}
      <div className='flex items-start gap-3'>
        {/* Avatar */}
        <div className='size-review-avatar-mobile md:size-review-avatar-desktop relative shrink-0 overflow-hidden rounded-full bg-neutral-100'>
          {review.userAvatar ? (
            <Image
              src={review.userAvatar}
              alt={review.userName}
              fill
              sizes='(max-width: 768px) 40px, 48px'
              className='object-cover'
            />
          ) : (
            <div className='flex size-full items-center justify-center bg-neutral-200'>
              <Icon icon='ri:user-line' className='size-6 text-neutral-400' />
            </div>
          )}
        </div>

        {/* Info: Name + Date */}
        <div className='flex flex-col'>
          <span className='text-md font-extrabold text-neutral-950 md:text-lg'>
            {review.userName}
          </span>
          <span className='md:text-md text-sm font-normal tracking-tight text-neutral-950'>
            {dayjs(review.date).format('D MMMM YYYY, HH:mm')}
          </span>
        </div>
      </div>

      {/* Content: Rating + Comment */}
      <div className='flex flex-col gap-2'>
        {/* Stars */}
        <div className='flex md:gap-0.5'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              icon='ri:star-fill'
              className={cn(
                'size-4.5',
                star <= review.rating ? 'text-rating' : 'text-neutral-200'
              )}
              aria-hidden='true'
            />
          ))}
        </div>

        {/* Comment */}
        <p className='md:text-md text-sm font-normal tracking-tight text-neutral-950'>
          {review.comment}
        </p>
      </div>
    </div>
  );
}
/**
 * MenuCardSkeleton
 */
export function MenuCardSkeleton() {
  return (
    <div className='shadow-card flex flex-col overflow-hidden rounded-3xl bg-white'>
      <div className='relative aspect-square w-full animate-pulse bg-neutral-100' />
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <div className='h-5 w-3/4 animate-pulse rounded bg-neutral-100' />
            <div className='h-6 w-1/2 animate-pulse rounded bg-neutral-100' />
          </div>
          <div className='h-9 w-28.5 animate-pulse rounded-full bg-neutral-100 md:h-10 md:w-30.75' />
        </div>
      </div>
    </div>
  );
}

/**
 * ReviewCardSkeleton
 */
export function ReviewCardSkeleton() {
  return (
    <div className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4'>
      <div className='flex items-start gap-3'>
        <div className='size-review-avatar-mobile md:size-review-avatar-desktop animate-pulse rounded-full bg-neutral-100' />
        <div className='flex flex-1 flex-col gap-2'>
          <div className='h-5 w-1/3 animate-pulse rounded bg-neutral-100' />
          <div className='h-4 w-1/2 animate-pulse rounded bg-neutral-100' />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='size-4 animate-pulse rounded bg-neutral-100'
            />
          ))}
        </div>
        <div className='h-4 w-full animate-pulse rounded bg-neutral-100' />
        <div className='h-4 w-2/3 animate-pulse rounded bg-neutral-100' />
      </div>
    </div>
  );
}
