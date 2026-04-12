import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { DatePicker } from '@/components/atoms/Datepicker';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import type { CreateLeavePayload } from '@/types/leave';

import type { UseMutateFunction } from '@tanstack/react-query';

interface AddLeaveModal {
  onSubmit: UseMutateFunction<{ message: string }, Error, CreateLeavePayload>;
  isLoading: boolean;
  open: boolean;
  onClose: () => void;
}
export default function AddLeaveModal({ isLoading, onClose, onSubmit, open }: AddLeaveModal) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const today = dayjs().startOf('day').toDate();

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both dates.');
      return;
    }
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      setError('Start date cannot be after end date.');
      return;
    }
    setError('');

    onSubmit(
      {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        reason,
      },
      {
        onSuccess: res => {
          toast.success(res.message ?? 'Leave added successfully');
          onClose();
        },
      }
    );
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Leave"
      description="Select dates to block your availability"
      isDescriptionHidden={false}
      hideFooter
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Start Date
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Start date"
              disabled={date => dayjs(date).isBefore(today, 'day')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              End Date
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="End date"
              disabled={date =>
                dayjs(date).isBefore(today, 'day') ||
                (startDate ? dayjs(date).isBefore(startDate, 'day') : false)
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Reason <span className="font-normal opacity-60">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. Medical appointment, family event..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            error={error}
            className="min-h-20"
          />
        </div>

        <Button onClick={handleSubmit} loading={isLoading} fullWidth size="md">
          Add Leave
        </Button>
      </div>
    </AppModal>
  );
}
