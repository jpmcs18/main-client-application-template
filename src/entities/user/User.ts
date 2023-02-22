import { Personnel } from '../transaction/Personnel';
import { Role } from './Role';

export interface User {
  id: number;
  username: string;
  name?: string;
  active: boolean;
  admin: boolean;
  isAvailable?: boolean | undefined;
  personnel?: Personnel | undefined;
  personnelId: number | undefined;
  userRoles?: UserRole[] | undefined;
}

export interface UserRole {
  id: number;
  userId: number | undefined;
  roleId: number;
  role?: Role | undefined;
  roleDesc?: string | undefined;
  deleted?: boolean | undefined;
}
