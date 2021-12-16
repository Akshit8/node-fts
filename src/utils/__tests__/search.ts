import { SearchUtils } from "../search";

let searchUtil: SearchUtils;

beforeAll(() => {
  searchUtil = new SearchUtils();
});

describe("TEST SEARCH UTILS", () => {
  it("Test analyze", (done) => {
    const query = "Customer is king! (success) quotes, By.";
    const expected = ["customer", "is", "king", "success", "quotes", "by"];
    const parsedQuery = searchUtil.analyze(query);
    expect(parsedQuery).toEqual(expected);
    done();
  });
});
