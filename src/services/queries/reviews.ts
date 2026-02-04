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
 * Hook to create a new restaurant review
 * @description Invalidates the specific restaurant detail and order history to reflect the new review.
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.create,
    onSuccess: (_, variables) => {
      // Invalidate the specific restaurant detail to show the new review
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurants.detail(String(variables.restaurantId)),
      });
      // Invalidate orders as reviews are usually linked to past orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
