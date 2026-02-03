import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/api';
import { queryKeys } from './keys';

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
