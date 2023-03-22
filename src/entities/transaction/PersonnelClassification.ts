import { Classification } from './Classification';
import { Personnel } from './Personnel';

export interface PersonnelClassification {
  id: number;
  personnelId: number | undefined;
  personnel?: Personnel | undefined;
  classificationId: number;
  classification?: Classification | undefined;
  classificationDesc?: string | undefined;
  deleted?: boolean | undefined;
}
