import type { AvailabilitySlots } from '@/types/worker';

export function useAvailability() {
  const addSlot = (availability: AvailabilitySlots, day: keyof AvailabilitySlots) => {
    return {
      ...availability,
      [day]: [...availability[day], { startTime: '09:00', endTime: '17:00' }],
    };
  };

  const updateSlot = (
    availability: AvailabilitySlots,
    day: keyof AvailabilitySlots,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    return {
      ...availability,
      [day]: availability[day].map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    };
  };

  const removeSlot = (
    availability: AvailabilitySlots,
    day: keyof AvailabilitySlots,
    index: number
  ) => {
    return {
      ...availability,
      [day]: availability[day].filter((_, i) => i !== index),
    };
  };

  return { addSlot, updateSlot, removeSlot };
}
