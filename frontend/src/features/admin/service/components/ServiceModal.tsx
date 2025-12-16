import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppModal } from '@/components/molecules/AppModal';
import { serviceSchema } from '../validation/serviceSchema';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import type { ServiceDTO, ServiceRow } from '@/types/admin/service';

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: ServiceDTO) => Promise<void>;
  service?: ServiceDTO | null;
  parentServices: ServiceRow | null;
}

export function ServiceModal({
  open,
  onClose,
  onSubmit,
  service,
  parentServices,
}: ServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const level = !parentServices?.level ? 1 : parentServices.level + 1;
  const parentId = !parentServices?._id ? null : parentServices._id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      iconUrl: null,
      imageUrl: null,
      parentId,
      level,
      platformFee: 0,
      isAvailable: true,
    },
  });

  useEffect(() => {
    reset({
      name: service?.name || '',
      description: service?.description || '',
      iconUrl: service?.iconUrl ?? null,
      imageUrl: service?.imageUrl ?? null,
      parentId,
      level,
      platformFee: service?.platformFee ?? 0,
      isAvailable: service?.isAvailable ?? true,
    });
  }, [parentId, level, service, reset]);

  const resetForm = () => {
    reset({
      name: '',
      description: '',
      iconUrl: null,
      imageUrl: null,
      parentId,
      level,
      platformFee: 0,
      isAvailable: true,
    });
  };

  const onSubmitForm = async (data: ServiceFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data as ServiceDTO);
      onClose();
      resetForm();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={service ? 'Edit Service' : 'Add New Service'}
      onConfirm={handleSubmit(onSubmitForm)}
      confirmText={service ? 'Update' : 'Create'}
      cancelText="Cancel"
      isConfirmLoading={isLoading}
      canCloseOnOutsideClick={!isLoading}
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 w-full">
        <div>
          <Label>Service Name</Label>
          <Input
            placeholder="Enter your full name"
            className="px-3"
            error={errors.name?.message}
            {...register('name', {
              setValueAs: v => v.trim(),
            })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            {...register('description', {
              setValueAs: v => v.trim(),
            })}
            error={errors.description?.message}
          />
        </div>
        <div>
          <Label>Platform Fee (%)</Label>
          <Input
            min={'0'}
            max={'8'}
            type="number"
            className="px-4"
            {...register('platformFee', { valueAsNumber: true })}
            error={errors.platformFee?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-40">
            <Label>Service Icon</Label>
            <Controller
              name="iconUrl"
              rules={{
                validate: v => (v ? true : 'Service icon is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={file => field.onChange(file)}
                  error={fieldState.error?.message}
                  className="h-40"
                />
              )}
            />
          </div>
          <div className="w-40">
            <Label>Service Image</Label>
            <Controller
              name="imageUrl"
              rules={{
                validate: v => (v ? true : 'Service Image is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={file => field.onChange(file)}
                  error={fieldState.error?.message}
                  className="h-40 w-40"
                />
              )}
            />
          </div>
        </div>
      </form>
    </AppModal>
  );
}
