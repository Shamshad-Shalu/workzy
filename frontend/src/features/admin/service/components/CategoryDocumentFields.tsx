import { FileCheck } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import Label from '@/components/atoms/Label';
import MultiSelectInput from '@/components/molecules/MultiSelectInput';

import { WORKER_DOCUMENT_OPTIONS } from '../../worker/utils/documentUtils';

import type { CategoryFormData } from '../validation/categorySchema';

interface CategoryDocumentFieldsProps {
  form: UseFormReturn<CategoryFormData>;
}
export function CategoryDocumentFields({ form }: CategoryDocumentFieldsProps) {
  return (
    <div className="space-y-2 pt-2 border-t border-border">
      <Label className="text-sm font-semibold">Required Verified Documents for Workers</Label>
      <Controller
        name="requiredDocuments"
        control={form.control}
        render={({ field, fieldState }) => {
          const selectedLabels = (field.value || []).map(
            val => WORKER_DOCUMENT_OPTIONS.find(opt => opt.value === val)?.label || val
          );
          const handleLabelsChange = (newLabels: string[]) => {
            const newValues = newLabels.map(
              label => WORKER_DOCUMENT_OPTIONS.find(opt => opt.label === label)?.value || label
            );
            field.onChange(newValues);
          };
          return (
            <MultiSelectInput
              value={selectedLabels}
              onChange={handleLabelsChange}
              options={WORKER_DOCUMENT_OPTIONS.map(item => item.label)}
              icon={FileCheck}
              placeholder="Search & select required document..."
              emptyText="No document requirements selected"
              error={fieldState.error?.message}
            />
          );
        }}
      />
    </div>
  );
}
