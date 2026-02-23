import { Separator } from '@radix-ui/react-separator';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Star,
  Layers,
  Tag,
  MousePointerClick,
  LayoutGrid,
  MapPin,
  Users,
  ListOrdered,
  MessageSquareQuote,
  User,
  CalendarDays,
  Wrench,
  Shield,
  Award,
  Clock,
} from 'lucide-react';

import { HOME_SECTION_TYPE, WHY_CHOOSE_ICON } from '@/constants';
import CategoryService from '@/services/category.service';
import type { AdminSection } from '@/types/admin/home';
import type {
  HeroSlide,
  HowItWorksStep,
  TestimonialItem,
  WhyChooseItem,
} from '@/types/home/home.sectionContent';

import {
  PreviewShell,
  Field,
  Stat,
  IdBadge,
  PreviewHeaderRow,
  CardGrid,
  PreviewCard,
  MetaRow,
} from './preview-primitives';

type StepsProps = { section: AdminSection<typeof HOME_SECTION_TYPE.HOW_IT_WORKS> };
type TestimonialProps = { section: AdminSection<typeof HOME_SECTION_TYPE.TESTIMONIALS> };
type TopServiceProps = { section: AdminSection<typeof HOME_SECTION_TYPE.TOP_SERVICES> };
type WhyChooseProps = { section: AdminSection<typeof HOME_SECTION_TYPE.WHY_CHOOSE> };
type NearByProps = { section: AdminSection<typeof HOME_SECTION_TYPE.NEARBY_WORKERS> };
type CategoryProps = { section: AdminSection<typeof HOME_SECTION_TYPE.CATEGORY_SHOWCASE> };
type BannerProps = { section: AdminSection<typeof HOME_SECTION_TYPE.BANNER> };
type HeroProps = { section: AdminSection<typeof HOME_SECTION_TYPE.HERO> };

export function HeroPreview({ section }: HeroProps) {
  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          {section.data.slides.length} slide{section.data.slides.length !== 1 ? 's' : ''}
        </span>
        {section.data.autoPlay && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>Auto-play every {section.data.interval / 1000}s</span>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.data.slides.map((slide, index) => (
          <HeroSlideCard key={index} slide={slide} />
        ))}
      </div>
    </div>
  );
}

function HeroSlideCard({ slide }: { slide: HeroSlide }) {
  return (
    <article className="group flex flex-col min-h-[160px] overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-2 p-4 h-full">
        <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {slide.eyebrow}
        </span>
        <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
          {slide.title || <span className="opacity-30 italic">Untitled Slide</span>}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1">{slide.subTitle}</p>
        <div className="my-1 border-t border-border/50" />
        <p className="text-xs text-foreground leading-relaxed line-clamp-3">{slide.description}</p>
      </div>
    </article>
  );
}

export function BannerPreview({ section }: BannerProps) {
  const { data } = section;
  return (
    <PreviewShell icon={Tag} label="Banner">
      <div className="relative">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
      </div>
      <Field label="Title">{data.title}</Field>
      <Separator />
      <Field label="Description">
        <p className="text-sm font-normal text-foreground/80 line-clamp-3">{data.description}</p>
      </Field>
      {data.ctaText && (
        <>
          <Separator />
          <div className="flex items-center gap-3 px-4 pb-4">
            <MousePointerClick className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                CTA
              </p>
              <span className="inline-flex items-center rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {data.ctaText}
              </span>
            </div>
          </div>
        </>
      )}
    </PreviewShell>
  );
}

export function CategoryPreview({ section }: CategoryProps) {
  const { data } = section;
  const { data: category } = useQuery({
    queryKey: ['category', data.categoryId],
    queryFn: () => CategoryService.getCategory(data.categoryId),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <PreviewShell icon={LayoutGrid} label="Category Showcase">
      <PreviewHeaderRow title={data.title} subTitle={data.subTitle} />
      <div className="flex flex-wrap items-center gap-6 px-4 py-4">
        <IdBadge id={category?.name ?? data.categoryId} label="Category" />
        <Stat icon={Layers} label="Limit" value={data.limit} variant="primary" />
      </div>
    </PreviewShell>
  );
}

export function NearByWorkersPreview({ section }: NearByProps) {
  const { data } = section;
  return (
    <PreviewShell icon={MapPin} label="Nearby Workers">
      <PreviewHeaderRow title={data.title} subTitle={data.subTitle} />
      <div className="flex items-center gap-6 px-4 py-4">
        <Stat icon={MapPin} label="Radius" value={data.radiusKm} unit="km" variant="primary" />
        <div className="h-10 w-px bg-border/50" />
        <Stat icon={Users} label="Limit" value={data.limit} unit="workers" variant="muted" />
      </div>
    </PreviewShell>
  );
}

export function StepsPreview({ section }: StepsProps) {
  const { data } = section;
  return (
    <PreviewShell icon={ListOrdered} label="How It Works" badge={`${data.steps.length} steps`}>
      <PreviewHeaderRow title={data.title} subTitle={data.subTitle} />
      <div className="flex flex-col divide-y divide-border/40">
        {data.steps.map(step => (
          <StepRow key={step.step} step={step} />
        ))}
      </div>
    </PreviewShell>
  );
}

function StepRow({ step }: { step: HowItWorksStep }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 hover:bg-muted/20 transition-colors">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <span className="text-[11px] font-bold text-primary">{step.step}</span>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
          {step.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function TestimonialPreview({ section }: TestimonialProps) {
  const { data } = section;
  return (
    <PreviewShell
      icon={MessageSquareQuote}
      label="Testimonials"
      badge={`${data.items.length} reviews`}
    >
      <Field label="Section Title">{data.title}</Field>
      <Separator />
      <CardGrid>
        {data.items.map((item, i) => (
          <TestimonialCard key={item.id ?? i} item={item} />
        ))}
      </CardGrid>
    </PreviewShell>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <PreviewCard>
      <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 italic">
        "{item.comment}"
      </p>
      <Separator />
      <MetaRow icon={User}>{item.name}</MetaRow>
      <MetaRow icon={Wrench}>{item.service}</MetaRow>
      <MetaRow icon={CalendarDays}>{item.date}</MetaRow>
    </PreviewCard>
  );
}

export function TopServicePreview({ section }: TopServiceProps) {
  const { data } = section;
  return (
    <PreviewShell icon={Star} label="Top Services">
      <PreviewHeaderRow title={data.title} subTitle={data.subTitle} />
      <div className="px-4 py-4">
        <Stat icon={Layers} label="Services Shown" value={data.limit} />
      </div>
    </PreviewShell>
  );
}

export function WhyChoosePreview({ section }: WhyChooseProps) {
  const { data } = section;
  return (
    <PreviewShell icon={ShieldCheck} label="Why Choose" badge={`${data.items.length} items`}>
      <PreviewHeaderRow title={data.title} subTitle={data.subTitle} />
      <CardGrid>
        {data.items.map((item, i) => (
          <WhyChooseCard key={i} item={item} />
        ))}
      </CardGrid>
    </PreviewShell>
  );
}

function WhyChooseCard({ item }: { item: WhyChooseItem }) {
  const IconComponent =
    item.icon === WHY_CHOOSE_ICON.Shield
      ? Shield
      : item.icon === WHY_CHOOSE_ICON.Star
        ? Star
        : item.icon === WHY_CHOOSE_ICON.Clock
          ? Clock
          : Award;

  return (
    <PreviewCard>
      <div className="flex items-center gap-2.5">
        <IconComponent className="w-6 h-6 text-foreground " />
        <h4 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {item.description}
      </p>
      <Separator />
      <MetaRow icon={TrendingUp} className="text-primary">
        <span className="text-xs font-bold text-primary">{item.stat}</span>
      </MetaRow>
    </PreviewCard>
  );
}
