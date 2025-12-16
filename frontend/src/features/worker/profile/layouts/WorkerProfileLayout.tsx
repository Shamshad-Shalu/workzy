import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import type { WorkerInfo } from '@/types/worker';
import { Check } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export interface StatItem {
  value: string;
  label: string;
}

interface WorkerProfileLayoutProps {
  workerInfo: WorkerInfo;
  workerAction?: React.ReactNode;
  workerStats: StatItem[];
  reloadWorkerData?: () => void;
}

const TABS = [
  { name: 'About', path: 'about' },
  { name: 'Services', path: 'services' },
  { name: 'Documents', path: 'documents' },
  { name: 'Subscription', path: 'subscription' },
];

export default function WorkerProfileLayout({
  workerInfo,
  workerAction,
  workerStats,
  reloadWorkerData,
}: WorkerProfileLayoutProps) {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `p-4 text-muted-foreground transition duration-150 border-b-2 ${
      isActive
        ? 'text-primary font-semibold border-primary'
        : 'border-transparent hover:bg-muted/50'
    }`;

  return (
    <div className="pb-12 bg-background -mt-6">
      <WorkerProfileHeader workerInfo={workerInfo} workerAction={workerAction} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-7">
          {workerStats.map((stat: StatItem, index: number) => (
            <StatCard
              key={index}
              icon={<Check className="w-6 h-6" />}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
        <div className="bg-card rounded-2xl shadow-sm mb-6 flex px-6 flex justify-between border-b border-border">
          {TABS.map(tab => (
            <NavLink key={tab.path} to={tab.path} className={getNavLinkClass} end={tab.path === ''}>
              {tab.name}
            </NavLink>
          ))}
        </div>
        <div className="pt-2">
          <Outlet context={{ reloadWorkerData }} />
        </div>
      </div>
    </div>
  );
}
