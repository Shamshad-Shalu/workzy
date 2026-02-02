import { CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { CategoryLite } from '@/types/category';

interface ServiceCardProps {
  service: CategoryLite;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

export function ServiceCard({ service, isActive = false, onSelect }: ServiceCardProps) {
  return (
    <button
      onClick={() => onSelect?.(service.id)}
      className={cn(
        'group relative border rounded-lg p-4 transition-all hover:shadow-md bg-card',
        isActive
          ? 'bg-section-blue border-section-blue-border shadow-md'
          : 'border-border hover:border-primary'
      )}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isActive ? 'bg-[var(--section-blue)]' : 'bg-accent group-hover:bg-primary/10'
          )}
        >
          <img src={service.iconUrl} alt={service.name} className="w-8 h-8 sm:w-7 sm:h-7" />
        </div>

        <h3
          className={cn(
            'text-xs sm:text-sm font-medium leading-tight transition-colors',
            isActive ? 'text-primary' : 'text-foreground'
          )}
        >
          {service.name}
        </h3>
      </div>

      {isActive && (
        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
          <CheckCircle2 className="w-3 h-3" />
        </div>
      )}
    </button>
  );
}
