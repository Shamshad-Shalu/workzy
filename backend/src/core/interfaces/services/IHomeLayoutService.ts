import { HomeLayoutResponseDTO } from "@/dtos/responses/admin/homeLayout.response.dto";

export type SaveItem = { sectionId: string; order: number };

export interface IHomeLayoutService {
  getLayout(): Promise<HomeLayoutResponseDTO>;
  saveLayout(items: SaveItem[]): Promise<HomeLayoutResponseDTO>;
}
