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
  Order,
  OrderStatus,
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
  transactionId?: string;
  transaction_id?: string;
  restaurantId?: number | string;
  restaurant_id?: number | string;
  restaurant?: {
    id: number | string;
    name?: string;
    logo?: string;
  };
  user?: {
    id: number | string;
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

interface ApiOrder {
  id: number | string;
  transactionId?: string;
  transaction_id?: string;
  status: OrderStatus;
  paymentMethod?: string;
  payment_method?: string;
  deliveryAddress?: string;
  delivery_address?: string;
  phone?: string;
  pricing?: {
    subtotal?: number | string;
    serviceFee?: number | string;
    service_fee?: number | string;
    deliveryFee?: number | string;
    delivery_fee?: number | string;
    totalPrice?: number | string;
    total_price?: number | string;
  };
  restaurants?: Array<{
    restaurant?: {
      id: number | string;
      name?: string;
      logo?: string;
    };
    items?: Array<{
      menuId?: number | string;
      menu_id?: number | string;
      menuName?: string;
      menu_name?: string;
      price?: number | string;
      image?: string;
      quantity?: number | string;
      itemTotal?: number | string;
      item_total?: number | string;
    }>;
    subtotal?: number | string;
  }>;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
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
  userId: String(data.user?.id ?? ''),
  userName: data.user?.name ?? 'Anonymous',
  userAvatar: data.user?.avatar ?? undefined,
  rating: data.star ?? 0,
  comment: data.comment ?? '',
  date: data.createdAt ?? '',
  transactionId: data.transactionId ?? data.transaction_id,
  restaurantId: data.restaurantId ?? data.restaurant_id ?? data.restaurant?.id,
});

const mapOrder = (data: ApiOrder): Order => ({
  id: String(data.id),
  transactionId: data.transactionId ?? data.transaction_id ?? String(data.id),
  status: data.status,
  paymentMethod: data.paymentMethod ?? data.payment_method ?? '',
  deliveryAddress: data.deliveryAddress ?? data.delivery_address ?? '',
  phone: data.phone ?? '',
  pricing: {
    subtotal: Number(data.pricing?.subtotal || 0),
    serviceFee:
      Number(data.pricing?.serviceFee ?? data.pricing?.service_fee) || 0,
    deliveryFee:
      Number(data.pricing?.deliveryFee ?? data.pricing?.delivery_fee) || 0,
    totalPrice:
      Number(data.pricing?.totalPrice ?? data.pricing?.total_price) || 0,
  },
  restaurants: (data.restaurants || []).map((or) => ({
    restaurant: {
      id: Number(or.restaurant?.id),
      name: or.restaurant?.name ?? '',
      logo: or.restaurant?.logo ?? '',
    },
    items: (or.items || []).map((item) => ({
      menuId: Number(item.menuId ?? item.menu_id),
      menuName: item.menuName ?? item.menu_name ?? '',
      price: Number(item.price),
      image: item.image ?? '',
      quantity: Number(item.quantity),
      itemTotal: Number(item.itemTotal ?? item.item_total),
    })),
    subtotal: Number(or.subtotal),
  })),
  createdAt: data.createdAt ?? data.created_at ?? '',
  updatedAt: data.updatedAt ?? data.updated_at ?? '',
});

export const restaurantService = {
  getRestaurants: async (params?: Record<string, unknown>) => {
    let endpoint: string = API_ENDPOINTS.RESTAURANTS.LIST;
    const requestParams = { ...params };

    // Handle search query with dedicated endpoint and parameter 'q'
    if (params?.search) {
      endpoint = API_ENDPOINTS.RESTAURANTS.SEARCH;
      requestParams.q = params.search;
      delete requestParams.search;
    } else if (params?.category === 'nearby') {
      endpoint = API_ENDPOINTS.RESTAURANTS.NEARBY;
    } else if (params?.category === 'best-seller') {
      endpoint = API_ENDPOINTS.RESTAURANTS.BEST_SELLER;
    } else if (params?.category === 'recommended') {
      endpoint = API_ENDPOINTS.RESTAURANTS.RECOMMENDED;
    }

    const { data } = await axios.get(endpoint, {
      params: requestParams,
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
  getOrders: async (): Promise<Order[]> => {
    const { data } = await axios.get(API_ENDPOINTS.ORDERS.HISTORY);
    return (data.data.orders || []).map(mapOrder);
  },

  /**
   * Get orders with pagination support
   * @param params - page, limit, status filters
   * @returns orders array with pagination metadata
   */
  getOrdersPaginated: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
    };
  }> => {
    const { data } = await axios.get(API_ENDPOINTS.ORDERS.HISTORY, { params });
    const orders = (data.data.orders || []).map(mapOrder);

    // API returns: { page, limit, total, totalPages }
    // We need to map to our expected format
    const apiPagination = data.data.pagination;
    const currentPage = apiPagination?.page ?? params?.page ?? 1;
    const totalPages = apiPagination?.totalPages ?? 1;
    const totalItems = apiPagination?.total ?? orders.length;
    const hasNextPage = currentPage < totalPages;

    return {
      orders,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNextPage,
      },
    };
  },
  checkout: async (payload: Record<string, unknown>) => {
    const { data } = await axios.post(API_ENDPOINTS.ORDERS.CHECKOUT, payload);
    return data.data;
  },
};
export const reviewService = {
  create: async (payload: {
    transactionId: string;
    restaurantId: string | number;
    star: number;
    comment: string;
    menuIds: number[];
  }) => {
    // Normalize IDs to Numbers where expected by the backend
    const normalizedPayload = {
      ...payload,
      restaurantId: Number(payload.restaurantId),
      menuIds: payload.menuIds.map(Number),
    };
    const { data } = await axios.post(
      API_ENDPOINTS.REVIEWS.CREATE,
      normalizedPayload
    );
    return data.data;
  },
  getMyReviews: async () => {
    const { data } = await axios.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS);
    return (data.data.reviews || []).map(mapReview);
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
  update: async (
    id: string | number,
    payload: { star: number; comment: string }
  ) => {
    const { data } = await axios.put(API_ENDPOINTS.REVIEWS.UPDATE(id), payload);
    return data.data;
  },
  delete: async (id: string | number) => {
    const { data } = await axios.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
    return data.data;
  },
};
