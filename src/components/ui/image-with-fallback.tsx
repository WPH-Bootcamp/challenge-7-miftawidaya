'use client';

import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  /** Image source - if undefined or empty, fallback will be shown */
  src?: string | null;
  /** Fallback icon size - defaults to 40% of container */
  fallbackIconSize?: 'sm' | 'md' | 'lg';
}

/**
 * ImageWithFallback Component
 *
 * An optimized Image component that displays the Foody logo as fallback
 * when the image fails to load or src is empty. This eliminates the need
 * for a heavy placeholder.png file.
 *
 * @description Uses brand colors (neutral-100 bg + brand-primary icon) for
 * consistent branding across the application.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackIconSize = 'md',
  ...props
}: Readonly<ImageWithFallbackProps>) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Reset error state and check if already complete when src changes
  React.useEffect(() => {
    setHasError(false);
    // If the image is already in cache, it might be complete immediately
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  const showFallback = !src || hasError;

  const iconSizeClass = {
    sm: 'size-6',
    md: 'size-10',
    lg: 'size-14',
  }[fallbackIconSize];

  if (showFallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-neutral-100',
          className
        )}
      >
        <span className='sr-only'>{alt}</span>
        <Logo className={cn(iconSizeClass, 'text-brand-primary/30')} />
      </div>
    );
  }

  return (
    <>
      {/* Show subtle bg while loading */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-neutral-100',
            className
          )}
        >
          <Logo
            className={cn(iconSizeClass, 'text-brand-primary/20 animate-pulse')}
          />
        </div>
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        sizes={props.sizes ?? '(max-width: 768px) 100vw, 50vw'}
        className={cn(className, !isLoaded && 'opacity-0')}
        onError={() => setHasError(true)}
        onLoad={(e) => {
          if (e.currentTarget.complete) {
            setIsLoaded(true);
          }
        }}
        {...props}
      />
    </>
  );
}
