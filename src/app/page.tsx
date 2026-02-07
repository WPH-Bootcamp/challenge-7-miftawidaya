'use client';

/**
 * Home Page
 * @description The main landing page of the Restaurant App.
 * Features HeroSection with search, CategoryFilter, and RestaurantGrid.
 */

import * as React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryFilter } from '@/components/home/CategoryFilter';
import Link from 'next/link';

import { RestaurantGrid } from '@/components/menu/RestaurantGrid';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useRecommendedRestaurants } from '@/services/queries';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { useLocation } from '@/context/LocationContext';
import {
  RECOMMENDED_INITIAL_COUNT,
  RECOMMENDED_LOAD_INCREMENT,
} from '@/config/constants';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { latitude, longitude, isLoading: isLoadingLocation } = useLocation();

  const { data: recommended, isLoading: isLoadingData } =
    useRecommendedRestaurants(
      isAuthenticated,
      {
        ...(latitude !== null && { lat: latitude }),
        ...(longitude !== null && { lng: longitude }),
      },
      { enabled: !isLoadingLocation }
    );

  const isLoading = isLoadingLocation || isLoadingData;

  const [visibleCount, setVisibleCount] = React.useState(
    RECOMMENDED_INITIAL_COUNT
  );

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + RECOMMENDED_LOAD_INCREMENT);
  };

  const visibleRestaurants = recommended?.slice(0, visibleCount);
  const hasMore = recommended && visibleCount < recommended.length;
  const isListLongEnough =
    recommended && recommended.length >= RECOMMENDED_INITIAL_COUNT;

  return (
    <div className='flex flex-col'>
      {/* 1. Hero Section - Persistent on home */}
      <HeroSection />

      {/* 2. Main Content Area */}
      <div className='custom-container flex flex-col gap-12 pt-6 pb-12 md:mx-auto md:pt-12 md:pb-25'>
        {/* Category Filter - Entry point for navigation */}
        <CategoryFilter />

        {/* 3. Restaurant Grid Area - Full Width for Home */}
        <main className='flex flex-col gap-10'>
          <section>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='text-display-xs font-extrabold text-neutral-950'>
                Recommended
              </h2>
              <Link
                href={ROUTES.CATEGORY('all')}
                className='text-brand-primary text-sm font-bold hover:underline'
              >
                See All
              </Link>
            </div>

            <RestaurantGrid
              restaurants={visibleRestaurants}
              isLoading={isLoading}
            />

            {/* Pagination Logic */}
            {isListLongEnough && (
              <div className='mt-4 flex min-h-10 items-center justify-center md:mt-8 md:min-h-12'>
                {hasMore ||
                (visibleCount === RECOMMENDED_INITIAL_COUNT &&
                  isListLongEnough) ? (
                  <Button
                    variant='outline'
                    onClick={handleShowMore}
                    className='md:text-md h-10 w-40 text-sm leading-7 md:h-12 md:leading-7.5'
                  >
                    Show More
                  </Button>
                ) : (
                  <p className='text-md font-medium text-neutral-500 italic'>
                    You&apos;ve reached the end of our recommendations
                  </p>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
