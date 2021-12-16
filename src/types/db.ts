export interface SortIndex {
  id: number;
  field: string | Date;
}

export interface SearchIndex {
  [key: string]: number[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponseMetadata {
  count: number;
  next: boolean;
}
