import { Card, CardContent } from '../ui/card';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

export default function StatCard({
  icon,
  label,
  value = 0,
  sub = '',
  tone = 'primary',
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  sub?: string;
  tone?: Tone;
}) {
  const toneMap: Record<string, string> = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    primary: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    neutral: 'bg-muted text-muted-foreground',
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-bold leading-tight">{value}</p>
          <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}
