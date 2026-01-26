import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Hash, Percent } from 'lucide-react';
import Label from '@/components/atoms/Label';
import { useServiceForm } from '../hooks/useServiceForm';

type ServiceFormHook = ReturnType<typeof useServiceForm>;

interface BulkDiscountSectionProps {
  form: ServiceFormHook;
}

export default function BulkDiscountSection({ form }: BulkDiscountSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: 'bulkDiscounts' });

  return (
    <div className="space-y-3 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label className="mb-0 text-sm font-semibold">Bulk Discounts</Label>
        <button
          type="button"
          onClick={() => append({ count: 2, percent: 5 })}
          disabled={fields.length >= 3}
          className="text-xs font-medium text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Discount
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-1">
          <div className="flex items-center gap-3 bg-section-blue/30 border border-section-blue-border rounded-lg p-3">
            <div className="flex-1">
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Count"
                  className="w-full pl-8 pr-3 h-9 bg-background border border-input rounded-md text-sm"
                  {...register(`bulkDiscounts.${index}.count`, { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Percent"
                  className="w-full pl-8 pr-3 h-9 bg-background border border-input rounded-md text-sm"
                  {...register(`bulkDiscounts.${index}.percent`, { valueAsNumber: true })}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-start gap-3 px-1">
            <div className="flex-1">
              {errors.bulkDiscounts?.[index]?.count && (
                <p className=" text-[10px] text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.bulkDiscounts[index]?.count?.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              {errors.bulkDiscounts?.[index]?.percent && (
                <p className="text-[10px] text-destructive animate-in fade-in slide-in-from-top-1">
                  {errors.bulkDiscounts[index]?.percent?.message}
                </p>
              )}
            </div>
            <div className="w-8" />
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground italic text-center py-2">
          No bulk discounts added yet.
        </p>
      )}
    </div>
  );
}
