'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from '@/services/queries';

import type { CartGroup, CartItemNested } from '@/types';

/**
 * CartItemCard - Individual cart item with quantity controls
 */
function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  isUpdating,
}: Readonly<{
  item: CartItemNested;
  onIncrement: () => void;
  onDecrement: () => void;
  isUpdating: boolean;
}>) {
  return (
    <div className='flex items-center gap-3 md:gap-4'>
      {/* Image */}
      <div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:size-20'>
        <Image
          src={item.menu.image || '/images/placeholder.png'}
          alt={item.menu.foodName}
          fill
          className='object-cover'
        />
      </div>

      {/* Info */}
      <div className='flex flex-1 flex-col gap-0.5'>
        <h4 className='md:text-md text-sm font-medium text-neutral-950'>
          {item.menu.foodName}
        </h4>
        <span className='md:text-md text-sm font-extrabold text-neutral-950'>
          Rp{item.menu.price.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center gap-2 md:gap-3'>
        <button
          type='button'
          onClick={onDecrement}
          disabled={isUpdating}
          className='flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:opacity-50 md:size-9'
          aria-label='Decrease quantity'
        >
          <Icon icon='ri:subtract-line' className='size-4 md:size-5' />
        </button>
        <span className='md:text-md w-6 text-center text-sm font-semibold text-neutral-950'>
          {item.quantity}
        </span>
        <button
          type='button'
          onClick={onIncrement}
          disabled={isUpdating}
          className='bg-brand-primary flex size-8 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:size-9'
          aria-label='Increase quantity'
        >
          <Icon icon='ri:add-line' className='size-4 md:size-5' />
        </button>
      </div>
    </div>
  );
}

/**
 * CartRestaurantGroup - Group of items from same restaurant
 */
function CartRestaurantGroup({
  group,
  onUpdateQuantity,
  isUpdating,
}: Readonly<{
  group: CartGroup;
  onUpdateQuantity: (itemId: string | number, quantity: number) => void;
  isUpdating: boolean;
}>) {
  return (
    <div className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-5 md:p-6'>
      {/* Restaurant Header */}
      <Link
        href={ROUTES.RESTAURANT_DETAIL(group.restaurant.id)}
        className='flex items-center gap-2 transition-opacity hover:opacity-80'
      >
        {group.restaurant.logo ? (
          <div className='relative size-6 shrink-0 overflow-hidden rounded-full'>
            <Image
              src={group.restaurant.logo}
              alt={group.restaurant.name}
              fill
              className='object-cover'
            />
          </div>
        ) : (
          <Icon icon='ri:store-2-line' className='text-brand-primary size-6' />
        )}
        <span className='md:text-md text-sm font-extrabold text-neutral-950'>
          {group.restaurant.name}
        </span>
        <Icon
          icon='ri:arrow-right-s-line'
          className='size-5 text-neutral-400'
        />
      </Link>

      {/* Items List */}
      <div className='flex flex-col gap-4'>
        {group.items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {/* Subtotal & Checkout */}
      <div className='flex flex-col gap-3 border-t border-dashed border-neutral-200 pt-4 md:flex-row md:items-center md:justify-between md:gap-4'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs font-normal text-neutral-500 md:text-sm'>
            Total
          </span>
          <span className='text-lg font-extrabold text-neutral-950 md:text-xl'>
            Rp{group.subtotal.toLocaleString('id-ID')}
          </span>
        </div>
        <Link href={ROUTES.CHECKOUT} className='w-full md:w-auto'>
          <Button className='md:text-md h-11 w-full rounded-full px-8 text-sm font-bold md:h-12 md:min-w-60'>
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * EmptyCartState - Shown when cart is empty
 */
function EmptyCartState() {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <Icon icon='lets-icons:bag-fill' className='size-24 text-neutral-200' />
      <h2 className='mt-6 text-xl font-bold text-neutral-950'>
        Your cart is empty
      </h2>
      <p className='mt-2 text-sm text-neutral-500'>
        Order your favorite food now!
      </p>
      <Link href={ROUTES.HOME} className='mt-6'>
        <Button className='h-12 rounded-full px-8 text-sm font-bold'>
          Browse Restaurants
        </Button>
      </Link>
    </div>
  );
}

/**
 * CartPage - Main cart page component
 */
export default function CartPage() {
  const { data: cartData, isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = (itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart.mutate(itemId);
    } else {
      updateQuantity.mutate({ itemId, quantity });
    }
  };

  const isUpdating = updateQuantity.isPending || removeFromCart.isPending;

  return (
    <div className='pt-header-mobile md:pt-header flex min-h-screen flex-col bg-neutral-50 pb-10 md:pb-16'>
      <div className='custom-container mx-auto flex max-w-200 flex-col gap-6 pt-6 md:gap-8 md:pt-10'>
        {/* Page Title */}
        <h1 className='text-display-xs md:text-display-md font-extrabold text-neutral-950'>
          My Cart
        </h1>

        {/* Loading State */}
        {isLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='h-64 animate-pulse rounded-2xl bg-neutral-200'
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (cartData?.length ?? 0) === 0 && <EmptyCartState />}

        {/* Cart Groups */}
        {!isLoading && (cartData?.length ?? 0) > 0 && (
          <div className='flex flex-col gap-5 md:gap-6'>
            {cartData?.map((group: CartGroup) => (
              <CartRestaurantGroup
                key={group.restaurant.id}
                group={group}
                onUpdateQuantity={handleUpdateQuantity}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
