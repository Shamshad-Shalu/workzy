import { Skeleton } from '@/components/ui/skeleton';

export function QuoteSlotPickerSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-24 rounded" />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
        {Array.from({ length: 28 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
