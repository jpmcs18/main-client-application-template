import { RoleEnd } from '../endpoints';
import { SearchResult } from '../entities/SearchResult';
import { Role } from '../entities/user/Role';
import { httpDelete, httpGet, httpPost, httpPut } from './base';
export async function getRoles(): Promise<Role[] | undefined> {
  return httpGet<Role[]>(RoleEnd.GetList);
}
export async function searchRoles(
  key: string | undefined,
  page: number
): Promise<SearchResult<Role> | undefined> {
  let parameters: string = '?page=' + page;
  if (key !== undefined) {
    parameters += '&key=' + encodeURI(key);
  }

  return await httpGet<SearchResult<Role>>(RoleEnd.Search + parameters);
}
export async function deleteRole(id: number): Promise<boolean> {
  return await httpDelete(RoleEnd.Delete + '/' + id);
}

export async function createRole(
  description: string,
  moduleIds: number[] | undefined
): Promise<Role | undefined> {
  return await httpPost<Role>(RoleEnd.Create, {
    description,
    moduleIds,
  });
}

export async function updateRole(
  id: number,
  description: string,
  newModuleIds: number[] | undefined,
  accessToDelete: number[] | undefined
): Promise<boolean> {
  return await httpPut(RoleEnd.Update + '/' + id, {
    description,
    newModuleIds,
    accessToDelete,
  });
}
