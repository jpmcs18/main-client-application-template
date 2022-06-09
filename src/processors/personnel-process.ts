import { PersonnelEnd } from '../endpoints';
import { Personnel } from '../entities/transaction/Personnel';
import { httpGet } from './base';

export async function getPersonnels(): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(PersonnelEnd.GetList);
}
