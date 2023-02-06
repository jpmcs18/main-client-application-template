import { Classification } from './Classification';
import { Office } from './Office';

export interface Personnel {
  id: number;
  name: string;
  classificationId: number | undefined;
  classification?: Classification | undefined;
  officeId: number | undefined;
  office?: Office | undefined;
}
