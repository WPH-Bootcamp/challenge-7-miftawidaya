import axios from './axios';
import { API_ENDPOINTS } from '@/config/api';

export const restaurantService = {
  getRestaurants: async (params?: Record<string, unknown>) => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.LIST, {
      params,
    });
    return data.data.restaurants;
  },
  getDetail: async (id: string) => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.DETAIL(id));
    return data.data;
  },
  getRecommended: async () => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.RECOMMENDED);
    return data.data.restaurants;
  },
};

export const cartService = {
  getCart: async () => {
    const { data } = await axios.get(API_ENDPOINTS.CART.GET);
    return data.data.cart;
  },
  addToCart: async (payload: {
    restaurantId: number | string;
    menuId: number | string;
    quantity: number;
  }) => {
    const { data } = await axios.post(API_ENDPOINTS.CART.ADD, payload);
    return data;
  },
  updateQuantity: async (itemId: string | number, quantity: number) => {
    const { data } = await axios.put(API_ENDPOINTS.CART.UPDATE(itemId), {
      quantity,
    });
    return data;
  },
  removeFromCart: async (itemId: string | number) => {
    const { data } = await axios.delete(API_ENDPOINTS.CART.REMOVE(itemId));
    return data;
  },
};

export const orderService = {
  getOrders: async () => {
    const { data } = await axios.get(API_ENDPOINTS.ORDERS.HISTORY);
    return data.data.orders;
  },
  checkout: async (payload: Record<string, unknown>) => {
    const { data } = await axios.post(API_ENDPOINTS.ORDERS.CHECKOUT, payload);
    return data.data;
  },
};
