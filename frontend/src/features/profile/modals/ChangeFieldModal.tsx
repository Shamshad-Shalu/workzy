import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import type { ZodTypeAny } from 'zod';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type FieldForm = {
  value: string;
};
interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  label: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  initialValue?: string;
  schema: ZodType<FieldForm, any, any> | ZodTypeAny;
  onSubmit: (value: string) => Promise<void>;
}

export default function ChangeFieldModal({
  open,
  onOpenChange,
  title,
  description,
  label,
  leftIcon,
  placeholder = '',
  initialValue = '',
  schema,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FieldForm>({
    resolver: zodResolver(schema as any),
    defaultValues: { value: initialValue ?? '' },
    mode: 'onChange',
  });

  const currentValue = watch('value');

  async function onSubmitForm(data: FieldForm) {
    await onSubmit(data.value);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="bg-accent/30 border border-text-blue-300 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <DialogDescription className="text-sm  dark:text-blue-500 text-muted-foreground">
            {description}
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Label>{label}</Label>
            <Input
              leftIcon={leftIcon}
              placeholder={placeholder}
              error={errors.value?.message}
              {...register('value')}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || currentValue === initialValue}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
