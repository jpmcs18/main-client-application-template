import { PersonnelConcernEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import { PersonnelConcern } from '../entities/transaction/PersonnelConcern';
import { httpGet } from './base';

export async function getDirectConcerns(
  isResolve: boolean,
  isForwarded: boolean,
  page: number
): Promise<SearchResult<PersonnelConcern> | undefined> {
  let params = `?isResolve=${isResolve}&isForwarded=${isForwarded}&page=${page}`;
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
