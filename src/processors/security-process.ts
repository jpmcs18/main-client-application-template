import { SecurityEnd } from '../endpoints';
import { Authentication } from '../entities/Authentication';
import { httpAuthenticatingPost } from './base';
import { LoginUser } from '../entities/user/LoginUser';
import { saveToken } from './session-manager';

export async function authenticate(params: LoginUser): Promise<boolean> {
  return await httpAuthenticatingPost(SecurityEnd.Login, params).then((res) => {
    saveToken(res as Authentication);
    return true;
  });
}
