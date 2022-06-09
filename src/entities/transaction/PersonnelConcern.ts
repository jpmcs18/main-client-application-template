import { Concern } from './Concern';
import { Personnel } from './Personnel';

export interface PersonnelConcern {
  id: number;
  concern: Concern;
  personnelId: number | undefined;
  personnel: Personnel | undefined;
  action: string | undefined;
  forwardPersonnelConcernId: number | undefined;
  forwardPersonnelConcern: PersonnelConcern | undefined;
  receivedDate: Date | undefined;
  closedDate: Date | undefined;
  forwardDate: Date | undefined;
  isForwarded: boolean | undefined;
  isDone: boolean | undefined;
}
