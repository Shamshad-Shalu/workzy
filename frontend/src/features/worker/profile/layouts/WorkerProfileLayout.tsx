import { ClipboardCheck, Star, TrendingUp } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import { cn } from '@/lib/utils';
import type { WorkerInfo } from '@/types/worker';

interface WorkerProfileLayoutProps {
  workerInfo: WorkerInfo;
  workerAction?: React.ReactNode;
  reloadWorkerData?: () => void;
}

const TABS = [
  { name: 'About', path: '' },
  { name: 'Documents', path: 'documents' },
  { name: 'Account', path: 'account' },
  { name: 'Leaves', path: 'leaves' },
];

export default function WorkerProfileLayout({
  workerInfo,
  workerAction,
  reloadWorkerData,
}: WorkerProfileLayoutProps) {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      `p-4 text-muted-foreground transition duration-150 border-b-2 `,
      isActive
        ? 'text-primary font-semibold border-primary'
        : 'border-transparent hover:bg-muted/50'
    );

  return (
    <div className="pb-12 bg-background">
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden rounded-t-2xl">
        <img src={workerInfo.coverImage} className="w-full h-full object-cover" alt="banner" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <WorkerProfileHeader workerInfo={workerInfo} workerAction={workerAction} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-7">
          <StatCard
            icon={<ClipboardCheck className="w-6 h-6" />}
            label="Jobs Completed"
            value={workerInfo.worksCompleted}
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Average Rating"
            value={workerInfo.averageRating}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Completion Rate"
            value={`${workerInfo.worksCompleted ?? 0}%`}
          />
        </div>
        <div className="bg-card rounded-2xl shadow-sm mb-6 flex px-6 flex justify-between border-b border-border">
          {TABS.map(tab => (
            <NavLink key={tab.name} to={tab.path} className={getNavLinkClass} end={tab.path === ''}>
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
