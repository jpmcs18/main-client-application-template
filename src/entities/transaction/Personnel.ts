import { Classification } from './Classification';

export interface Personnel {
  id: number;
  name: string;
  classificationId: number | undefined;
  classification: Classification | undefined;
}
