import { Skeleton } from '@/components/ui/skeleton';

export default function LayoutSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border bg-background">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>

      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  );
}
