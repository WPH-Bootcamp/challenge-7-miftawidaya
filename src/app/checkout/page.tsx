'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import {
  useCart,
  useCheckout,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from '@/services/queries';
import { Button } from '@/components/ui/button';
import { RootState } from '@/features/store';
import { ROUTES } from '@/config/routes';
import { CartGroup, CartItemNested } from '@/types';
import { cn } from '@/lib/utils';
import { QuantityControl } from '@/components/cart/QuantityControl';

/**
 * Payment method options with bank logos
 */
const PAYMENT_METHODS = [
  { id: 'bni', name: 'Bank Negara Indonesia', logo: '/images/logo-bni.jpg' },
  { id: 'bri', name: 'Bank Rakyat Indonesia', logo: '/images/logo-bri.jpg' },
  { id: 'bca', name: 'Bank Central Asia', logo: '/images/logo-bca.jpg' },
  { id: 'mandiri', name: 'Mandiri', logo: '/images/logo-mandiri.jpg' },
] as const;

/**
 * CheckoutPage
 * @description Displays cart items, delivery address, payment method selection, and order summary.
 * Implements Figma design with responsive layout (2-column desktop, 1-column mobile).
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: cartData, isLoading: isCartLoading } = useCart(isAuthenticated);
  const checkout = useCheckout();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();

  const [selectedPayment, setSelectedPayment] = React.useState('bni');

  // Calculations
  const itemCount =
    cartData?.reduce(
      (acc: number, group: CartGroup) =>
        acc +
        group.items.reduce(
          (sum: number, item: CartItemNested) => sum + item.quantity,
          0
        ),
      0
    ) ?? 0;

  const subtotal =
    cartData?.reduce(
      (acc: number, group: CartGroup) => acc + group.subtotal,
      0
    ) ?? 0;

  const deliveryFee = 10000;
  const serviceFee = 1000;
  const total = subtotal + deliveryFee + serviceFee;

  // Handlers
  const handleIncrement = (item: CartItemNested) => {
    updateQuantity.mutate({
      itemId: item.id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrement = (item: CartItemNested) => {
    if (item.quantity > 1) {
      updateQuantity.mutate({
        itemId: item.id,
        quantity: item.quantity - 1,
      });
    } else {
      removeFromCart.mutate(item.id);
    }
  };

  const handleCheckout = () => {
    const payload = {
      restaurants: cartData?.map((group: CartGroup) => ({
        restaurantId: Number(group.restaurant.id),
        items: group.items.map((item: CartItemNested) => ({
          menuId: Number(item.menu.id),
          quantity: Number(item.quantity),
        })),
      })),
      deliveryAddress: 'Jl. Sudirman No. 25, Jakarta Pusat, 10220',
      phone: '081234567890',
      paymentMethod: selectedPayment.toUpperCase(),
      notes: '',
    };

    checkout.mutate(payload, {
      onSuccess: () => router.push(ROUTES.CHECKOUT_SUCCESS),
    });
  };

  // Loading state
  if (isCartLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='border-brand-primary size-10 animate-spin rounded-full border-4 border-t-transparent' />
      </div>
    );
  }

  // Empty cart state
  if (!cartData || cartData.length === 0) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4'>
        <Icon
          icon='ri:shopping-bag-line'
          className='size-20 text-neutral-200'
        />
        <h2 className='text-display-xs font-extrabold text-neutral-950'>
          Your cart is empty
        </h2>
        <Button
          onClick={() => router.push(ROUTES.HOME)}
          className='h-12 rounded-full px-8'
        >
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className='pt-header-mobile md:pt-header min-h-screen bg-neutral-50'>
      <div className='custom-container mx-auto flex flex-col gap-6 py-6 md:gap-10 md:py-10 lg:flex-row lg:items-start lg:gap-8'>
        {/* Left Column: Checkout Details */}
        <div className='flex min-w-0 flex-1 flex-col gap-6 md:gap-8'>
          {/* Page Title */}
          <h1 className='text-display-xs md:text-display-sm font-extrabold text-neutral-950'>
            Checkout
          </h1>

          {/* Delivery Address Card */}
          <section className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-5 md:p-5'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <div className='relative size-6 shrink-0 md:size-8'>
                  <Image
                    src='/icons/icon-location.png'
                    alt='Location'
                    fill
                    sizes='(max-width: 768px) 24px, 32px'
                    className='object-contain'
                  />
                </div>
                <h3 className='text-md font-extrabold tracking-tight text-neutral-950 md:text-lg'>
                  Delivery Address
                </h3>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='md:text-md text-sm font-medium tracking-tight text-neutral-950'>
                  Jl. Sudirman No. 25, Jakarta Pusat, 10220
                </p>
                <p className='md:text-md text-sm font-medium tracking-tight text-neutral-950'>
                  0812-3456-7890
                </p>
              </div>
            </div>
            <button
              type='button'
              className='md:text-md flex h-9 w-30 items-center justify-center rounded-full border border-neutral-300 text-sm font-bold tracking-tight text-neutral-950 transition-colors hover:bg-neutral-50 md:h-10'
            >
              Change
            </button>
          </section>

          {/* Cart Items by Restaurant */}
          {cartData.map((group: CartGroup) => (
            <section
              key={String(group.restaurant.id)}
              className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-5 md:p-6'
            >
              {/* Restaurant Header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='relative size-6 overflow-hidden rounded-full bg-neutral-100'>
                    {group.restaurant.logo && (
                      <Image
                        src={group.restaurant.logo}
                        alt={group.restaurant.name}
                        fill
                        sizes='24px'
                        className='object-contain'
                      />
                    )}
                  </div>
                  <h3 className='text-md font-extrabold text-neutral-950 md:text-lg'>
                    {group.restaurant.name}
                  </h3>
                </div>
                <button
                  type='button'
                  className='rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-neutral-50'
                >
                  Add Item
                </button>
              </div>

              {/* Item List */}
              <div className='flex flex-col gap-4'>
                {group.items.map((item: CartItemNested) => (
                  <div
                    key={String(item.id)}
                    className='flex items-center gap-3'
                  >
                    {/* Item Image */}
                    <div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:size-20'>
                      {item.menu.image && (
                        <Image
                          src={item.menu.image}
                          alt={item.menu.foodName}
                          fill
                          sizes='(max-width: 768px) 64px, 80px'
                          className='object-cover'
                        />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className='flex flex-1 flex-col gap-0.5'>
                      <h4 className='md:text-md text-sm font-medium text-neutral-950'>
                        {item.menu.foodName}
                      </h4>
                      <span className='text-md font-extrabold text-neutral-950 md:text-lg'>
                        Rp{item.menu.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrement={() => handleIncrement(item)}
                      onDecrement={() => handleDecrement(item)}
                      isUpdating={updateQuantity.isPending}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Payment Method Section (Mobile) */}
          <section className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-5 md:p-6 lg:hidden'>
            <h3 className='text-md font-extrabold text-neutral-950 md:text-lg'>
              Payment Method
            </h3>
            <div className='flex flex-col gap-3'>
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
                    selectedPayment === method.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <div className='relative size-8 shrink-0'>
                    <Image
                      src={method.logo}
                      alt={method.name}
                      fill
                      sizes='32px'
                      className='object-contain'
                    />
                  </div>
                  <span className='flex-1 text-sm font-medium text-neutral-950'>
                    {method.name}
                  </span>
                  <div
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border-2',
                      selectedPayment === method.id
                        ? 'border-brand-primary'
                        : 'border-neutral-300'
                    )}
                  >
                    {selectedPayment === method.id && (
                      <div className='bg-brand-primary size-2.5 rounded-full' />
                    )}
                  </div>
                  <input
                    type='radio'
                    name='payment-mobile'
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className='sr-only'
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Payment Summary (Mobile) */}
          <section className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-5 md:p-6 lg:hidden'>
            <h3 className='text-md font-extrabold text-neutral-950 md:text-lg'>
              Payment Summary
            </h3>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-normal text-neutral-950'>
                  Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
                <span className='text-sm font-bold text-neutral-950'>
                  Rp{subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-normal text-neutral-950'>
                  Delivery Fee
                </span>
                <span className='text-sm font-bold text-neutral-950'>
                  Rp{deliveryFee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-normal text-neutral-950'>
                  Service Fee
                </span>
                <span className='text-sm font-bold text-neutral-950'>
                  Rp{serviceFee.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='my-2 h-px bg-neutral-100' />
              <div className='flex items-center justify-between'>
                <span className='text-md font-bold text-neutral-950'>
                  Total
                </span>
                <span className='text-md font-extrabold text-neutral-950'>
                  Rp{total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={checkout.isPending}
              className='text-md h-12 w-full rounded-full font-bold'
            >
              {checkout.isPending ? 'Processing...' : 'Buy'}
            </Button>
          </section>
        </div>

        {/* Right Column: Payment Method & Summary (Desktop) */}
        <aside className='hidden w-full shrink-0 lg:block lg:w-90'>
          <div className='shadow-card sticky top-24 flex flex-col gap-6 rounded-2xl bg-white p-6'>
            {/* Payment Method */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-lg font-extrabold text-neutral-950'>
                Payment Method
              </h3>
              <div className='flex flex-col gap-3'>
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors',
                      selectedPayment === method.id
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className='relative size-8 shrink-0'>
                      <Image
                        src={method.logo}
                        alt={method.name}
                        fill
                        sizes='32px'
                        className='object-contain'
                      />
                    </div>
                    <span className='flex-1 text-sm font-medium text-neutral-950'>
                      {method.name}
                    </span>
                    <div
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full border-2',
                        selectedPayment === method.id
                          ? 'border-brand-primary'
                          : 'border-neutral-300'
                      )}
                    >
                      {selectedPayment === method.id && (
                        <div className='bg-brand-primary size-2.5 rounded-full' />
                      )}
                    </div>
                    <input
                      type='radio'
                      name='payment-desktop'
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className='sr-only'
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-lg font-extrabold text-neutral-950'>
                Payment Summary
              </h3>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-normal text-neutral-950'>
                    Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className='text-sm font-bold text-neutral-950'>
                    Rp{subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-normal text-neutral-950'>
                    Delivery Fee
                  </span>
                  <span className='text-sm font-bold text-neutral-950'>
                    Rp{deliveryFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-normal text-neutral-950'>
                    Service Fee
                  </span>
                  <span className='text-sm font-bold text-neutral-950'>
                    Rp{serviceFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='my-2 h-px bg-neutral-100' />
                <div className='flex items-center justify-between'>
                  <span className='text-md font-bold text-neutral-950'>
                    Total
                  </span>
                  <span className='text-lg font-extrabold text-neutral-950'>
                    Rp{total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkout.isPending}
                className='text-md mt-2 h-12 w-full rounded-full font-bold'
              >
                {checkout.isPending ? 'Processing...' : 'Buy'}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
