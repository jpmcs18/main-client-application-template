import { OfficeEnd } from '../endpoints';
import { Office } from '../entities/transaction/Office';
import { httpGet } from './base';

export async function getOffices(): Promise<Office[] | undefined> {
  return await httpGet<Office[]>(OfficeEnd.GetList);
}
