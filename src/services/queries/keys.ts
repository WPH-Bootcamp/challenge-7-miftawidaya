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
    detail: (id: string) => [...queryKeys.restaurants.details(), id] as const,
    recommended: (isAuthenticated?: boolean) =>
      [...queryKeys.restaurants.all, 'recommended', isAuthenticated] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byRestaurant: (restaurantId: string) =>
      [...queryKeys.reviews.all, 'restaurant', restaurantId] as const,
  },
};
