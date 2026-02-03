/**
 * Navbar Component
 *
 * Primary navigation header providing site branding and utility actions.
 * Features a scroll-aware background and smooth transitions for branding elements.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { ProfileMenu } from './ProfileMenu';
import { cn } from '@/lib/utils';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/services/queries';
import { CartGroup, CartItemNested } from '@/types';

const SCROLL_THRESHOLD = 20;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { data: cartData } = useCart();
  const cartCount =
    cartData?.reduce(
      (acc: number, group: CartGroup) =>
        acc +
        group.items.reduce(
          (sum: number, item: CartItemNested) => sum + item.quantity,
          0
        ),
      0
    ) || 0;

  // If NOT on home, it should always behave as "scrolled" (solid background)
  const shouldBeSolid = !isHome || isScrolled;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'z-header fixed inset-x-0 top-0 transition-all duration-300 ease-in-out',
          shouldBeSolid
            ? 'h-header-mobile bg-base-white lg:h-header shadow-card'
            : 'h-header-mobile lg:h-header bg-transparent shadow-none'
        )}
      >
        <div className='custom-container mx-auto flex h-full items-center justify-between'>
          {/* Logo Section */}
          <Link
            href='/'
            className='group flex cursor-pointer items-center gap-3 outline-none'
          >
            <Logo
              className={cn(
                'duration-header size-10 transition-colors group-hover:animate-spin md:size-10.5',
                shouldBeSolid ? 'text-primary' : 'text-base-white'
              )}
            />
            <span
              className={cn(
                'text-display-md duration-header hidden font-extrabold transition-colors md:block',
                shouldBeSolid ? 'text-neutral-950' : 'text-base-white'
              )}
            >
              Foody
            </span>
          </Link>

          {/* Actions */}
          {isAuthenticated && user ? (
            <div className='flex items-center gap-4 md:gap-6'>
              {/* Cart Action - Only visible when logged in */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsCartOpen(true)}
                className={cn(
                  'duration-header relative size-11 rounded-full p-0 transition-colors',
                  shouldBeSolid
                    ? 'text-neutral-900 hover:bg-neutral-100'
                    : 'text-base-white hover:bg-white/10'
                )}
              >
                <Icon icon='lets-icons:bag-fill' className='size-8' />
                {cartCount > 0 && (
                  <span className='bg-brand-primary text-base-white absolute -end-0.5 top-1 flex size-5 items-center justify-center rounded-full text-xs font-bold shadow-sm'>
                    {cartCount}
                  </span>
                )}
                <span className='sr-only'>{cartCount} items in cart</span>
              </Button>

              {/* Profile Dropdown - Only visible when logged in */}
              <ProfileMenu
                name={user.name}
                avatarUrl={user.avatar ?? undefined}
                isScrolled={shouldBeSolid}
              />
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              {/* Sign In Button - Outline style */}
              <Link href='/login'>
                <Button
                  variant='outline'
                  className={cn(
                    'md:min-w-btn-auth h-10 rounded-full px-6 font-bold transition-all md:h-12',
                    shouldBeSolid
                      ? 'border-neutral-300 text-neutral-950 hover:bg-neutral-50'
                      : 'border-white text-white hover:bg-white/10'
                  )}
                >
                  Sign In
                </Button>
              </Link>

              {/* Sign Up Button - Fill style (Hidden on mobile) */}
              <Link href='/register' className='hidden md:block'>
                <Button
                  className={cn(
                    'md:min-w-btn-auth h-10 rounded-full px-6 font-bold transition-all md:h-12',
                    shouldBeSolid
                      ? 'bg-brand-primary text-white hover:opacity-90'
                      : 'bg-white text-neutral-950 hover:bg-neutral-100'
                  )}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
