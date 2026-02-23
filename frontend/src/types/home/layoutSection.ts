import type { HomeSectionType } from '@/constants';

import type { SectionContentMap } from './sectionContentMap';

export type LayoutSection<T extends HomeSectionType> = {
  type: T;
  order: number;
} & SectionContentMap[T];

export type HomeSection = { [k in HomeSectionType]: LayoutSection<k> }[HomeSectionType];

export interface LayoutSectionItem {
  sectionId: string;
  order: number;
}
export interface LayoutSectionForm {
  items: LayoutSectionItem[];
}
