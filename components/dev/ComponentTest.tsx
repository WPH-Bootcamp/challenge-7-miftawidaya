/**
 * ComponentTest Component
 *
 * Test component to verify UI components (Button, Input, Badge, etc.).
 * Add component tests here as you build them.
 *
 * @remarks
 * For development and testing purposes only.
 */

import { Logo } from '@/components/icons';

export function ComponentTest() {
  return (
    <div className='custom-container space-y-10xl py-6xl'>
      {/* Header */}
      <header className='space-y-md'>
        <h1 className='text-display-xl text-foreground font-extrabold'>
          Component Test
        </h1>
        <p className='text-md text-muted-foreground'>
          Verify UI components (Button, Input, Badge, etc.)
        </p>
      </header>

      {/* Logo Section - Demo CSS Color Control */}
      <section className='space-y-4xl' aria-labelledby='logo-heading'>
        <h2
          id='logo-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Logo (Single SVG with CSS Color Control)
        </h2>

        <div className='space-y-3xl'>
          {/* Original Brand Color - Red on Light BG */}
          <div className='bg-card p-4xl space-y-md rounded-2xl'>
            <p className='text-muted-foreground text-sm'>
              Primary Color (text-primary) - Light Background
            </p>
            <span className='text-primary inline-block'>
              <Logo title='Logo primary color' />
            </span>
          </div>

          {/* White Logo on Dark BG */}
          <div className='bg-foreground p-4xl space-y-md rounded-2xl'>
            <p className='text-background text-sm'>
              White Logo (text-white) - Dark Background
            </p>
            <span className='inline-block text-white'>
              <Logo title='Logo white' />
            </span>
          </div>

          {/* Multiple Sizes & Colors Demo */}
          <div className='bg-card p-4xl space-y-md rounded-2xl'>
            <p className='text-muted-foreground text-sm'>
              Different Sizes and Colors (same component)
            </p>
            <div className='gap-4xl flex items-center'>
              <span className='text-primary'>
                <Logo className='size-6' title='Logo small' />
              </span>
              <span className='text-muted-foreground'>
                <Logo className='size-8' title='Logo medium gray' />
              </span>
              <span className='text-primary'>
                <Logo className='size-12' title='Logo large' />
              </span>
              <span className='text-destructive'>
                <Logo title='Logo destructive color' />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className='space-y-4xl' aria-labelledby='buttons-heading'>
        <h2
          id='buttons-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Buttons
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <p className='text-muted-foreground text-sm'>
            Add Button component tests here when components are created.
          </p>
        </div>
      </section>

      {/* Inputs Section */}
      <section className='space-y-4xl' aria-labelledby='inputs-heading'>
        <h2
          id='inputs-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Inputs
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <p className='text-muted-foreground text-sm'>
            Add Input component tests here when components are created.
          </p>
        </div>
      </section>

      {/* Badges Section */}
      <section className='space-y-4xl' aria-labelledby='badges-heading'>
        <h2
          id='badges-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Badges
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <p className='text-muted-foreground text-sm'>
            Add Badge component tests here when components are created.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className='space-y-4xl' aria-labelledby='cards-heading'>
        <h2
          id='cards-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Cards
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <p className='text-muted-foreground text-sm'>
            Add Card component tests here when components are created.
          </p>
        </div>
      </section>

      {/* Modals Section */}
      <section className='space-y-4xl' aria-labelledby='modals-heading'>
        <h2
          id='modals-heading'
          className='text-display-sm text-foreground font-bold'
        >
          Modals
        </h2>

        <div className='space-y-3xl bg-card p-4xl rounded-2xl'>
          <p className='text-muted-foreground text-sm'>
            Add Modal component tests here when components are created.
          </p>
        </div>
      </section>
    </div>
  );
}
