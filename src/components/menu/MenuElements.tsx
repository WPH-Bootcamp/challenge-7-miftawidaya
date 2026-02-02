'use client';

import * as React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MenuItem, Review } from '@/types';

/**
 * StarRating
 */
export function StarRating({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'md';
}) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          icon='ri:star-fill'
          className={cn(
            size === 'sm' ? 'size-4' : 'size-5',
            i < Math.floor(rating) ? 'text-rating' : 'text-neutral-200'
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
}: {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}) {
  return (
    <div className='flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md'>
      <div className='relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:size-24'>
        <Image
          src={item.image || '/images/placeholder.png'}
          alt={item.name}
          fill
          className='object-cover'
        />
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex items-start justify-between gap-2'>
          <h4 className='md:text-md text-sm font-bold text-neutral-950'>
            {item.name}
          </h4>
          <span className='text-sm font-extrabold text-neutral-950'>
            Rp {item.price.toLocaleString('id-ID')}
          </span>
        </div>
        <p className='line-clamp-2 text-xs text-neutral-500'>
          {item.description}
        </p>
        <button
          onClick={() => onAdd?.(item)}
          className='text-brand-primary mt-1 self-start text-xs font-bold hover:underline'
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}

/**
 * ReviewCard
 */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-neutral-100 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative size-10 overflow-hidden rounded-full bg-neutral-100'>
            {review.userAvatar && review.userAvatar !== '' && (
              <Image src={review.userAvatar} alt={review.userName} fill />
            )}
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-neutral-950'>
              {review.userName}
            </span>
            <span className='text-xs text-neutral-500'>{review.date}</span>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className='text-sm leading-6 text-neutral-600'>{review.comment}</p>
    </div>
  );
}
