import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock, Info, Send, Sparkles, User, Wallet } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import { Separator } from '@/components/ui/separator';
import type { BookingDetails } from '@/types/booking';

import type { QuoteFormType } from '../validation/quoteSchema';
import { formatCurrency } from '@/utils/currency';


function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

interface Props {
  booking?: BookingDetails | null;
  isSubmitting: boolean;
}

export default function SummarySection({ booking, isSubmitting }: Props) {
  const { watch, setValue } = useFormContext<QuoteFormType>();
  const selectedDates = watch('dates');
  const totalPrice = watch('totalPrice');

  function removeDate(d: string) {
    setValue(
      'dates',
      selectedDates.filter(x => x !== d),
      { shouldValidate: true }
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold">Summary</h3>
        <p className="text-xs text-muted-foreground">Review before sending the quote.</p>

        <Separator className="my-4" />

        <div className="space-y-3 text-sm">
          <Row
            icon={<User className="h-3.5 w-3.5" />}
            label="Customer"
            value={booking?.user.name ?? '—'}
          />
          <Row
            icon={<Sparkles className="h-3.5 w-3.5" />}
            label="Service"
            value={booking?.category.name ?? '—'}
          />
          <Row
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Days"
            value={`${selectedDates.length} selected`}
          />
          <Row
            icon={<Wallet className="h-3.5 w-3.5" />}
            label="Total"
            value={totalPrice > 0 ? formatCurrency(totalPrice) : '—'}
          />
        </div>

        <AnimatePresence>
          {selectedDates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Selected dates
                </div>
                <ul className="space-y-1 text-xs">
                  {selectedDates.map(d => (
                    <li key={d} className="flex items-center justify-between">
                      <span>{formatDayLabel(d)}</span>
                      <button
                        type="button"
                        onClick={() => removeDate(d)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="mt-5 w-full"
          size="lg"
          loading={isSubmitting}
          iconLeft={<Send className="h-4 w-4" />}
        >
          Send Quote
        </Button>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          Customer has 24h to accept. Slots auto-release on rejection or expiry.
        </p>
      </div>
    </motion.aside>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
