'use client';

/**
 * Home Page
 * @description The main landing page of the Restaurant App.
 * Features HeroSection with search, CategoryFilter, and RestaurantGrid.
 */

import * as React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryFilter } from '@/components/home/CategoryFilter';

import { RestaurantGrid } from '@/components/menu/RestaurantGrid';
import { useRecommendedRestaurants } from '@/services/queries';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: recommended, isLoading } =
    useRecommendedRestaurants(isAuthenticated);

  return (
    <div className='flex flex-col'>
      {/* 1. Hero Section - Persistent on home */}
      <HeroSection />

      {/* 2. Main Content Area */}
      <div className='custom-container mx-auto mt-12 flex flex-col pb-20 md:pb-40'>
        {/* Category Filter - Entry point for navigation */}
        <CategoryFilter />

        {/* 3. Restaurant Grid Area - Full Width for Home */}
        <main className='mt-10 flex flex-col gap-10'>
          <section>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='text-display-xs font-extrabold text-neutral-950'>
                Recommended
              </h2>
              <button
                type='button'
                className='text-brand-primary text-sm font-bold hover:underline'
              >
                See All
              </button>
            </div>

            <RestaurantGrid restaurants={recommended} isLoading={isLoading} />
          </section>
        </main>
      </div>
    </div>
  );
}
