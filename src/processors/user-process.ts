import { UserEnd } from '../endpoints';
import { httpDelete, httpGet, httpPost, httpPut } from './base';
import { Profile } from '../entities/user/Profile';
import { UpdateUserProfile } from '../entities/user/UpdateUserProfile';
import { User } from '../entities/user/User';
import { SearchResult } from '../entities/SearchResult';

export async function getUserData(): Promise<Profile | undefined> {
  return await httpGet<Profile>(UserEnd.GetData);
}

export async function searchUsers(
  name: string | undefined,
  page: number
): Promise<SearchResult<User> | undefined> {
  let parameters: string = '?page=' + page;
  if (name !== undefined) {
    parameters += '&key=' + encodeURI(name);
  }

  return await httpGet<SearchResult<User>>(UserEnd.Search + parameters);
}

export async function activateUsers(id: number): Promise<boolean | undefined> {
  return await httpPost(UserEnd.Activate + '/' + id, null);
}

export async function resetUserPassword(
  id: number
): Promise<boolean | undefined> {
  return await httpPost(UserEnd.ResetPassword + '/' + id, null);
}

export async function deleteUser(id: number): Promise<boolean> {
  return await httpDelete(UserEnd.Delete + '/' + id);
}

export async function createUser(
  user: User,
  roleIds: number[] | undefined
): Promise<User | undefined> {
  return await httpPost<User>(UserEnd.Create, { ...user, roleIds });
}

export async function updateUser(
  user: User,
  newRoleIds: number[] | undefined,
  accessToDelete: number[] | undefined
): Promise<boolean> {
  return await httpPut(UserEnd.Update + '/' + user.id, {
    ...user,
    newRoleIds,
    accessToDelete,
  });
}

export async function updateProfile(
  user: UpdateUserProfile
): Promise<boolean | undefined> {
  return await httpPost<boolean>(UserEnd.UpdateProfile, user);
}
