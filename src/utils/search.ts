import { BasicMap, PunctuationsMap } from "../types";

export class SearchUtils {
  private static stopwords: BasicMap = {
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

  private static punctuations: PunctuationsMap = {
    // propert first denotes that is the punctuation can be found at first index of token
    ".": { first: false },
    "!": { first: false },
    ",": { first: false },
    "(": { first: true },
    ")": { first: false }
  };

  private sliceFirst(str: string): string {
    return str.slice(1);
  }

  private sliceLast(str: string): string {
    return str.slice(0, str.length - 1);
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
      if (element in SearchUtils.stopwords) {
        return;
      }
      r.push(element.toLowerCase());
    });

    return r;
  }

  private punctutaionFilter(tokens: string[]): string[] {
    const r: string[] = [];
    tokens.forEach((element) => {
      for (const key of Object.keys(SearchUtils.punctuations)) {
        if (element.includes(key)) {
          if (SearchUtils.punctuations[key].first) {
            element = this.sliceFirst(element);
          } else {
            element = this.sliceLast(element);
          }
        }

        if (element[0] === '"') {
          element = this.sliceFirst(element);
        }
        if (element[element.length - 1] === '"') {
          element = this.sliceLast(element);
        }
      }

      r.push(element);
    });

    return r;
  }

  analyze(text: string): string[] {
    let tokens = this.tokenize(text);
    tokens = this.lowercaseFilter(tokens);
    tokens = this.stopwordsFilter(tokens);
    tokens = this.punctutaionFilter(tokens);

    return tokens;
  }
}
