import { CheckCircle2 } from 'lucide-react';

import { STEP_LABELS, type BookingStep } from '@/constants';

export default function StepIndicator({
  steps,
  current,
}: {
  steps: BookingStep[];
  current: BookingStep;
}) {
  const idx = steps.indexOf(current);

  return (
    <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-0.5 scrollbar-hide">
      {steps.map((s, i) => (
        <div key={`${s}-${i}`} className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors flex-shrink-0 ${
              i < idx
                ? 'bg-emerald-500 text-white'
                : i === idx
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground/60'
            }`}
          >
            {i < idx ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
          </div>
          <span
            className={`text-[11px] font-medium transition-colors ${
              i === idx ? 'text-foreground' : 'text-muted-foreground/60'
            }`}
          >
            {STEP_LABELS[s]}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-px w-4 flex-shrink-0 ${i < idx ? 'bg-emerald-400' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
