'use client';

/**
 * HeroSection Component
 *
 * Full-viewport hero section for the home page featuring:
 * - Background image with gradient overlay
 * - Centered headline and subtitle
 * - Search bar for restaurant discovery
 * - Reveal animation on load
 */

import * as React from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';

import { SearchAutocomplete } from './SearchAutocomplete';
import { useAppDispatch, useAppSelector } from '@/features/store';
import { setSearchQuery } from '@/features/filter/filterSlice';

/**
 * SearchBar Component (Internal)
 * Renders a rounded search input with icon for restaurant search.
 */
function SearchBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.filter.searchQuery);
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(
        `${ROUTES.CATEGORY('all')}?search=${encodeURIComponent(query)}`
      );
    }
  };

  // Close autocomplete when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className='md:w-hero-search-desktop relative w-full'
    >
      <form
        onSubmit={handleSearch}
        className={cn(
          'flex w-full items-center gap-1.5 rounded-full bg-white transition-all',
          'h-12 px-4 md:h-14 md:px-6',
          isFocused && 'ring-brand-primary/20 ring-2'
        )}
      >
        <Icon
          icon='heroicons:magnifying-glass'
          className='size-5 shrink-0 text-neutral-500'
          aria-hidden='true'
        />
        <input
          type='text'
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder='Search restaurants, food and drink'
          className={cn(
            'grow bg-transparent outline-none placeholder:text-neutral-600',
            'md:text-md text-sm tracking-tight'
          )}
          aria-label='Search restaurants'
        />
        <span className='sr-only'>Search restaurants, food and drink</span>
      </form>

      <SearchAutocomplete
        query={query}
        isOpen={isFocused && query.length >= 2}
        onClose={() => setIsFocused(false)}
      />
    </div>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Trigger reveal animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className='relative z-20 flex h-screen min-h-160 w-full items-center justify-center bg-neutral-900'
      aria-label='Hero section'
    >
      {/* Background Image Container */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/bg-hero.jpg'
          alt='Delicious food background'
          fill
          className='object-cover object-center'
          preload
          fetchPriority='high'
          sizes='100vw'
        />
        {/* Gradient Overlay */}
        <div className='hero-overlay absolute inset-0' aria-hidden='true' />
      </div>

      {/* Content Container */}
      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-center px-6',
          'transition-all duration-700 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <div className='max-w-hero-content-mobile flex w-full flex-col items-center gap-6 md:max-w-none md:gap-10'>
          {/* Text Block */}
          <div className='flex flex-col items-center gap-1 text-center md:gap-2'>
            {/* Headline */}
            <h1
              className={cn(
                'font-extrabold text-white',
                'text-display-lg leading-11',
                'md:text-display-2xl md:leading-15 md:whitespace-nowrap'
              )}
            >
              Explore Culinary Experiences
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                'font-bold tracking-tight text-white',
                'text-lg leading-8',
                'md:text-display-xs md:leading-9 md:whitespace-nowrap'
              )}
            >
              Search and refine your choice to discover the perfect restaurant.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
