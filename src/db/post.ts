import {
  DB,
  PaginationParams,
  Post,
  PostPaginatedResponse,
  PostStorage,
  SearchIndex,
  SortIndex
} from "../types";
import { SearchUtils } from "../utils";

export class PostDB implements DB {
  private static fields: { [key: string]: string } = {
    name: "name",
    image: "image",
    description: "description",
    dateLastEdited: "dateLastEdited"
  };

  private entries: PostStorage;
  private count: number;
  private nameSortIndex: SortIndex[];
  private dateModifiedSortIndex: SortIndex[];
  private nameSearchIndex: SearchIndex;
  private descriptionSearchIndex: SearchIndex;
  private searchUtils: SearchUtils;

  constructor() {
    this.entries = {};
    this.count = 0;
    this.nameSortIndex = [];
    this.dateModifiedSortIndex = [];
    this.nameSearchIndex = {};
    this.descriptionSearchIndex = {};
    this.searchUtils = new SearchUtils();
  }

  private getAutoIncrementID(): number {
    if (this.count === 0) {
      return 0;
    }
    return 1 + this.entries[this.count - 1].id;
  }

  private returnPostsByID(ids: number[]): Post[] {
    const posts: Post[] = [];

    ids.forEach((id) => {
      posts.push(this.entries[id]);
    });

    return posts;
  }

  private intersection(l1: number[], l2: number[]): number[] {
    const r: number[] = [];

    let i = 0;
    let j = 0;

    for (; i < l1.length && j < l2.length; ) {
      if (l1[i] < l2[j]) {
        i++;
      } else if (l1[i] > l2[j]) {
        j++;
      } else {
        r.push(l1[i]);
        i++;
        j++;
      }
    }

    return r;
  }

  private paginateSearchResponse(
    posts: Post[],
    start: number,
    end: number
  ): PostPaginatedResponse {
    return {
      count: end > start ? end - start : 0,
      next: end !== posts.length,
      posts: end > start ? posts.slice(start, end) : []
    };
  }

  add(name: string, image: string, description: string, dateLastEdited?: Date): Post {
    const post: Post = {
      id: this.getAutoIncrementID(),
      name,
      image,
      description,
      dateLastEdited: dateLastEdited || new Date()
    };
    this.entries[post.id] = post;
    this.count++;

    // create name search index
    const nameTokens = this.searchUtils.analyze(post.name);
    nameTokens.forEach((token) => {
      let ids = this.nameSearchIndex[token];

      if (!ids) {
        this.nameSearchIndex[token] = [];
        ids = this.nameSearchIndex[token];
      }

      if (ids.length !== 0 && ids[ids.length - 1] === post.id) {
        return;
      }

      this.nameSearchIndex[token].push(post.id);
    });

    // create description search index
    const descriptionTokens = this.searchUtils.analyze(post.description);
    descriptionTokens.forEach((token) => {
      let ids = this.descriptionSearchIndex[token];

      if (!ids) {
        this.descriptionSearchIndex[token] = [];
        ids = this.descriptionSearchIndex[token];
      }

      if (ids[ids.length - 1] === post.id) {
        return;
      }

      this.descriptionSearchIndex[token].push(post.id);
    });

    // create name sort index
    let i = 0;
    for (; i < this.nameSortIndex.length; i++) {
      const field = <string>this.nameSortIndex[i].field;
      if (post.name.toLowerCase() < field.toLowerCase()) {
        break;
      }
    }
    this.nameSortIndex.splice(i, 0, { id: post.id, field: post.name });

    // create date modified sort index
    i = 0;
    for (; i < this.dateModifiedSortIndex.length; i++) {
      if (post.description < this.dateModifiedSortIndex[i].field) {
        break;
      }
    }
    this.dateModifiedSortIndex.splice(i, 0, {
      id: post.id,
      field: post.dateLastEdited
    });

    return post;
  }

  get(
    sortyBy: string = PostDB.fields.dateLastEdited,
    asc: boolean = true,
    pagination: PaginationParams
  ): PostPaginatedResponse {
    const index: SortIndex[] =
      PostDB.fields[sortyBy] === PostDB.fields.name
        ? this.nameSortIndex
        : this.dateModifiedSortIndex;

    const ids: number[] = [];
    let start: number;
    let end: number;
    let next: boolean;
    if (asc) {
      start = pagination.page * pagination.limit;
      end =
        start + pagination.limit >= index.length
          ? index.length
          : start + pagination.limit;
      next = end !== index.length;
      for (let i = start; i < end; i++) {
        ids.push(index[i].id);
      }
    } else {
      start = index.length - pagination.page * pagination.limit - 1;
      end = start - pagination.limit < -1 ? 0 : start - pagination.limit;
      next = end !== 0;
      for (let i = start; i > end; i--) {
        ids.push(index[i].id);
      }
    }

    return {
      count: ids.length,
      next,
      posts: this.returnPostsByID(ids)
    };
  }

  search(
    query: string,
    searchIn: string = PostDB.fields.name,
    pagination: PaginationParams
  ): PostPaginatedResponse {
    let posts: Post[] = [];
    const exact = query[0] === '"' && query[query.length - 1] === '"';
    if (exact) {
      query = query.split('"')[1];
    }

    const parsedSearchQuery = this.searchUtils.analyze(query);
    const index: SearchIndex =
      PostDB.fields[searchIn] === PostDB.fields.name
        ? this.nameSearchIndex
        : this.descriptionSearchIndex;

    let hits: number[] = [];
    parsedSearchQuery.forEach((token) => {
      if (token in index) {
        if (hits.length === 0) {
          hits = index[token];
        } else {
          hits = this.intersection(hits, index[token]);
        }
      }
    });

    const injectedPosts = this.returnPostsByID(hits);

    if (exact) {
      injectedPosts.forEach((post) => {
        const field =
          PostDB.fields[searchIn] === PostDB.fields.name ? post.name : post.description;
        if (field.toLowerCase().includes(query.toLowerCase())) {
          posts.push(post);
        }
      });
    } else {
      posts = posts.concat(injectedPosts);
    }

    const start = pagination.page * pagination.limit;
    const end =
      start + pagination.limit >= posts.length
        ? posts.length
        : start + pagination.limit;
    return this.paginateSearchResponse(posts, start, end);
  }
}
