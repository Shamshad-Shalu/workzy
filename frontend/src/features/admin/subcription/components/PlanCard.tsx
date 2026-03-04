import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/plan';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit }: PlanCardProps) {
  const { name, description, isActive, isSpecialOffer, price, validFrom, validTill } = plan;
  const now = dayjs();
  const expired = !!validTill && dayjs(validTill).isBefore(now);
  const left = !validTill ? null : Math.max(0, dayjs(validTill).diff(now, 'day'));
  const fromText = validFrom ? dayjs(validFrom).format('D MMMM YYYY') : '—';
  const tillText = validTill ? dayjs(validTill).format('D MMMM YYYY') : '—';

  return (
    <div
      className={cn(
        'group p-4 rounded-xl border bg-card shadow-sm',
        !isSpecialOffer && 'border-dashed border-blue-400',
        !isActive && 'opacity-80'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-semibold">{name}</h2>

          {isSpecialOffer ? (
            <Badge variant={expired ? 'slate' : isActive ? 'amber' : 'slate'}>
              {expired ? 'Expired' : isActive ? 'Special Offer' : 'Inactive'}
            </Badge>
          ) : (
            <Badge variant="blue">Regular Plan</Badge>
          )}
        </div>

        {!expired && (
          <div
            className={cn(
              'flex items-center gap-2 transition-all duration-300 ease-in-out',
              'sm:opacity-0 sm:group-hover:opacity-100',
              'sm:translate-x-2 sm:group-hover:translate-x-0'
            )}
          >
            <Button onClick={() => onEdit(plan)} variant="blue" size="sm" className="text-xs">
              Edit <Pencil size={15} />
            </Button>
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-xs mb-4 leading-relaxed">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(price)
          .filter(([, amount]) => typeof amount === 'number')
          .map(([cycle, amount]) => (
            <div key={cycle} className="bg-card/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5 capitalize">{cycle}</p>
              <p className="font-semibold text-sm">₹{Number(amount).toLocaleString('en-IN')}</p>
            </div>
          ))}
      </div>

      {isSpecialOffer && (
        <div className="flex items-center justify-between text-xs border-t card-foreground pt-3">
          <span className="text-muted-foreground">
            {fromText} — {tillText}
          </span>
          {isActive && !expired && left !== null && (
            <span
              className={`font-medium ${
                left <= 3 ? 'text-red-400' : left <= 7 ? 'text-amber-400' : 'text-muted-foreground'
              }`}
            >
              {left === 0 ? 'Expires today' : `${left}d left`}
            </span>
          )}
          {expired && <span className="text-muted-foreground">Offer ended</span>}
        </div>
      )}
    </div>
  );
}
