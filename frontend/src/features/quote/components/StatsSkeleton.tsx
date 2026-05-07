import { Skeleton } from '@/components/ui/skeleton';

export default function StatsSkeleton() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3 w-28 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
