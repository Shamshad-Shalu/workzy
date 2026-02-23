import { ArrowRight } from 'lucide-react';

import type { ServiceItem } from '@/types/home/home';

interface ServiceCardProps {
  service: ServiceItem;
  onServiceClick?: (categoryId: string) => void;
  onSubServiceClick?: (categoryId: string, serviceId: string) => void;
}

export const ServiceCard = ({ service, onServiceClick, onSubServiceClick }: ServiceCardProps) => {
  return (
    <div
      onClick={() => onServiceClick?.(service.id)}
      className="
          w-full  h-full
          bg-popover rounded-2xl overflow-hidden
          border border-muted-foreground/10
          shadow-lg hover:shadow-lg
          transition-all duration-300
          cursor-pointer group
          hover:-translate-y-1
        "
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          decoding="async"
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-foreground leading-relaxed text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {service.subServices.slice(0, 3).map(sub => (
              <button
                key={sub.id}
                onClick={e => {
                  e.stopPropagation();
                  onSubServiceClick?.(service.id, sub.id);
                }}
                className="px-2 py-1 bg-secondary text-muted-foreground text-xs rounded-full hover:bg-secondary/80 transition cursor-pointer"
              >
                {sub.name}
              </button>
            ))}
            {service.subServices.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium transition-colors bg-indigo-500/20 text-indigo-200  dark:text-indigo-400">
                +{service.subServices.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center pt-4 border-t border-muted-secondary">
          <button
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:gap-3 transition-all"
            onClick={e => {
              e.stopPropagation();
              onServiceClick?.(service.id);
            }}
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
