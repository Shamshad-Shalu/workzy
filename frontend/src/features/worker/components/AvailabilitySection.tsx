import Button from '@/components/atoms/Button';
import type { AvailabilitySlots, TimeSlot } from '@/types/worker';
import { CheckCircle, Clock, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilitySectionProps {
  availability: AvailabilitySlots;
  isEditing: boolean;
  onAddSlot: (day: keyof AvailabilitySlots) => void;
  onUpdateSlot: (
    day: keyof AvailabilitySlots,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => void;
  error?: string;
  onRemoveSlot: (day: keyof AvailabilitySlots, index: number) => void;
}

export function AvailabilitySection({
  availability,
  isEditing,
  onAddSlot,
  onUpdateSlot,
  onRemoveSlot,
  error,
}: AvailabilitySectionProps) {
  if (error) {
    toast.error(error);
  }

  const days = Object.keys(availability) as (keyof AvailabilitySlots)[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {days.map((day, i) => {
        const slots = availability[day];
        const label = day.charAt(0).toUpperCase() + day.slice(1);
        const isAvailable = slots && slots.length > 0;

        return (
          <div
            key={i}
            className="border border-border rounded-lg p-4 hover:border-primary transition-colors bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isAvailable ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                {isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-primary bg-section-blue" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-card-foreground text-sm">{label}</h4>
                <p className="text-xs text-muted-foreground">
                  {isAvailable
                    ? `${slots?.length} slot${slots && slots.length > 1 ? 's' : ''}`
                    : 'Off'}
                </p>
              </div>
            </div>
            {slots.map((slot: TimeSlot, idx: number) => (
              <div className="bg-muted p-2 rounded flex items-center gap-2 mb-2" key={idx}>
                {isEditing ? (
                  <>
                    <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={e => onUpdateSlot(day, idx, 'startTime', e.target.value)}
                      className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      min={slot.startTime || undefined}
                      onChange={e => onUpdateSlot(day, idx, 'endTime', e.target.value)}
                      className="flex-1 px-2 py-1 border border-input rounded text-xs focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveSlot(day, idx)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0 " />
                    <span className="text-xs text-card-foreground  font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </>
                )}
              </div>
            ))}

            {isEditing && (
              <Button
                onClick={() => onAddSlot(day)}
                disabled={slots && slots.length >= 3}
                variant={slots && slots.length >= 3 ? 'ghost' : 'blue'}
                fullWidth
                className="text-xs py-2"
                iconLeft={<Plus className="w-3 h-3" />}
              >
                Add Slot
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
