import { BarChart3, Clock, Search, CheckCircle, XCircle } from 'lucide-react';

import SkeletonStatCard from '@/components/molecules/SkeletonStatCard';
import StatCard from '@/components/molecules/StatCard';
import type { DisputeStats } from '@/types/dispute';

interface Props {
  isError: boolean;
  isLoading: boolean;
  statsData?: DisputeStats;
}
const DISPUTE_STATS_CONFIG = [
  { key: 'total', label: 'Total Disputes', icon: <BarChart3 />, tone: 'primary' },
  { key: 'pending', label: 'Pending', icon: <Clock />, tone: 'warning' },
  { key: 'under_review', label: 'Under Review', icon: <Search />, tone: 'neutral' },
  { key: 'resolved', label: 'Resolved', icon: <CheckCircle />, tone: 'success' },
  { key: 'dismissed', label: 'Dismissed', icon: <XCircle />, tone: 'error' },
] as const;

export function DisputeStatsSection({ isError, isLoading, statsData }: Props) {
  return (
    <>
      {!isError && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? DISPUTE_STATS_CONFIG.map((_, i) => <SkeletonStatCard key={i} />)
            : DISPUTE_STATS_CONFIG.map(item => (
                <StatCard
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  tone={item.tone}
                  value={statsData?.[item.key]}
                />
              ))}
        </div>
      )}
    </>
  );
}
