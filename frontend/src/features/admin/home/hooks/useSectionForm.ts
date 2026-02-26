import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { HOME_SECTION_TYPE, WHY_CHOOSE_ICON } from '@/constants';
import type { AdminHomeSection } from '@/types/admin/home';

import { homeSectionSchema, type HomeSectionFormData } from '../validation/section-schemas';

type SectionData<T extends HomeSectionFormData['type']> = Extract<
  HomeSectionFormData,
  { type: T }
>['data'];

const DEFAULT_SECTION_DATA: { [K in HomeSectionFormData['type']]: SectionData<K> } = {
  HERO: {
    autoPlay: true,
    interval: 5,
    slides: [
      {
        categoryId: '',
        eyebrow: '',
        title: '',
        subTitle: '',
        description: '',
      },
    ],
  },
  CATEGORY_SHOWCASE: { categoryId: '', title: '', subTitle: '', limit: 5 },
  BANNER: { categoryId: '', title: '', description: '', imageUrl: '', ctaText: '' },
  TOP_SERVICES: { title: '', subTitle: '', limit: 10 },
  NEARBY_WORKERS: { title: '', subTitle: '', radiusKm: 20, limit: 10 },
  HOW_IT_WORKS: {
    title: '',
    subTitle: '',
    steps: [
      { step: 1, title: '', description: '', imageUrl: '' },
      { step: 2, title: '', description: '', imageUrl: '' },
      { step: 3, title: '', description: '', imageUrl: '' },
    ],
  },
  WHY_CHOOSE: {
    title: '',
    subTitle: '',
    items: [
      { icon: WHY_CHOOSE_ICON.Shield, title: '', description: '', stat: '', imageUrl: '' },
      { icon: WHY_CHOOSE_ICON.Star, title: '', description: '', stat: '', imageUrl: '' },
      { icon: WHY_CHOOSE_ICON.Clock, title: '', description: '', stat: '', imageUrl: '' },
      { icon: WHY_CHOOSE_ICON.Award, title: '', description: '', stat: '', imageUrl: '' },
    ],
  },
  TESTIMONIALS: {
    title: '',
    items: [
      { name: '', service: '', comment: '', imageUrl: '', date: '', rating: 5 },
      { name: '', service: '', comment: '', imageUrl: '', date: '', rating: 5 },
      { name: '', service: '', comment: '', imageUrl: '', date: '', rating: 5 },
    ],
  },
};

const defaultValues = {
  name: '',
  type: HOME_SECTION_TYPE.HERO,
  data: DEFAULT_SECTION_DATA.HERO,
};

export function useSectionForm(section?: AdminHomeSection | null) {
  const form = useForm<HomeSectionFormData>({
    resolver: zodResolver(homeSectionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });
  const { reset, getValues, watch } = form;

  useEffect(() => {
    if (section) {
      const formattedSection = {
        ...section,
        data:
          section.type === HOME_SECTION_TYPE.HERO
            ? { ...section.data, interval: section.data.interval / 1000 }
            : section.data,
      };
      reset(formattedSection as HomeSectionFormData);
    } else {
      reset(defaultValues);
    }
  }, [section, reset]);

  const sectionType = watch('type');
  const handleTypeChange: (newType: HomeSectionFormData['type']) => void = newType => {
    reset({
      name: getValues('name'),
      type: newType,
      data: DEFAULT_SECTION_DATA[newType],
    } as HomeSectionFormData);
  };

  return {
    form,
    sectionType,
    handleTypeChange,
  };
}
