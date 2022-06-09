import { Role } from './Role';

export interface User {
  id: number;
  username: string;
  name: string;
  active: boolean;
  admin: boolean;
}
