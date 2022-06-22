import { PersonnelConcernEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import { PersonnelConcern } from '../entities/transaction/PersonnelConcern';
import { httpGet, httpPost } from './base';

export async function getDirectConcerns(
  isResolve: boolean,
  isForwarded: boolean,
  page: number
): Promise<SearchResult<PersonnelConcern> | undefined> {
  let params = `?isResolved=${isResolve}&isForwarded=${isForwarded}&page=${page}`;
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
