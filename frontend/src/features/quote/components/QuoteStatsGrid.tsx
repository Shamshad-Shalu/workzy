import { FileText, TrendingUp, Wallet } from 'lucide-react';

import StatCard from '@/components/molecules/StatCard';
import type { WorkerQuoteStats } from '@/types/quote';
import { formatCurrency } from '@/utils/currency';

export function QuoteStatsGrid({ stats }: { stats: WorkerQuoteStats }) {
  const { counts, acceptRate = 0, totalEarned = 0 } = stats;

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6`}>
      <StatCard
        icon={<FileText className="h-4 w-4" />}
        label="Quotes Sent"
        value={counts?.all ?? 0}
        sub=""
      />
      <StatCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Acceptance Rate"
        value={`${acceptRate}%`}
        sub=""
        tone="info"
      />
      <StatCard
        icon={<Wallet className="h-4 w-4" />}
        label="Earned (Accepted)"
        value={formatCurrency(totalEarned)}
        tone="success"
        sub=""
      />
    </div>
  );
}
