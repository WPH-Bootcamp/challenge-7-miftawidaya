/**
 * Application Routes Configuration
 * @description Centralized route constants to avoid hardcoding links.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESTAURANTS: '/restaurants',
  CATEGORY: (id: string | number) => `/category/${id}`,
  RESTAURANT_DETAIL: (id: string | number) => `/resto/${id}`,
  CART: '/cart',
  CHECKOUT: (restaurantId?: string | number) =>
    restaurantId ? `/checkout?restaurantId=${restaurantId}` : '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  ORDERS: '/orders',
  PROFILE: '/profile',
  DEV: '/dev',
} as const;

/**
 * Protected Routes
 * @description Routes that require authentication.
 */
export const PROTECTED_ROUTES = [
  ROUTES.CART,
  ROUTES.CHECKOUT(), // Call as function for base path
  ROUTES.CHECKOUT_SUCCESS,
  ROUTES.ORDERS,
  ROUTES.PROFILE,
];

/**
 * Auth Routes
 * @description Routes that should not be accessible when logged in.
 */
export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];

export type RouteKey = keyof typeof ROUTES;
