'use client';

/**
 * FilterContent Component
 *
 * The core filter logic and UI shared between the Mobile Sheet and Desktop Sidebar.
 * Matches specifications for Distance, Price, and Rating sections.
 */

import * as React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import {
  setMinPrice,
  setMaxPrice,
  setRating,
  setDistance,
  setSearchQuery,
} from '@/features/filter/filterSlice';

type FilterContentProps = Readonly<{
  className?: string;
  showTitle?: boolean;
}>;

export function FilterContent({
  className,
  showTitle = true,
}: FilterContentProps) {
  const dispatch = useDispatch();
  const { minPrice, maxPrice, rating, distance, searchQuery } = useSelector(
    (state: RootState) => state.filter
  );

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {showTitle && (
        <h3 className='text-display-xs font-extrabold tracking-tight text-neutral-950 uppercase'>
          FILTER
        </h3>
      )}

      {/* Search Filter */}
      <FilterGroup title='Search'>
        <div className='relative'>
          <div className='absolute top-1/2 left-3 -translate-y-1/2'>
            <Icon
              icon='heroicons:magnifying-glass'
              className='size-5 text-neutral-400'
            />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder='Restaurant name...'
            className='focus-visible:ring-brand-primary/20 h-12 border-neutral-300 pl-10 text-sm font-medium placeholder:text-neutral-400 focus-visible:ring-1'
          />
        </div>
      </FilterGroup>

      {/* Divider */}
      <div className='h-px w-full bg-neutral-100' />

      {/* Distance Filter */}
      <FilterGroup title='Distance'>
        {['Nearby', 'Within 1 km', 'Within 3 km', 'Within 5 km'].map((dist) => (
          <FilterOption
            key={dist}
            label={dist}
            isSelected={distance === dist}
            onToggle={() =>
              dispatch(setDistance(distance === dist ? null : dist))
            }
          />
        ))}
      </FilterGroup>

      {/* Divider for Desktop Sidebar look */}
      <div className='h-px w-full bg-neutral-100 md:hidden' />

      {/* Price Filter */}
      <FilterGroup title='Price'>
        <div className='flex flex-col gap-3'>
          <div className='relative'>
            <div className='absolute top-1/2 left-2 flex h-8 w-(--width-price-prefix) -translate-y-1/2 items-center justify-center rounded-md bg-neutral-100 text-sm font-bold text-neutral-950'>
              Rp
            </div>
            <Input
              value={minPrice}
              onChange={(e) => dispatch(setMinPrice(e.target.value))}
              placeholder='Minimum Price'
              className='focus-visible:ring-brand-primary/20 pl-price-input-left h-12 border-neutral-300 text-sm font-medium placeholder:text-neutral-400 focus-visible:ring-1'
            />
          </div>
          <div className='relative'>
            <div className='absolute top-1/2 left-2 flex h-8 w-(--width-price-prefix) -translate-y-1/2 items-center justify-center rounded-md bg-neutral-100 text-sm font-bold text-neutral-950'>
              Rp
            </div>
            <Input
              value={maxPrice}
              onChange={(e) => dispatch(setMaxPrice(e.target.value))}
              placeholder='Maximum Price'
              className='focus-visible:ring-brand-primary/20 pl-price-input-left h-12 border-neutral-300 text-sm font-medium placeholder:text-neutral-400 focus-visible:ring-1'
            />
          </div>
        </div>
      </FilterGroup>

      {/* Divider */}
      <div className='h-px w-full bg-neutral-100 md:hidden' />

      {/* Rating Filter */}
      <FilterGroup title='Rating'>
        {[5, 4, 3, 2, 1].map((star) => (
          <FilterOption
            key={star}
            label={star.toString()}
            isRating
            isSelected={rating === star}
            onToggle={() => dispatch(setRating(rating === star ? null : star))}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

type FilterGroupProps = Readonly<{
  title: string;
  children: React.ReactNode;
}>;

function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-md font-bold text-neutral-950'>{title}</h4>
      <div className='flex flex-col gap-4'>{children}</div>
    </div>
  );
}

type FilterOptionProps = Readonly<{
  label: string;
  isSelected?: boolean;
  isRating?: boolean;
  onToggle: () => void;
}>;

function FilterOption({
  label,
  isSelected = false,
  isRating = false,
  onToggle,
}: FilterOptionProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='group flex cursor-pointer items-center gap-3 outline-none'
    >
      {/* Checkbox Box */}
      <div
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded border transition-all',
          isSelected
            ? 'bg-brand-primary border-brand-primary shadow-sm'
            : 'border-neutral-300 bg-white group-hover:border-neutral-400'
        )}
      >
        {isSelected && (
          <Icon
            icon='heroicons:check-16-solid'
            className='size-3.5 text-white'
            strokeWidth={2}
          />
        )}
      </div>

      {/* Label with optional Rating Star */}
      <div className='flex items-center gap-2'>
        {isRating && (
          <Icon icon='ri:star-fill' className='text-rating size-5' />
        )}
        <span
          className={cn(
            'text-sm transition-colors',
            isSelected ? 'font-semibold text-neutral-950' : 'text-neutral-600'
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
