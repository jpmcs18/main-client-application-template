import { Personnel } from '../transaction/Personnel';
import { Module } from './Module';
import { UserRole } from './User';

export interface Profile {
  username?: string | undefined;
  admin?: boolean | undefined;
  name?: string | undefined;
  personnelId?: number | undefined;
  personnel?: Personnel | undefined;
  distinctModules?: Module[] | undefined;
}
