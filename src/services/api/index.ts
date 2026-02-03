import axios from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { DEFAULT_DISTANCE } from '@/config/constants';
import { Restaurant, RestaurantDetail, MenuItem, Review } from '@/types';

/**
 * API Response interfaces for strict typing
 */
interface ApiRestaurant {
  id: number | string;
  name: string;
  logo?: string;
  images?: string[];
  star?: number;
  averageRating?: number;
  reviewCount?: number;
  totalReviews?: number;
  place?: string;
  distance?: string | number;
  category?: string;
  menus?: ApiMenuItem[];
  reviews?: ApiReview[];
}

interface ApiMenuItem {
  id: number | string;
  foodName: string;
  description?: string;
  price: number;
  image?: string;
  type?: string;
}

interface ApiReview {
  id: number | string;
  star?: number;
  comment?: string;
  createdAt?: string;
  user?: {
    name?: string;
    avatar?: string | null;
  };
}

/**
 * Mapping helpers to transform API response to our types
 */
const mapRestaurant = (data: ApiRestaurant): Restaurant => ({
  id: String(data.id),
  name: data.name,
  image: data.images?.[0] || data.logo || '',
  rating: data.averageRating ?? data.star ?? 0,
  totalReview: data.reviewCount ?? data.totalReviews ?? 0,
  place: data.place ?? '',
  distance: data.distance ?? DEFAULT_DISTANCE,
  category: data.category ?? '',
  logo: data.logo,
});

const mapMenuItem = (data: ApiMenuItem): MenuItem => ({
  id: String(data.id),
  name: data.foodName,
  description: data.description ?? '',
  price: data.price,
  image: data.image ?? '',
  category: (data.type?.toUpperCase() as 'FOOD' | 'DRINK') || 'FOOD',
});

const mapReview = (data: ApiReview): Review => ({
  id: String(data.id),
  userName: data.user?.name ?? 'Anonymous',
  userAvatar: data.user?.avatar ?? undefined,
  rating: data.star ?? 0,
  comment: data.comment ?? '',
  date: data.createdAt ?? '',
});

export const restaurantService = {
  getRestaurants: async (params?: Record<string, unknown>) => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.LIST, {
      params,
    });
    return (data.data.restaurants || []).map(mapRestaurant);
  },
  getDetail: async (id: string): Promise<RestaurantDetail> => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.DETAIL(id));
    const resto = data.data;
    const mappedBase = mapRestaurant(resto);

    return {
      ...mappedBase,
      images: resto.images || (resto.logo ? [resto.logo] : []),
      menu: (resto.menus || []).map(mapMenuItem),
      reviews: (resto.reviews || []).map(mapReview),
    };
  },
  getRecommended: async () => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.RECOMMENDED);
    const restaurants =
      data.data.recommendations || data.data.restaurants || [];
    return restaurants.map(mapRestaurant);
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

export const reviewService = {
  create: async (payload: {
    restaurantId: string | number;
    star: number;
    comment: string;
  }) => {
    const { data } = await axios.post(API_ENDPOINTS.REVIEWS.CREATE, payload);
    return data.data;
  },
  getMyReviews: async () => {
    const { data } = await axios.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS);
    return data.data.reviews;
  },
  getRestaurantReviews: async (restaurantId: string | number) => {
    const { data } = await axios.get(
      API_ENDPOINTS.REVIEWS.RESTAURANT_REVIEWS(restaurantId)
    );
    return (data.data.reviews || []).map(mapReview);
  },
};
