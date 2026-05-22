import type { Role } from '@/constants';

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  travelFromPrev: number;
}

export interface SlotOption {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isFullDay: boolean;
  duration: number;
  status: 'reserved' | 'booked';
}

export interface BookingLocation {
  lat: number;
  lng: number;
  label: string;
}

export interface SlotParams {
  workerId: string;
  serviceId: string;
  lat?: number;
  lng?: number;
  itemCount?: number;
  date: string;
}

export type DateRangeFilter = {
  startDate?: string;
  endDate?: string;
};

export type WorkerSlotDatesQuery = DateRangeFilter & {
  lat: number;
  lng: number;
  workerId: string;
  itemCount?: number;
  serviceId: string;
};

export interface BookingState {
  itemCount: number;
  date: string; // "YYYY-MM-DD"
  slot: AvailableSlot | null;
  note: string;
  slotId: string | null;
  reservedUntil: Date | null;
}

export interface SlotFormData {
  workerId: string;
  serviceId: string;
  date: Date;
  lat?: number;
  lng?: number;
  itemCount?: number;
  startTime: string;
}

export interface RescheduleSlotData {
  requestedBy: Role;
  date: string;
  isFullDay: boolean;
  startTime?: string;
}
