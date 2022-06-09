import { Role } from './Role';

export interface Profile {
  username?: string | undefined;
  admin?: boolean | undefined;
  role?: Role | undefined;
  name?: string | undefined;
}

export interface UpdateUserProfile {
  username: string;
  name: string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
