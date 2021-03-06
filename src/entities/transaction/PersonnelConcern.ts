import { Concern } from './Concern';
import { Personnel } from './Personnel';

export interface PersonnelConcern {
  classificationId: number;
  id: number;
  concern: Concern;
  personnelId: number | undefined;
  personnel: Personnel | undefined;
  action: string | undefined;
  prevPersonnelConcernId: number | undefined;
  prevPersonnelConcern: PersonnelConcern | undefined;
  receivedDate: Date | undefined;
  closedDate?: Date | undefined;
  statusId?: number | undefined;
  status?: string | undefined;
  creator?: string | undefined;
}

export interface TicketSummary {
  date: Date;
  noOfResolved: number;
  noOfForwarded: number;
}
