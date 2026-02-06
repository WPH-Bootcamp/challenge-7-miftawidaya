'use client';

/**
 * Category Page
 * Matches specifications for the filtered view.
 */

import * as React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { FilterContent } from '@/components/home/FilterContent';
import { RestaurantGrid } from '@/components/menu/RestaurantGrid';
import { useRestaurants } from '@/services/queries';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilters, setSearchQuery } from '@/features/filter/filterSlice';
import { Icon } from '@iconify/react';
import {
  RECOMMENDED_INITIAL_COUNT,
  RECOMMENDED_LOAD_INCREMENT,
} from '@/config/constants';
import { FilterSheet } from '@/components/home/FilterSheet';
import { FilterLines } from '@untitledui/icons';
import { cn } from '@/lib/utils';
import { RootState } from '@/features/store';

const getCategoryLabel = (id: string, searchQuery?: string) => {
  if (searchQuery) return searchQuery;
  if (id === 'all') return 'All Restaurant';
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const mapDistanceToMeters = (
  distanceLabel: string | null
): number | undefined => {
  if (!distanceLabel) return undefined;
  if (distanceLabel === 'Nearby') return 500;
  if (distanceLabel === 'Within 1 km') return 1000;
  if (distanceLabel === 'Within 3 km') return 3000;
  if (distanceLabel === 'Within 5 km') return 5000;
  return undefined;
};

export default function CategoryPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const categoryId = typeof id === 'string' ? id : 'all';
  const {
    latitude,
    longitude,
    isLoading: isLoadingLocation,
    requestLocation,
  } = useLocation();

  const { minPrice, maxPrice, rating, distance, searchQuery } = useSelector(
    (state: RootState) => state.filter
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClearFilters = () => {
    dispatch(resetFilters());
    router.push(`/category/${categoryId}`);
  };

  // 1. Sync URL -> Redux on mount and param change
  React.useEffect(() => {
    dispatch(setSearchQuery(initialSearch));
  }, [dispatch, initialSearch]);

  // 2. Sync Redux -> URL on change
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    const newUrl = `/category/${categoryId}?${params.toString()}`;
    // Use replace to avoid polluting depth history
    globalThis.history.replaceState(
      { ...globalThis.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
  }, [searchQuery, categoryId, searchParams]);

  // Automatically request location if "nearby" is selected
  React.useEffect(() => {
    if (categoryId === 'nearby') {
      requestLocation();
    }
  }, [categoryId, requestLocation]);

  const { data: restaurants, isLoading: isLoadingData } = useRestaurants(
    {
      ...(categoryId !== 'all' && { category: categoryId }),
      ...(latitude !== null && { lat: latitude }),
      ...(longitude !== null && { lng: longitude }),
      ...(minPrice && { priceMin: Number(minPrice) }),
      ...(maxPrice && { priceMax: Number(maxPrice) }),
      ...(rating !== null && { rating: Number(rating) }),
      ...(distance && { range: mapDistanceToMeters(distance) }),
      ...(searchQuery && { search: searchQuery }),
    },
    { enabled: !isLoadingLocation }
  );

  const isLoading = isLoadingLocation || isLoadingData;

  // 3. Client-side filtering as a refinement layer
  // Specifically for Rating: 4.0 - 4.9 maps to '4', etc.
  const filteredRestaurants = React.useMemo(() => {
    if (!restaurants) return [];
    let list = [...restaurants];

    if (rating !== null) {
      list = list.filter((r) => Math.floor(r.rating) === rating);
    }

    return list;
  }, [restaurants, rating]);

  const [visibleCount, setVisibleCount] = React.useState(
    RECOMMENDED_INITIAL_COUNT
  );

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + RECOMMENDED_LOAD_INCREMENT);
  };

  const visibleRestaurants = filteredRestaurants.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRestaurants.length;
  const isListLongEnough =
    filteredRestaurants.length >= RECOMMENDED_INITIAL_COUNT;

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const renderRestaurants = () => {
    if (isLoading) {
      return <RestaurantGrid restaurants={[]} isLoading columns={2} />;
    }

    if (visibleRestaurants && visibleRestaurants.length > 0) {
      return (
        <RestaurantGrid
          restaurants={visibleRestaurants}
          isLoading={false}
          columns={2}
        />
      );
    }

    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='mb-6 flex size-16 items-center justify-center rounded-full bg-neutral-100'>
          <Icon icon='ri:search-line' className='size-8 text-neutral-400' />
        </div>
        <h3 className='text-lg font-bold text-neutral-950'>
          No restaurants found
        </h3>
        <p className='mt-2 mb-8 max-w-96 text-sm text-neutral-500'>
          We couldn't find any restaurants matching your current search or
          filters. Try adjusting them or clear all filters.
        </p>
        <Button
          onClick={handleClearFilters}
          className='bg-brand-primary hover:bg-brand-primary/90 h-11 rounded-full px-8 font-bold text-white'
        >
          Clear all filters
        </Button>
      </div>
    );
  };

  return (
    <div className='flex flex-col pt-24 pb-20 md:pt-32 md:pb-40'>
      <FilterSheet isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} />

      <div className='custom-container mx-auto flex flex-col gap-4 lg:gap-8'>
        {/* Title (Above the split) */}
        <div>
          <h2 className='text-display-xs md:text-display-sm font-extrabold text-neutral-950'>
            {getCategoryLabel(categoryId, searchQuery)}
          </h2>
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className='text-brand-primary hover:text-brand-primary/80 mt-2 flex items-center gap-1.5 text-sm font-bold transition-colors'
            >
              <Icon icon='ri:close-circle-fill' className='size-5' />
              <span>Clear search results for "{searchQuery}"</span>
            </button>
          )}
        </div>

        {/* Mobile Filter Trigger */}
        <button
          type='button'
          onClick={() => setIsFilterOpen(true)}
          className={cn(
            'shadow-card flex h-13 w-full items-center justify-between rounded-xl bg-white p-4 transition-transform active:scale-95 lg:hidden'
          )}
        >
          <span className='text-sm leading-7 font-extrabold text-neutral-950'>
            FILTER
          </span>

          <FilterLines className='size-5 text-neutral-950' strokeWidth={1.67} />
        </button>

        <div className='flex flex-col gap-10 lg:flex-row'>
          {/* 2. Left Sidebar Filter - Persistent on this page */}
          <aside className='hidden w-66.5 shrink-0 lg:block'>
            <div className='shadow-card sticky top-24 rounded-xl border border-neutral-100 bg-white'>
              <FilterContent />
            </div>
          </aside>

          {/* 3. Main Content Column (Filtered Grid) */}
          <main className='flex flex-1 flex-col'>
            <section>
              {renderRestaurants()}

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
                      No more restaurants to show
                    </p>
                  )}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
