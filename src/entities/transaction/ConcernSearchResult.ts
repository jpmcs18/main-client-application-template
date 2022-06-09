import { Concern } from './Concern';

export interface ConcernSearchResult {
  pageCount: number;
  results: Concern[];
}

export interface SearchResult<T> {
  pageCount: number;
  results: T[];
}
