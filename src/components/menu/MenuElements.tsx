'use client';

import { Icon } from '@iconify/react';
import { Pencil02, Trash03 } from '@untitledui/icons';
import dayjs from 'dayjs';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

import { QuantityControl } from '@/components/cart/QuantityControl';
import { useAppDispatch, useAppSelector } from '@/features/store';
import { openReviewModal } from '@/features/review/reviewSlice';
import { useDeleteReview } from '@/services/queries/reviews';
import type { MenuItem, Review } from '@/types';
import React from 'react';

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
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2'>
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
          <div className='h-9 w-full shrink-0 md:h-10 md:w-30.75'>
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
              <QuantityControl
                quantity={quantity}
                onIncrement={() => onIncrement?.(item)}
                onDecrement={() => onDecrement?.(item)}
                isUpdating={isLoading}
                size='md'
                className='size-full justify-start gap-4'
              />
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
export function ReviewCard({
  review,
  restaurantId,
  restaurantName,
  highlighted = false,
}: Readonly<{
  review: Review;
  restaurantId?: string | number;
  restaurantName?: string;
  highlighted?: boolean;
}>) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const deleteReview = useDeleteReview();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [shouldAnimate, setShouldAnimate] = React.useState(highlighted);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const isOwner = currentUser && String(currentUser.id) === review.userId;

  // Force animation restart when highlighted changes
  React.useEffect(() => {
    if (highlighted && cardRef.current) {
      // Remove animation class
      setShouldAnimate(false);
      // Force reflow
      const _reflow = cardRef.current.offsetHeight;
      // Re-add animation class
      requestAnimationFrame(() => {
        setShouldAnimate(true);
      });
    }
  }, [highlighted]);

  const handleEdit = () => {
    if (!restaurantId || !restaurantName) return;
    dispatch(
      openReviewModal({
        mode: 'edit',
        reviewId: review.id,
        restaurantId,
        restaurantName,
        rating: review.rating,
        comment: review.comment,
      })
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      !restaurantId ||
      !globalThis.confirm('Are you sure you want to delete this review?')
    )
      return;

    // Start disappearing animation
    setIsDeleting(true);

    // Wait for animation then delete (500ms matches --animate-highlight-delete)
    setTimeout(() => {
      deleteReview.mutate({
        id: review.id,
        restaurantId,
      });
    }, 500);
  };

  return (
    <div
      ref={cardRef}
      key={`review-${review.id}-${highlighted ? 'hl' : 'normal'}`}
      id={`review-${review.id}`}
      className={cn(
        'shadow-card flex flex-col gap-4 rounded-2xl p-4 transition-all duration-300',
        !shouldAnimate && !isDeleting && 'bg-white',
        isDeleting && 'animate-highlight-delete pointer-events-none',
        shouldAnimate && !isDeleting && 'animate-highlight-reveal'
      )}
    >
      {/* Header: Avatar + Info + Actions */}
      <div className='flex items-start justify-between gap-3'>
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

        {/* Action Buttons (Owner only) */}
        {isOwner && (
          <div className='flex items-center gap-1 md:gap-2'>
            <button
              onClick={handleEdit}
              className='hover:text-brand-primary cursor-pointer p-1 text-neutral-400 transition-colors'
              aria-label='Edit review'
            >
              <Pencil02 className='size-4.5' />
            </button>
            <button
              onClick={handleDelete}
              className='hover:text-brand-primary cursor-pointer p-1 text-neutral-400 transition-colors'
              aria-label='Delete review'
              disabled={deleteReview.isPending}
            >
              <Trash03 className='size-4.5' />
            </button>
          </div>
        )}
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
