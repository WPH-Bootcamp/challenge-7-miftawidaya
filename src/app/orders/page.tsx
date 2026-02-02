'use client';

import * as React from 'react';
import { useOrders } from '@/services/queries';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className='custom-container mx-auto flex flex-col gap-10 py-32'>
      <h1 className='text-display-sm font-extrabold text-neutral-950'>
        My Orders
      </h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='flex flex-col gap-6'>
          {orders?.map((order: Order) => (
            <div
              key={order.id}
              className='flex items-center justify-between gap-6 rounded-2xl border border-neutral-100 p-6'
            >
              <div className='flex items-center gap-6'>
                <div className='relative size-20 overflow-hidden rounded-xl bg-neutral-100'>
                  <Image
                    src={order.restaurantImage || '/images/placeholder.png'}
                    alt={order.restaurantName}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-lg font-bold text-neutral-950'>
                    {order.restaurantName}
                  </h3>
                  <p className='text-sm text-neutral-500'>
                    {order.items} Items • {order.date}
                  </p>
                  <span className='text-md font-extrabold text-neutral-950'>
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <Badge
                variant='outline'
                className={cn(
                  'rounded-lg px-4 py-1.5 text-xs font-bold uppercase',
                  order.status === 'DELIVERED'
                    ? 'bg-status-success/10 text-status-success border-status-success/20'
                    : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                )}
              >
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
