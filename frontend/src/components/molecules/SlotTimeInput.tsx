import { BUFFER_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS } from '@/constants';
import Label from '../atoms/Label';
import Select from '../atoms/Select';

interface SlotTimeInputProps {
  label: string;
  valueInMinutes: number;
  onChange: (newMinutes: number) => void;
  error?: string;
  isBuffer?: boolean;
}

export default function SlotTimeInput({
  label,
  onChange,
  valueInMinutes,
  error,
  isBuffer = false,
}: SlotTimeInputProps) {
  const hours = Math.floor(valueInMinutes / 60);
  const minutes = valueInMinutes % 60;

  const hourOptions = isBuffer ? BUFFER_OPTIONS : HOUR_OPTIONS;

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select
          placeholder="hour"
          options={hourOptions}
          value={hours.toString()}
          onChange={v => onChange(Number(v) * 60 + minutes)}
        />
        <Select
          placeholder="minute"
          options={MINUTE_OPTIONS}
          value={minutes.toString()}
          onChange={v => onChange(hours * 60 + Number(v))}
        />
      </div>
      <p className="text-red-500 text-sm -mt-2">{error}</p>
    </div>
  );
}
