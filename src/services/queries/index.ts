import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService, cartService, orderService } from '@/services/api';
import { Restaurant, RestaurantDetail, Order, CartGroup } from '@/types';

// Restaurant Hooks
export const useRestaurants = (params?: Record<string, unknown>) =>
  useQuery<Restaurant[]>({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantService.getRestaurants(params),
  });

export const useRestaurantDetail = (id: string) =>
  useQuery<RestaurantDetail>({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getDetail(id),
    enabled: !!id,
  });

export const useRecommendedRestaurants = (isAuthenticated?: boolean) =>
  useQuery<Restaurant[]>({
    queryKey: ['restaurants', 'recommended', isAuthenticated],
    queryFn: () =>
      isAuthenticated
        ? restaurantService.getRecommended()
        : restaurantService.getRestaurants({ limit: 10 }),
  });

// Cart Hooks
export const useCart = () =>
  useQuery<CartGroup[]>({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string | number;
      quantity: number;
    }) => cartService.updateQuantity(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

// Order Hooks
export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
