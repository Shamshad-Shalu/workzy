import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { motion } from 'framer-motion';
import { Clock, MapPin, Percent, ShieldCheck, Star, Zap } from 'lucide-react';
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

export function WorkerCard({ worker, index = 0, onBook }: WorkerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {worker.isPremium && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400" />
      )}

      <div className="p-4 sm:p-5 flex gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden ring-1 ring-border/80">
              <img
                src={worker.profileImage}
                alt={worker.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {worker.isAvailable && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
              </span>
            )}
          </div>
          {worker.isPremium && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md whitespace-nowrap">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-bold text-[15px] sm:text-base text-foreground leading-snug tracking-tight">
              {worker.displayName}
            </h3>
            {worker.categoryName && (
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border mt-0.5 leading-none">
                {worker.categoryName}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground -mt-1 truncate">{worker.tagline}</p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-1">
              <StarRating rating={worker.averageRating} />
              <span className="text-xs font-bold text-foreground">
                {worker.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">({worker.reviewCount})</span>
            </span>

            {worker.distanceKm !== undefined && (
              <>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {worker.distanceKm} km
                </span>
              </>
            )}

            {worker.estimatedDuration !== null && (
              <>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDuration(worker.estimatedDuration)}
                </span>
              </>
            )}

            {worker.travelCost !== null && worker.travelCost > 0 && (
              <>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                  <Zap className="w-3 h-3" />₹{worker.travelCost} travel
                </span>
              </>
            )}
          </div>

          {worker.bulkDiscounts && worker.bulkDiscounts.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {worker.bulkDiscounts.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full"
                >
                  <Percent className="w-2.5 h-2.5" />
                  {d.percent}% off · {d.count}+ items
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {worker.description}
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end justify-between gap-4 min-w-[110px]">
          <div className="text-right">
            <div className="flex items-start justify-end gap-0.5 leading-none">
              <span className="text-sm font-bold text-foreground/70 mt-[3px]">₹</span>
              <span className="text-[32px] font-black text-foreground leading-none tracking-tighter">
                {worker.serviceRate.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{worker.PricingMode}</p>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <motion.div whileTap={{ scale: 0.97 }} className="w-full">
              <Link
                to={`/workers/${worker.workerId}`}
                className="flex items-center justify-center w-full text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors whitespace-nowrap"
              >
                View Profile →
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} className="w-full">
              <Button
                variant="green"
                size="sm"
                fullWidth
                onClick={() => onBook(worker)}
                className="rounded-lg text-xs font-semibold"
              >
                Book Now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {worker.totalAmount > 0 && (
        <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 mt-0 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-medium">Estimated total</span>
          <span className="text-sm font-extrabold text-foreground tracking-tight">
            ₹{worker.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      )}
    </motion.div>
  );
}
