import { IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import { Switch } from '@/components/ui/switch';
import { PLAN_BENEFITS, type BillingCycle } from '@/constants';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/plan';
import { handleApiError } from '@/utils/handleApiError';

import { usePlanForm } from '../hooks/usePlanForm';

import type { PlanFormData } from '../validation/plan-schema';

interface CycleConfig {
  key: BillingCycle;
  label: string;
  required: boolean;
}

const cycles: CycleConfig[] = [
  { key: 'monthly', label: 'Monthly', required: true },
  { key: 'quarterly', label: 'Quarterly', required: false },
  { key: 'halfYearly', label: 'Half-Yearly', required: false },
  { key: 'yearly', label: 'Yearly', required: false },
];

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlanFormData) => Promise<void>;
  plan?: Plan | null;
}

export default function PlanModal({ open, onClose, onSubmit, plan }: PlanModalProps) {
  const form = usePlanForm(plan ?? undefined);
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
    watch,
  } = form;

  const price = watch('price');

  const setPrice = (key: BillingCycle, val: string) => {
    setValue(`price.${key}`, val === '' ? undefined : Number(val), {
      shouldValidate: true,
    });
  };

  const onSubmitForm = async (data: PlanFormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const isSpecialOffer = watch('isSpecialOffer');

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={plan ? 'Edit Plan' : 'Add New Plan'}
      onConfirm={handleSubmit(onSubmitForm)}
      confirmText={plan ? 'Update' : 'Create'}
      isConfirmLoading={isSubmitting}
      canCloseOnOutsideClick={!isSubmitting}
      className="sm:max-w-3xl w-full"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-6 px-1">
        <div className="flex flex-col gap-4">
          <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label>Plan Name</Label>
              <Input
                className={cn(
                  'px-4',
                  plan && !plan.isSpecialOffer && 'opacity-50 cursor-not-allowed'
                )}
                {...register('name')}
                placeholder="Enter Plan Name"
                error={errors.name?.message}
              />
              {plan && !plan.isSpecialOffer && (
                <p className="text-xs text-amber-400/70 mt-1">
                  Name cannot be changed once subscriptions exist.
                </p>
              )}
            </div>
            {(!plan || !!plan?.isSpecialOffer) && (
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={watch('isActive')}
                  onCheckedChange={v => setValue('isActive', v)}
                  id="active"
                />
                <label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Active
                </label>
              </div>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Enter Description"
              className="px-4"
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Pricing (₹)</label>
            <div className="grid grid-cols-2 gap-3">
              {cycles.map(({ key, label, required }) => {
                const isRequired = required || !isSpecialOffer;
                return (
                  <div key={key}>
                    <Label>
                      {label}
                      {isRequired ? (
                        <span className="text-red-400 ml-1">*</span>
                      ) : (
                        <span className="text-slate-600 ml-1">(optional)</span>
                      )}
                    </Label>
                    <div>
                      <Input
                        leftIcon={<IndianRupee size={15} />}
                        type="number"
                        value={price?.[key] ?? ''}
                        onChange={e => setPrice(key, e.target.value)}
                        placeholder="—"
                        className="pl-7"
                        error={errors.price?.[key]?.message}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {isSpecialOffer && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Offer Duration</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    {...register('validFrom')}
                    className="px-4"
                    error={errors.validFrom?.message}
                  />
                </div>
                <div>
                  <Label>Valid Till</Label>
                  <Input
                    type="date"
                    {...register('validTill')}
                    className="px-4"
                    error={errors.validTill?.message}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="bg-muted/50 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Included Benefits
            </p>
            <div className="space-y-2">
              {PLAN_BENEFITS.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </AppModal>
  );
}
