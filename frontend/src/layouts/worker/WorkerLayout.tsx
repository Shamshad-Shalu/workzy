import { Outlet } from 'react-router-dom';
import { WorkerSidebar } from './WorkerSidebar';
import { Topbar } from '@/components/organisms/Topbar';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export function WorkerLayout() {
  return (
    <div className="flex h-screen bg-muted/30 ">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <WorkerSidebar />
      </div>

      {/* MOBILE DRAWER */}
      <Sheet>
        <SheetTrigger id="drawer-trigger" className="hidden" />

        <SheetContent side="left" className="p-0 w-72">
          <WorkerSidebar mobile />
        </SheetContent>
      </Sheet>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">
        <Topbar
          onMenuClick={() => {
            document.getElementById('drawer-trigger')?.click();
          }}
        />

        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
