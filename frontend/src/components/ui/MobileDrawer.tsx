import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import type React from 'react';

interface MobileDrawerProps {
  trigger: React.ReactNode;
  sidebar: React.ReactNode;
}

export function MobileDrawer({ trigger, sidebar }: MobileDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent side="left" className="p-0 w-72">
        {sidebar}
      </SheetContent>
    </Sheet>
  );
}
