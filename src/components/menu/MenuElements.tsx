'use client';

import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import Image from 'next/image';

import { cn } from '@/lib/utils';

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
}: Readonly<{
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}>) {
  return (
    <div className='shadow-card flex flex-col overflow-hidden rounded-3xl bg-white transition-all hover:shadow-md'>
      {/* Image Area - 1:1 ratio */}
      <div className='relative aspect-square w-full overflow-hidden bg-neutral-100'>
        <Image
          src={item.image || '/images/placeholder.png'}
          alt={item.name}
          fill
          className='object-cover'
        />
      </div>

      {/* Content Area */}
      <div className='flex flex-col gap-3 p-4'>
        {/* Desktop: Name+Price LEFT, Button RIGHT vertically centered */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h4 className='md:text-md line-clamp-1 text-sm font-medium text-neutral-950'>
              {item.name}
            </h4>
            <span className='text-md font-extrabold text-neutral-950 md:text-lg'>
              Rp{item.price.toLocaleString('id-ID')}
            </span>
          </div>
          {/* Desktop button */}
          <button
            type='button'
            onClick={() => onAdd?.(item)}
            className='bg-brand-primary text-md hidden h-10 w-20 shrink-0 items-center justify-center rounded-full font-bold tracking-tight text-white transition-opacity hover:opacity-90 md:flex'
          >
            Add
          </button>
        </div>

        {/* Mobile button - full width */}
        <button
          type='button'
          onClick={() => onAdd?.(item)}
          className='bg-brand-primary flex h-9 w-full items-center justify-center rounded-full text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-90 md:hidden'
        >
          Add
        </button>
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
