import { ClassificationEnd } from '../endpoints';
import { Classification } from '../entities/transaction/Classification';
import { httpGet } from './base';

export async function getClassifications(): Promise<
  Classification[] | undefined
> {
  return await httpGet<Classification[]>(ClassificationEnd.GetList);
}
