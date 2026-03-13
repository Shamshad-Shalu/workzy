import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import SlotService from '@/services/slot.service';
import type { SlotFormData, DateSlotParams, SlotParams } from '@/types/slot';

export function useAvailableDates(params: DateSlotParams) {
  const { workerId, serviceId, itemCount, lat, lng } = params;
  return useQuery({
    queryKey: ['available-dates', workerId, serviceId, itemCount, lat, lng],
    queryFn: () => SlotService.getAvailableDates(params),
    enabled: !!workerId && !!serviceId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAvailableSlots(params: SlotParams) {
  const { workerId, serviceId, date, itemCount, lat, lng } = params;
  return useQuery({
    queryKey: ['available-slots', workerId, serviceId, date, itemCount, lat, lng],
    queryFn: () => SlotService.getAvailableSlots(params),
    enabled: !!params.workerId && !!params.serviceId && !!params.date,
    staleTime: 1000 * 30,
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
