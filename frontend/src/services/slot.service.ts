import { SLOT_API } from '@/constants/apiRoutes/slot.routes';
import api from '@/lib/api/axios';
import type { AvailableSlot, DateSlotParams, SlotFormData, SlotParams } from '@/types/slot';

const SlotService = {
  getAvailableSlots: async (params: SlotParams): Promise<{ slots: AvailableSlot[] }> => {
    const res = await api.get(SLOT_API.ROOT, { params });
    return res.data;
  },
  getAvailableDates: async (
    params: DateSlotParams
  ): Promise<{ dates: Record<string, boolean> }> => {
    const res = await api.get(SLOT_API.DATES, { params });
    return res.data;
  },
  reserveSlot: async (
    data: SlotFormData
  ): Promise<{ slotId: string; reservedUntil: Date; message: string }> => {
    const res = await api.post(SLOT_API.REVERSE, data);
    return res.data;
  },
  releaseSlot: async (slotId: string): Promise<{ message: string }> => {
    const res = await api.delete(SLOT_API.BY_ID(slotId));
    return res.data;
  },
};

export default SlotService;
