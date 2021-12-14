export interface Post {
  id: number;
  name: string;
  image: string;
  description: string;
  dateLastEdited: Date;
}

export interface PostStorage {
  [key: number]: Post;
}

export interface SortIndex {
  id: number;
  field: string | Date;
}

export interface SearchIndex {
  [key: string]: number[];
}

export interface BasicMap {
  [key: string]: object;
}
