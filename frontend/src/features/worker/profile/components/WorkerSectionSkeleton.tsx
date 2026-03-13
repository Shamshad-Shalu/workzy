import { Skeleton } from '@/components/ui/skeleton';

export default function WorkerSectionSkeleton() {
  return (
    <main>
      <div className="mt-6 bg-card rounded-2xl shadow-sm p-8 border border-border">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-5">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card rounded-2xl shadow-sm p-8 border border-border">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
