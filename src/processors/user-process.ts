import { UserEnd } from '../endpoints';
import { httpDelete, httpGet, httpPost, httpPut } from './base';
import { Profile, UpdateUserProfile } from '../entities/user/Profile';
import { UserSearchResult } from '../entities/user/UserSearchResult';
import { User } from '../entities/user/User';

export async function getUserData(): Promise<Profile | undefined> {
  return await httpGet<Profile>(UserEnd.GetData);
}

export async function searchUsers(
  name: string | undefined,
  page: number
): Promise<UserSearchResult | undefined> {
  let parameters: string = '?page=' + page;
  if (name !== undefined) {
    parameters += '&key=' + encodeURI(name);
  }

  return await httpGet<UserSearchResult>(UserEnd.Search + parameters);
}

export async function activateUsers(id: number): Promise<boolean> {
  return await httpPut(UserEnd.Activate + '/' + id, null);
}

export async function resetUserPassword(id: number): Promise<boolean> {
  return await httpPut(UserEnd.ResetPassword + '/' + id, null);
}

export async function deleteUser(id: number): Promise<boolean> {
  return await httpDelete(UserEnd.Delete + '/' + id);
}

export async function createUser(user: User): Promise<User | undefined> {
  return await httpPost<User>(UserEnd.Create, user);
}

export async function updateUser(user: User): Promise<boolean> {
  return await httpPut(UserEnd.Update, user);
}

export async function updateProfile(user: UpdateUserProfile): Promise<boolean> {
  return await httpPut(UserEnd.UpdateProfile, user);
}
