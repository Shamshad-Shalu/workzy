import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import BookingService from '@/services/booking.service';

import { workerBookingKeys } from './useWorkerBookings';

import type { BookigCompleteForm } from '../components/WorkerCompleteModal';
import type { ExtraChargeFormType } from '../validation/extraChargeSchema';

export function useWorkerBookingMutations() {
  const queryClient = useQueryClient();

  const invalidateBookings = () =>
    queryClient.invalidateQueries({ queryKey: workerBookingKeys.lists() });

  const acceptBookingMutation = useMutation({
    mutationFn: (id: string) => BookingService.acceptBooking(id),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      BookingService.rejectBooking(id, reason),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const startJobMutation = useMutation({
    mutationFn: (id: string) => BookingService.startJob(id),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const completeJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookigCompleteForm }) =>
      BookingService.completeJob(id, data),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const requestExtraChargeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExtraChargeFormType }) =>
      BookingService.requestExtraCharge(id, data),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  return {
    acceptBookingMutation,
    rejectBookingMutation,
    startJobMutation,
    completeJobMutation,
    requestExtraChargeMutation,
  };
}
