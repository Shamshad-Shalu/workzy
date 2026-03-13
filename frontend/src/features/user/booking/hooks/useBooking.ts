import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { SERVICE_TYPE } from '@/constants';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import type { BulkDiscountType } from '@/types/service';
import type { AvailableSlot, BookingState } from '@/types/slot';
import type { WorkerListingInfo } from '@/types/worker';
import { handleApiError } from '@/utils/handleApiError';

import { useReleaseSlot, useReserveSlot } from '../../slot/hooks/useSlot';

import { useCreateBooking } from './useBookingQuery';

import type { bookingFormData } from '../validation/bookingFormData';


export interface BookingPricing {
  rate: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  chargeableAmount: number;
  travelCost: number;
  total: number;
}
function getBestDiscount(discounts: BulkDiscountType[] | null, count: number) {
  if (!discounts?.length) {return null;}
  const eligible = discounts.filter(d => count >= d.count);
  if (!eligible.length) {return null;}
  return eligible.reduce((a, b) => (a.percent > b.percent ? a : b));
}

const INITIAL: BookingState = {
  itemCount: 1,
  date: '',
  slot: null,
  note: '',
  slotId: null,
  reservedUntil: null,
};

export function useBooking(worker: WorkerListingInfo, onSuccess: () => void) {
  const {
    latitude: lat,
    longitude: lng,
    address: userAddress,
  } = useAppSelector((s: RootState) => s.location);

  const { mutateAsync: releaseSlot, isPending: isReleasing } = useReleaseSlot();
  const { mutateAsync: reserveSlot, isPending: isReserving } = useReserveSlot();
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const [booking, setBooking] = useState<BookingState>(INITIAL);

  const buildPricing = useCallback(
    (state: BookingState) => {
      const best = getBestDiscount(worker.bulkDiscounts, state.itemCount);
      const rate = worker.serviceRate;
      const subtotal = rate * state.itemCount;
      const discountPercent = best?.percent ?? 0;
      const discountAmount = Math.round((subtotal * discountPercent) / 100);
      const chargeableAmount = subtotal - discountAmount;
      const travelCost = worker.travelCost ?? 0;
      const total = chargeableAmount + travelCost;
      return {
        rate,
        subtotal,
        discountPercent,
        discountAmount,
        chargeableAmount,
        travelCost,
        total,
      };
    },
    [worker]
  );

  const buildPayload = useCallback(
    (state: BookingState): bookingFormData => ({
      serviceId: worker.serviceId,
      workerId: worker.workerId,
      slotId: state.slotId!,
      date: state.date,
      startTime: state.slot!.startTime,
      endTime: state.slot!.endTime,
      duration: (worker.estimatedDuration ?? 0) * state.itemCount,
      itemCount: state.itemCount,
      address:
        worker.serviceType === SERVICE_TYPE.REMOTE
          ? null
          : {
              label: userAddress ?? '',
              location: { type: 'Point', coordinates: [lng ?? 0, lat ?? 0] },
            },
      userNote: state.note?.trim() || undefined,
    }),
    [worker, userAddress, lat, lng]
  );

  const handleDateSelect = async (date: string) => {
    if (booking.slotId) {await releaseSlot(booking.slotId);}
    setBooking(b => ({ ...b, date: date, slot: null, slotId: null, reservedUntil: null }));
  };

  const handleSlotSelect = async (slot: AvailableSlot) => {
    try {
      if (booking.slotId) {await releaseSlot(booking.slotId);}
      setBooking(b => ({ ...b, slot, slotId: null, reservedUntil: null }));
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const handleReserve = useCallback(async (): Promise<boolean> => {
    if (!booking.slot) {return false;}
    try {
      if (booking.slotId) {await releaseSlot(booking.slotId);}
      const res = await reserveSlot({
        workerId: worker.workerId,
        serviceId: worker.serviceId,
        date: new Date(booking.date),
        startTime: booking.slot.startTime,
        itemCount: booking.itemCount,
        lat,
        lng,
      });
      setBooking(b => ({
        ...b,
        slotId: res.slotId,
        reservedUntil: new Date(res.reservedUntil),
      }));
      return true;
    } catch (err) {
      toast.error(handleApiError(err));
      return false;
    }
  }, [booking, worker, lat, lng, releaseSlot, reserveSlot]);

  const handleClose = useCallback(async () => {
    try {
      if (booking.slotId) {await releaseSlot(booking.slotId);}
      setBooking(INITIAL);
    } catch (err) {
      console.error(handleApiError(err));
    }
  }, [booking.slotId, releaseSlot]);

  const handleConfirm = useCallback(async () => {
    try {
      const payload = buildPayload(booking);
      await createBooking(payload);
      setBooking(INITIAL);
      onSuccess();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  }, [booking, buildPayload, createBooking, onSuccess]);

  return {
    booking,
    setBooking,
    pricing: buildPricing(booking),
    lat,
    lng,
    isReleasing,
    isReserving,
    isBooking,
    handleDateSelect,
    handleSlotSelect,
    handleReserve,
    handleConfirm,
    handleClose,
    isRemote: worker.serviceType === SERVICE_TYPE.REMOTE,
  };
}
