import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/api';
import { Review } from '@/types';
import { queryKeys } from './keys';

/**
 * Hook to fetch reviews for a specific restaurant
 */
export const useRestaurantReviews = (
  restaurantId: string,
  params?: Record<string, unknown>
) => {
  return useQuery<Review[]>({
    queryKey: queryKeys.reviews.byRestaurant(restaurantId, params),
    queryFn: () => reviewService.getRestaurantReviews(restaurantId, params),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep data while fetching new page
  });
};

/**
 * Hook to fetch reviews by current user
 */
export const useMyReviews = (enabled = true) => {
  return useQuery<Review[]>({
    queryKey: [...queryKeys.reviews.all, 'mine'],
    queryFn: reviewService.getMyReviews,
    enabled,
  });
};

/**
 * Hook to create a new restaurant review
 * @description Invalidates the specific restaurant detail and order history to reflect the new review.
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.create,
    onSuccess: (_, variables) => {
      // Invalidate the restaurant's reviews list (all variations)
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.reviews.all,
          'restaurant',
          String(variables.restaurantId),
        ],
      });
      // Invalidate my reviews - critical for My Orders page to update
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.reviews.all, 'mine'],
      });
      // Invalidate orders as reviews are usually linked to past orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};

/**
 * Hook to update an existing review
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: { star: number; comment: string };
      restaurantId: string | number;
    }) => reviewService.update(id, payload),
    onMutate: async ({ id, payload, restaurantId }) => {
      // Cancel outgoing refetches
      const queryKey = [
        ...queryKeys.reviews.all,
        'restaurant',
        String(restaurantId),
      ];
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousReviews = queryClient.getQueryData<Review[]>(queryKey);

      // Optimistically update
      if (previousReviews) {
        queryClient.setQueryData<Review[]>(
          queryKey,
          previousReviews.map((r) =>
            r.id === String(id)
              ? { ...r, rating: payload.star, comment: payload.comment }
              : r
          )
        );
      }

      return { previousReviews, queryKey };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousReviews) {
        queryClient.setQueryData(context.queryKey, context.previousReviews);
      }
    },
    onSettled: (_, _error, variables) => {
      // Invalidate the specific restaurant detail to show updated rating/count
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.detail(String(variables.restaurantId)),
      });
      // Invalidate the restaurant's reviews list (all variations)
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.reviews.all,
          'restaurant',
          String(variables.restaurantId),
        ],
      });
      // Invalidate my reviews for consistency
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.reviews.all, 'mine'],
      });
    },
  });
};

/**
 * Hook to delete a review with optimistic UI
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string | number;
      restaurantId: string | number;
    }) => reviewService.delete(id),
    onMutate: async ({ id, restaurantId }) => {
      // Standard optimistic update pattern
      const queryKey = [
        ...queryKeys.reviews.all,
        'restaurant',
        String(restaurantId),
      ];

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData<Review[]>(queryKey);

      // Optimistically update to the new value
      if (previousReviews) {
        queryClient.setQueryData<Review[]>(
          queryKey,
          previousReviews.filter((r) => r.id !== String(id))
        );
      }

      // Return a context object with the snapshotted value
      return { previousReviews, queryKey };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(context.queryKey, context.previousReviews);
      }
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, variables) => {
      // Invalidate restaurant detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.detail(String(variables.restaurantId)),
      });
      // Invalidate restaurant reviews
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.reviews.all,
          'restaurant',
          String(variables.restaurantId),
        ],
      });
      // Invalidate my reviews - critical for My Orders page to update
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.reviews.all, 'mine'],
      });
      // Invalidate orders to update review status
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
