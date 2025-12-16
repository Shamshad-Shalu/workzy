import { Skeleton } from '@/components/ui/skeleton';

export default function WorkerProfileLayoutSkeleton() {
  return (
    <div className="pb-12 bg-background -mt-6">
      <div className="relative -mx-4 lg:-mx-6 h-[260px] md:h-[300px] overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      <div className="relative mx-auto -mt-16">
        <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <Skeleton className="w-28 h-28 md:w-32 md:h-32 rounded-full" />
              <div className="flex flex-col justify-center w-full space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-7">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
      <div className="bg-card rounded-2xl shadow-sm mb-6 flex px-6 flex justify-between border-b border-border">
        <Skeleton className="h-6 w-20 p-5" />
        <Skeleton className="h-6 w-28 p-5" />
        <Skeleton className="h-6 w-24 p-5" />
        <Skeleton className="h-6 w-32 p-5" />
      </div>
    </div>
  );
}
