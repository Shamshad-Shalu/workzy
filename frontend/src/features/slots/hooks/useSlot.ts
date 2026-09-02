import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Role } from '@/constants';
import SlotService from '@/services/slot.service';
import type {
  RescheduleSlotData,
  SlotFormData,
  SlotParams,
  WorkerSlotDatesQuery,
} from '@/types/slot';

export function useAvailableDates(params: WorkerSlotDatesQuery) {
  const { workerId, serviceId, itemCount, lat, lng } = params;
  return useQuery({
    queryKey: ['available-dates', workerId, serviceId, itemCount, lat, lng],
    queryFn: () => SlotService.getAvailableDates(params),
    enabled: !!workerId && !!serviceId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}

export function useAvailableSlots(params: SlotParams) {
  const { workerId, serviceId, date, itemCount, lat, lng } = params;
  return useQuery({
    queryKey: ['available-slots', workerId, serviceId, date, itemCount, lat, lng],
    queryFn: () => SlotService.getAvailableSlots(params),
    enabled: !!params.workerId && !!params.serviceId && !!params.date,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}

export function useReserveSlot() {
  return useMutation({
    mutationFn: (data: SlotFormData) => SlotService.reserveSlot(data),
  });
}

export function useReleaseSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => SlotService.releaseSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      queryClient.invalidateQueries({ queryKey: ['available-dates'] });
    },
  });
}

// reschedule slots

export function useRescheduleDates(bookingId: string) {
  return useQuery({
    queryKey: ['available-dates', bookingId],
    queryFn: () => SlotService.getRescheduleDates(bookingId),
    enabled: !!bookingId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}

export function useRescheduleSlots({ bookingId, date }: { bookingId: string; date: string }) {
  return useQuery({
    queryKey: ['reschedule-slots', bookingId, date],
    queryFn: () => SlotService.getRescheduleSlots(bookingId, date),
    enabled: !!bookingId && !!date,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}

export function useRescheduleSlotOptions(bookingId: string) {
  return useQuery({
    queryKey: ['slots-options', bookingId],
    queryFn: () => SlotService.getRescheduleSlotOptions(bookingId),
    enabled: !!bookingId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}

export function useReserveRescheduleSlot() {
  const qc = useQueryClient();
  return useMutation<
    { slotId: string; reservedUntil: Date; message: string },
    Error,
    { bookingId: string; data: RescheduleSlotData }
  >({
    mutationFn: ({ bookingId, data }) => SlotService.reserveRescheduleSlot(bookingId, data),
    onSuccess: (_, { bookingId, data }) => {
      qc.invalidateQueries({ queryKey: ['available-dates', bookingId] });
      qc.invalidateQueries({ queryKey: ['available-slots', bookingId, data.requestedBy] });
    },
  });
}

export function useReleaseRescheduleSlot() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { slotId: string; bookingId: string; role: Role }>(
    {
      mutationFn: ({ slotId, bookingId, role }) =>
        SlotService.releaseRescheduleSlot(slotId, { bookingId, role }),
      onSuccess: (_, { bookingId, role }) => {
        qc.invalidateQueries({ queryKey: ['available-dates', bookingId] });
        qc.invalidateQueries({ queryKey: ['available-slots', bookingId, role] });
      },
    }
  );
}
