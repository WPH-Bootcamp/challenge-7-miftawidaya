import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/api';
import { Order } from '@/types';
import { queryKeys } from './keys';

/**
 * Hook to fetch order history
 */
export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: queryKeys.orders.all,
    queryFn: orderService.getOrders,
  });

/**
 * Hook to handle checkout process
 * @description Invalidates both orders and cart on success to ensure data consistency.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};
