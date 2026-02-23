import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface PreviewShellProps {
  icon: LucideIcon;
  label: string;
  badge?: string;
  children: React.ReactNode;
}
export function PreviewShell({ icon: Icon, label, badge, children }: PreviewShellProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-2.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {badge && (
          <span className="ml-auto inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

interface PreviewHeaderRowProps {
  title?: string;
  subTitle?: string;
  className?: string;
}
export function PreviewHeaderRow({ title, subTitle, className }: PreviewHeaderRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 divide-x divide-border/50 border-b border-border/50',
        className
      )}
    >
      <Field label="Title">{title || <Empty />}</Field>
      <Field label="Subtitle">{subTitle || <Empty />}</Field>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
export function Field({ label, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1 p-4', className)}>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-semibold text-foreground leading-snug">{children}</div>
    </div>
  );
}

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  unit?: string;
  variant?: 'primary' | 'muted';
}
export function Stat({ icon: Icon, label, value, unit, variant = 'primary' }: StatProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          variant === 'primary' ? 'bg-primary/10' : 'bg-muted'
        )}
      >
        <Icon
          className={cn(
            'w-4 h-4',
            variant === 'primary' ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground leading-none">
          {value}
          {unit && <span className="text-xs font-medium text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2;
}
export function CardGrid({ children, cols = 2 }: CardGridProps) {
  return (
    <div
      className={cn('grid gap-3 p-3', cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}
    >
      {children}
    </div>
  );
}

export function PreviewCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 hover:bg-muted/40 transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MetaRowProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}
export function MetaRow({ icon: Icon, children, className }: MetaRowProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground truncate">{children}</span>
    </div>
  );
}

export function IdBadge({ id, label = 'ID' }: { id: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground shrink-0">
        {label}
      </span>
      <Badge variant="outline" className="  px-1.5 h-4  truncate" title={id}>
        {id}
      </Badge>
    </div>
  );
}

function Empty() {
  return <span className="italic opacity-30 font-normal">—</span>;
}
