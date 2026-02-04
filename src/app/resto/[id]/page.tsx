'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import {
  useRestaurantDetail,
  useAddToCart,
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useRestaurantReviews,
} from '@/services/queries';
import {
  MenuCard,
  ReviewCard,
  ReviewCardSkeleton,
} from '@/components/menu/MenuElements';
import { MenuItem, CartGroup, CartItemNested, Review } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { ROUTES } from '@/config/routes';
import {
  DEFAULT_DISTANCE,
  MENU_INITIAL_COUNT,
  MENU_LOAD_INCREMENT,
  REVIEW_INITIAL_COUNT,
  REVIEW_LOAD_INCREMENT,
} from '@/config/constants';
import { cn } from '@/lib/utils';
import React from 'react';
import { useLocation } from '@/context/LocationContext';

export default function RestaurantDetailPage() {
  const { id: restaurantId } = useParams();
  const router = useRouter();
  const { latitude, longitude, isLoading: isLoadingLocation } = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { data: restaurant, isLoading: isLoadingData } = useRestaurantDetail(
    restaurantId as string,
    {
      ...(latitude !== null && { lat: latitude }),
      ...(longitude !== null && { lng: longitude }),
    }
  );

  const isLoading = isLoadingLocation || isLoadingData;
  const addToCart = useAddToCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const { data: cartData } = useCart(isAuthenticated);

  // State for filtering and pagination
  const [activeCategory, setActiveCategory] = React.useState<
    'ALL' | 'FOOD' | 'DRINK'
  >('ALL');
  const [visibleMenuCount, setVisibleMenuCount] =
    React.useState(MENU_INITIAL_COUNT);
  const [visibleReviewCount, setVisibleReviewCount] =
    React.useState(REVIEW_INITIAL_COUNT);
  const [isCartUpdating, setIsCartUpdating] = React.useState(false);

  const { data: reviewsData, isFetching: isFetchingReviews } =
    useRestaurantReviews(restaurantId as string, {
      limit: visibleReviewCount,
    });

  // Derived data
  const filteredMenu = React.useMemo(
    () =>
      (restaurant?.menu || []).filter((item) => {
        if (activeCategory === 'ALL') return true;
        return item.category === activeCategory;
      }),
    [restaurant?.menu, activeCategory]
  );

  const visibleMenus = React.useMemo(
    () => filteredMenu.slice(0, visibleMenuCount),
    [filteredMenu, visibleMenuCount]
  );
  const hasMoreMenus = visibleMenuCount < filteredMenu.length;

  const visibleReviews =
    reviewsData || (restaurant?.reviews || []).slice(0, visibleReviewCount);
  const hasMoreReviews =
    visibleReviewCount <
    (restaurant?.totalReview ?? restaurant?.reviews?.length ?? 0);

  // Observers for infinite scroll
  const menuObserverRef = React.useRef<HTMLDivElement>(null);
  const reviewObserverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const menuObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMenus) {
          setVisibleMenuCount((prev) => prev + MENU_LOAD_INCREMENT);
        }
      },
      { threshold: 0.1 }
    );

    if (menuObserverRef.current) menuObserver.observe(menuObserverRef.current);
    return () => menuObserver.disconnect();
  }, [hasMoreMenus]);

  React.useEffect(() => {
    const reviewObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreReviews && !isFetchingReviews) {
          setVisibleReviewCount((prev) => prev + REVIEW_LOAD_INCREMENT);
        }
      },
      { threshold: 0.5 } // Trigger earlier for smoother transition
    );

    if (reviewObserverRef.current)
      reviewObserver.observe(reviewObserverRef.current);
    return () => reviewObserver.disconnect();
  }, [hasMoreReviews, isFetchingReviews]);

  // Get cart data for current restaurant
  const currentRestoCart = cartData?.find(
    (group: CartGroup) => String(group.restaurant.id) === String(restaurantId)
  );
  const cartItemCount =
    currentRestoCart?.items.reduce(
      (sum: number, item: CartItemNested) => sum + item.quantity,
      0
    ) ?? 0;
  const cartSubtotal = currentRestoCart?.subtotal ?? 0;

  // Trigger animation when cart changes
  React.useEffect(() => {
    if (cartItemCount > 0) {
      setIsCartUpdating(true);
      const timer = setTimeout(() => setIsCartUpdating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount, cartSubtotal]);

  const handleAddToCart = (item: MenuItem) => {
    if (!isAuthenticated) {
      const pendingItem = {
        restaurantId: restaurantId as string,
        menuId: item.id,
        quantity: 1,
      };
      localStorage.setItem('pending_cart_item', JSON.stringify(pendingItem));
      router.push(ROUTES.LOGIN);
      return;
    }

    const payload = {
      restaurantId: restaurantId as string,
      menuId: item.id,
      quantity: 1,
    };

    addToCart.mutate(payload, {
      onError: (error) => {
        console.error('Failed to add to cart:', error);
        // If 401, token might be expired - redirect to login
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          router.push(ROUTES.LOGIN);
        }
      },
    });
  };

  const handleIncrement = (item: MenuItem) => {
    const cartItem = currentRestoCart?.items.find(
      (ci) => String(ci.menu.id) === String(item.id)
    );
    if (cartItem) {
      updateQuantity.mutate({
        itemId: cartItem.id,
        quantity: cartItem.quantity + 1,
      });
    }
  };

  const handleDecrement = (item: MenuItem) => {
    const cartItem = currentRestoCart?.items.find(
      (ci) => String(ci.menu.id) === String(item.id)
    );
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity.mutate({
          itemId: cartItem.id,
          quantity: cartItem.quantity - 1,
        });
      } else {
        removeFromCart.mutate(cartItem.id);
      }
    }
  };

  /**
   * Handle native browser share or fallback to clipboard copy
   */
  const handleShare = async () => {
    const shareData = {
      title: restaurant?.name ?? 'Restaurant',
      text: `Check out ${restaurant?.name ?? 'this restaurant'} on Foody!`,
      url: globalThis.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(globalThis.location.href);
        alert('Link copied to clipboard!');
      } catch {
        // Clipboard API failed
      }
    }
  };

  if (isLoading)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='border-brand-primary size-12 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='font-bold text-neutral-500'>Loading deliciousness...</p>
        </div>
      </div>
    );

  if (!restaurant)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-6'>
          <div className='flex size-20 items-center justify-center rounded-full bg-neutral-100'>
            <Icon
              icon='ri:error-warning-line'
              className='size-10 text-neutral-400'
            />
          </div>
          <h2 className='text-display-xs font-extrabold text-neutral-950'>
            Restaurant not found
          </h2>
          <button
            onClick={() => router.push(ROUTES.HOME)}
            className='text-brand-primary font-bold hover:underline'
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  // Derived data

  const galleryImages = restaurant.images || [];

  return (
    <div className='pt-header-mobile md:pt-header flex flex-col bg-white pb-10 md:pb-12'>
      {/* 1. Image Gallery Section */}
      <section className='pt-4 md:pt-12'>
        <div className='custom-container mx-auto'>
          {/* Desktop Gallery Grid */}
          <div className='hidden h-120 w-full gap-4 md:flex'>
            <div className='relative h-full flex-1 overflow-hidden rounded-3xl'>
              <Image
                src={galleryImages[0] || restaurant.image || ''}
                alt={restaurant.name}
                fill
                sizes='(max-width: 768px) 100vw, 66vw'
                className='object-cover'
                priority
              />
            </div>
            <div className='flex h-full w-110 flex-col gap-4'>
              <div className='relative h-1/2 w-full overflow-hidden rounded-3xl'>
                <Image
                  src={galleryImages[1] || galleryImages[0] || ''}
                  alt={restaurant.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover'
                />
              </div>
              <div className='flex h-1/2 w-full gap-4'>
                <div className='relative flex-1 overflow-hidden rounded-3xl'>
                  <Image
                    src={galleryImages[2] || galleryImages[0] || ''}
                    alt={restaurant.name}
                    fill
                    sizes='(max-width: 768px) 100vw, 16vw'
                    className='object-cover'
                  />
                </div>
                <div className='relative flex-1 overflow-hidden rounded-3xl'>
                  <Image
                    src={galleryImages[3] || galleryImages[0] || ''}
                    alt={restaurant.name}
                    fill
                    sizes='(max-width: 768px) 100vw, 16vw'
                    className='object-cover'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Gallery (Simple Banner) */}
          <div className='relative aspect-4/3 w-full overflow-hidden rounded-2xl md:hidden'>
            <Image
              src={restaurant.image || ''}
              alt={restaurant.name}
              fill
              sizes='(max-width: 768px) 100vw, 800px'
              className='object-cover'
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Restaurant Info Header */}
      <section className='mt-6 md:mt-10'>
        <div className='custom-container mx-auto'>
          <div className='flex items-center justify-between'>
            {/* Left: Logo + Info */}
            <div className='flex items-center gap-4'>
              {/* Logo */}
              <div className='size-resto-logo-mobile md:size-resto-logo-desktop bg-base-white relative shrink-0 overflow-hidden rounded-full'>
                <Image
                  src={restaurant.logo || ''}
                  alt={`${restaurant.name} logo`}
                  fill
                  sizes='(max-width: 768px) 80px, 120px'
                  className='object-contain p-2'
                />
              </div>

              {/* Info Container */}
              <div className='flex flex-col gap-0.5 md:gap-1'>
                {/* Title */}
                <h1 className='text-md md:text-display-md font-extrabold text-neutral-950'>
                  {restaurant.name}
                </h1>

                {/* Rating Row */}
                <div className='flex items-center gap-1'>
                  <Icon
                    icon='ri:star-fill'
                    className='text-rating size-6'
                    aria-hidden='true'
                  />
                  <span className='text-sm font-medium text-neutral-950 md:text-lg md:font-semibold'>
                    {restaurant.rating}
                  </span>
                </div>

                {/* Location + Distance Row */}
                <div className='flex items-center gap-1.5 md:gap-2'>
                  <span className='text-sm font-normal tracking-tight text-neutral-950 md:text-lg md:font-medium'>
                    {restaurant.place}
                  </span>
                  <div
                    className='size-0.5 shrink-0 rounded-full bg-neutral-950'
                    aria-hidden='true'
                  />
                  <span className='text-sm font-normal tracking-tight text-neutral-950 md:text-lg md:font-medium'>
                    {restaurant.distance || DEFAULT_DISTANCE} km
                  </span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <button
              type='button'
              onClick={handleShare}
              className='md:w-11xl flex size-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 font-bold text-neutral-950 transition-colors hover:bg-neutral-50 md:h-11'
              aria-label='Share this restaurant'
            >
              <Icon
                icon='ri:share-line'
                className='size-5'
                aria-hidden='true'
              />
              <span className='hidden md:inline'>Share</span>
            </button>
          </div>

          {/* Divider */}
          <hr className='my-4 border-t border-neutral-200 md:my-8' />
        </div>
      </section>

      {/* 3. Menu Section */}
      <section>
        <div className='custom-container mx-auto flex flex-col gap-8'>
          <div className='flex flex-col gap-4 md:gap-6'>
            <h2 className='text-display-xs md:text-display-lg font-extrabold text-neutral-950'>
              Menu
            </h2>

            {/* Category Filters */}
            <div className='scrollbar-none flex items-center gap-2 overflow-x-auto pb-2 md:gap-3'>
              {[
                { label: 'All Menu', value: 'ALL' },
                { label: 'Food', value: 'FOOD' },
                { label: 'Drink', value: 'DRINK' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveCategory(cat.value as 'ALL' | 'FOOD' | 'DRINK');
                    setVisibleMenuCount(8);
                  }}
                  className={cn(
                    'md:text-md h-10 rounded-full border px-4 text-sm tracking-tight whitespace-nowrap transition-all md:h-11.5 md:px-4',
                    activeCategory === cat.value
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                      : 'border-neutral-200 font-semibold text-neutral-950 hover:border-neutral-300'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-5 md:gap-y-6 lg:grid-cols-4'>
            {visibleMenus.map((item) => {
              const cartItem = currentRestoCart?.items.find(
                (ci: CartItemNested) => String(ci.menu.id) === String(item.id)
              );
              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={handleAddToCart}
                  quantity={cartItem?.quantity ?? 0}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  isLoading={false}
                />
              );
            })}
          </div>

          {/* Scroll Target for Menu Observer */}
          {hasMoreMenus && <div ref={menuObserverRef} className='h-20' />}

          {!hasMoreMenus && filteredMenu.length > MENU_INITIAL_COUNT && (
            <p className='text-center text-sm font-medium text-neutral-400 italic'>
              No more menu items to display
            </p>
          )}
        </div>
      </section>

      {/* Divider before Review */}
      <div className='custom-container mx-auto'>
        <hr className='my-4 border-t border-neutral-200 md:my-8' />
      </div>

      {/* 4. Review Section */}
      <section>
        <div className='custom-container mx-auto flex flex-col gap-8'>
          {/* Section Header */}
          <div className='flex flex-col gap-2 md:gap-3'>
            <h2 className='text-display-xs md:text-display-lg font-extrabold text-neutral-950'>
              Review
            </h2>
            <div className='flex items-center gap-1'>
              <Icon
                icon='ri:star-fill'
                className='text-rating size-4.5 md:size-6'
              />
              <span className='text-md font-extrabold text-neutral-950 md:text-xl'>
                {restaurant.rating} ({restaurant.totalReview ?? 0} Reviews)
              </span>
            </div>
          </div>

          {/* Review List */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
            {visibleReviews.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))}

            {/* Review Skeletons during loading more */}
            {isFetchingReviews &&
              Array.from({ length: REVIEW_LOAD_INCREMENT }).map((_, i) => (
                <ReviewCardSkeleton
                  key={`skeleton-${visibleReviews.length}-${i}`}
                />
              ))}
          </div>

          {/* Scroll Target for Review Observer */}
          {hasMoreReviews && <div ref={reviewObserverRef} className='h-20' />}

          {!hasMoreReviews &&
            (restaurant.totalReview ?? 0) > REVIEW_INITIAL_COUNT && (
              <p className='text-center text-sm font-medium text-neutral-400 italic'>
                You&apos;ve reached the end of reviews
              </p>
            )}
        </div>
      </section>

      {/* Fixed Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <div className='fixed inset-x-0 bottom-0 z-50 border-t border-neutral-100 bg-white shadow-lg'>
          <div className='custom-container mx-auto flex h-16 items-center justify-between gap-4 md:h-20'>
            {/* Left: Items count & Total */}
            <div
              className={cn(
                'flex flex-col items-start gap-0.5 transition-transform',
                isCartUpdating && 'animate-cart-pop'
              )}
            >
              {/* Row 1: Icon + Items count (horizontal) */}
              <div className='flex items-center gap-1 md:gap-2'>
                <Icon
                  icon='lets-icons:bag-fill'
                  className='size-5 text-neutral-950 md:size-6'
                />
                <span className='md:text-md text-sm font-normal tracking-tight text-neutral-950'>
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              {/* Row 2: Price */}
              <span
                key={cartSubtotal}
                className={cn(
                  'text-md font-extrabold text-neutral-950 md:text-xl',
                  isCartUpdating && 'animate-number-slide-up'
                )}
              >
                Rp{cartSubtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Right: Checkout Button */}
            <Link href={ROUTES.CHECKOUT(restaurantId as string)}>
              <Button className='md:text-md h-10 w-40 rounded-full text-sm font-bold md:h-11 md:w-57.5'>
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Spacer for fixed bottom bar */}
      {cartItemCount > 0 && <div className='h-16 md:h-20' />}
    </div>
  );
}
