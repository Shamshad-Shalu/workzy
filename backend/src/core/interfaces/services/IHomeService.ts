import { PublicHomeResponseDTO } from "@/dtos/responses/home.response.dto";

export interface IHomeService {
  getHome(): Promise<PublicHomeResponseDTO>;
}
