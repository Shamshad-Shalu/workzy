import dayjs from 'dayjs';

import { DatePicker } from '@/components/atoms/Datepicker';
import Select from '@/components/atoms/Select';
import { cn } from '@/lib/utils';
import { formatDateForUrl } from '@/utils/time.format';

type Props = {
  rating: number | null;
  minRating: number | null;
  maxRating: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  status: string;
  updateParams: (updates: Record<string, string | number | null | undefined>) => void;
  resetFilters: () => void;
  activeFilterCount: number;
};

export function AdminReviewFilters({
  rating,
  minRating,
  maxRating,
  fromDate,
  toDate,
  status,
  updateParams,
  resetFilters,
  activeFilterCount,
}: Props) {
  const ratingOptions = [
    { label: 'Any', value: 'all' },
    ...[1, 2, 3, 4, 5].map(n => ({
      label: `${n}★`,
      value: String(n),
    })),
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Advanced filters</p>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-xs text-primary hover:underline">
            Reset all
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Exact rating</label>
        <div className="flex gap-1">
          {[null, 1, 2, 3, 4, 5].map(n => (
            <button
              key={n ?? 'any'}
              onClick={() => updateParams({ rating: n, minRating: null, maxRating: null })}
              className={cn(
                'flex-1 rounded-md border py-1 text-xs',
                rating === n ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              )}
            >
              {n ?? 'Any'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select
          value={minRating !== null ? String(minRating) : 'all'}
          onChange={v => {
            const newMin = v === 'all' ? null : Number(v);
            updateParams({
              minRating: newMin,
              rating: null,
              maxRating:
                maxRating !== null && newMin !== null && maxRating < newMin ? null : maxRating,
            });
          }}
          options={ratingOptions.filter(opt => {
            if (opt.value === 'all') {
              return true;
            }
            if (maxRating === null) {
              return true;
            }
            return Number(opt.value) <= maxRating;
          })}
          customClass="h-9 text-sm"
        />
        <Select
          value={maxRating !== null ? String(maxRating) : 'all'}
          onChange={v => updateParams({ maxRating: v === 'all' ? null : Number(v), rating: null })}
          options={ratingOptions.filter(
            opt => opt.value === 'all' || minRating === null || Number(opt.value) >= minRating
          )}
          customClass="h-9 text-sm"
        />
      </div>

      <div className="flex gap-1">
        {['all', 'visible', 'hidden'].map(v => (
          <button
            key={v}
            onClick={() => updateParams({ status: v })}
            className={cn(
              'flex-1 rounded-md border py-1 text-xs',
              status === v ? 'bg-primary text-white' : 'hover:bg-accent'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DatePicker
          value={fromDate ?? undefined}
          onChange={date => updateParams({ fromDate: formatDateForUrl(date) })}
          placeholder="From Date"
          disabled={date => dayjs(date).isAfter(dayjs(), 'day')}
        />
        <DatePicker
          value={toDate ?? undefined}
          onChange={date => updateParams({ toDate: formatDateForUrl(date) })}
          placeholder="To Date"
          disabled={date => {
            if (fromDate && dayjs(date).isBefore(fromDate, 'day')) {
              return true;
            }
            if (dayjs(date).isAfter(dayjs(), 'day')) {
              return true;
            }
            return false;
          }}
        />
      </div>
    </>
  );
}
