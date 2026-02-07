import { useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/api';
import { Restaurant, RestaurantDetail } from '@/types';
import { queryKeys } from './keys';

/**
 * Hook to fetch list of restaurants
 */
export const useRestaurants = (
  params?: Record<string, unknown>,
  options?: { enabled?: boolean }
) =>
  useQuery<Restaurant[]>({
    queryKey: queryKeys.restaurants.list(params),
    queryFn: () => restaurantService.getRestaurants(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });

/**
 * Hook to fetch detailed restaurant information
 * @description Features placeholderData for instant UI transition if the restaurant exists in list cache.
 */
export const useRestaurantDetail = (
  id: string,
  params?: { lat?: number; lng?: number },
  options?: Record<string, unknown>
) => {
  const queryClient = useQueryClient();

  return useQuery<RestaurantDetail>({
    queryKey: queryKeys.restaurants.detail(id, params),
    queryFn: () => restaurantService.getDetail(id, params),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
    placeholderData: () => {
      // Find the restaurant in any active 'list' query to show immediate name/logo
      // This provides a much smoother 'Lead UI' experience
      const resto = queryClient
        .getQueryCache()
        .findAll({ queryKey: queryKeys.restaurants.lists() })
        .flatMap((query) => (query.state.data as Restaurant[]) || [])
        .find((r) => r && String(r.id) === String(id));

      if (!resto) return undefined;

      // Transform Restaurant to a partial RestaurantDetail for the placeholder
      return {
        ...resto,
        menu: [],
        reviews: [],
        images: resto.logo ? [resto.logo] : [],
      } as RestaurantDetail;
    },
  });
};

/**
 * Hook to fetch recommended restaurants
 */
export const useRecommendedRestaurants = (
  isAuthenticated?: boolean,
  params?: Record<string, unknown>,
  options?: { enabled?: boolean }
) =>
  useQuery<Restaurant[]>({
    queryKey: queryKeys.restaurants.recommended({ isAuthenticated, ...params }),
    queryFn: () =>
      isAuthenticated
        ? restaurantService.getRecommended(params)
        : restaurantService.getRestaurants({ limit: 10, ...params }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
