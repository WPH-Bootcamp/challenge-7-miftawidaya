'use client';

import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  /** The current quantity value */
  quantity: number;
  /** Callback when increment button is clicked */
  onIncrement: () => void;
  /** Callback when decrement button is clicked */
  onDecrement: () => void;
  /** Whether the control is in a loading or updating state */
  isUpdating?: boolean;
  /** Optional size variant */
  size?: 'sm' | 'md';
  /** Optional variant for different styles */
  variant?: 'outline' | 'ghost';
  /** Optional className for the container */
  className?: string;
}

/**
 * QuantityControl
 * @description A reusable component for increasing or decreasing item quantities.
 * Features design-system-aligned buttons and smooth transitions.
 */
export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  isUpdating = false,
  size = 'sm',
  variant = 'outline',
  className,
}: Readonly<QuantityControlProps>) {
  const isSmall = size === 'sm';

  return (
    <div className={cn('flex items-center gap-2 md:gap-3', className)}>
      {/* Decrease Button */}
      <button
        type='button'
        onClick={onDecrement}
        disabled={isUpdating}
        className={cn(
          'flex items-center justify-center rounded-full transition-all disabled:opacity-50',
          isSmall ? 'size-8 md:size-9' : 'size-9 md:size-10',
          variant === 'outline'
            ? 'border border-neutral-200 text-neutral-950 hover:bg-neutral-50'
            : 'text-neutral-950 hover:bg-neutral-100'
        )}
        aria-label='Decrease quantity'
      >
        <Icon
          icon='ri:subtract-line'
          className={isSmall ? 'size-4 md:size-5' : 'size-5 md:size-6'}
        />
      </button>

      {/* Quantity Text */}
      <span
        className={cn(
          'text-center font-bold text-neutral-950',
          isSmall ? 'md:text-md min-w-6 text-sm' : 'text-md min-w-4 md:text-lg'
        )}
      >
        {quantity}
      </span>

      {/* Increase Button */}
      <button
        type='button'
        onClick={onIncrement}
        disabled={isUpdating}
        className={cn(
          'bg-brand-primary flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50',
          isSmall ? 'size-8 md:size-9' : 'size-9 md:size-10'
        )}
        aria-label='Increase quantity'
      >
        <Icon
          icon='ri:add-line'
          className={isSmall ? 'size-4 md:size-5' : 'size-5 md:size-6'}
        />
      </button>
    </div>
  );
}
