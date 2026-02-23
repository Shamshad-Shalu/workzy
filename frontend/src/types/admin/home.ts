import type { HomeSectionType } from '@/constants';

import type { SectionContentMap } from '../home/sectionContentMap';

export type ListType = HomeSectionType | 'all';

export interface SectionListItem {
  sectionId: string;
  order: number;
  sectionName: string;
  sectionType: HomeSectionType;
}

export interface HomeLayout {
  sections: SectionListItem[];
}

export type HomeSection = {
  [K in HomeSectionType]: {
    id: string;
    name: string;
    type: K;
    data: SectionContentMap[K];
    isActive: boolean;
    createdAt: Date;
  };
}[HomeSectionType];

export interface HomeSectionsApiResponse {
  total: number;
  sections: HomeSection[];
}

export type AdminSection<T extends HomeSectionType> = {
  id: string;
  name: string;
  type: T;
  isActive: boolean;
  createdAt: Date;
  data: SectionContentMap[T];
};

export type AdminHomeSection = { [k in HomeSectionType]: AdminSection<k> }[HomeSectionType];
