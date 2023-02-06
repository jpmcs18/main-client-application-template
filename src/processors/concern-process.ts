import { ConcernEnd } from '../endpoints';
import { Concern } from '../entities/transaction/Concern';
import { SearchResult } from '../entities/SearchResult';
import { httpDelete, httpGet, httpPost, httpPut } from './base';
import { dateToString } from '../helpers';

export async function searchConcerns(
  name: string | undefined,
  page: number,
  assigned: boolean,
  closed: boolean,
  start: Date | undefined,
  end: Date | undefined,
  officeId: number | undefined,
  classificationId: number | undefined
): Promise<SearchResult<Concern> | undefined> {
  let parameters: string = `?page=${page}&isAssigned=${assigned}&isClosed=${closed}`;
  if (name !== undefined) {
    parameters += '&key=' + encodeURI(name);
  }
  if (start !== undefined) {
    parameters += '&start=' + encodeURI(dateToString(start) ?? '');
  }
  if (end !== undefined) {
    parameters += '&end=' + encodeURI(dateToString(end) ?? '');
  }
  if (officeId !== undefined) {
    parameters += '&officeId=' + officeId;
  }
  if (classificationId !== undefined) {
    parameters += '&classificationId=' + classificationId;
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
