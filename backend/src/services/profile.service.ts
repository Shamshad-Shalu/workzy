import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";
import { deleteFromS3, generateSignedUrl, uploadFileToS3 } from "./s3.service";
import { getUserOrThrow } from "@/utils/getUserOrThrow";
import { compare, hash } from "bcryptjs";
import CustomError from "@/utils/customError";
import { AUTH, HTTPSTATUS } from "@/constants";
import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";

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
  async updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean> {
    const { currentPassword, newPassword } = passwordDto;
    const user = await getUserOrThrow(this._userRepository, userId);

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomError(AUTH.INVALID_PASSWORD, HTTPSTATUS.BAD_REQUEST);
    }
    const hashedPassword = await hash(newPassword, 10);
    await this._userRepository.updateOne({ _id: user.id }, { $set: { password: hashedPassword } });

    return true;
  }
}
