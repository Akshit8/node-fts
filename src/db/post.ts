import { Post, PostStorage, SearchIndex, SortIndex } from "../types";
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
    this.count = 0;
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

  add(post: Post) {
    post.id = this.getAutoIncrementID();
    this.entries[post.id] = post;

    // create name search index
    const nameTokens = this.searchUtils.analyze(post.name);
    nameTokens.forEach((token) => {
      const ids = this.nameSearchIndex[token];

      if (ids[ids.length - 1] === post.id) {
        return;
      }

      this.nameSearchIndex[token].push(post.id);
    });

    // create description search index
    const descriptionTokens = this.searchUtils.analyze(post.description);
    descriptionTokens.forEach((token) => {
      const ids = this.descriptionSearchIndex[token];

      if (ids[ids.length - 1] === post.id) {
        return;
      }

      this.descriptionSearchIndex[token].push(post.id);
    });

    // create name sort index
    let i = 0;
    for (; i < this.nameSortIndex.length; i++) {
      if (post.name < this.nameSortIndex[i].field) {
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
  }

  get(sortyBy: string = DATE_LAST_EDITED_NAME) {
    let index: SortIndex[] = this.dateModifiedSortIndex;
    if (sortyBy === NAME_FIELD) {
      index = this.nameSortIndex;
    }

    const ids: number[] = [];
    index.forEach((element) => {
      ids.push(element.id);
    });

    return this.returnPostsByID(ids);
  }
}
