import { ModuleRight } from './ModuleRight';

export interface Access {
  roleId: number;
  moduleRightId: number;
  granted: boolean;

  moduleRight: ModuleRight;
}
