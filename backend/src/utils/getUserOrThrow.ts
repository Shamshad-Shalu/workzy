import { HTTPSTATUS, USER } from "@/constants";
import CustomError from "./customError";
import { HasFindById } from "@/core/types/HasFindById";

export async function getUserOrThrow<T>(repo: HasFindById<T>, id: string) {
  const user = await repo.findById(id);
  if (!user) {
    throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
  }
  return user;
}
