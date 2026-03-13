export interface AvailableSlot {
  startTime: string;
  endTime: string;
  travelFromPrev: number;
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
export type DateSlotParams = Omit<SlotParams, 'date'>;

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
