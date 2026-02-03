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

/**
 * SearchBar Component (Internal)
 * Renders a rounded search input with icon for restaurant search.
 */
function SearchBar() {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Navigate to search results page
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'flex w-full items-center gap-1.5 rounded-full bg-white',
        'md:w-hero-search-desktop h-12 px-4 md:h-14 md:px-6'
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
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search restaurants, food and drink'
        className={cn(
          'grow bg-transparent outline-none placeholder:text-neutral-600',
          'md:text-md text-sm tracking-tight'
        )}
        aria-label='Search restaurants'
      />
      <span className='sr-only'>Search restaurants, food and drink</span>
    </form>
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
      className='relative flex h-screen min-h-160 w-full items-center justify-center overflow-hidden bg-neutral-900'
      aria-label='Hero section'
    >
      {/* Background Image Container */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/bg-hero.jpg'
          alt='Delicious food background'
          fill
          className='object-cover object-center'
          priority
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
