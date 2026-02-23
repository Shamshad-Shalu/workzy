import { Layers, ToggleLeft, ToggleRight, Hash } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HOME_SECTION_TYPE } from '@/constants';
import { cn } from '@/lib/utils';
import type { AdminHomeSection } from '@/types/admin/home';

import {
  BannerPreview,
  CategoryPreview,
  HeroPreview,
  NearByWorkersPreview,
  StepsPreview,
  TestimonialPreview,
  TopServicePreview,
  WhyChoosePreview,
} from './previews/Preview-Sections';

interface Props {
  section: AdminHomeSection;
  onEdit?: (section: AdminHomeSection) => void;
}

export default function SectionDetailView({ section, onEdit }: Props) {
  const renderPreview = () => {
    switch (section.type) {
      case HOME_SECTION_TYPE.HERO:
        return <HeroPreview section={section} />;

      case HOME_SECTION_TYPE.CATEGORY_SHOWCASE:
        return <CategoryPreview section={section} />;

      case HOME_SECTION_TYPE.TOP_SERVICES:
        return <TopServicePreview section={section} />;

      case HOME_SECTION_TYPE.HOW_IT_WORKS:
        return <StepsPreview section={section} />;

      case HOME_SECTION_TYPE.WHY_CHOOSE:
        return <WhyChoosePreview section={section} />;

      case HOME_SECTION_TYPE.NEARBY_WORKERS:
        return <NearByWorkersPreview section={section} />;

      case HOME_SECTION_TYPE.BANNER:
        return <BannerPreview section={section} />;

      case HOME_SECTION_TYPE.TESTIMONIALS:
        return <TestimonialPreview section={section} />;

      default:
        return (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Layers className="w-10 h-10 opacity-30" />
            <p className="text-sm">No preview available for this section type.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          {section.name}
        </div>
        <Separator orientation="vertical" className="h-4" />
        <Badge
          variant="secondary"
          className="text-xs tracking-wide uppercase font-mono px-2 py-0.5"
        >
          {section.type}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            section.isActive ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'
          )}
        >
          {section.isActive ? (
            <ToggleRight className="w-3 h-3" />
          ) : (
            <ToggleLeft className="w-3 h-3" />
          )}
          {section.isActive ? 'Active' : 'Inactive'}
        </Badge>
        <div className="ml-auto">
          <Button onClick={() => onEdit?.(section)}>Edit</Button>
        </div>
      </div>
      <div>{renderPreview()}</div>
    </div>
  );
}
