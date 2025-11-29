export interface IProfileService {
  updateProfileImage(userId: string, file: Express.Multer.File): Promise<string>;
}
