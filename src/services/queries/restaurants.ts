import { useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/api';
import { Restaurant, RestaurantDetail } from '@/types';
import { queryKeys } from './keys';

/**
 * Hook to fetch list of restaurants
 */
export const useRestaurants = (params?: Record<string, unknown>) =>
  useQuery<Restaurant[]>({
    queryKey: queryKeys.restaurants.list(params),
    queryFn: () => restaurantService.getRestaurants(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

/**
 * Hook to fetch detailed restaurant information
 * @description Features placeholderData for instant UI transition if the restaurant exists in list cache.
 */
export const useRestaurantDetail = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery<RestaurantDetail>({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => restaurantService.getDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: () => {
      // Find the restaurant in any active 'list' query to show immediate name/logo
      // This provides a much smoother 'Lead UI' experience
      return queryClient
        .getQueryCache()
        .findAll({ queryKey: queryKeys.restaurants.lists() })
        .flatMap((query) => (query.state.data as Restaurant[]) || [])
        .find((resto) => resto && String(resto.id) === String(id)) as
        | RestaurantDetail
        | undefined;
    },
  });
};

/**
 * Hook to fetch recommended restaurants
 */
export const useRecommendedRestaurants = (isAuthenticated?: boolean) =>
  useQuery<Restaurant[]>({
    queryKey: queryKeys.restaurants.recommended(isAuthenticated),
    queryFn: () =>
      isAuthenticated
        ? restaurantService.getRecommended()
        : restaurantService.getRestaurants({ limit: 10 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
