'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

import { Logo } from '@/components/icons/Logo';
import { ROUTES } from '@/config/routes';
import { useOrders } from '@/services/queries/orders';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * CheckoutSuccessPage
 * @description Displays a payment success confirmation with order details.
 * Wraps the content in Suspense to handle useSearchParams() during build/SSR.
 */
export default function CheckoutSuccessPage() {
  return (
    <React.Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </React.Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id');
  const { data: orders, isLoading } = useOrders();

  // Find the specific order that matches the transaction ID
  const order = orders?.find(
    (o) =>
      String(o.transactionId) === transactionId ||
      String(o.id) === transactionId
  );

  // If loading or searching for the order
  if (isLoading || (transactionId && !order)) {
    return <SuccessSkeleton />;
  }

  // Fallback if no order found
  const orderDetails = order
    ? {
        date: dayjs(order.createdAt).locale('id').format('D MMMM YYYY, HH:mm'),
        paymentMethod: order.paymentMethod,
        itemCount: order.restaurants.reduce(
          (acc, r) => acc + r.items.reduce((sum, i) => sum + i.quantity, 0),
          0
        ),
        subtotal: order.pricing.subtotal,
        deliveryFee: order.pricing.deliveryFee,
        serviceFee: order.pricing.serviceFee,
        total: order.pricing.totalPrice,
      }
    : {
        date: dayjs().locale('id').format('D MMMM YYYY, HH:mm'),
        paymentMethod: '-',
        itemCount: 0,
        subtotal: 0,
        deliveryFee: 0,
        serviceFee: 0,
        total: 0,
      };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-8'>
      {/* Main Container */}
      <div className='flex w-full max-w-107 flex-col items-center gap-7'>
        {/* Logo Header */}
        <Link
          href={ROUTES.HOME}
          className='flex items-center justify-center gap-3.75 transition-opacity hover:opacity-80'
        >
          <Logo className='text-brand-primary size-10.5' />
          <span className='text-display-md font-extrabold text-neutral-950'>
            Foody
          </span>
        </Link>

        {/* Success Card */}
        <div className='shadow-card relative flex w-full flex-col items-center gap-4 rounded-2xl bg-white p-4 md:p-5'>
          {/* Decorative circles - top */}
          <div className='pointer-events-none absolute -start-2.5 top-34 size-5 rounded-full bg-neutral-50 md:-start-2.5 md:top-34.5' />
          <div className='pointer-events-none absolute -end-2.5 top-34 size-5 rounded-full bg-neutral-50 md:-end-2.5 md:top-34.5' />

          {/* Decorative circles - bottom */}
          <div className='pointer-events-none absolute -start-2.5 bottom-32 size-5 rounded-full bg-neutral-50 md:-start-2.5 md:bottom-28' />
          <div className='pointer-events-none absolute -end-2.5 bottom-32 size-5 rounded-full bg-neutral-50 md:-end-2.5 md:bottom-28' />

          {/* Success Icon & Message */}
          <div className='flex flex-col items-center gap-0.5'>
            <div className='flex size-16 items-center justify-center'>
              <Icon
                icon='icon-park-solid:check-one'
                className='size-16 text-[#44AB09]'
                aria-hidden='true'
              />
            </div>
            <h1 className='text-lg font-extrabold tracking-tight text-neutral-950 md:text-xl'>
              Payment Success
            </h1>
            <p className='md:text-md text-center text-sm font-normal tracking-tight text-neutral-950'>
              {order
                ? 'Your payment has been successfully processed.'
                : 'Could not retrieve your recent order details, but your payment was successful.'}
            </p>
          </div>

          {/* Dashed Divider */}
          <div className='w-full border-t border-dashed border-neutral-300' />

          {/* Order Details */}
          <div className='flex w-full flex-col gap-0'>
            {/* Date */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Date
              </span>
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                {orderDetails.date}
              </span>
            </div>

            {/* Payment Method */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Payment Method
              </span>
              <span className='md:text-md text-right text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                {orderDetails.paymentMethod}
              </span>
            </div>

            {/* Price */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Price ({orderDetails.itemCount} items)
              </span>
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                Rp{orderDetails.subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Delivery Fee */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Delivery Fee
              </span>
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                Rp{orderDetails.deliveryFee.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Service Fee */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Service Fee
              </span>
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                Rp{orderDetails.serviceFee.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className='w-full border-t border-dashed border-neutral-300' />

          {/* Total */}
          <div className='flex w-full items-center justify-between'>
            <span className='text-md font-normal tracking-tight text-neutral-950 md:text-lg'>
              Total
            </span>
            <span className='text-md font-extrabold text-neutral-950 md:text-lg'>
              Rp{orderDetails.total.toLocaleString('id-ID')}
            </span>
          </div>

          {/* CTA Button */}
          <Link
            href={ROUTES.ORDERS}
            className='bg-brand-primary text-md text-neutral-25 flex h-11 w-full items-center justify-center rounded-full font-bold tracking-tight transition-opacity hover:opacity-90 md:h-12'
          >
            See My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <div className='flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-32 md:py-52'>
      <div className='flex w-full max-w-107 flex-col items-center gap-7'>
        {/* Logo Placeholder */}
        <div className='flex items-center gap-3.75'>
          <Skeleton className='size-10.5 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-lg' />
        </div>

        {/* Card Skeleton */}
        <div className='shadow-card flex w-full flex-col items-center gap-6 rounded-2xl bg-white p-5'>
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className='size-16 rounded-full' />
            <Skeleton className='h-7 w-48 rounded-lg' />
            <Skeleton className='h-5 w-64 rounded-lg' />
          </div>

          <div className='w-full border-t border-dashed border-neutral-200' />

          <div className='flex w-full flex-col gap-3'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='flex justify-between'>
                <Skeleton className='h-5 w-24 rounded-md' />
                <Skeleton className='h-5 w-32 rounded-md' />
              </div>
            ))}
          </div>

          <div className='w-full border-t border-dashed border-neutral-200' />

          <div className='flex w-full justify-between'>
            <Skeleton className='h-7 w-20 rounded-md' />
            <Skeleton className='h-7 w-32 rounded-md' />
          </div>

          <Skeleton className='h-12 w-full rounded-full' />
        </div>
      </div>
    </div>
  );
}
