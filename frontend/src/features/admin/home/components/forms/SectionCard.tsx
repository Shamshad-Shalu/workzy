import { GripVertical, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface SectionCardProps {
  label: string;
  index: number;
  onRemove?: () => void;
  canRemove?: boolean;
  children: React.ReactNode;
}
export function SectionCard({ label, index, onRemove, canRemove, children }: SectionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-2.5">
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
        <Badge variant="secondary" className="text-[10px] font-mono">
          {`${label} ${index + 1}`}
        </Badge>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </div>
  );
}
