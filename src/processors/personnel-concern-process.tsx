import { PersonnelConcernEnd } from '../endpoints';
import { SearchResult } from '../entities/transaction/ConcernSearchResult';
import { PersonnelConcern } from '../entities/transaction/PersonnelConcern';
import { httpGet } from './base';

export async function getDirectConcerns(
  personnelId: number,
  isResolve: boolean,
  isForwarded: boolean,
  page: number
): Promise<SearchResult<PersonnelConcern> | undefined> {
  return httpGet<SearchResult<PersonnelConcern>>(PersonnelConcernEnd.GetList);
}
