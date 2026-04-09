import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { motion } from 'framer-motion';
import { Clock, MapPin, Percent, ShieldCheck, Star, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import type { WorkerListingInfo } from '@/types/worker';

dayjs.extend(duration);

type WorkerCardProps = {
  worker: WorkerListingInfo;
  index?: number;
  onBook: (worker: WorkerListingInfo) => void;
};

function formatDuration(minutes: number): string {
  const d = dayjs.duration(minutes, 'minutes');
  const h = d.hours(),
    m = d.minutes();
  if (h === 0) {return `${m}m`;}
  if (m === 0) {return `${h}h`;}
  return `${h}h ${m}m`;
}

export function WorkerCard({ worker, index = 0, onBook }: WorkerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 flex gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-1 ring-border group-hover:ring-primary/30 transition-all">
              <img
                src={worker.profileImage}
                alt={worker.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {worker.isAvailable && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight leading-none">
                {worker.displayName}
              </h3>
              {worker.isPremium && <ShieldCheck size={14} className="text-emerald-500" />}
            </div>

            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              {worker.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 mb-4">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-foreground">{worker.averageRating.toFixed(1)}</span>
                <span className="font-bold opacity-40">({worker.reviewCount})</span>
              </div>

              {worker.distanceKm !== undefined && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="opacity-50" />
                  {worker.distanceKm} km
                </span>
              )}

              {worker.estimatedDuration !== null && (
                <span className="flex items-center gap-1">
                  <Clock size={12} className="opacity-50" />
                  {formatDuration(worker.estimatedDuration)}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 max-w-lg">
              {worker.description}
            </p>
          </div>
        </div>

        <div className="sm:w-40 shrink-0 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:pl-4 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0">
          <div className="text-left sm:text-right">
            <div className="flex items-end justify-start sm:justify-end gap-0.5 leading-none">
              <span className="text-sm font-black text-primary mb-1">₹</span>
              <span className="text-3xl font-black text-foreground tracking-tighter">
                {worker.serviceRate.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[8px] font-black text-muted-foreground/60 mt-1 uppercase tracking-widest">
              {worker.PricingMode}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-[120px] sm:max-w-none">
            <Button
              variant="green"
              size="sm"
              onClick={() => onBook(worker)}
              className="w-full h-9 rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              Book Expert
            </Button>
            <Link
              to={`/workers/${worker.workerId}`}
              className="flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              Profile <ChevronRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      {(worker.bulkDiscounts?.length || worker.travelCost) && (
        <div className="bg-muted/30 px-6 py-2.5 flex flex-wrap items-center gap-4 border-t border-border mt-1">
          {worker.travelCost !== null && worker.travelCost > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600">
              <Zap size={10} className="fill-current" />₹{worker.travelCost} fee
            </span>
          )}
          {worker.bulkDiscounts?.map((d, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary"
            >
              <Percent size={10} />
              Save {d.percent}%
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
