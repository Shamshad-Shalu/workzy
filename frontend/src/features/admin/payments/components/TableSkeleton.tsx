import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1fr_1fr_0.8fr_auto] px-5 py-3 border-b border-border/50 bg-muted/50" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1fr_1fr_0.8fr_auto] px-5 py-4 border-b border-border/50 items-center gap-4"
        >
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
