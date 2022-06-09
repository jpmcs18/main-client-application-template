import { User } from './User';

export interface UserSearchResult {
  pageCount: number;
  results: User[];
}
