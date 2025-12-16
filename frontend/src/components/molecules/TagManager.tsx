import { AlertCircle, Plus, X } from 'lucide-react';
import Button from '../atoms/Button';
import { cn } from '@/lib/utils';

interface TagManagerProps {
  label: string;
  items: string[];
  isEditing?: boolean;
  max?: number;
  onAdd?: () => void;
  onRemove?: (tag: string) => void;
  className?: string;
  error?: string;
}

export function TagManager({
  label,
  items,
  isEditing = false,
  max = 15,
  onAdd,
  onRemove,
  className,
  error,
}: TagManagerProps) {
  return (
    <div>
      <div
        className={cn(
          'space-y-3 border-l-3 pl-4 p-4 rounded-lg bg-card border-card-border',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-medium">{label}</p>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <Button
              fullWidth
              onClick={onAdd}
              disabled={max ? items.length >= max : false}
              iconLeft={<Plus size={16} />}
              type="button"
            >
              Add {label}
            </Button>
            <div className="flex flex-wrap gap-2 ">
              {items.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                >
                  <span>{tag}</span>
                  {onRemove && (
                    <button onClick={() => onRemove(tag)} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {max && items.length >= max && (
              <p className="text-xs text-destructive">
                Maximum {max} {label.toLowerCase()} allowed
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 ">
            {items.length === 0 ? (
              <p className="text-muted-foreground text-sm">No {label} added</p>
            ) : (
              items.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      ) : (
        <span className="text-sm invisible">placeholder</span>
      )}
    </div>
  );
}
