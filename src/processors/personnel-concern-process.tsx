import { PersonnelConcernEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import {
  PersonnelConcern,
  TicketSummary,
} from '../entities/transaction/PersonnelConcern';
import { httpGet, httpPost } from './base';

export async function getDirectConcerns(
  isResolve: boolean,
  isForwarded: boolean,
  isPending: boolean,
  page: number
): Promise<SearchResult<PersonnelConcern> | undefined> {
  let params = `?isResolved=${isResolve}&isForwarded=${isForwarded}&isPending=${isPending}&page=${page}`;
  return httpGet<SearchResult<PersonnelConcern>>(
    `${PersonnelConcernEnd.GetList}${params}`
  );
}
export async function getActions(
  concernId: number
): Promise<PersonnelConcern[] | undefined> {
  return httpGet<PersonnelConcern[]>(
    `${PersonnelConcernEnd.GetActions}?concernId=${concernId}`
  );
}
export async function resolvePersonnelConcern(
  id: number,
  actionTaken: string
): Promise<boolean | undefined> {
  return httpPost<boolean>(PersonnelConcernEnd.Resolve, { id, actionTaken });
}
export async function forwardPersonnelConcern(
  id: number,
  personnelId: number,
  reason: string
): Promise<boolean | undefined> {
  return httpPost<boolean>(PersonnelConcernEnd.Forward, {
    id,
    personnelId,
    reason,
  });
}

export async function getTicketSummary(
  month: number,
  year: number
): Promise<TicketSummary[] | undefined> {
  return httpGet<TicketSummary[]>(
    `${PersonnelConcernEnd.Summary}?month=${month}&year=${year}`
  );
}

export async function getDetailedSummary(
  year: number,
  month: number,
  day: number
): Promise<PersonnelConcern[] | undefined> {
  return httpGet<PersonnelConcern[]>(
    `${PersonnelConcernEnd.DetailedSummary}?year=${year}&month=${month}&day=${day}`
  );
}
