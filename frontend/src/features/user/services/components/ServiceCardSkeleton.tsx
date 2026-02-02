import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex flex-col items-center text-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
