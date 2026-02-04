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
 * Uses optimistic update to immediately clear cart cache, then invalidates to sync with server.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.checkout,
    onSuccess: async () => {
      // 1. Immediately clear cart cache (optimistic update)
      queryClient.setQueryData(queryKeys.cart.all, []);

      // 2. Invalidate queries with refetchType 'all' to bypass staleTime
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.all,
          refetchType: 'all',
        }),
      ]);
    },
  });
};
