import { Personnel } from '../transaction/Personnel';
import { Role } from './Role';

export interface Profile {
  username?: string | undefined;
  admin?: boolean | undefined;
  role?: Role | undefined;
  name?: string | undefined;
  personnelId?: number | undefined;
  personnel?: Personnel | undefined;
}

export interface UpdateUserProfile {
  username: string;
  personnel?: Personnel | undefined;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
