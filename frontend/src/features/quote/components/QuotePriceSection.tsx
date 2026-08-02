import { motion } from 'framer-motion';
import { IndianRupee, Timer, Wallet } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import type { CreateQuoteFormType } from '@/features/quote';

export function QuotePriceSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateQuoteFormType>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border bg-card p-5"
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Wallet className="h-4 w-4" />
        Quote details
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Total price (INR)</Label>
          <div className="relative">
            <Input
              leftIcon={<IndianRupee size={18} />}
              type="number"
              inputMode="numeric"
              placeholder="e.g. 2500"
              className="pl-7"
              {...register('totalPrice', { valueAsNumber: true })}
            />
          </div>
          {errors.totalPrice && (
            <p className="text-xs text-destructive">{errors.totalPrice.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Reservation hold</Label>
          <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
            <Timer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Slots locked for 48 hours after sending</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label>Message to customer (optional)</Label>
        <Textarea
          rows={4}
          placeholder="Briefly describe scope, parts, warranty, etc."
          {...register('message')}
        />
      </div>
    </motion.div>
  );
}
