import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { PaginationMetadata } from './api-client';

/**
 * Shape shared by every generated `PaginatedXResponse`: a page of `data`
 * plus the `pagination` metadata describing where we are in the result set.
 */
interface PaginatedResponse<T> {
  data?: Array<T>;
  pagination?: PaginationMetadata;
}

/**
 * Default page size. Matches the backend maximum (100 items per page), so we
 * make the fewest possible requests.
 */
const DEFAULT_PAGE_SIZE = 100;

/**
 * Walk every page of a paginated endpoint and emit a single combined array.
 *
 * `fetchPage` is a closure that requests one page, e.g.
 *   fetchAllPages((page, limit) => this.tagService.getAllTags(page, limit))
 *
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
