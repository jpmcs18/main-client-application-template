import { Personnel } from '../transaction/Personnel';

export interface UpdateUserProfile {
  username: string;
  personnel?: Personnel | undefined;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
