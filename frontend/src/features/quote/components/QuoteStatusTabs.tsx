import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type QuoteStatusKey = 'all' | 'pending' | 'accepted' | 'rejected' | 'expired';

interface QuoteStatusTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  counts?: Partial<Record<QuoteStatusKey, number>>;
  className?: string;
}

const statusOptions: Array<{ value: QuoteStatusKey; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];

export function QuoteStatusTabs({ value, onValueChange, counts, className }: QuoteStatusTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="h-auto flex-wrap">
        {statusOptions.map(option => {
          const count = counts?.[option.value];
          const showCount = typeof count === 'number';

          return (
            <TabsTrigger key={option.value} value={option.value} className="gap-1.5">
              {option.label}
              {showCount && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground">
                  {count}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
