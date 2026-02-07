/**
 * API Endpoints Configuration
 * @description Centralized API endpoint constants for backend communication.
 * All endpoints are prefixed with /api as per the documentation.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile', // GET for fetch, PUT for update
  },
  RESTAURANTS: {
    LIST: '/api/resto',
    NEARBY: '/api/resto/nearby',
    RECOMMENDED: '/api/resto/recommended',
    BEST_SELLER: '/api/resto/best-seller',
    SEARCH: '/api/resto/search',
    DETAIL: (id: string | number) => `/api/resto/${id}`,
  },
  CART: {
    GET: '/api/cart', // GET
    ADD: '/api/cart', // POST
    UPDATE: (itemId: string | number) => `/api/cart/${itemId}`, // PUT
    REMOVE: (itemId: string | number) => `/api/cart/${itemId}`, // DELETE
  },
  ORDERS: {
    CHECKOUT: '/api/order/checkout',
    HISTORY: '/api/order/my-order',
  },
  REVIEWS: {
    CREATE: '/api/review', // POST
    MY_REVIEWS: '/api/review/my-reviews', // GET
    RESTAURANT_REVIEWS: (restaurantId: string | number) =>
      `/api/review/restaurant/${restaurantId}`, // GET
    UPDATE: (id: string | number) => `/api/review/${id}`, // PUT
    DELETE: (id: string | number) => `/api/review/${id}`, // DELETE
  },
} as const;
