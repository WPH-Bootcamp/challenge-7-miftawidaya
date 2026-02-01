/**
 * Home Page
 * @description The main landing page of the Restaurant App.
 * Features HeroSection with search, CategoryFilter, and RestaurantGrid.
 */

import { HeroSection } from '@/components/home/HeroSection';

export default function Home() {
  return (
    <div className='flex flex-col'>
      {/* Hero Section - Full viewport with search */}
      <HeroSection />

      {/* Placeholder for CategoryFilter and RestaurantGrid */}
      <section className='custom-container mx-auto py-10'>
        <p className='text-center text-neutral-500'>
          Category Filter and Restaurant Grid coming soon...
        </p>
      </section>
    </div>
  );
}
