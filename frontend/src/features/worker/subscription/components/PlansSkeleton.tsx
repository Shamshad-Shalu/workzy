import { Skeleton } from '@/components/ui/skeleton';

export default function PlansSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
      <PlanCardSkeleton />
      <PlanCardSkeleton />
    </div>
  );
}
function PlanCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
