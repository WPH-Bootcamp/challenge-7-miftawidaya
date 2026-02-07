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
  lat?: number;
  lng?: number;
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
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  transactionId?: string;
  restaurantId?: string | number;
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

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'done'
  | 'cancelled';

export interface OrderItem {
  menuId: number;
  menuName: string;
  price: number;
  image: string;
  quantity: number;
  itemTotal: number;
}

export interface OrderRestaurant {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: OrderItem[];
  subtotal: number;
}

export interface Order {
  id: number | string;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  pricing: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  restaurants: OrderRestaurant[];
  createdAt: string;
  updatedAt: string;
}
