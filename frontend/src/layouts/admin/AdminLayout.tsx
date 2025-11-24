import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/organisms/Topbar';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-muted/30 ">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <Sheet>
        <SheetTrigger id="drawer-trigger" className="hidden" />

        <SheetContent side="left" className="p-0 w-72">
          <AdminSidebar mobile />
        </SheetContent>
      </Sheet>

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
