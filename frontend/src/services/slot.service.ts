import type { Role } from '@/constants';
import { SLOT_API } from '@/constants/apiRoutes/slot.routes';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
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
    const res = await api.get<ApiResponse<{ slots: AvailableSlot[] }>>(SLOT_API.ROOT, { params });
    return res.data.data;
  },
  getAvailableDates: async (
    params: WorkerSlotDatesQuery
  ): Promise<{ dates: Record<string, boolean> }> => {
    const res = await api.get<ApiResponse<{ dates: Record<string, boolean> }>>(SLOT_API.DATES, {
      params,
    });
    return res.data.data;
  },
  getAvailableDatesForQuotes: async (
    serviceId: string,
    params?: DateRangeFilter
  ): Promise<{ dates: Record<string, boolean> }> => {
    const res = await api.get<ApiResponse<{ dates: Record<string, boolean> }>>(
      SLOT_API.DATES_BY_ID(serviceId),
      { params }
    );
    return res.data.data;
  },
  reserveSlot: async (
    data: SlotFormData
  ): Promise<{ slotId: string; reservedUntil: Date; message: string }> => {
    const res = await api.post<ApiResponse<{ slotId: string; reservedUntil: Date }>>(
      SLOT_API.RESERVE,
      data
    );
    return {
      ...res.data.data,
      message: res.data.message,
    };
  },
  releaseSlot: async (slotId: string): Promise<{ message: string }> => {
    const res = await api.delete<ApiResponse<null>>(SLOT_API.BY_ID(slotId));
    return { message: res.data.message };
  },
  getRescheduleDates: async (
    bookingId: string
  ): Promise<{ dates: Record<string, boolean>; isFullDay: boolean }> => {
    const res = await api.get<ApiResponse<{ dates: Record<string, boolean>; isFullDay: boolean }>>(
      SLOT_API.RESCHEDULE_DATES(bookingId)
    );
    return res.data.data;
  },
  getRescheduleSlots: async (
    bookingId: string,
    date: string
  ): Promise<{ slots: AvailableSlot[] }> => {
    const res = await api.get<ApiResponse<{ slots: AvailableSlot[] }>>(
      SLOT_API.RESCHEDULE_SLOTS(bookingId),
      { params: { date } }
    );
    return res.data.data;
  },
  getRescheduleSlotOptions: async (bookingId: string): Promise<{ slots: SlotOption[] }> => {
    const res = await api.get<ApiResponse<{ slots: SlotOption[] }>>(
      SLOT_API.RESCHEDULE_OPTIONS(bookingId)
    );
    return res.data.data;
  },
  reserveRescheduleSlot: async (
    bookingId: string,
    data: RescheduleSlotData
  ): Promise<{ slotId: string; reservedUntil: Date; message: string }> => {
    const res = await api.post<ApiResponse<{ slotId: string; reservedUntil: Date }>>(
      SLOT_API.RESERVE_RESCHEDULE(bookingId),
      data
    );
    return {
      ...res.data.data,
      message: res.data.message,
    };
  },
  releaseRescheduleSlot: async (
    slotId: string,
    params: { bookingId: string; role: Role }
  ): Promise<{ message: string }> => {
    const res = await api.delete<ApiResponse<null>>(SLOT_API.RESCHEDULE_SLOTS(slotId), { params });
    return { message: res.data.message };
  },
};

export default SlotService;
