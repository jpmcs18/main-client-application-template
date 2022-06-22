import { ModuleEnd } from '../endpoints';
import { Module } from '../entities/user/Module';
import { httpGet } from './base';

export async function getModules(): Promise<Module[] | undefined> {
  return await httpGet<Module[]>(ModuleEnd.GetList);
}
