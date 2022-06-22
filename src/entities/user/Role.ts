import { Access } from './Access';

export interface Role {
  id: number;
  description: string;
  accesses: Access[];
}
