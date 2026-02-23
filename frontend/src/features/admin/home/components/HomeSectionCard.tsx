import { Eye } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { Badge } from '@/components/ui/badge';
import { HOME_SECTION_TYPE, HOME_SECTION_TYPE_LABELS } from '@/constants';
import { cn } from '@/lib/utils';
import type { AdminHomeSection } from '@/types/admin/home';

type SectionPreview = {
  label: string;
  count: number;
  color: string;
};

interface Props {
  section: AdminHomeSection;
  isLayoutSection?: boolean;
  onExpand: (section: AdminHomeSection) => void;
  onStatusToggle?: (section: AdminHomeSection) => void;
}

export default function HomeSectionCard({
  section,
  isLayoutSection = false,
  onExpand,
  onStatusToggle,
}: Props) {
  const preview = getPreview(section);
  return (
    <div
      className={cn(
        'p-4 rounded-xl border bg-card shadow-sm',
        isLayoutSection && 'border-dashed border-blue-400'
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={cn('text-sm text-muted-foreground', `text-${preview.color}`)}>
            {HOME_SECTION_TYPE_LABELS[section.type]}
          </p>
          <h2 className="font-semibold">{section.name}</h2>
          <p className="text-xs mt-1">
            {preview.label}: <span>{preview.count}</span>
          </p>
        </div>
        <Badge
          className={cn(
            section.isActive ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'
          )}
        >
          {section.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <div className="flex justify-end mt-2 gap-2">
        <Button variant="blue" className="bg-blue-500" size="sm" onClick={() => onExpand(section)}>
          Show <Eye size={16} />
        </Button>
        <Button
          disabled={isLayoutSection}
          onClick={() => onStatusToggle?.(section)}
          variant={section.isActive ? 'red' : 'green'}
          size="sm"
          className="text-xs"
        >
          {section.isActive ? 'Block' : 'Unblock'}
        </Button>
      </div>
    </div>
  );
}
function getPreview(section: AdminHomeSection): SectionPreview {
  switch (section.type) {
    case HOME_SECTION_TYPE.HERO:
      return {
        label: 'Slides',
        count: section.data.slides.length,
        color: 'bg-blue-100 text-blue-600',
      };

    case HOME_SECTION_TYPE.CATEGORY_SHOWCASE:
      return {
        label: 'Limit',
        count: section.data.limit,
        color: 'bg-purple-100 text-purple-600',
      };

    case HOME_SECTION_TYPE.TOP_SERVICES:
      return {
        label: 'Limit',
        count: section.data.limit,
        color: 'bg-indigo-100 text-indigo-600',
      };

    case HOME_SECTION_TYPE.HOW_IT_WORKS:
      return {
        label: 'Steps',
        count: section.data.steps.length,
        color: 'bg-green-100 text-green-600',
      };

    case HOME_SECTION_TYPE.WHY_CHOOSE:
      return {
        label: 'Items',
        count: section.data.items.length,
        color: 'bg-amber-100 text-amber-600',
      };

    case HOME_SECTION_TYPE.NEARBY_WORKERS:
      return {
        label: 'Radius (km)',
        count: section.data.radiusKm,
        color: 'bg-cyan-100 text-cyan-600',
      };

    case HOME_SECTION_TYPE.TESTIMONIALS:
      return {
        label: 'Testimonials',
        count: section.data.items.length,
        color: 'bg-rose-100 text-rose-600',
      };

    default:
      return {
        label: 'Unknown',
        count: 0,
        color: 'bg-gray-100 text-gray-600',
      };
  }
}
