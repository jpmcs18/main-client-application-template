import axios, { AxiosRequestConfig } from 'axios';
import { Authentication } from '../entities/Authentication';
import { SecurityEnd } from '../endpoints';
import { API } from '../constant';
import { clearToken, getToken, saveToken } from './session-manager';

export async function httpGet<Return>(
  url: string
): Promise<Return | undefined> {
  const token = getToken();
  if (token?.token === null) {
    throw new Error('Unauthorized');
  }
  return await axios
    .get(url, {
      headers: {
        Authorization: 'Bearer ' + token?.token,
        'content-type': 'application/json',
      },
      baseURL: API,
    } as AxiosRequestConfig)
    .then(async (res) => {
      switch (res.status) {
        case 200:
          return res.data;
      }
    })
    .catch(async (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            throw new Error(err.response.data);
          case 403:
            throw new Error('Access denied');
          case 401:
            if (await refreshTokenAuthentication()) {
              return await httpGet<Return>(url);
            }
            throw new Error('Unauthorized');
          case 404:
            throw new Error('Not Data Found');
          default:
            throw new Error(err.response.data);
        }
      }
      throw new Error(err);
    });
}

export async function httpPost<Return>(
  url: string,
  param: any
): Promise<Return | undefined> {
  const token = getToken();
  if (token?.token === undefined) {
    throw new Error('Unauthorized');
  }
  return await axios
    .post(url, param, {
      headers: {
        Authorization: 'Bearer ' + token?.token,
        'content-type': 'application/json',
      },
      baseURL: API,
    } as AxiosRequestConfig)
    .then(async (res) => {
      switch (res.status) {
        case 200:
          return res.data;
        case 201:
          return res.data;
        case 204:
          return true;
        default:
          throw new Error('Unknown Error');
      }
    })
    .catch(async (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            throw new Error(err.response.data);
          case 403:
            throw new Error('Access denied');
          case 401:
            if (await refreshTokenAuthentication()) {
              return await httpPost<Return>(url, param);
            }
            throw new Error('Unauthorized');
          case 404:
            throw new Error('No Data Found');
          default:
            throw new Error(err.response.data);
        }
      }
      throw new Error(err);
    });
}

export async function httpPut(url: string, param: any): Promise<boolean> {
  const token = getToken();
  if (token?.token === undefined) {
    throw new Error('Unauthorized');
  }
  return await axios
    .put(url, param, {
      headers: {
        Authorization: 'Bearer ' + token?.token,
        'content-type': 'application/json',
      },
      baseURL: API,
    } as AxiosRequestConfig)
    .then(async (res) => {
      switch (res.status) {
        case 204:
          return true;
        default:
          throw new Error('Unknown Error');
      }
    })
    .catch(async (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            throw new Error(err.response.data);
          case 403:
            throw new Error('Access denied');
          case 401:
            if (await refreshTokenAuthentication()) {
              return await httpPut(url, param);
            }
            throw new Error('Unauthorized');
          case 404:
            throw new Error('No Data Found');
          default:
            throw new Error(err.response.data);
        }
      }
      throw new Error(err);
    });
}

export async function httpDelete(url: string): Promise<boolean> {
  const token = getToken();
  if (token?.token === undefined) {
    throw new Error('Unauthorized');
  }
  return await axios
    .delete(url, {
      headers: {
        Authorization: 'Bearer ' + token?.token,
        'content-type': 'application/json',
      },
      baseURL: API,
    } as AxiosRequestConfig)
    .then(async (res) => {
      switch (res.status) {
        case 204:
          return true;
        default:
          throw new Error('Unknown Error');
      }
    })
    .catch(async (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            throw new Error(err.response.data);
          case 403:
            throw new Error('Access denied');
          case 401:
            if (await refreshTokenAuthentication()) {
              return await httpDelete(url);
            }
            throw new Error('Unauthorized');
          case 404:
            throw new Error('No Data Found');
          default:
            throw new Error(err.response.data);
        }
      }
      throw new Error(err);
    });
}

export async function httpAuthenticatingPost<Return>(
  url: string,
  param: any
): Promise<Return | undefined> {
  return await axios
    .post(url, JSON.stringify(param), {
      headers: {
        'content-type': 'application/json',
      },
      baseURL: API,
    } as AxiosRequestConfig)
    .then((res) => {
      switch (res.status) {
        case 200:
          return res.data;
        default:
          throw new Error('Unknown Error');
      }
    })
    .catch(async (err) => {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            throw new Error(err.response.data);
          case 404:
            throw new Error('No Data Found');
          default:
            throw new Error(err.response.data);
        }
      }
      throw new Error(err);
    });
}

export async function refreshTokenAuthentication(): Promise<
  boolean | undefined
> {
  const request = getToken();
  return await httpAuthenticatingPost<Authentication>(
    SecurityEnd.Refresh,
    request
  )
    .then((res) => {
      if (res !== undefined) {
        saveToken(res);
        return true;
      }
      throw new Error('Unauthorized');
    })
    .catch(() => {
      clearToken();
      throw new Error('Unauthorized');
    });
}
