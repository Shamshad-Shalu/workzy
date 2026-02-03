import { HomeSectionType } from "@/constants/home";
import {
  HomeSectionRequestDTO,
  HomeSectionUpdateRequestDTO,
} from "@/dtos/requests/admin/homeSection.dto";
import { HomeSectionResponseDTO } from "@/dtos/responses/admin/homeSection.response.dto";

export type ListType = HomeSectionType | "all";
export interface ListSectionsResult {
  sections: HomeSectionResponseDTO[];
  total: number;
}

export interface IHomeSectionService {
  createSection(payload: HomeSectionRequestDTO): Promise<HomeSectionResponseDTO>;
  updateSection(
    sectionId: string,
    payload: HomeSectionUpdateRequestDTO
  ): Promise<HomeSectionResponseDTO>;
  deleteSection(sectionId: string): Promise<string>;
  toggleStatus(sectionId: string): Promise<{ message: string }>;
  listSections(
    page: number,
    limit: number,
    search: string,
    status: string,
    type: ListType
  ): Promise<ListSectionsResult>;
}
