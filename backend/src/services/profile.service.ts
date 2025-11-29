import { HTTPSTATUS, USER } from "@/constants";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";
import { deleteFromS3, generateSignedUrl, uploadFileToS3 } from "./s3.service";
import { getUserOrThrow } from "@/utils/getUserOrThrow";

@injectable()
export class ProfileService implements IProfileService {
  constructor(@inject(TYPES.UserRepository) private _userRepository: IUserRepository) {}
  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await getUserOrThrow(this._userRepository, userId);
    if (user.profileImage) {
      const oldImage = user.profileImage.split(".amazonaws.com/")[1];
      if (oldImage) await deleteFromS3(oldImage);
    }
    const newImage = await uploadFileToS3(file, "profile");
    const key = newImage.split(".amazonaws.com/")[1];
    user.profileImage = newImage;
    await user.save();

    return await generateSignedUrl(key);
  }
}
