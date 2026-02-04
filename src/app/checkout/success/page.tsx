'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';

import { Logo } from '@/components/icons/Logo';
import { ROUTES } from '@/config/routes';

/**
 * CheckoutSuccessPage
 * @description Displays a payment success confirmation with order details.
 * Design follows Figma specifications with responsive layout for desktop and mobile.
 * This page has no Navbar or Footer per design requirements.
 */
export default function CheckoutSuccessPage() {
  // Placeholder data - In production, this would come from the checkout state or API
  const orderDetails = {
    date: '25 August 2025, 15:51',
    paymentMethod: 'Bank Rakyat Indonesia',
    itemCount: 2,
    price: 100000,
    deliveryFee: 10000,
    serviceFee: 1000,
  };

  const total =
    orderDetails.price + orderDetails.deliveryFee + orderDetails.serviceFee;

  return (
    <div className='flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-32 md:py-52'>
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
              Your payment has been successfully processed.
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
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                {orderDetails.paymentMethod}
              </span>
            </div>

            {/* Price */}
            <div className='flex items-center justify-between py-0'>
              <span className='md:text-md text-sm font-medium text-neutral-950'>
                Price ({orderDetails.itemCount} items)
              </span>
              <span className='md:text-md text-sm font-semibold tracking-tight text-neutral-950 md:font-bold'>
                Rp{orderDetails.price.toLocaleString('id-ID')}
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
              Rp{total.toLocaleString('id-ID')}
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
