'use client';

import dynamic from 'next/dynamic';

const DesignSystemTest = dynamic(
  () => import('@/components/dev').then((mod) => mod.DesignSystemTest),
  { ssr: false }
);
const IconTest = dynamic(
  () => import('@/components/dev').then((mod) => mod.IconTest),
  { ssr: false }
);
const ComponentTest = dynamic(
  () => import('@/components/dev').then((mod) => mod.ComponentTest),
  { ssr: false }
);

export function DevPageClient() {
  return (
    <main className='pb-20'>
      <div className='bg-neutral-900 py-4 text-center text-white'>
        <p className='text-sm font-medium'>Development Test Environment</p>
      </div>

      <DesignSystemTest />
      <hr className='max-w-container-max mx-auto border-neutral-800' />
      <IconTest />
      <hr className='max-w-container-max mx-auto border-neutral-800' />
      <ComponentTest />
    </main>
  );
}
