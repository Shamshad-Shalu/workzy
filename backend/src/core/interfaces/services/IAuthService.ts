export interface IAuthService {
  findUserByEmail(email: string): Promise<boolean>;
}
