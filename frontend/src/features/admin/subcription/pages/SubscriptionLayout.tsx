import { NavLink, Outlet } from 'react-router-dom';

import PageHeader from '@/components/molecules/PageHeader';
import { cn } from '@/lib/utils';

const TABS = [
  { name: 'Plans', path: '' },
  { name: 'Subscriptions', path: 'subscriptions' },
];

export default function SubscriptionLayout() {
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
        title="Subscription Management"
        description={`Manage plans, special offers and subscriber overview`}
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
