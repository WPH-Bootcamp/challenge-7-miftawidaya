'use client';

/**
 * CategoryFilter Component
 *
 * Renders a horizontal list of categories.
 * Clicking a category navigates to the specific category page with filters.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FilterSheet } from './FilterSheet';
import { ROUTES } from '@/config/routes';

/**
 * Category data representing the available food/service types.
 */
const categories = [
  { id: 'all', label: 'All Restaurant', icon: '/images/category-all-food.png' },
  { id: 'nearby', label: 'Nearby', icon: '/images/category-location.png' },
  { id: 'discount', label: 'Discount', icon: '/images/category-discount.png' },
  {
    id: 'best-seller',
    label: 'Best Seller',
    icon: '/images/category-best-seller.png',
  },
  { id: 'delivery', label: 'Delivery', icon: '/images/category-delivery.png' },
  { id: 'lunch', label: 'Lunch', icon: '/images/category-lunch.png' },
];

type CategoryFilterProps = Readonly<{
  activeCategory?: string;
}>;

export function CategoryFilter({ activeCategory = '' }: CategoryFilterProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const handleCategoryClick = (id: string) => {
    router.push(ROUTES.CATEGORY(id));

    // On mobile, automatically show the Sheet after navigation (optional UX)
    if (window.innerWidth < 1024) {
      setIsFilterOpen(true);
    }
  };

  return (
    <section className='w-full pb-3 md:pb-12' aria-label='Food categories'>
      {/* Mobile-only Filter Sheet */}
      <FilterSheet isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} />

      <div
        className={cn(
          'mx-auto flex items-center',
          'flex-wrap justify-center gap-(--spacing-category-gap-mobile)',
          'md:gap-category-gap-desktop md:w-full md:flex-nowrap md:justify-between md:p-0'
        )}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            type='button'
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              'flex flex-col items-center gap-1 transition-transform outline-none hover:scale-105 md:gap-1.5',
              'w-category-item-mobile md:w-category-item-desktop'
            )}
            aria-pressed={activeCategory === category.id}
          >
            {/* Image Container (Frame 8) */}
            <div
              className={cn(
                'shadow-card flex items-center justify-center rounded-2xl bg-white transition-all',
                'h-category-item w-full',
                activeCategory === category.id
                  ? 'ring-brand-primary ring-2'
                  : 'hover:ring-1 hover:ring-neutral-200'
              )}
            >
              <div className='md:size-category-icon-desktop relative size-12'>
                <Image
                  src={category.icon}
                  alt={category.label}
                  fill
                  className='object-contain'
                  sizes='(max-width: 768px) 48px, 65px'
                />
              </div>
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-center font-bold tracking-tight whitespace-nowrap text-neutral-950',
                'text-sm leading-7 md:text-lg md:leading-8',
                activeCategory === category.id ? 'text-brand-primary' : ''
              )}
            >
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
