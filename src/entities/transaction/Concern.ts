import { Classification } from './Classification';
import { Office } from './Office';

export interface Concern {
  id: number | undefined;
  description: string | undefined;
  entryDate: Date | undefined;
  closedDate: Date | undefined;
  classificationId: number | undefined;
  classification: Classification | undefined;
  officeId: number | undefined;
  office: Office | undefined;
  caller: string | undefined;
}
