import { ConcernEnd } from '../endpoints';
import { Concern } from '../entities/transaction/Concern';
import { ConcernSearchResult } from '../entities/transaction/ConcernSearchResult';
import { httpGet, httpPost, httpPut } from './base';

export async function searchConcerns(
  name: string | undefined,
  page: number
): Promise<ConcernSearchResult | undefined> {
  let parameters: string = '?page=' + page;
  if (name !== undefined) {
    parameters += '&key=' + encodeURI(name);
  }
  return await httpGet<ConcernSearchResult>(ConcernEnd.Search + parameters);
}
export async function createConcern(
  concern: Concern
): Promise<Concern | undefined> {
  return await httpPost<Concern>(ConcernEnd.Create, concern);
}

export async function updateConcern(concern: Concern): Promise<boolean> {
  return await httpPut(`${ConcernEnd.Update}/${concern.id}`, concern);
}
