import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { PaginationMetadata } from './api-client';

/** Shape shared by every generated `PaginatedXResponse`. */
interface PaginatedResponse<T> {
  data?: Array<T>;
  pagination?: PaginationMetadata;
}

/** Matches the backend's max page size, to minimize the number of requests. */
const DEFAULT_PAGE_SIZE = 100;

/**
 * Walks every page of a paginated endpoint and emits one combined array.
 * Pages are fetched sequentially until `pagination.has_next` is false.
 */
export function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Observable<PaginatedResponse<T>>,
  limit: number = DEFAULT_PAGE_SIZE
): Observable<T[]> {
  return fetchPage(1, limit).pipe(
    expand((response) =>
      response.pagination?.has_next
        ? fetchPage((response.pagination.page ?? 1) + 1, limit)
        : EMPTY
    ),
    reduce((acc, response) => acc.concat(response.data ?? []), [] as T[])
  );
}
