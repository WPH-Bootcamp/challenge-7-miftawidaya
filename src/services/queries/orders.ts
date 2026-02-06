import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { orderService } from '@/services/api';
import { Order } from '@/types';
import { queryKeys } from './keys';

/** Default page size for orders pagination */
const ORDERS_PAGE_SIZE = 10;

/**
 * Hook to fetch order history (non-paginated, legacy)
 */
export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: queryKeys.orders.all,
    queryFn: orderService.getOrders,
  });

/**
 * Hook to fetch paginated orders with prefetching
 * @description Fetches orders page by page, prefetches next page for instant loading
 * @param status - Filter by order status
 */
export const useOrdersPaginated = (status?: string) => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [accumulatedOrders, setAccumulatedOrders] = React.useState<Order[]>([]);

  const params = { page, limit: ORDERS_PAGE_SIZE, status };

  const query = useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.getOrdersPaginated(params),
    // Ensure fresh data - no stale time
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });

  // Sync accumulated orders with query data
  React.useEffect(() => {
    if (query.data?.orders) {
      if (page === 1) {
        // For page 1, replace with fresh data
        setAccumulatedOrders(query.data.orders);
      } else {
        // For subsequent pages, accumulate
        setAccumulatedOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.id));
          const newOrders = query.data.orders.filter(
            (o) => !existingIds.has(o.id)
          );
          return [...prev, ...newOrders];
        });
      }
    }
  }, [query.data?.orders, query.dataUpdatedAt, page]);

  // Prefetch next page when current page loads
  React.useEffect(() => {
    if (query.data?.pagination?.hasNextPage) {
      const nextParams = { page: page + 1, limit: ORDERS_PAGE_SIZE, status };
      queryClient.prefetchQuery({
        queryKey: queryKeys.orders.list(nextParams),
        queryFn: () => orderService.getOrdersPaginated(nextParams),
      });
    }
  }, [query.data?.pagination?.hasNextPage, page, status, queryClient]);

  // Reset when status filter changes
  React.useEffect(() => {
    setPage(1);
    setAccumulatedOrders([]);
  }, [status]);

  const loadMore = React.useCallback(() => {
    if (query.data?.pagination?.hasNextPage && !query.isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [query.data?.pagination?.hasNextPage, query.isFetching]);

  // Use query.data.orders directly for page 1 to avoid state sync delay
  const displayOrders =
    page === 1 && query.data?.orders ? query.data.orders : accumulatedOrders;

  return {
    orders: displayOrders,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetching && page > 1,
    hasNextPage: query.data?.pagination?.hasNextPage ?? false,
    loadMore,
    totalItems: query.data?.pagination?.totalItems ?? displayOrders.length,
  };
};

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
      // Invalidate both base orders key AND paginated lists to ensure all are refreshed
      await Promise.all([
        // Invalidate legacy non-paginated orders
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
          refetchType: 'all',
        }),
        // Explicitly invalidate paginated orders lists
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.lists(),
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
