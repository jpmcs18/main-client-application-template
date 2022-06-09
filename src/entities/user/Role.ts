import { Access } from './Access';

export interface Role {
  id: number | undefined;
  description: string | undefined;
  acccesses: Access[];
}
