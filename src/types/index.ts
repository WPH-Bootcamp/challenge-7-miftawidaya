/**
 * Restaurant Types
 */

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  totalReview: number;
  place: string;
  distance: string | number;
  category: string;
  logo?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'FOOD' | 'DRINK';
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RestaurantDetail extends Restaurant {
  menu: MenuItem[];
  reviews: Review[];
  images?: string[];
}

/**
 * Cart Types
 */

export interface CartItemNested {
  id: string | number;
  menu: {
    id: string | number;
    foodName: string;
    price: number;
    image?: string;
  };
  quantity: number;
  itemTotal: number;
}

export interface CartGroup {
  restaurant: {
    id: string | number;
    name: string;
    logo?: string;
  };
  items: CartItemNested[];
  subtotal: number;
}

/**
 * Order Types
 */

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  restaurantId: string | number;
  restaurantName: string;
  restaurantImage: string;
  totalAmount: number;
  items: number;
  status: OrderStatus;
  date: string;
}
