import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const statusStyles: Record<string, string> = {
  neutral: 'bg-gray-100',
  success: 'bg-green-400',
  pending: 'bg-status-blue',
  error: 'bg-red-400',
  info: 'bg-yellow-100',
};

export function StatusBadge({
  status = 'neutral',
  label,
  onClick,
  className = '',
}: {
  status?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Badge
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-foreground',
        statusStyles[status],
        className
      )}
    >
      {label}
    </Badge>
  );
}
