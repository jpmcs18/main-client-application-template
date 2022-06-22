import { ConcernEnd } from '../endpoints';
import { Concern } from '../entities/transaction/Concern';
import { SearchResult } from '../entities/SearchResult';
import { httpDelete, httpGet, httpPost, httpPut } from './base';

export async function searchConcerns(
  name: string | undefined,
  page: number
): Promise<SearchResult<Concern> | undefined> {
  let parameters: string = '?page=' + page;
  if (name !== undefined) {
    parameters += '&key=' + encodeURI(name);
  }
  return await httpGet<SearchResult<Concern>>(ConcernEnd.Search + parameters);
}
export async function createConcern(
  concern: Concern,
  personnelId: number | undefined
): Promise<Concern | undefined> {
  return await httpPost<Concern>(ConcernEnd.Create, {
    ...concern,
    personnelId,
  });
}

export async function updateConcern(concern: Concern): Promise<boolean> {
  return await httpPut(`${ConcernEnd.Update}/${concern.id}`, concern);
}

export async function deleteConcern(id: number): Promise<boolean> {
  return await httpDelete(`${ConcernEnd.Delete}/${id}`);
}

export async function assignConcern(
  id: number,
  personnelId: number
): Promise<boolean | undefined> {
  return await httpPost<boolean>(ConcernEnd.Assign, { id, personnelId });
}
