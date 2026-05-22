import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { RESCHEDULE_STEPS, type RescheduleStep, type Role } from '@/constants';
import {
  useReleaseRescheduleSlot,
  useRescheduleDates,
  useRescheduleSlotOptions,
  useRescheduleSlots,
  useReserveRescheduleSlot,
} from '@/features/slots/hooks/useSlot';
import type { BookingDetails } from '@/types/booking';
import type { AvailableSlot } from '@/types/slot';
import { handleApiError } from '@/utils/handleApiError';

import {
  bookingRescheduleFormData,
  type bookingRescheduleFormType,
} from '../validation/bookingRescheduleFormData';

export interface RescheduleFlowState {
  date: string;
  slot: AvailableSlot | null;
  newSlotId: string | null;
  reservedUntil: Date | null;
  isFullDay: boolean;
}

const INITIAL_FLOW_STATE: RescheduleFlowState = {
  date: '',
  slot: null,
  newSlotId: null,
  reservedUntil: null,
  isFullDay: false,
};

export function useRescheduleFlow(booking: BookingDetails, role: Role) {
  const [flow, setFlow] = useState<RescheduleFlowState>(INITIAL_FLOW_STATE);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const form = useForm<bookingRescheduleFormType>({
    resolver: zodResolver(bookingRescheduleFormData),
    mode: 'onChange',
    defaultValues: { requestedBy: role },
  });

  const {
    data: datesData,
    error: datesError,
    isLoading: isDatesLoading,
    refetch: refetchDates,
  } = useRescheduleDates(booking.id);

  const {
    data: slotsData,
    isLoading: isSlotsLoading,
    refetch: refetchSlots,
    error: slotsError,
  } = useRescheduleSlots({ bookingId: booking.id, date: flow.date });

  const { data: slotOptions } = useRescheduleSlotOptions(booking.id);

  const { mutateAsync: releaseSlot, isPending: isReleaseLoading } = useReleaseRescheduleSlot();
  const { mutateAsync: reserveSlot, isPending: isReserveLoading } = useReserveRescheduleSlot();
  const { reset: resetForm } = form;
  const isLoading = isDatesLoading || isSlotsLoading || isReleaseLoading || isReserveLoading;

  useEffect(() => {
    setFlow({ ...INITIAL_FLOW_STATE, isFullDay: datesData?.isFullDay ?? false });
  }, [datesData?.isFullDay]);

  const { dates, isFullDay } = datesData ?? {};

  const steps = useMemo<RescheduleStep[]>(
    () => [
      RESCHEDULE_STEPS.DATE,
      ...(!isFullDay ? [RESCHEDULE_STEPS.SLOTS] : []),
      RESCHEDULE_STEPS.PREVIEW,
    ],
    [isFullDay]
  );
  const step = steps[stepIndex];

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= steps.length) {
      return;
    }
    setDirection(idx > stepIndex ? 1 : -1);
    setStepIndex(idx);
  };
  const canNext = (): boolean => {
    const {
      formState: { errors },
    } = form;
    switch (step) {
      case RESCHEDULE_STEPS.DATE:
        return !!flow.date;
      case RESCHEDULE_STEPS.SLOTS:
        return !!flow.slot;
      case RESCHEDULE_STEPS.PREVIEW:
        return !errors.oldSlotId && !errors.reason;
      default:
        return false;
    }
  };
  const handleReleaseSlot = async () => {
    if (flow.newSlotId) {
      await releaseSlot({ slotId: flow.newSlotId, bookingId: booking.id, role });
    }
  };

  const handleDateSelect = async (date: string) => {
    await handleReleaseSlot();
    setFlow(f => ({ ...f, date, slot: null, newSlotId: null, reservedUntil: null }));
  };

  const handleSlotSelect = async (slot: AvailableSlot) => {
    try {
      await handleReleaseSlot();
      setFlow(f => ({ ...f, slot, newSlotId: null, reservedUntil: null }));
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };
  const handleReserveSlot = async () => {
    const { date, isFullDay, slot } = flow;
    await handleReleaseSlot();
    const result = await reserveSlot({
      bookingId: booking.id,
      data: {
        date,
        isFullDay,
        requestedBy: role,
        startTime: slot?.startTime,
      },
    });
    setFlow(f => ({
      ...f,
      newSlotId: result.slotId,
      reservedUntil: result.reservedUntil,
    }));
    form.setValue('newSlotId', result.slotId, { shouldValidate: true });
  };

  const handleContinue = async () => {
    try {
      if (step === RESCHEDULE_STEPS.DATE && isFullDay) {
        await handleReserveSlot();
        goTo(stepIndex + 1);
        return;
      }
      if (step === RESCHEDULE_STEPS.SLOTS) {
        await handleReserveSlot();
        goTo(stepIndex + 1);
        return;
      }
      goTo(stepIndex + 1);
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const reset = useCallback(async () => {
    try {
      if (flow.newSlotId) {
        await releaseSlot({ slotId: flow.newSlotId, bookingId: booking.id, role });
      }
    } catch (err) {
      console.error(handleApiError(err));
    } finally {
      setFlow(INITIAL_FLOW_STATE);
      resetForm();
      setStepIndex(0);
    }
  }, [flow.newSlotId, booking.id, role, releaseSlot, resetForm]);

  return {
    flow,
    step,
    steps,
    stepIndex,
    direction,
    isFullDay,
    isLoading,
    dates: dates ?? {},
    datesError,
    isDatesLoading,
    refetchDates,
    slots: slotsData?.slots ?? [],
    slotsError,
    isSlotsLoading,
    refetchSlots,
    slotOptions: slotOptions?.slots ?? [],
    form,
    goTo,
    canNext,
    handleDateSelect,
    handleSlotSelect,
    handleContinue,
    reset,
  };
}
