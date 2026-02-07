'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XClose, Star01 } from '@untitledui/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateReview, useUpdateReview } from '@/services/queries/reviews';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/features/store';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queries/keys';
import { reviewService, restaurantService } from '@/services/api';
import {
  closeReviewModal,
  openReviewModal,
  resetReview,
  setReviewError,
  updateReviewData,
} from '@/features/review/reviewSlice';
import { z } from 'zod';
import { reviewSchema } from '@/lib/validations/review';

/**
 * Global Review Dialog
 */
export function ReviewDialog() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    isOpen,
    mode,
    restaurantId,
    restaurantName,
    transactionId,
    reviewId,
    menuIds,
    error,
    rating,
    comment,
  } = useAppSelector((state) => state.review);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const isEditMode = mode === 'edit';
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  // Prefetch restaurant page and data when modal opens
  React.useEffect(() => {
    if (isOpen && restaurantId) {
      // 1. Next.js router prefetch
      router.prefetch(`/resto/${restaurantId}`);

      // 2. TanStack Query prefetch
      const rId = String(restaurantId);
      queryClient.prefetchQuery({
        queryKey: queryKeys.restaurants.detail(rId),
        queryFn: () => restaurantService.getDetail(rId),
      });
      queryClient.prefetchQuery({
        queryKey: queryKeys.reviews.byRestaurant(rId),
        queryFn: () => reviewService.getRestaurantReviews(rId),
      });
    }
  }, [isOpen, restaurantId, queryClient, router]);

  const displayRating = hoverRating ?? rating;

  const handleRatingChange = (newRating: number) => {
    dispatch(updateReviewData({ rating: newRating }));
    if (error) dispatch(setReviewError(null));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateReviewData({ comment: e.target.value }));
    if (error) dispatch(setReviewError(null));
  };

  const handleSubmit = () => {
    if (!restaurantId || (!transactionId && !isEditMode)) return;

    try {
      // Validate with Zod
      reviewSchema.parse({ star: rating, comment });

      // Close modal IMMEDIATELY for optimistic UX
      dispatch(closeReviewModal());

      const targetReviewId = isEditMode ? reviewId : undefined;
      const highlightParam = targetReviewId
        ? `?highlight=${String(targetReviewId)}&t=${Date.now()}`
        : '';

      // Detect if we are already on the restaurant detail page
      const isAtRestoPage =
        globalThis.window?.location.pathname === `/resto/${restaurantId}`;

      // Navigate immediately
      const finalUrl = `/resto/${restaurantId}${highlightParam}${isAtRestoPage ? '' : '#reviews'}`;
      router.push(finalUrl, { scroll: false });

      // Reset form
      dispatch(resetReview());

      const mutationOptions = {
        onSuccess: (data: { id: string | number }) => {
          // For new reviews, update URL with the new review ID
          if (!isEditMode) {
            const newReviewId = data?.id;
            if (newReviewId) {
              const newUrl = `/resto/${restaurantId}?highlight=${String(newReviewId)}&t=${Date.now()}${isAtRestoPage ? '' : '#reviews'}`;
              router.replace(newUrl, { scroll: false });
            }
          }
        },
        onError: (err: unknown) => {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to submit review. Please try again.';

          // Reopen modal with error on failure
          dispatch(setReviewError(errorMessage));
          dispatch(
            openReviewModal({
              mode: isEditMode ? 'edit' : 'create',
              ...(isEditMode && reviewId ? { reviewId } : {}),
              restaurantId,
              restaurantName: restaurantName || '',
              ...(isEditMode ? { rating, comment } : {}),
              ...(transactionId ? { transactionId } : {}),
              ...(menuIds ? { menuIds } : {}),
            })
          );
        },
      };

      if (isEditMode && reviewId) {
        updateReview.mutate(
          {
            id: reviewId,
            restaurantId,
            payload: {
              star: rating,
              comment,
            },
          },
          mutationOptions
        );
      } else if (transactionId) {
        createReview.mutate(
          {
            transactionId,
            restaurantId,
            star: rating,
            comment,
            menuIds,
          },
          mutationOptions
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        dispatch(setReviewError(err.issues[0].message));
      }
    }
  };

  const isPending = createReview.isPending || updateReview.isPending;

  const getSubmitButtonContent = () => {
    if (isPending) {
      return (
        <div className='size-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
      );
    }
    return isEditMode ? 'Save Changes' : 'Submit Review';
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeReviewModal())}
    >
      <DialogContent
        showCloseButton={false}
        className='flex w-full max-w-[calc(100%-2rem)] flex-col items-center gap-4 rounded-2xl border-0 p-4 sm:max-w-110 md:gap-6 md:p-6'
      >
        {/* Header */}
        <div className='flex w-full items-center justify-between'>
          <DialogTitle className='md:text-display-xs text-xl font-extrabold text-neutral-950'>
            {isEditMode ? 'Edit Review' : 'Give Review'}
          </DialogTitle>
          <DialogClose asChild>
            <button
              type='button'
              className='cursor-pointer text-neutral-950 transition-opacity hover:opacity-70'
              aria-label='Close dialog'
            >
              <XClose className='size-6' strokeWidth={2} />
            </button>
          </DialogClose>
        </div>
        <DialogDescription className='sr-only'>
          {isEditMode
            ? 'Update your feedback'
            : 'Share your thoughts about our service'}
        </DialogDescription>
        {/* Rating Section */}
        <div className='flex w-full flex-col items-center justify-center'>
          <span className='md:text-md text-sm font-extrabold text-neutral-950'>
            Give Rating
          </span>
          <div className='flex items-center justify-center gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className='cursor-pointer active:scale-95'
              >
                <span className='sr-only'>{star} Stars</span>
                <Star01
                  className={cn(
                    'size-7 md:size-9',
                    star <= displayRating
                      ? 'fill-rating text-rating'
                      : 'fill-neutral-400 text-neutral-400'
                  )}
                  strokeWidth={0}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Error Message Section */}
        {error && (
          <div className='bg-brand-primary/10 w-full rounded-lg p-3 text-center'>
            <p className='text-brand-primary text-sm font-bold'>{error}</p>
          </div>
        )}

        {/* Comment Textarea */}
        <textarea
          id='review-comment'
          placeholder='Please share your thoughts about our service!'
          value={comment}
          onChange={handleCommentChange}
          className={cn(
            'md:text-md h-60 w-full resize-none rounded-xl border p-3 text-sm text-neutral-950 placeholder:text-neutral-500 focus:outline-none md:h-52',
            error
              ? 'border-brand-primary focus:border-brand-primary'
              : 'border-neutral-300 focus:border-neutral-400'
          )}
          aria-label='Review comment'
        />

        {/* Action Buttons */}
        <div className='flex w-full flex-col gap-2'>
          <Button
            className='bg-brand-primary hover:bg-brand-primary/90 text-md h-11 w-full rounded-full font-bold text-white md:h-12'
            onClick={handleSubmit}
            disabled={isPending}
          >
            {getSubmitButtonContent()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
