import axios from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { DEFAULT_DISTANCE } from '@/config/constants';
import { calculateDistance } from '@/lib/utils';
import {
  Restaurant,
  RestaurantDetail,
  MenuItem,
  Review,
  CartGroup,
} from '@/types';

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
  lat?: number | string;
  long?: number | string;
  lng?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  coordinates?: {
    lat: number | string;
    long?: number | string;
    lng?: number | string;
  };
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

interface ApiCartItem {
  id: number | string;
  menu: ApiMenuItem;
  quantity: number | string;
  itemTotal: number | string;
}

interface ApiCartGroup {
  restaurant: {
    id: number | string;
    name: string;
    logo?: string;
  };
  items: ApiCartItem[];
  subtotal: number | string;
}

/**
 * Mapping helpers to transform API response to our types
 */
/**
 * Helper to parse latitude from various API formats
 */
const parseLat = (data: ApiRestaurant): number | undefined => {
  const val = data.lat ?? data.latitude ?? data.coordinates?.lat;
  return val !== undefined && val !== null ? Number(val) : undefined;
};

/**
 * Helper to parse longitude from various API formats
 */
const parseLng = (data: ApiRestaurant): number | undefined => {
  const val =
    data.lng ??
    data.long ??
    data.longitude ??
    data.coordinates?.lng ??
    data.coordinates?.long;
  return val !== undefined && val !== null ? Number(val) : undefined;
};

const mapRestaurant = (
  data: ApiRestaurant,
  userCoords?: { lat?: number; lng?: number }
): Restaurant => {
  const rLat = parseLat(data);
  const rLong = parseLng(data);

  // 1. Try to get distance from API
  let distance = data.distance;

  // 2. If API doesn't provide distance but coordinates are available
  if (
    (distance === undefined || distance === null) &&
    userCoords?.lat !== undefined &&
    userCoords?.lng !== undefined &&
    rLat !== undefined &&
    rLong !== undefined
  ) {
    distance = calculateDistance(userCoords.lat, userCoords.lng, rLat, rLong);
  }

  // Fallback to default if still not available
  distance = distance ?? DEFAULT_DISTANCE;

  // Extract numeric distance if it comes as a string (e.g. "2.4 km")
  if (typeof distance === 'string') {
    const numeric = distance.replaceAll(/[^0-9.]/g, '');
    distance = numeric ? Number.parseFloat(numeric) : DEFAULT_DISTANCE;
  }

  return {
    id: String(data.id),
    name: data.name,
    image: data.images?.[0] || data.logo || '',
    rating: data.averageRating ?? data.star ?? 0,
    totalReview: data.reviewCount ?? data.totalReviews ?? 0,
    place: data.place ?? '',
    distance,
    category: data.category ?? '',
    logo: data.logo,
    lat: rLat,
    lng: rLong,
  };
};

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
    let endpoint: string = API_ENDPOINTS.RESTAURANTS.LIST;

    // Route special categories to their dedicated endpoints
    if (params?.category === 'nearby') {
      endpoint = API_ENDPOINTS.RESTAURANTS.NEARBY;
    } else if (params?.category === 'best-seller') {
      endpoint = API_ENDPOINTS.RESTAURANTS.BEST_SELLER;
    } else if (params?.category === 'recommended') {
      endpoint = API_ENDPOINTS.RESTAURANTS.RECOMMENDED;
    }

    const { data } = await axios.get(endpoint, {
      params,
    });

    const result = data.data;
    const restaurants = Array.isArray(result)
      ? result
      : result.restaurants || result.recommendations || [];

    const userCoords =
      params?.lat !== undefined && params?.lng !== undefined
        ? { lat: Number(params.lat), lng: Number(params.lng) }
        : undefined;

    return restaurants.map((r: ApiRestaurant) => mapRestaurant(r, userCoords));
  },
  getDetail: async (
    id: string,
    params?: Record<string, unknown>
  ): Promise<RestaurantDetail> => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.DETAIL(id), {
      params,
    });
    const resto = data.data;
    const mappedBase = mapRestaurant(resto, params);

    return {
      ...mappedBase,
      images: resto.images || (resto.logo ? [resto.logo] : []),
      menu: (resto.menus || []).map(mapMenuItem),
      reviews: (resto.reviews || []).map(mapReview),
    };
  },
  getRecommended: async (params?: Record<string, unknown>) => {
    const { data } = await axios.get(API_ENDPOINTS.RESTAURANTS.RECOMMENDED, {
      params,
    });
    const restaurants =
      data.data.recommendations || data.data.restaurants || [];

    const userCoords =
      params?.lat !== undefined && params?.lng !== undefined
        ? { lat: Number(params.lat), lng: Number(params.lng) }
        : undefined;

    return restaurants.map((r: ApiRestaurant) => mapRestaurant(r, userCoords));
  },
};

export const cartService = {
  getCart: async (): Promise<CartGroup[]> => {
    const { data } = await axios.get(API_ENDPOINTS.CART.GET);
    const cart = data.data.cart || [];

    // Normalize numeric fields to prevent string concatenation issues in calculations
    return cart.map((group: ApiCartGroup) => ({
      ...group,
      restaurant: {
        ...group.restaurant,
        id: String(group.restaurant.id),
      },
      subtotal: Number(group.subtotal),
      items: (group.items || []).map((item: ApiCartItem) => ({
        ...item,
        id: String(item.id),
        quantity: Number(item.quantity),
        itemTotal: Number(item.itemTotal),
        menu: {
          ...item.menu,
          id: String(item.menu.id),
          price: Number(item.menu.price),
        },
      })),
    }));
  },
  addToCart: async (payload: {
    restaurantId: number | string;
    menuId: number | string;
    quantity: number;
  }) => {
    // Ensure IDs are numbers as backend expects numeric values
    const normalizedPayload = {
      restaurantId: Number(payload.restaurantId),
      menuId: Number(payload.menuId),
      quantity: payload.quantity,
    };
    const { data } = await axios.post(
      API_ENDPOINTS.CART.ADD,
      normalizedPayload
    );
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
  getRestaurantReviews: async (
    restaurantId: string | number,
    params?: Record<string, unknown>
  ) => {
    const { data } = await axios.get(
      API_ENDPOINTS.REVIEWS.RESTAURANT_REVIEWS(restaurantId),
      { params }
    );
    return (data.data.reviews || []).map(mapReview);
  },
};
