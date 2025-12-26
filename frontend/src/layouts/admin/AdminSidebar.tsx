import { BaseSidebar } from '@/components/layout/BaseSidebar';
import { adminMenuItems, adminSupportItems } from '@/features/admin/AdminNavigation';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

export function AdminSidebar({ mobile = false }) {
  const { collapsed, initialRender, toggleCollapse } = useSidebarState(mobile);
  const { user } = useAppSelector((s: RootState) => s.auth);
  if (!user) {
    return;
  }

  return (
    <BaseSidebar
      collapsed={collapsed}
      toggleCollapse={toggleCollapse}
      initialRender={initialRender}
      mobile={mobile}
      menuItems={adminMenuItems}
      supportItems={adminSupportItems}
      user={user}
    />
  );
}
