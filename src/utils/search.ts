import { BasicMap } from "../types";

export class SearchUtils {
  private stopwords: BasicMap;

  constructor() {
    this.stopwords = {
      a: {},
      and: {},
      be: {},
      have: {},
      i: {},
      in: {},
      of: {},
      that: {},
      the: {},
      to: {}
    };
  }

  private tokenize(text: string): string[] {
    return text.split(" ");
  }

  private lowercaseFilter(tokens: string[]): string[] {
    const r: string[] = [];

    tokens.forEach((element) => {
      r.push(element.toLowerCase());
    });

    return r;
  }

  private stopwordsFilter(tokens: string[]): string[] {
    const r: string[] = [];

    tokens.forEach((element) => {
      if (element in this.stopwords) {
        r.push(element.toLowerCase());
      }
    });

    return r;
  }

  analyze(text: string): string[] {
    let tokens = this.tokenize(text);
    tokens = this.lowercaseFilter(tokens);
    tokens = this.stopwordsFilter(tokens);

    return tokens;
  }
}
