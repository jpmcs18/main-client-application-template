import { Office } from './Office';
import { PersonnelClassification } from './PersonnelClassification';

export interface Personnel {
  id: number;
  name: string;
  number: string | undefined;
  officeId: number | undefined;
  office?: Office | undefined;
  personnelClassification?: PersonnelClassification[] | undefined;
}
