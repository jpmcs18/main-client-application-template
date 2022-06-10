import { Personnel } from '../transaction/Personnel';
import { Role } from './Role';

export interface User {
  id: number;
  username: string;
  name: string;
  active: boolean;
  admin: boolean;
  personnel?: Personnel | undefined;
  personnelId?: number | undefined;
}
