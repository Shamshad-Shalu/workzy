import { Skeleton } from '@/components/ui/skeleton';

export default function WorkerProfileLayoutSkeleton() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Skeleton className="w-full h-[200px] md:h-[260px] rounded-none" />
      <div className="section-container -mt-20 relative z-10 pb-16 flex flex-col gap-5">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-5 w-full">
              <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex-shrink-0" />
              <div className="flex flex-col gap-2.5 justify-center w-full">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3.5 w-40" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex gap-2 border-b border-border px-2 py-1">
            {[80, 96, 72].map((w, i) => (
              <Skeleton key={i} className={`h-9 rounded-md my-1`} style={{ width: w }} />
            ))}
          </div>
          <div className="p-6 flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </main>
  );
}
