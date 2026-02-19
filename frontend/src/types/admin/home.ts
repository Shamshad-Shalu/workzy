import type { HomeSectionType } from '@/constants';

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

export interface HomeSection {
  id: string;
  name: string;
  type: HomeSectionType;
  data: unknown;
  isActive: boolean;
  createdAt: Date;
}

export interface HomeSectionsApiResponse {
  total: number;
  sections: HomeSection[];
}
