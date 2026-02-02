'use client';

import * as React from 'react';
import { useCart, useCheckout } from '@/services/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { CartGroup, CartItemNested } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData } = useCart();
  const checkout = useCheckout();

  const total =
    cartData?.reduce(
      (acc: number, group: CartGroup) => acc + group.subtotal,
      0
    ) || 0;

  const handleCheckout = () => {
    const payload = {
      restaurants: cartData?.map((group: CartGroup) => ({
        restaurantId: group.restaurant.id,
        items: group.items.map((item: CartItemNested) => ({
          menuId: item.menu.id,
          quantity: item.quantity,
        })),
      })),
      deliveryAddress: 'Jl. Sudirman No. 25, Jakarta Pusat, 10220', // TODO: From form
      phone: '081234567890', // TODO: From form
      paymentMethod: 'CASH',
      notes: '',
    };

    checkout.mutate(payload, {
      onSuccess: () => router.push('/checkout/success'),
    });
  };

  return (
    <div className='custom-container mx-auto flex flex-col gap-10 py-32 pb-40 lg:flex-row'>
      <div className='flex flex-1 flex-col gap-8'>
        <h1 className='text-display-sm font-extrabold text-neutral-950'>
          Checkout
        </h1>

        <div className='flex flex-col gap-6 rounded-2xl border border-neutral-100 p-8'>
          <h3 className='text-lg font-bold text-neutral-950'>
            Delivery Address
          </h3>
          <div className='flex flex-col gap-4'>
            <Input placeholder='Full Name' className='h-12 rounded-xl' />
            <Input
              placeholder='Phone Number (e.g. 0812...)'
              className='h-12 rounded-xl'
            />
            <Textarea
              placeholder='Full Address'
              className='min-h-32 rounded-xl'
            />
          </div>
        </div>

        <div className='flex flex-col gap-6 rounded-2xl border border-neutral-100 p-8'>
          <h3 className='text-lg font-bold text-neutral-950'>Payment Method</h3>
          <Select defaultValue='CASH'>
            <SelectTrigger className='h-14 rounded-xl'>
              <SelectValue placeholder='Select Payment' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='CASH'>Cash on Delivery</SelectItem>
              <SelectItem value='VA'>Virtual Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <aside className='w-full max-w-sm shrink-0'>
        <div className='sticky top-24 flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl'>
          <h3 className='text-lg font-bold text-neutral-950'>Order Summary</h3>
          <div className='flex flex-col gap-6'>
            {cartData?.map((group: CartGroup) => (
              <div key={group.restaurant.id} className='flex flex-col gap-2'>
                <p className='text-xs font-bold text-neutral-400 uppercase'>
                  {group.restaurant.name}
                </p>
                <div className='flex flex-col gap-2'>
                  {group.items.map((item: CartItemNested) => (
                    <div
                      key={item.id}
                      className='flex justify-between gap-4 text-sm'
                    >
                      <span className='text-neutral-500'>
                        {item.quantity}x {item.menu.foodName}
                      </span>
                      <span className='font-bold'>
                        Rp{' '}
                        {(item.menu.price * item.quantity).toLocaleString(
                          'id-ID'
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='h-px bg-neutral-100' />
          <div className='flex items-center justify-between'>
            <span className='font-medium text-neutral-500'>Total</span>
            <span className='text-xl font-extrabold text-neutral-950'>
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
          <Button
            className='text-md mt-4 h-14 w-full rounded-2xl font-bold'
            onClick={handleCheckout}
          >
            Pay Now
          </Button>
        </div>
      </aside>
    </div>
  );
}
