import { Skeleton } from '@/components/ui/skeleton';

export function WorkerDocumentSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="relative w-full h-40 bg-muted/50 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-muted">
              <Skeleton className="h-4 w-4" />
            </span>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
