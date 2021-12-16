import { PaginationParams } from "./db";
import { Post, PostPaginatedResponse } from "./post";

export interface APIResponse {
  status_code?: number;
  data?: any;
}

export interface BasicMap {
  [key: string]: object;
}

export interface PunctuationsMap {
  [key: string]: { [key: string]: boolean };
}

export interface DB {
  add(name: string, image: string, description: string, dateLastEdited?: Date): Post;
  get(
    sortyBy: string | undefined,
    asc: boolean,
    pagination: PaginationParams
  ): PostPaginatedResponse;
  search(
    query: string,
    searchIn: string | undefined,
    pagination: PaginationParams
  ): PostPaginatedResponse;
}
