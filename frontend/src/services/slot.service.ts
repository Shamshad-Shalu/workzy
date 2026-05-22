import type { Role } from '@/constants';
import { SLOT_API } from '@/constants/apiRoutes/slot.routes';
import api from '@/lib/api/axios';
import type {
  AvailableSlot,
  DateRangeFilter,
  WorkerSlotDatesQuery,
  SlotFormData,
  SlotParams,
  SlotOption,
  RescheduleSlotData,
} from '@/types/slot';

const SlotService = {
  getAvailableSlots: async (params: SlotParams): Promise<{ slots: AvailableSlot[] }> => {
    const res = await api.get(SLOT_API.ROOT, { params });
    return res.data;
  },
  getAvailableDates: async (
    params: WorkerSlotDatesQuery
  ): Promise<{ dates: Record<string, boolean> }> => {
    const res = await api.get(SLOT_API.DATES, { params });
    return res.data;
  },
  getAvailableDatesForQuotes: async (
    serviceId: string,
    params?: DateRangeFilter
  ): Promise<{ dates: Record<string, boolean> }> => {
    const res = await api.get(SLOT_API.DATES_BY_ID(serviceId), { params });
    return res.data;
  },
  reserveSlot: async (
    data: SlotFormData
  ): Promise<{ slotId: string; reservedUntil: Date; message: string }> => {
    const res = await api.post(SLOT_API.RESERVE, data);
    return res.data;
  },
  releaseSlot: async (slotId: string): Promise<{ message: string }> => {
    const res = await api.delete(SLOT_API.BY_ID(slotId));
    return res.data;
  },
  getRescheduleDates: async (
    bookingId: string
  ): Promise<{ dates: Record<string, boolean>; isFullDay: boolean }> => {
    const res = await api.get(SLOT_API.RESCHEDULE_DATES(bookingId));
    return res.data;
  },
  getRescheduleSlots: async (
    bookingId: string,
    date: string
  ): Promise<{ slots: AvailableSlot[] }> => {
    const res = await api.get(SLOT_API.RESCHEDULE_SLOTS(bookingId), { params: { date } });
    return res.data;
  },
  getRescheduleSlotOptions: async (bookingId: string): Promise<{ slots: SlotOption[] }> => {
    const res = await api.get(SLOT_API.RESCHEDULE_OPTIONS(bookingId));
    return res.data;
  },
  reserveRescheduleSlot: async (
    bookingId: string,
    data: RescheduleSlotData
  ): Promise<{ slotId: string; reservedUntil: Date; message: string }> => {
    const res = await api.post(SLOT_API.RESERVE_RESCHEDULE(bookingId), data);
    return res.data;
  },
  releaseRescheduleSlot: async (
    slotId: string,
    params: { bookingId: string; role: Role }
  ): Promise<{ message: string }> => {
    const res = await api.delete(SLOT_API.RESCHEDULE_SLOTS(slotId), { params });
    return res.data;
  },
};

export default SlotService;
