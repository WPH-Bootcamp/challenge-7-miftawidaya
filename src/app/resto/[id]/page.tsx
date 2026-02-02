'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { useRestaurantDetail } from '@/services/queries';
import { MenuCard, ReviewCard } from '@/components/menu/MenuElements';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { data: restaurant, isLoading } = useRestaurantDetail(id as string);

  if (isLoading)
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  if (!restaurant)
    return (
      <div className='flex h-screen items-center justify-center'>
        Restaurant not found
      </div>
    );

  const foods = restaurant.menu.filter((item) => item.category === 'FOOD');
  const drinks = restaurant.menu.filter((item) => item.category === 'DRINK');

  return (
    <div className='flex flex-col pb-20'>
      {/* Header / Gallery */}
      <div className='relative h-60 w-full overflow-hidden md:h-100'>
        <Image
          src={restaurant.image || '/images/placeholder.png'}
          alt={restaurant.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-black/30' />
      </div>

      <div className='custom-container relative z-10 mx-auto -mt-20'>
        <div className='rounded-3xl bg-white p-6 shadow-xl md:p-10'>
          <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-display-sm md:text-display-md font-extrabold text-neutral-950'>
                {restaurant.name}
              </h1>
              <div className='flex items-center gap-4 text-sm font-medium text-neutral-500'>
                <div className='flex items-center gap-1.5'>
                  <Icon
                    icon='ri:map-pin-2-fill'
                    className='text-brand-primary size-5'
                  />
                  {restaurant.place}
                </div>
                <div className='flex items-center gap-1.5'>
                  <Icon icon='ri:star-fill' className='text-rating size-5' />
                  <span className='font-bold text-neutral-950'>
                    {restaurant.rating}
                  </span>
                  ({restaurant.totalReview} Reviews)
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue='menu' className='mt-10'>
            <TabsList className='h-14 w-full justify-start gap-8 rounded-2xl bg-neutral-100/50 p-2'>
              <TabsTrigger
                value='menu'
                className='text-md px-8 py-2 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'
              >
                Menu
              </TabsTrigger>
              <TabsTrigger
                value='reviews'
                className='text-md px-8 py-2 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value='menu' className='mt-8 flex flex-col gap-10'>
              <div className='flex flex-col gap-6'>
                <h3 className='text-xl font-extrabold text-neutral-950'>
                  Foods
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {foods.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-6'>
                <h3 className='text-xl font-extrabold text-neutral-950'>
                  Drinks
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {drinks.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value='reviews' className='mt-8'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {restaurant.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
