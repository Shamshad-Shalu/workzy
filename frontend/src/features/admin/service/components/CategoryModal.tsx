import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/molecules/AppModal';
import { categorySchema, type CategoryFormData } from '../validation/categorySchema';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import type { Category } from '@/types/admin/category';
import { UploadPurposes } from '@/constants/upload';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => Promise<void>;
  category?: Category | null;
  parentId?: string | null;
}

export function CategoryModal({ open, onClose, onSubmit, category, parentId }: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      iconUrl: '',
      imageUrl: '',
      parentId,
      platformFee: 0,
      isAvailable: true,
    },
  });

  useEffect(() => {
    reset({
      name: category?.name || '',
      description: category?.description || '',
      iconUrl: category?.iconUrl || '',
      imageUrl: category?.imageUrl || '',
      parentId,
      platformFee: category?.platformFee ?? 0,
      isAvailable: category?.isAvailable ?? true,
    });
  }, [category, reset, parentId]);

  const resetForm = () => {
    reset({
      name: '',
      description: '',
      iconUrl: '',
      imageUrl: '',
      parentId,
      platformFee: 0,
      isAvailable: true,
    });
  };

  const onSubmitForm = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
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
      title={category ? 'Edit Category' : 'Add New Category'}
      onConfirm={handleSubmit(onSubmitForm)}
      confirmText={category ? 'Update' : 'Create'}
      cancelText="Cancel"
      isConfirmLoading={isLoading}
      canCloseOnOutsideClick={!isLoading}
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 w-full">
        <div>
          <Label>Category Name</Label>
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
            <Label>Category Icon</Label>
            <Controller
              name="iconUrl"
              rules={{
                validate: v => (v ? true : 'Category icon is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={url => field.onChange(url)}
                  error={fieldState.error?.message}
                  className="h-40"
                  purpose={UploadPurposes.CATEGORY_ICON}
                />
              )}
            />
          </div>
          <div className="w-40">
            <Label>Category Image</Label>
            <Controller
              name="imageUrl"
              rules={{
                validate: v => (v ? true : 'Category Image is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={url => field.onChange(url)}
                  error={fieldState.error?.message}
                  className="h-40 w-40"
                  purpose={UploadPurposes.CATEGORY_IMAGE}
                />
              )}
            />
          </div>
        </div>
      </form>
    </AppModal>
  );
}
