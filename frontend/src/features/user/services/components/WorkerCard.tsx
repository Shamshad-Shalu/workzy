import { Clock, IndianRupee, MapPin, ShieldCheck, Star, Zap } from 'lucide-react';

import type { WorkerListingInfo } from '@/types/worker';

type WorkerCardProps = {
  worker: WorkerListingInfo;
  onViewProfile: (id: string) => void;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export function WorkerCard({ worker, onViewProfile }: WorkerCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-4 sm:p-5 flex gap-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-green-50/60 to-transparent rounded-2xl" />

      <div className="flex-shrink-0 flex flex-col items-center gap-2.5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-2 ring-border shadow-md">
          <img
            src={worker.profileImage}
            alt={worker.displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {worker.isAvailable && (
            <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-card" />
          )}
        </div>

        {worker.isPremium && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-700 px-2 py-1 rounded-lg border border-green-200 leading-none font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2.5 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight tracking-tight">
                {worker.displayName}
              </h3>
              {worker.categoryName && (
                <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                  {worker.categoryName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              {worker.tagline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="flex items-baseline gap-0.5 justify-end">
                <IndianRupee className="w-3.5 h-3.5 text-foreground mt-0.5" />
                <span className="text-xl sm:text-2xl font-extrabold text-foreground leading-none tracking-tight">
                  {worker.serviceRate}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{worker.PricingMode}</p>
            </div>
            <button
              onClick={() => onViewProfile(worker.workerId)}
              className="bg-foreground text-background text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-85 active:scale-95 transition-all duration-150 whitespace-nowrap shadow-sm"
            >
              View Profile →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex items-center gap-1.5">
            <StarRating rating={worker.averageRating} />
            <span className="text-xs font-bold text-foreground">
              {worker.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({worker.reviewCount})</span>
          </span>

          <span className="w-px h-3.5 bg-border" />

          {worker.distanceKm !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {worker.distanceKm} km
            </span>
          )}

          {worker.distanceKm !== undefined && worker.estimatedDuration !== null && (
            <span className="w-px h-3.5 bg-border" />
          )}

          {worker.estimatedDuration !== null && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {worker.estimatedDuration} hrs
            </span>
          )}

          {worker.travelCost !== null &&
            worker.travelCost !== undefined &&
            worker.travelCost > 0 && (
              <>
                <span className="w-px h-3.5 bg-border" />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />₹{worker.travelCost} travel
                </span>
              </>
            )}
        </div>

        {worker.about && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {worker.about}
          </p>
        )}

        {worker.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {tag}
              </span>
            ))}
            {worker.skills.length > 4 && (
              <span className="text-[11px] font-medium text-muted-foreground px-2.5 py-1">
                +{worker.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
