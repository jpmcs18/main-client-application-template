import { Classification } from './Classification';
import { Office } from './Office';
import { Personnel } from './Personnel';

export interface Concern {
  id: number;
  description: string | undefined;
  entryDate: Date | undefined;
  closedDate: Date | undefined;
  classificationId: number | undefined;
  classification: Classification | undefined;
  officeId: number | undefined;
  office: Office | undefined;
  caller: string | undefined;
  personnelId: number | undefined;
  personnel: Personnel | undefined;
}
