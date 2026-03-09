import { motion } from 'framer-motion';
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
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect?.(service.id)}
      className={cn(
        'group relative border rounded-xl p-3 transition-all text-center flex flex-col items-center gap-2.5',
        isActive
          ? 'bg-primary/5 border-primary shadow-sm'
          : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
      )}
    >
      <div
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
          isActive ? 'bg-primary/10' : 'bg-muted group-hover:bg-primary/8'
        )}
      >
        <img src={service.iconUrl} alt={service.name} className="w-6 h-6" />
      </div>
      <span
        className={cn(
          'text-[11px] sm:text-xs font-medium leading-snug transition-colors',
          isActive ? 'text-primary font-semibold' : 'text-foreground'
        )}
      >
        {service.name}
      </span>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm"
        >
          <CheckCircle2 className="w-3 h-3" />
        </motion.div>
      )}
    </motion.button>
  );
}
