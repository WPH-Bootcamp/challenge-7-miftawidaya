'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import { useOrders, useMyReviews } from '@/services/queries';
import { cn, formatCurrency } from '@/lib/utils';
import { OrderRestaurant, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  ProfileSidebar,
  ProfileSidebarSkeleton,
} from '@/components/user/ProfileSidebar';
import { useAppDispatch, useAppSelector } from '@/features/store';
import { openReviewModal } from '@/features/review/reviewSlice';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Status filter options
 */
const STATUS_FILTERS = [
  { id: 'all', label: 'Status' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'on_the_way', label: 'On the Way' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'done', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]['id'];

/**
 * OrderRestaurantCard - Individual restaurant order card
 * @description Displays order details for a single restaurant with menu items
 */
function OrderRestaurantCard({
  orderRestaurant,
  orderStatus,
  existingReview,
  onReview,
}: Readonly<{
  orderRestaurant: OrderRestaurant;
  orderStatus: string;
  existingReview?: Review;
  onReview: (params?: { mode: 'edit'; review: Review }) => void;
}>) {
  const { restaurant, items, subtotal } = orderRestaurant;
  const firstItem = items[0];

  const handleReviewClick = () => {
    if (existingReview) {
      onReview({ mode: 'edit', review: existingReview });
    } else {
      onReview();
    }
  };

  return (
    <article className='shadow-card flex flex-col gap-3 rounded-2xl bg-white p-4 md:gap-4 md:p-5'>
      {/* Restaurant Header */}
      <Link
        href={`/resto/${restaurant.id}`}
        className='flex items-center gap-2 transition-opacity hover:opacity-70'
      >
        <div className='relative size-8 shrink-0 overflow-hidden'>
          <ImageWithFallback
            src={restaurant.logo}
            alt={restaurant.name}
            fill
            className='object-contain'
            fallbackIconSize='sm'
          />
        </div>
        <span className='text-sm font-bold tracking-tight text-neutral-950 md:text-lg'>
          {restaurant.name}
        </span>
      </Link>

      {/* Menu Item */}
      <div className='flex items-center gap-3 md:gap-4'>
        <div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:size-20'>
          <ImageWithFallback
            src={firstItem?.image ?? ''}
            alt={firstItem?.menuName ?? 'Food'}
            fill
            className='object-cover'
            fallbackIconSize='sm'
          />
        </div>
        <div className='flex grow flex-col'>
          <span className='md:text-md text-sm font-medium text-neutral-950'>
            {firstItem?.menuName ?? 'Food Name'}
          </span>
          <span className='text-md font-extrabold text-neutral-950'>
            {formatCurrency(firstItem?.itemTotal ?? subtotal)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className='h-px w-full bg-neutral-300' />

      {/* Footer */}
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0'>
        <div className='flex flex-col'>
          <span className='md:text-md text-sm font-medium text-neutral-950'>
            Total
          </span>
          <span className='text-md font-extrabold text-neutral-950 md:text-xl'>
            {formatCurrency(subtotal)}
          </span>
        </div>
        {orderStatus === 'done' && (
          <Button
            onClick={handleReviewClick}
            variant={existingReview ? 'outline' : 'default'}
            className={cn(
              'text-md h-11 w-full rounded-full font-bold md:h-12 md:w-60',
              !existingReview &&
                'bg-brand-primary hover:bg-brand-primary/90 text-white'
            )}
          >
            {existingReview ? 'Edit Review' : 'Give Review'}
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * OrderRestaurantCardSkeleton - Loading placeholder for OrderRestaurantCard
 */
function OrderRestaurantCardSkeleton() {
  return (
    <div className='shadow-card flex flex-col gap-3 rounded-2xl bg-white p-4 md:gap-4 md:p-5'>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-6 w-32' />
      </div>
      <div className='flex items-center gap-3 md:gap-4'>
        <Skeleton className='size-16 rounded-xl md:size-20' />
        <div className='flex grow flex-col gap-2'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-6 w-24' />
        </div>
      </div>
      <div className='h-px w-full bg-neutral-300' />
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-7 w-28' />
        </div>
        <Skeleton className='h-11 w-full rounded-full md:h-12 md:w-60' />
      </div>
    </div>
  );
}

/**
 * StatusFilterTabs - Renders the status filter buttons
 */
function StatusFilterTabs({
  activeFilter,
  onFilterChange,
}: Readonly<{
  activeFilter: StatusFilter;
  onFilterChange: (id: StatusFilter) => void;
}>) {
  return (
    <div className='scrollbar-hide flex items-center gap-2 overflow-x-auto md:gap-3'>
      {STATUS_FILTERS.map((filter, index) => {
        const isActive = activeFilter === filter.id;
        if (index === 0) {
          return (
            <span
              key={filter.id}
              className='shrink-0 text-sm font-bold text-neutral-950 md:text-lg'
            >
              {filter.label}
            </span>
          );
        }

        return (
          <button
            key={filter.id}
            type='button'
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              'md:text-md shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors md:py-2.5',
              isActive
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold'
                : 'border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50'
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * OrderList - Handles the conditional rendering of the order list
 */
function OrderList({
  isLoading,
  orders,
  myReviews,
  onReview,
}: Readonly<{
  isLoading: boolean;
  orders: ReturnType<typeof useOrders>['data'];
  myReviews?: Review[];
  onReview: (params: {
    restaurantId: string | number;
    restaurantName: string;
    transactionId: string;
    menuIds: number[];
    mode?: 'create' | 'edit';
    reviewId?: string;
    rating?: number;
    comment?: string;
  }) => void;
}>) {
  if (isLoading) {
    return (
      <div className='flex flex-col gap-5'>
        {[1, 2, 3].map((i) => (
          <OrderRestaurantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 py-20'>
        <Icon
          icon='ri:file-list-3-line'
          className='size-16 text-neutral-300'
          aria-hidden='true'
        />
        <p className='text-md text-neutral-500'>No orders found</p>
      </div>
    );
  }

  // Pre-flatten orders to avoid deep nesting in JSX
  const flattenedOrders = orders.flatMap((order) =>
    order.restaurants.map((orderRestaurant) => {
      const existingReview = myReviews?.find(
        (r) =>
          r.transactionId === order.transactionId &&
          String(r.restaurantId) === String(orderRestaurant.restaurant.id)
      );

      return {
        orderId: order.id,
        transactionId: order.transactionId,
        status: order.status,
        restaurant: orderRestaurant.restaurant,
        items: orderRestaurant.items,
        subtotal: orderRestaurant.subtotal,
        menuIds: orderRestaurant.items.map((item) => item.menuId),
        existingReview,
      };
    })
  );

  return (
    <div className='flex flex-col gap-5'>
      {flattenedOrders.map((flatOrder) => (
        <OrderRestaurantCard
          key={`${flatOrder.orderId}-${flatOrder.restaurant.id}`}
          orderRestaurant={{
            restaurant: flatOrder.restaurant,
            items: flatOrder.items,
            subtotal: flatOrder.subtotal,
          }}
          orderStatus={flatOrder.status}
          existingReview={flatOrder.existingReview}
          onReview={(extra) =>
            onReview({
              restaurantId: flatOrder.restaurant.id,
              restaurantName: flatOrder.restaurant.name,
              transactionId: flatOrder.transactionId,
              menuIds: flatOrder.menuIds,
              ...(extra?.mode === 'edit' && {
                mode: 'edit',
                reviewId: extra.review.id,
                rating: extra.review.rating,
                comment: extra.review.comment,
              }),
            })
          }
        />
      ))}
    </div>
  );
}

/**
 * OrdersPage - Main orders page with sidebar and order list
 * @description Displays user's order history with filtering and search
 */
export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: orders, isLoading } = useOrders();
  const { data: myReviews } = useMyReviews(isAuthenticated);
  const [activeFilter, setActiveFilter] = React.useState<StatusFilter>('done');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter orders based on status and search
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesStatus =
        activeFilter === 'all' || order.status === activeFilter;
      const matchesSearch = order.restaurants.some((r) =>
        r.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesStatus && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  return (
    <div className='custom-container mx-auto flex gap-6 py-20 md:gap-8 md:py-32'>
      {/* Desktop Sidebar */}
      {isAuthenticated ? <ProfileSidebar /> : <ProfileSidebarSkeleton />}

      {/* Main Content */}
      <div className='flex min-w-0 grow flex-col gap-4 md:gap-6'>
        {/* Page Title */}
        <h1 className='text-display-xs md:text-display-md font-extrabold text-neutral-950'>
          My Orders
        </h1>

        {/* Content Block */}
        <div className='flex flex-col gap-5 overflow-hidden rounded-2xl bg-white p-4 md:p-6'>
          {/* Search Bar */}
          <div className='relative max-w-150'>
            <Icon
              icon='ri:search-line'
              className='absolute start-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500'
              aria-hidden='true'
            />
            <input
              type='text'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-11 w-full rounded-full border border-neutral-300 bg-white ps-11 pe-4 text-sm text-neutral-950 placeholder:text-neutral-600 focus:border-neutral-400 focus:outline-none'
              aria-label='Search orders'
            />
          </div>

          {/* Status Filter Tabs */}
          <StatusFilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Orders List */}
          <OrderList
            isLoading={isLoading}
            orders={filteredOrders}
            myReviews={myReviews}
            onReview={(params) => dispatch(openReviewModal(params))}
          />
        </div>
      </div>
    </div>
  );
}
