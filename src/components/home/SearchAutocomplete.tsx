'use client';

import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRestaurants } from '@/services/queries';
import { ROUTES } from '@/config/routes';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SearchAutocomplete({
  query,
  isOpen,
  onClose,
}: SearchAutocompleteProps) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: restaurants, isLoading } = useRestaurants(
    { search: debouncedQuery },
    { enabled: isOpen && debouncedQuery.length >= 2 }
  );

  if (!isOpen || debouncedQuery.length < 2) return null;

  const results = restaurants?.slice(0, 5) || [];
  const hasResults = results.length > 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col gap-2 p-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='size-10 rounded-lg' />
              <div className='flex flex-col gap-1'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-20' />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (hasResults) {
      return (
        <div className='flex flex-col'>
          {results.map((resto) => (
            <Link
              key={resto.id}
              href={ROUTES.RESTAURANT_DETAIL(resto.id)}
              onClick={onClose}
              className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50'
            >
              <div className='relative size-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100'>
                {resto.logo ? (
                  <Image
                    src={resto.logo}
                    alt={resto.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex size-full items-center justify-center'>
                    <Icon
                      icon='ri:restaurant-line'
                      className='size-5 text-neutral-400'
                    />
                  </div>
                )}
              </div>
              <div className='flex flex-col overflow-hidden'>
                <span className='truncate text-sm font-bold text-neutral-950'>
                  {resto.name}
                </span>
                <span className='truncate text-xs text-neutral-500'>
                  {resto.category}
                </span>
              </div>
            </Link>
          ))}
          <Link
            href={`${ROUTES.CATEGORY('all')}?search=${encodeURIComponent(query)}`}
            onClick={onClose}
            className='text-brand-primary border-t border-neutral-100 px-4 py-3 text-center text-sm font-bold transition-colors hover:bg-neutral-50'
          >
            See all results for "{query}"
          </Link>
        </div>
      );
    }

    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Icon icon='ri:search-line' className='mb-2 size-8 text-neutral-300' />
        <p className='text-sm font-medium text-neutral-500'>
          No restaurants found for "{query}"
        </p>
      </div>
    );
  };

  return (
    <div className='shadow-card absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white py-2'>
      {renderContent()}
    </div>
  );
}
