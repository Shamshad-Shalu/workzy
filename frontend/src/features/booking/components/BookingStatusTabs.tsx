import { motion } from 'framer-motion';
import {
  List,
  CalendarClock,
  Clock3,
  BadgeCheck,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { useRef } from 'react';

import type { BookingFilterStatus } from '@/constants';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface Tab {
  key: BookingFilterStatus;
  label: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { key: 'all', label: 'All', icon: List },
  { key: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { key: 'pending', label: 'Pending', icon: Clock3 },
  { key: 'confirmed', label: 'Confirmed', icon: BadgeCheck },
  { key: 'in_progress', label: 'In Progress', icon: RefreshCw },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'approved', label: 'Approved', icon: ShieldCheck },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle },
  { key: 'rejected', label: 'Rejected', icon: Ban },
  { key: 'disputed', label: 'Disputed', icon: AlertTriangle },
];

interface Props {
  active: BookingFilterStatus;
  onChange: (s: BookingFilterStatus) => void;
  counts?: Partial<Record<BookingFilterStatus, number>>;
}

export function BookingStatusTabs({ active, onChange, counts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex w-full gap-2 overflow-x-auto pb-1 no-scrollbar mb-5 ',
        '-mx-4 px-4 sm:mx-0 sm:px-0',
        'snap-x snap-mandatory'
      )}
    >
      {TABS.map(tab => {
        const isActive = active === tab.key;
        const count = counts?.[tab.key];
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            title={tab.label}
            className={cn(
              'snap-start shrink-0 relative inline-flex items-center gap-1.5',
              'px-3 py-2 rounded-xl whitespace-nowrap',
              'text-xs font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-tab-bg"
                className="absolute inset-0 rounded-xl bg-foreground"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}

            <Icon
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                tab.key === 'in_progress' && isActive && 'animate-spin'
              )}
            />
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                  isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
