/**
 * DesignSystemTest Component
 *
 * Test component to verify Figma design system tokens from globals.css.
 * This component displays typography, colors, spacing, and radius tokens visually.
 *
 * @remarks
 * For development and testing purposes only.
 * This component intentionally uses primitive color tokens (not semantic)
 * to demonstrate the full color palette from the design system.
 */

import { cn } from '@/lib/utils';

/** Neutral color swatches for visual testing */
const NEUTRAL_SWATCHES = [
  { shade: '25', bgClass: 'bg-neutral-25' },
  { shade: '50', bgClass: 'bg-neutral-50' },
  { shade: '100', bgClass: 'bg-neutral-100' },
  { shade: '200', bgClass: 'bg-neutral-200' },
  { shade: '300', bgClass: 'bg-neutral-300' },
  { shade: '400', bgClass: 'bg-neutral-400' },
  { shade: '500', bgClass: 'bg-neutral-500' },
  { shade: '600', bgClass: 'bg-neutral-600' },
  { shade: '700', bgClass: 'bg-neutral-700' },
  { shade: '800', bgClass: 'bg-neutral-800' },
  { shade: '900', bgClass: 'bg-neutral-900' },
  { shade: '950', bgClass: 'bg-neutral-950' },
] as const;

/** Spacing scale tokens with their CSS values */
const SPACING_TOKENS = [
  { name: 'xxs', cssValue: '0.125rem', widthClass: 'w-xxs' },
  { name: 'xs', cssValue: '0.25rem', widthClass: 'w-xs' },
  { name: 'sm', cssValue: '0.375rem', widthClass: 'w-sm' },
  { name: 'md', cssValue: '0.5rem', widthClass: 'w-md' },
  { name: 'lg', cssValue: '0.75rem', widthClass: 'w-lg' },
  { name: 'xl', cssValue: '1rem', widthClass: 'w-xl' },
  { name: '2xl', cssValue: '1.25rem', widthClass: 'w-2xl' },
  { name: '3xl', cssValue: '1.5rem', widthClass: 'w-3xl' },
  { name: '4xl', cssValue: '2rem', widthClass: 'w-4xl' },
  { name: '5xl', cssValue: '2.5rem', widthClass: 'w-5xl' },
  { name: '6xl', cssValue: '3rem', widthClass: 'w-6xl' },
] as const;

/** Border radius tokens */
const RADIUS_TOKENS = [
  { name: 'xxs', radiusClass: 'rounded-xxs' },
  { name: 'xs', radiusClass: 'rounded-xs' },
  { name: 'sm', radiusClass: 'rounded-sm' },
  { name: 'md', radiusClass: 'rounded-md' },
  { name: 'lg', radiusClass: 'rounded-lg' },
  { name: 'xl', radiusClass: 'rounded-xl' },
  { name: '2xl', radiusClass: 'rounded-2xl' },
  { name: '3xl', radiusClass: 'rounded-3xl' },
  { name: '4xl', radiusClass: 'rounded-4xl' },
] as const;

export function DesignSystemTest() {
  return (
    <div className='custom-container space-y-10xl py-6xl'>
      {/* Header */}
      <header className='space-y-md'>
        <h1 className='text-display-xl text-foreground font-extrabold'>
          Design System Test
        </h1>
        <p className='text-md text-muted-foreground'>
          Verify Figma design tokens from{' '}
          <code className='bg-muted rounded-sm px-1'>globals.css</code>
        </p>
      </header>

      {/* Typography Section */}
      <section className='space-y-4xl' aria-labelledby='typography-heading'>
        <h2
          id='typography-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Typography
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          {/* Display Sizes */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Display Sizes
            </h3>
            <div className='space-y-lg'>
              <p className='text-display-3xl text-card-foreground font-extrabold'>
                Display 3XL (3.75rem)
              </p>
              <p className='text-display-2xl text-card-foreground font-bold'>
                Display 2XL (3rem)
              </p>
              <p className='text-display-xl text-card-foreground font-bold'>
                Display XL (2.5rem)
              </p>
              <p className='text-display-lg text-card-foreground font-semibold'>
                Display LG (2.25rem)
              </p>
              <p className='text-display-md text-card-foreground font-semibold'>
                Display MD (2rem)
              </p>
              <p className='text-display-sm text-card-foreground font-medium'>
                Display SM (1.75rem)
              </p>
              <p className='text-display-xs text-card-foreground font-medium'>
                Display XS (1.5rem)
              </p>
            </div>
          </div>

          {/* Body Sizes */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Body Sizes
            </h3>
            <div className='space-y-lg'>
              <p className='text-card-foreground text-xl'>Text XL (1.25rem)</p>
              <p className='text-card-foreground text-lg'>Text LG (1.125rem)</p>
              <p className='text-md text-card-foreground'>
                Text MD (1rem) - Default
              </p>
              <p className='text-card-foreground text-sm'>Text SM (0.875rem)</p>
              <p className='text-card-foreground text-xs'>Text XS (0.75rem)</p>
            </div>
          </div>

          {/* Font Weights */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Font Weights
            </h3>
            <div className='space-y-lg'>
              <p className='text-card-foreground text-lg font-normal'>
                Regular (400) - The quick brown fox
              </p>
              <p className='text-card-foreground text-lg font-medium'>
                Medium (500) - The quick brown fox
              </p>
              <p className='text-card-foreground text-lg font-semibold'>
                Semibold (600) - The quick brown fox
              </p>
              <p className='text-card-foreground text-lg font-bold'>
                Bold (700) - The quick brown fox
              </p>
              <p className='text-card-foreground text-lg font-extrabold'>
                Extrabold (800) - The quick brown fox
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className='space-y-4xl' aria-labelledby='colors-heading'>
        <h2
          id='colors-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Colors
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          {/* Neutral Colors */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Neutral Scale
            </h3>
            <div className='gap-md flex flex-wrap'>
              {NEUTRAL_SWATCHES.map((swatch) => (
                <figure key={swatch.shade} className='text-center'>
                  <div
                    className={cn(
                      'border-border size-16 rounded-lg border',
                      swatch.bgClass
                    )}
                  />
                  <figcaption className='mt-xs text-muted-foreground text-xs'>
                    {swatch.shade}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Primary and Accent */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Primary and Accent
            </h3>
            <div className='gap-lg flex flex-wrap'>
              <figure className='text-center'>
                <div className='bg-primary size-16 rounded-lg' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Primary
                </figcaption>
              </figure>
              <figure className='text-center'>
                <div className='bg-status-error size-16 rounded-lg' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Status Error
                </figcaption>
              </figure>
              <figure className='text-center'>
                <div className='bg-status-success size-16 rounded-lg' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Status Success
                </figcaption>
              </figure>
              <figure className='text-center'>
                <div className='bg-status-warning size-16 rounded-lg' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Status Warning
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Base Colors */}
          <div className='space-y-xl'>
            <h3 className='text-muted-foreground text-lg font-semibold'>
              Base Colors
            </h3>
            <div className='gap-lg flex flex-wrap'>
              <figure className='text-center'>
                <div className='border-border bg-base-white size-16 rounded-lg border' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  White
                </figcaption>
              </figure>
              <figure className='text-center'>
                <div className='border-border bg-base-black size-16 rounded-lg border' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Black
                </figcaption>
              </figure>
              <figure className='text-center'>
                <div className='border-border bg-background size-16 rounded-lg border' />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  Background
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className='space-y-4xl' aria-labelledby='spacing-heading'>
        <h2
          id='spacing-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Spacing
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <div className='space-y-lg'>
            {SPACING_TOKENS.map((spacing) => (
              <div key={spacing.name} className='gap-xl flex items-center'>
                <span className='text-muted-foreground w-16 text-sm'>
                  {spacing.name}
                </span>
                <div className={cn('bg-primary h-4', spacing.widthClass)} />
                <span className='text-muted-foreground text-xs'>
                  {spacing.cssValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Radius Section */}
      <section className='space-y-4xl' aria-labelledby='radius-heading'>
        <h2
          id='radius-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Border Radius
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <div className='gap-xl flex flex-wrap'>
            {RADIUS_TOKENS.map((radius) => (
              <figure key={radius.name} className='text-center'>
                <div className={cn('bg-primary size-16', radius.radiusClass)} />
                <figcaption className='mt-xs text-muted-foreground text-xs'>
                  {radius.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Container Max Width */}
      <section className='space-y-4xl' aria-labelledby='layout-heading'>
        <h2
          id='layout-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Layout
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <div className='space-y-md'>
            <p className='text-muted-foreground text-sm'>
              Container Max Width:{' '}
              <code className='bg-muted rounded-sm px-1'>
                --spacing-container-max: 78rem (1248px)
              </code>
            </p>
            <div className='max-w-container-max bg-primary h-4' />
          </div>
        </div>
      </section>
    </div>
  );
}
