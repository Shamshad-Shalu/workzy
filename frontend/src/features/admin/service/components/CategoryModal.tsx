import { toast } from 'sonner';

import { AppModal } from '@/components/molecules/AppModal';
import type { Category } from '@/types/category';
import { handleApiError } from '@/utils/handleApiError';

import { useCategoryForm } from '../hooks/useCategoryForm';
import { type CategoryFormData } from '../validation/categorySchema';

import { CategoryBasicFields } from './CategoryBasicFields';
import { CategoryImageFields } from './CategoryImageFields';
import { ServiceFields } from './ServiceFields';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => Promise<void>;
  category?: Category | null;
  parentCategory?: Category | null;
}

export function CategoryModal({
  open,
  onClose,
  onSubmit,
  category,
  parentCategory,
}: CategoryModalProps) {
  const { form, isLevel2, serviceType, bufferTime, estimatedDuration } = useCategoryForm({
    category,
    parentCategory,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmitForm = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      onClose();
      form.reset();
    } catch (error) {
      toast.error(handleApiError(error));
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
      isConfirmLoading={isSubmitting}
      canCloseOnOutsideClick={!isSubmitting}
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 w-full">
        <CategoryBasicFields form={form} />
        {isLevel2 && (
          <ServiceFields
            form={form}
            bufferTime={bufferTime}
            estimatedDuration={estimatedDuration}
            serviceType={serviceType}
          />
        )}
        <CategoryImageFields form={form} />
      </form>
    </AppModal>
  );
}
