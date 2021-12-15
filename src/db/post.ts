import { PaginationParams, Post, PostStorage, SearchIndex, SortIndex } from "../types";
import { SearchUtils } from "../utils";

const NAME_FIELD = "name";
const DATE_LAST_EDITED_NAME = "dateLastEdited";

export class PostDB {
  entries: PostStorage;
  count: number;
  nameSortIndex: SortIndex[];
  dateModifiedSortIndex: SortIndex[];
  nameSearchIndex: SearchIndex;
  descriptionSearchIndex: SearchIndex;
  searchUtils: SearchUtils;

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
    sortyBy: string = DATE_LAST_EDITED_NAME,
    asc: boolean = true,
    pagination: PaginationParams
  ) {
    let index: SortIndex[] = this.dateModifiedSortIndex;
    if (sortyBy === NAME_FIELD) {
      index = this.nameSortIndex;
    }

    const ids: number[] = [];
    if (asc) {
      const start = pagination.page * pagination.limit;
      const end = start + pagination.limit;
      if (end > index.length) {
        return [];
      }
      for (let i = start; i < end; i++) {
        ids.push(index[i].id);
      }
    } else {
      const start = index.length - pagination.page * pagination.limit - 1;
      const end = start - pagination.limit + 1;
      if (end < 0) {
        return [];
      }
      for (let i = start; i >= end; i--) {
        ids.push(index[i].id);
      }
    }

    return this.returnPostsByID(ids);
  }

  search(query: string) {
    const parsedSearchQuery = this.searchUtils.analyze(query);

    let nameHits: number[] = [];
    parsedSearchQuery.forEach((token) => {
      if (token in this.nameSearchIndex) {
        if (nameHits.length === 0) {
          nameHits = this.nameSearchIndex[token];
        } else {
          nameHits = this.intersection(nameHits, this.nameSearchIndex[token]);
        }
      }
    });

    let descriptionHits: number[] = [];
    parsedSearchQuery.forEach((token) => {
      if (token in this.descriptionSearchIndex) {
        if (descriptionHits.length === 0) {
          descriptionHits = this.descriptionSearchIndex[token];
        } else {
          descriptionHits = this.intersection(
            descriptionHits,
            this.descriptionSearchIndex[token]
          );
        }
      }
    });

    // const posts = {
    //   nameHits: this.returnPostsByID(nameHits),
    //   descriptionHits: this.returnPostsByID(descriptionHits)
    // };

    const posts: Post[] = [];

    for (const key in Object.keys(this.entries)) {
      const post = this.entries[key];
      if (post.description.toLowerCase().includes(query)) {
        posts.push(post);
      }
    }

    return posts;
  }
}
