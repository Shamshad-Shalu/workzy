import { BaseSidebar } from '@/components/layout/BaseSidebar';
import { workerMenuItems, workerSupportItems } from '@/features/worker/workerNavigation';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import type { SidebarProps } from '@/types/navigation';

export function WorkerSidebar({ mobile = false, onNavigate }: SidebarProps) {
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
      menuItems={workerMenuItems}
      supportItems={workerSupportItems}
      user={user}
      onNavigate={onNavigate}
    />
  );
}
