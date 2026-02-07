/**
 * ComponentTest Component
 *
 * Test component to verify UI components (Button, Input, Badge, etc.).
 * Add component tests here as you build them.
 *
 * @remarks
 * For development and testing purposes only.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MarkerPin01,
  File05,
  ArrowCircleBrokenLeft,
  FilterLines,
} from '@untitledui/icons';
import { cn } from '@/lib/utils';

export function ComponentTest() {
  return (
    <div className='custom-container space-y-10xl py-6xl'>
      {/* Header */}
      <header className='space-y-md'>
        <h1 className='text-display-xl text-foreground font-extrabold'>
          Component Test
        </h1>
        <p className='text-md text-muted-foreground'>
          Verify UI components (Button, Avatar, Sheet, etc.)
        </p>
      </header>

      {/* Logo Section */}
      <section className='space-y-4xl' aria-labelledby='logo-heading'>
        <h2
          id='logo-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Logo (Single SVG with CSS Color Control)
        </h2>

        <div className='space-y-3xl'>
          <div className='space-y-md bg-card p-4xl rounded-2xl border border-neutral-200'>
            <p className='text-muted-foreground text-sm'>
              Primary Color (text-primary) - Light Background
            </p>
            <span className='text-primary inline-block'>
              <Logo title='Logo primary color' />
            </span>
          </div>

          <div className='space-y-md p-4xl rounded-2xl bg-neutral-900'>
            <p className='text-background text-sm'>
              White Logo (text-white) - Dark Background
            </p>
            <span className='inline-block text-white'>
              <Logo title='Logo white' />
            </span>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className='space-y-4xl' aria-labelledby='buttons-heading'>
        <h2
          id='buttons-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Buttons ( Customized)
        </h2>

        <div className='space-y-6xl'>
          <div className='space-y-4xl bg-card p-4xl rounded-2xl border border-neutral-200'>
            <div>
              <p className='text-muted-foreground mb-2 text-sm'>
                Light Background Variants
              </p>
              <div className='gap-xl flex flex-wrap items-center'>
                <Button>Sign Up (Primary/Default Red)</Button>
                <Button variant='outline'>Sign In (Outline)</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatars Section */}
      <section className='space-y-4xl' aria-labelledby='avatars-heading'>
        <h2
          id='avatars-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Avatars
        </h2>

        <div className='gap-4xl bg-card p-4xl flex items-center rounded-2xl border border-neutral-200'>
          <Avatar size='lg'>
            <AvatarImage src='https://github.com/mifta.png' alt='Mifta' />
            <AvatarFallback>MW</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Sheets Section */}
      <section className='space-y-4xl' aria-labelledby='sheets-heading'>
        <h2
          id='sheets-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Sheets ( Filter Demo)
        </h2>

        <div className='gap-4xl bg-card p-4xl flex flex-wrap rounded-2xl border border-neutral-200'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='size-11'>
                <FilterLines className='size-5' strokeWidth={2} />
                <span className='sr-only'>Open Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-78 overflow-visible p-0'
              showCloseButton
            >
              <SheetTitle className='sr-only'>Filter Demo</SheetTitle>
              <div className='flex-1 space-y-8 overflow-y-auto p-6'>
                <h3 className='text-display-xs font-bold uppercase'>Filter</h3>
                <div className='space-y-4'>
                  <h4 className='text-md text-foreground font-bold'>
                    Distance
                  </h4>
                  {['Nearby', 'Within 1 km'].map((dist) => (
                    <label
                      key={dist}
                      className='flex cursor-pointer items-center gap-3'
                    >
                      <input
                        type='checkbox'
                        className='sr-only'
                        checked={dist === 'Nearby'}
                        readOnly
                      />
                      <div
                        className={cn(
                          'flex size-5 items-center justify-center rounded border border-neutral-300 transition-colors',
                          dist === 'Nearby'
                            ? 'bg-brand-primary border-brand-primary'
                            : 'bg-white'
                        )}
                      >
                        {dist === 'Nearby' && (
                          <div className='size-2 rounded-full bg-white' />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-sm',
                          dist === 'Nearby'
                            ? 'font-semibold'
                            : 'text-neutral-600'
                        )}
                      >
                        {dist}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      {/* Profile Dropdown Demo */}
      <section
        className='space-y-4xl'
        aria-labelledby='profile-dropdown-heading'
      >
        <h2
          id='profile-dropdown-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Profile Dropdown ( Spec)
        </h2>
        <div className='gap-4xl bg-card p-4xl flex flex-wrap rounded-2xl border border-neutral-200'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='group cursor-pointer outline-hidden'>
                <Avatar className='size-9 border-2 border-white shadow-sm transition-transform group-hover:scale-105'>
                  <AvatarImage src='https://github.com/mifta.png' alt='User' />
                  <AvatarFallback className='bg-brand-primary text-white'>
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-dropdown shadow-card flex flex-col gap-3 rounded-2xl border-none p-4'
              align='end'
              sideOffset={12}
            >
              <DropdownMenuLabel className='flex items-center gap-2 p-0'>
                <Avatar className='size-9'>
                  <AvatarImage
                    src='https://github.com/mifta.png'
                    alt='John Doe'
                  />
                  <AvatarFallback className='bg-brand-primary text-xs text-white'>
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className='text-md font-bold tracking-tight text-neutral-950'>
                  John Doe
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='mx-0 my-0 h-px bg-neutral-200' />
              <div className='flex flex-col gap-3'>
                <DropdownMenuItem className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-950'>
                  <MarkerPin01 className='size-5' strokeWidth={2} />
                  <span className='text-sm font-medium'>Delivery Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-900'>
                  <File05 className='size-5' strokeWidth={2} />
                  <span className='text-sm font-medium'>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer gap-2 rounded-xl p-0 text-neutral-950'>
                  <ArrowCircleBrokenLeft className='size-5' strokeWidth={2} />
                  <span className='text-sm font-medium'>Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Skeletons Section */}
      <section className='space-y-4xl' aria-labelledby='skeletons-heading'>
        <h2
          id='skeletons-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Skeletons (Loading States)
        </h2>
        <div className='space-y-6xl bg-card p-4xl rounded-2xl border border-neutral-200'>
          <div className='flex items-center space-x-4'>
            <Skeleton className='size-12 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-64' />
              <Skeleton className='h-4 w-48' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
