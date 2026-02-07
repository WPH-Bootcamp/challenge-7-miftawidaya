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
  const { minPrice, maxPrice, rating, distance } = useSelector(
    (state: RootState) => state.filter
  );

  return (
    <div className={cn('flex flex-col gap-6 py-4', className)}>
      {showTitle && (
        <div className='ps-4 pe-4'>
          <h3 className='text-md leading-7.5 font-extrabold text-neutral-950 uppercase'>
            FILTER
          </h3>
        </div>
      )}

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

      {/* Divider */}
      <div className='h-px w-full bg-neutral-300' />

      {/* Price Filter */}
      <FilterGroup title='Price'>
        <div className='flex flex-col gap-3'>
          <div className='relative flex h-13.5 items-center gap-2 rounded-lg border border-neutral-300 p-2'>
            <div className='text-md flex size-9.5 shrink-0 items-center justify-center rounded bg-neutral-100 leading-7.5 font-bold text-neutral-950'>
              Rp
            </div>
            <Input
              value={minPrice}
              onChange={(e) => dispatch(setMinPrice(e.target.value))}
              placeholder='Minimum Price'
              className='text-md md:text-md h-7.5 flex-1 border-none p-0 leading-7.5 tracking-tight text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0'
            />
          </div>
          <div className='relative flex h-13.5 items-center gap-2 rounded-lg border border-neutral-300 p-2'>
            <div className='text-md flex size-9.5 shrink-0 items-center justify-center rounded bg-neutral-100 leading-7.5 font-bold text-neutral-950'>
              Rp
            </div>
            <Input
              value={maxPrice}
              onChange={(e) => dispatch(setMaxPrice(e.target.value))}
              placeholder='Maximum Price'
              className='text-md md:text-md h-7.5 flex-1 border-none p-0 leading-7.5 tracking-tight text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0'
            />
          </div>
        </div>
      </FilterGroup>

      {/* Divider */}
      <div className='h-px w-full bg-neutral-300' />

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
    <div className='flex flex-col gap-2.5 ps-4 pe-4'>
      <h4 className='text-lg leading-8 font-extrabold tracking-tight text-neutral-950'>
        {title}
      </h4>
      <div className='flex flex-col gap-0'>{children}</div>
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
      className='group flex h-11.5 cursor-pointer items-center gap-2 outline-none'
    >
      {/* Checkbox Box */}
      <div
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-sm border transition-all',
          isSelected
            ? 'bg-brand-primary border-brand-primary'
            : 'border-neutral-400 bg-white group-hover:border-neutral-500'
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
          <Icon
            icon='material-symbols:star-rounded'
            className='text-rating size-6'
          />
        )}
        <span
          className={cn(
            'text-md leading-7.5 tracking-tight transition-colors',
            isSelected ? 'font-bold text-neutral-950' : 'text-neutral-950'
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
