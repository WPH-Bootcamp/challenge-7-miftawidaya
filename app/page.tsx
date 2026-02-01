import { ComponentTest, DesignSystemTest, IconTest } from '@/components/dev';

/**
 * Home Page - Development Mode
 * @description Displays design system and component tests for development verification.
 * Replace with actual page content when ready for production.
 */
export default function Home() {
  return (
    <main>
      {/* Design System Test - Typography, Colors, Spacing, Radius */}
      <DesignSystemTest />

      {/* Divider */}
      <hr className='max-w-container-max mx-auto border-neutral-800' />

      {/* Icon Test - Untitled UI Icons */}
      <IconTest />

      {/* Divider */}
      <hr className='max-w-container-max mx-auto border-neutral-800' />

      {/* Component Test - Button, Input, Badge, etc. */}
      <ComponentTest />
    </main>
  );
}
