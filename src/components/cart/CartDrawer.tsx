'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/services/queries';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ROUTES } from '@/config/routes';
import Link from 'next/link';
import { CartGroup, CartItemNested } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ isOpen, onOpenChange }: CartDrawerProps) {
  const { data: cartData, isLoading } = useCart();

  const total =
    cartData?.reduce(
      (acc: number, group: CartGroup) => acc + group.subtotal,
      0
    ) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col p-0 sm:max-w-md'>
        <SheetHeader className='border-b border-neutral-100 p-6'>
          <SheetTitle className='text-display-xs font-extrabold'>
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto p-6'>
          {isLoading ? (
            <div className='flex h-full items-center justify-center'>
              Loading...
            </div>
          ) : !cartData?.length ? (
            <div className='flex h-full flex-col items-center justify-center text-center'>
              <Icon
                icon='lets-icons:bag-fill'
                className='size-20 text-neutral-200'
              />
              <p className='mt-4 text-lg font-bold text-neutral-950'>
                Your cart is empty
              </p>
              <p className='text-sm text-neutral-500'>
                Order your favorite food now!
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-8'>
              {cartData.map((group: CartGroup) => (
                <div key={group.restaurant.id} className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2'>
                    <Icon
                      icon='ri:restaurant-line'
                      className='text-brand-primary size-5'
                    />
                    <h3 className='text-md font-bold text-neutral-950'>
                      {group.restaurant.name}
                    </h3>
                  </div>
                  <div className='flex flex-col gap-6'>
                    {group.items.map((item: CartItemNested) => (
                      <div key={item.id} className='flex items-center gap-4'>
                        <div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100'>
                          <Image
                            src={item.menu.image || '/images/placeholder.png'}
                            alt={item.menu.foodName}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                          <h4 className='text-sm font-bold text-neutral-950'>
                            {item.menu.foodName}
                          </h4>
                          <p className='text-xs font-extrabold text-neutral-950'>
                            Rp {item.menu.price.toLocaleString('id-ID')}
                          </p>
                          <div className='mt-1 flex items-center gap-3'>
                            <button className='flex size-6 items-center justify-center rounded-md border border-neutral-200'>
                              -
                            </button>
                            <span className='text-xs font-bold'>
                              {item.quantity}
                            </span>
                            <button className='flex size-6 items-center justify-center rounded-md border border-neutral-200'>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(cartData?.length ?? 0) > 0 && (
          <div className='flex flex-col gap-4 border-t border-neutral-100 p-6 shadow-2xl'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-neutral-500'>
                Total Price
              </span>
              <span className='text-xl font-extrabold text-neutral-950'>
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <Link href={ROUTES.CHECKOUT} className='w-full'>
              <Button
                className='text-md h-14 w-full rounded-2xl font-bold'
                onClick={() => onOpenChange(false)}
              >
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
