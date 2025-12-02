import { IAdress, IUser } from "@/types/user";

export type UpdateProfilePayload = Partial<{
  name: IUser["name"];
  profile: Partial<{
    address: Partial<IAdress>;
  }>;
}>;
