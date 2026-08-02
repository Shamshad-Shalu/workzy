import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import type { QuoteListItem } from '@/types/quote';
import { formatCurrency } from '@/utils/currency';
import { handleApiError } from '@/utils/handleApiError';

import { useUpdateQuote } from '../hooks/useUpdateQuote';
import { editQuoteSchema, type EditQuoteFormType } from '../validation/quote.schemas';

import { QuoteSlotPicker } from './QuoteSlotPicker';

interface Props {
  open: boolean;
  onClose: () => void;
  quote: QuoteListItem;
  serviceId?: string;
}

export function QuoteEditModal({ open, onClose, quote, serviceId }: Props) {
  const { mutateAsync: updateQuote, isPending } = useUpdateQuote();

  const getInitialDates = useCallback(
    () => quote.dates.map(d => dayjs(d.date).format('YYYY-MM-DD')),
    [quote.dates]
  );

  const methods = useForm<EditQuoteFormType>({
    resolver: zodResolver(editQuoteSchema),
    defaultValues: {
      dates: getInitialDates(),
      totalPrice: quote.totalPrice,
      message: quote.message || '',
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;
  const currentPrice = watch('totalPrice');
  const currentDates = watch('dates');
  const currentMessage = watch('message');

  const origDatesStr = getInitialDates().sort().join(',');
  const newDatesStr = (currentDates || []).slice().sort().join(',');

  const datesChanged = origDatesStr !== newDatesStr;
  const priceChanged =
    typeof currentPrice === 'number' && !isNaN(currentPrice) && currentPrice !== quote.totalPrice;
  const messageChanged = (currentMessage || '') !== (quote.message || '');
  const hasChanges = datesChanged || priceChanged || messageChanged;

  useEffect(() => {
    if (open) {
      reset({
        dates: getInitialDates(),
        totalPrice: quote.totalPrice,
        message: quote.message || '',
      });
    }
  }, [open, quote, reset, getInitialDates]);

  const handleEditSubmit = async (data: EditQuoteFormType) => {
    try {
      if (!hasChanges) {
        return;
      }

      const payload: { dates?: string[]; totalPrice?: number; message?: string } = {};
      if (datesChanged) {
        payload.dates = data.dates;
      }
      if (priceChanged) {
        payload.totalPrice = data.totalPrice;
      }
      if (messageChanged) {
        payload.message = data.message;
      }

      const res = await updateQuote({ quoteId: quote.id, data: payload });

      toast.success(res.message);
      onClose();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      canCloseOnOutsideClick={!isPending}
      title="Edit Quote"
      description="Update your quote details and resubmit to the customer."
      isDescriptionHidden={false}
      className="max-w-2xl"
      isConfirmLoading={isPending}
      isConfirmDisabled={!hasChanges}
      confirmText="Save Changes"
      buttonVariant="primary"
      onConfirm={handleSubmit(handleEditSubmit)}
    >
      <FormProvider {...methods}>
        <form className="flex flex-col gap-5">
          <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Current status
              </span>
              <span className="text-sm font-semibold capitalize">{quote.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Original price
              </span>
              <span className="text-sm font-semibold">{formatCurrency(quote.totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Sent on
              </span>
              <span className="text-sm font-semibold">
                {dayjs(quote.createdAt).format('MMM D, YYYY')}
              </span>
            </div>
          </div>

          {serviceId && (
            <div className="border-t border-border/60 pt-4">
              <Label>Update Service Dates</Label>
              <QuoteSlotPicker serviceId={serviceId} currentQuoteDates={getInitialDates()} />
            </div>
          )}

          <div className="border-t border-border/60 pt-4">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="Enter new quote amount"
              inputMode="decimal"
              step={1}
              min={60}
              error={errors.totalPrice?.message}
              {...methods.register('totalPrice', {
                setValueAs: val =>
                  val === '' || val === null || isNaN(Number(val)) ? undefined : Number(val),
              })}
            />
            {typeof currentPrice === 'number' &&
              !isNaN(currentPrice) &&
              currentPrice !== quote.totalPrice && (
                <p className="text-xs text-muted-foreground mt-2">
                  Price difference: {currentPrice > quote.totalPrice ? '+' : ''}
                  {formatCurrency(currentPrice - quote.totalPrice)}
                </p>
              )}
          </div>
          <div className="border-t border-border/60 pt-4">
            <Label>Message</Label>
            <Textarea
              error={errors.message?.message}
              placeholder="Update your message to the customer..."
              {...methods.register('message', { setValueAs: v => v.trim() })}
            />
          </div>

          {currentDates && currentDates.length > 0 && (
            <div className="bg-section-blue border border-section-blue-border rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-section-blue-text mb-2">
                Selected Dates ({currentDates.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {currentDates.map((dateStr, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-section-blue text-section-blue-text rounded px-2 py-1"
                  >
                    {dayjs(dateStr).format('MMM D, YYYY')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </AppModal>
  );
}
