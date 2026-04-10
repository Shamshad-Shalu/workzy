import { FormProvider } from 'react-hook-form';

import { AppModal } from '@/components/molecules/AppModal';
import type { Service } from '@/types/service';

import { useCategoryLevels } from '../hooks/useCategoryLevels';
import { useServiceForm } from '../hooks/useServiceForm';

import { CategorySection } from './CategorySection';
import ServiceFormSection from './ServiceFormSection';

import type { ServiceFormType } from '../validation/ServiceFormData';

interface WorkerServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: ServiceFormType) => Promise<void>;
  service?: Service | null;
}

export function WorkerServiceModal({ open, onClose, onSubmit, service }: WorkerServiceModalProps) {
  const { category, ...rest } = useCategoryLevels(service?.categoryId);
  const form = useServiceForm(service, category);
  const handleClose = () => {
    form.reset();
    rest.handlers.resetLevels();
    onClose();
  };

  const handleSubmit = async (data: ServiceFormType) => {
    const {
      _baseRate,
      _deviation,
      _setTravelCost,
      _baseBuffer,
      _baseDuration,
      _serviceType,
      ...submitData
    } = data;
    await onSubmit(submitData);
    handleClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={service ? 'Edit Service' : 'Add Service'}
      onConfirm={form.handleSubmit(handleSubmit)}
      className="sm:max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <div className="space-y-4 w-full">
        <FormProvider {...form}>
          <form className="space-y-4">
            <CategorySection categoryInfo={{ category, ...rest }} service={service} />
            {category ? (
              <ServiceFormSection form={form} category={category} />
            ) : (   
              <div className="p-6 text-sm text-muted-foreground text-center">
                Select a category to configure service details
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </AppModal>
  );
}
