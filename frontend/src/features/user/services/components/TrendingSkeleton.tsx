import { Skeleton } from '@/components/ui/skeleton';

export default function TrendingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
