import { HOME_API } from '@/constants';
import type { HomeSectionFormData } from '@/features/admin/home/validation/section-schemas';
import api from '@/lib/api/axios';
import type { HomeLayout, HomeSectionsApiResponse, ListType } from '@/types/admin/home';
import type { LayoutSectionForm } from '@/types/home/layoutSection';

interface SectionParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  type: ListType;
}
export type HomeSectionFormType = {
  sectionId: string;
  data: HomeSectionFormData;
};
export const AdminHomeService = {
  getLayout: async (): Promise<{ layout: HomeLayout }> => {
    const res = await api.get(HOME_API.LAYOUT);
    return res.data;
  },
  updateLayout: async (
    form: LayoutSectionForm
  ): Promise<{ message: string; layout: HomeLayout }> => {
    const res = await api.put(HOME_API.LAYOUT, form);
    return res.data;
  },
  getSections: async (params: SectionParams): Promise<HomeSectionsApiResponse> => {
    const res = await api.get(HOME_API.SECTIONS, { params });
    return res.data;
  },
  addSection: async (data: HomeSectionFormData): Promise<{ message: string }> => {
    const res = await api.post(HOME_API.SECTIONS, data);
    return res.data;
  },
  updateSection: async ({ sectionId, data }: HomeSectionFormType): Promise<{ message: string }> => {
    const res = await api.patch(HOME_API.SECTION_BY_ID(sectionId), data);
    return res.data;
  },
  deleteSection: async (sectionId: string): Promise<{ message: string }> => {
    const res = await api.delete(HOME_API.SECTION_BY_ID(sectionId));
    return res.data;
  },
  updateSectionStatus: async (sectionId: string): Promise<{ message: string }> => {
    const res = await api.patch(HOME_API.SECTION_STATUS(sectionId));
    return res.data;
  },
};
