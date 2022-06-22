import { ClassificationEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import { Classification } from '../entities/transaction/Classification';
import { httpGet, httpPost, httpPut } from './base';

export async function getClassifications(): Promise<
  Classification[] | undefined
> {
  return await httpGet<Classification[]>(ClassificationEnd.GetList);
}
export async function searchClassifications(
  key: string | undefined,
  page: number
): Promise<SearchResult<Classification> | undefined> {
  let parameters: string = '?page=' + page;
  if (key !== undefined) {
    parameters += '&key=' + encodeURI(key);
  }

  return await httpGet<SearchResult<Classification>>(
    ClassificationEnd.Search + parameters
  );
}
export async function createClassification(
  classification: Classification
): Promise<Classification | undefined> {
  return httpPost(ClassificationEnd.Add, classification);
}
export async function updateClassification(
  classification: Classification
): Promise<boolean> {
  return httpPut(
    `${ClassificationEnd.Update}/${classification.id}`,
    classification
  );
}
