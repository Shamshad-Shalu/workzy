import { useState } from 'react';
import type { AvailabilitySlots, TimeSlot } from '@/types/worker';

// ------------------------
// Types
// ------------------------
export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface UseAvailabilityReturn {
  data: AvailabilitySlots;
  addSlot: (day: Day) => void;
  updateSlot: (day: Day, index: number, field: keyof TimeSlot, value: string) => void;
  removeSlot: (day: Day, index: number) => void;
}

export function useAvailability(initial: AvailabilitySlots): UseAvailabilityReturn {
  const [data, setData] = useState<AvailabilitySlots>(initial);

  const addSlot = (day: Day) => {
    setData(prev => ({
      ...prev,
      [day]: [...prev[day], { startTime: '09:00', endTime: '17:00' }],
    }));
  };

  const updateSlot = (day: Day, index: number, field: keyof TimeSlot, value: string) => {
    setData(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    }));
  };

  const removeSlot = (day: Day, index: number) => {
    setData(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  return { data, addSlot, updateSlot, removeSlot };
}
