import { notFound } from 'next/navigation';
import { DevPageClient } from './DevPageClient';

/**
 * Development Test Page
 * @description Displays design system, icons, and component tests for development verification.
 * Accessible at /dev
 */
export default function DevPage() {
  // Prevent this page from being accessible and even pre-rendered in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <DevPageClient />;
}
