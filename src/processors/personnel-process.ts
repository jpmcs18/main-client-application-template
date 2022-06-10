import { PersonnelEnd } from '../endpoints';
import { Personnel } from '../entities/transaction/Personnel';
import { httpGet } from './base';

export async function getPersonnels(): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(PersonnelEnd.GetList);
}

export async function getPersonnelsByClassification(
  classificationId: number
): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(
    `${PersonnelEnd.GetListByClassification}?classificationId=${classificationId}`
  );
}

export async function getAvailablePersonnelsByClassification(
  classificationId: number
): Promise<Personnel[] | undefined> {
  return httpGet<Personnel[]>(
    `${PersonnelEnd.GetAvailableListByClassification}?classificationId=${classificationId}`
  );
}
