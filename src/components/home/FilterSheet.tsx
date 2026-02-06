'use client';

/**
 * FilterSheet Component
 *
 * A responsive wrapper for FilterContent that displays as a Sheet on mobile/tablet.
 * On desktop, this component is generally not used as the filter is persistent in the sidebar.
 */

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FilterContent } from './FilterContent';
import { cn } from '@/lib/utils';
interface FilterSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterSheet({
  isOpen,
  onOpenChange,
}: Readonly<FilterSheetProps>) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className={cn('flex flex-col border-none p-0', 'w-66.5 min-w-66.5')}
      >
        <SheetTitle className='sr-only'>Filters</SheetTitle>
        <div className='flex-1 overflow-y-auto pt-2 pb-6'>
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
