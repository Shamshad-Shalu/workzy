import { BaseSidebar } from '@/components/layout/BaseSidebar';
import { workerMenuItems, workerSupportItems } from '@/features/worker/workerNavigation';
import { useSidebarState } from '@/hooks/useSidebarState';
import { useAppSelector } from '@/store/hooks';

export function WorkerSidebar({ mobile = false }) {
  const { collapsed, initialRender, toggleCollapse } = useSidebarState(mobile);
  const { user } = useAppSelector(s => s.auth);
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
    />
  );
}
