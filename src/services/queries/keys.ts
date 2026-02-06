/**
 * Query Key Factory
 * Centralized constant to avoid typos and manage cache effectively.
 * Structured with base keys and specific sub-keys for granular invalidation.
 */
export const queryKeys = {
  restaurants: {
    all: ['restaurants'] as const,
    lists: () => [...queryKeys.restaurants.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.restaurants.lists(), params] as const,
    details: () => [...queryKeys.restaurants.all, 'detail'] as const,
    detail: (id: string, params?: Record<string, unknown>) =>
      [...queryKeys.restaurants.details(), id, params] as const,
    recommended: (params?: Record<string, unknown>) =>
      [...queryKeys.restaurants.all, 'recommended', params] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      [...queryKeys.orders.lists(), params] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byRestaurant: (restaurantId: string, params?: Record<string, unknown>) =>
      [...queryKeys.reviews.all, 'restaurant', restaurantId, params] as const,
  },
};
