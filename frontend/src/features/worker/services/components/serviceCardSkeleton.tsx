import { Skeleton } from '@/components/ui/skeleton';

function WorkerServiceCardSkeleton() {
  return (
    <section className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-3 gap-3 pb-4 border-b border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-3 w-6 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-4 w-10 mx-auto" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkerServiceCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <WorkerServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
