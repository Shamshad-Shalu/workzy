import { NavLink, Outlet, useLocation } from 'react-router-dom';

import PageHeader from '@/components/molecules/PageHeader';
import { cn } from '@/lib/utils';

const TABS = [
  { name: 'Layout', path: '' },
  { name: 'Sections', path: 'sections' },
];

export default function HomePageLayout() {
  const location = useLocation();
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      `p-4 text-muted-foreground transition duration-150 border-b-2 `,
      isActive
        ? 'text-primary font-semibold border-primary'
        : 'border-transparent hover:bg-muted/50'
    );

  return (
    <main>
      <PageHeader
        title="Home Management"
        description={`Manage your platform's ${location.pathname === 'sections' ? 'layout' : 'sections'}`}
      />

      <div className="flex gap-2">
        {TABS.map(tab => (
          <NavLink key={tab.name} to={tab.path} className={getNavLinkClass} end={tab.path === ''}>
            {tab.name}
          </NavLink>
        ))}
      </div>
      <div className="pt-2">
        <Outlet />
      </div>
    </main>
  );
}
