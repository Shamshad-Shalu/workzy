import { FormProvider } from 'react-hook-form';

import { AppModal } from '@/components/molecules/AppModal';
import { DOCUMENT_STATUS } from '@/constants';
import { useWorkerProfileDetails } from '@/features/worker/profile/hooks/useWorkerProfile';
import type { Service } from '@/types/service';

import { useCategoryLevels } from '../hooks/useCategoryLevels';
import { useServiceForm } from '../hooks/useServiceForm';

import { CategoryDocumentChecklist } from './CategoryDocumentChecklist';
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
  const { category, parentCategory, ...rest } = useCategoryLevels(service?.categoryId);
  const { data: workerProfile } = useWorkerProfileDetails();
  const form = useServiceForm(service, category, parentCategory);

  const workerDocuments = workerProfile?.documents || [];
  const requiredDocTypes = Array.from(
    new Set([...(parentCategory?.requiredDocuments || []), ...(category?.requiredDocuments || [])])
  );

  const hasUnverifiedDocs = requiredDocTypes.some(docType => {
    const doc = workerDocuments.find(d => d.type === docType);
    return !doc || doc.status !== DOCUMENT_STATUS.VERIFIED;
  });

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
      isConfirmDisabled={hasUnverifiedDocs}
      className="sm:max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <div className="space-y-4 w-full">
        <FormProvider {...form}>
          <form className="space-y-4">
            <CategorySection
              categoryInfo={{ category, parentCategory, ...rest }}
              service={service}
            />

            {category && (
              <CategoryDocumentChecklist
                category={category}
                parentCategory={parentCategory}
                workerDocuments={workerDocuments}
              />
            )}

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
