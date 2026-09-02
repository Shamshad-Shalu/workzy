import { HOME_API } from '@/constants';
import type { HomeSectionFormData } from '@/features/admin/home/validation/section-schemas';
import api from '@/lib/api/axios';
import type { HomeLayout, HomeSectionsApiResponse, ListType } from '@/types/admin/home';
import type { ApiResponse } from '@/types/api';
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
    const res = await api.get<ApiResponse<{ layout: HomeLayout }>>(HOME_API.LAYOUT);
    return res.data.data;
  },
  updateLayout: async (
    form: LayoutSectionForm
  ): Promise<{ message: string; layout: HomeLayout }> => {
    const res = await api.put<ApiResponse<{ layout: HomeLayout }>>(HOME_API.LAYOUT, form);
    return {
      message: res.data.message,
      layout: res.data.data.layout,
    };
  },
  getSections: async (params: SectionParams): Promise<HomeSectionsApiResponse> => {
    const res = await api.get<ApiResponse<HomeSectionsApiResponse>>(HOME_API.SECTIONS, { params });
    return res.data.data;
  },
  addSection: async (data: HomeSectionFormData): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(HOME_API.SECTIONS, data);
    return { message: res.data.message };
  },
  updateSection: async ({ sectionId, data }: HomeSectionFormType): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(HOME_API.SECTION_BY_ID(sectionId), data);
    return { message: res.data.message };
  },
  deleteSection: async (sectionId: string): Promise<{ message: string }> => {
    const res = await api.delete<ApiResponse<null>>(HOME_API.SECTION_BY_ID(sectionId));
    return { message: res.data.message };
  },
  updateSectionStatus: async (sectionId: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(HOME_API.SECTION_STATUS(sectionId));
    return { message: res.data.message };
  },
};
