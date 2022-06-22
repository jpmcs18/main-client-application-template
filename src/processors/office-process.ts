import { OfficeEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import { Office } from '../entities/transaction/Office';
import { httpGet, httpPost, httpPut } from './base';

export async function getOffices(): Promise<Office[] | undefined> {
  return await httpGet<Office[]>(OfficeEnd.GetList);
}
export async function searchOffices(
  key: string | undefined,
  page: number
): Promise<SearchResult<Office> | undefined> {
  let parameters: string = '?page=' + page;
  if (key !== undefined) {
    parameters += '&key=' + encodeURI(key);
  }

  return await httpGet<SearchResult<Office>>(OfficeEnd.Search + parameters);
}
export async function createOffice(
  office: Office
): Promise<Office | undefined> {
  return httpPost(OfficeEnd.Add, office);
}
export async function updateOffice(office: Office): Promise<boolean> {
  return httpPut(`${OfficeEnd.Update}/${office.id}`, office);
}
