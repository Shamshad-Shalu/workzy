import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { CalendarDays, Trash } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { DatePicker } from '@/components/atoms/Datepicker';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { cn } from '@/lib/utils';
import { formatDateForUrl } from '@/utils/time.format';

import { useQuoteAvailableDates } from '../hooks/useQuotes';

import SlotPickerSkeleton from './SlotPickerSkeleton';


import type { QuoteFormType } from '../validation/quoteSchema';


const CUSTOM_PARAMS = [
  { key: 'endDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
  { key: 'startDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
];

interface Props {
  serviceId: string | undefined;
}

export default function SlotPicker({ serviceId }: Props) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuoteFormType>();
  const selectedDates = watch('dates');

  const { updateParams, endDate, startDate } = useUrlFilterParams<{
    endDate: Date | null;
    startDate: Date | null;
  }>(CUSTOM_PARAMS);

  const { dates, error, isLoading, refetch } = useQuoteAvailableDates(serviceId, {
    startDate: formatDateForUrl(startDate),
    endDate: formatDateForUrl(endDate),
  });

  const dateKeys = useMemo(() => Object.keys(dates), [dates]);

  const monthGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const d of dateKeys) {
      const key = d.slice(0, 7);
      (groups[key] ??= []).push(d);
    }
    return groups;
  }, [dateKeys]);

  useEffect(() => {
    if (!startDate || !endDate) {return;}
    if (dayjs(endDate).isBefore(dayjs(startDate).add(5, 'day'), 'day')) {
      updateParams({ endDate: null });
    }
  }, [startDate]);

  useEffect(() => {
    if (!dateKeys.length) {return;}
    const valid = selectedDates.filter(d => dateKeys.includes(d));
    if (valid.length !== selectedDates.length) {
      setValue('dates', valid, { shouldValidate: true });
    }
  }, [dateKeys]);

  const isAppliedFilter = startDate || endDate;

  const clearAllFilters = useCallback(() => {
    updateParams({ startDate: null, endDate: null });
  }, [updateParams]);

  function toggle(date: string) {
    if (!dates[date]) {return;}
    const next = selectedDates.includes(date)
      ? selectedDates.filter(d => d !== date)
      : [...selectedDates, date].sort();
    setValue('dates', next, { shouldValidate: true });
  }
  if (errors.dates) {
    toast.error(errors.dates.message);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-xl border bg-card p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4" />
            Pick service dates
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Each selected date reserves a full-day slot.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <LegendDot className="bg-primary" label="Selected" />
          <LegendDot className="bg-emerald-500/80" label="Available" />
          <LegendDot className="bg-muted-foreground/30" label="Blocked" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1">
        <DatePicker
          value={startDate ?? undefined}
          onChange={date => updateParams({ startDate: formatDateForUrl(date) })}
          placeholder="From Date"
          disabled={date => dayjs(date).isBefore(dayjs(), 'day')}
        />
        <DatePicker
          value={endDate ?? undefined}
          onChange={date => updateParams({ endDate: formatDateForUrl(date) })}
          placeholder="To Date"
          disabled={date => {
            if (dayjs(date).isBefore(dayjs(), 'day')) {return true;}
            if (startDate && dayjs(date).isBefore(dayjs(startDate).add(5, 'day'), 'day'))
              {return true;}
            if (startDate && dayjs(date).isAfter(dayjs(startDate).add(60, 'day'), 'day'))
              {return true;}
            return false;
          }}
        />
        {isAppliedFilter && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-1 mt-1 rounded p-2 bg-secondary text-red-600 hover:text-red-700 hover:bg-background"
          >
            <Trash size={20} />
          </button>
        )}
      </div>
      <div className="mt-4 space-y-5">
        {isLoading ? (
          <SlotPickerSkeleton />
        ) : error ? (
          <ErrorState onRetry={refetch} description={error.message} />
        ) : Object.entries(monthGroups).length === 0 ? (
          <EmptyState
            title="No available dates found"
            description={isAppliedFilter ? 'Try adjusting your filters' : 'No dates available yet'}
            action={
              isAppliedFilter ? (
                <Button type="button" onClick={clearAllFilters} variant="red" size="sm">
                  Clear Filters
                </Button>
              ) : null
            }
          />
        ) : (
          Object.entries(monthGroups).map(([month, days]) => (
            <div key={month}>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {dayjs(month + '-01').format('MMMM YYYY')}
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
                {days.map(d => {
                  const isAvailable = dates[d];
                  const isSelected = selectedDates.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggle(d)}
                      disabled={!isAvailable}
                      className={cn(
                        'group relative flex flex-col items-center justify-center rounded-lg border px-2 py-2.5 text-center transition-all',
                        isAvailable
                          ? 'hover:border-primary/60 hover:bg-primary/5'
                          : 'cursor-not-allowed opacity-40',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-background'
                      )}
                    >
                      <span className="text-[10px] font-medium uppercase opacity-80">
                        {dayjs(d).format('ddd')}
                      </span>
                      <span className="text-base font-semibold leading-tight">
                        {dayjs(d).date()}
                      </span>
                      {isAvailable && !isSelected && (
                        <span className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500" />
                      )}
                      {isSelected && (
                        <span className="absolute right-1 top-1 text-xs text-green-400">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span>
          {Object.values(dates).filter(Boolean).length} of {dateKeys.length} days available
        </span>
        {selectedDates.length > 0 && (
          <button
            type="button"
            onClick={() => setValue('dates', [], { shouldValidate: true })}
            className="font-medium text-primary hover:underline"
          >
            Clear selection
          </button>
        )}
      </div>
      {errors.dates && <p className="mt-2 text-xs text-destructive">{errors.dates.message}</p>}
    </motion.div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', className)} />
      {label}
    </span>
  );
}
