import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { AppModal } from '@/components/molecules/AppModal';
import { Separator } from '@/components/ui/separator';
import { HomeSectionsFilterOptions, type HomeSectionType } from '@/constants';
import type { AdminHomeSection } from '@/types/admin/home';
import { handleApiError } from '@/utils/handleApiError';

import { useSectionForm } from '../hooks/useSectionForm';

import BannerForm from './forms/BannerForm';
import CategoryShowcaseForm from './forms/CategoryShowcaseForm';
import HeroForm from './forms/HeroForm';
import HowItWorksForm from './forms/HowItWorksForm';
import NearbyWorkersForm from './forms/NearbyWorkersForm';
import TestimonialsForm from './forms/TestimonialsForm';
import TopServicesForm from './forms/TopServicesForm';
import WhyChooseForm from './forms/WhyChooseForm';

import type { HomeSectionFormData } from '../validation/section-schemas';

interface SectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (section: HomeSectionFormData) => Promise<void>;
  section?: AdminHomeSection | null;
}

const SubFormMap = {
  HERO: HeroForm,
  CATEGORY_SHOWCASE: CategoryShowcaseForm,
  BANNER: BannerForm,
  TOP_SERVICES: TopServicesForm,
  NEARBY_WORKERS: NearbyWorkersForm,
  HOW_IT_WORKS: HowItWorksForm,
  WHY_CHOOSE: WhyChooseForm,
  TESTIMONIALS: TestimonialsForm,
} as const;

export default function SectionModal({ open, onClose, onSubmit, section }: SectionModalProps) {
  const { form, sectionType, handleTypeChange } = useSectionForm(section);
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    watch,
  } = form;
  const ActiveForm = SubFormMap[sectionType];

  const onSubmitForm = async (data: HomeSectionFormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={section ? 'Edit Section' : 'Add New Section'}
      onConfirm={handleSubmit(onSubmitForm)}
      confirmText={section ? 'Update' : 'Create'}
      cancelText="Cancel"
      isConfirmLoading={isSubmitting}
      canCloseOnOutsideClick={!isSubmitting}
      className="sm:max-w-3xl w-full"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-6 px-1">
          <div className="flex flex-col gap-4">
            <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label>Section Name</Label>
                <Input className="px-4" {...register('name')} error={errors.name?.message} />
              </div>
              <div>
                <Label>Section Type</Label>
                <Select
                  placeholder="Select Section Type"
                  options={HomeSectionsFilterOptions.filter(opt => opt.value !== 'all')}
                  value={watch('type')}
                  onChange={v => handleTypeChange(v as HomeSectionType)}
                  error={errors.type?.message}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold px-1">
                {sectionType?.replace(/_/g, ' ')} Content
              </span>
              <Separator className="flex-1" />
            </div>
            {ActiveForm && <ActiveForm />}
          </div>
        </form>
      </FormProvider>
    </AppModal>
  );
}
