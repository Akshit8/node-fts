import { PaginatedResponseMetadata } from "./db";

export interface BasePost {
  name: string;
  image: string;
  description: string;
}

export interface Post extends BasePost {
  id: number;
  dateLastEdited: Date;
}

export interface MockPost extends BasePost {
  dateLastEdited: string;
}

export interface PostStorage {
  [key: number]: Post;
}

export interface PostPaginatedResponse extends PaginatedResponseMetadata {
  posts: Post[];
}
