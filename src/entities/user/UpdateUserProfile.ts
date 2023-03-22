import { Personnel } from '../transaction/Personnel';

export interface UpdateUserProfile {
  username?: string | undefined;
  personnel?: Personnel | undefined;
  isAvailable?: boolean | undefined;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
