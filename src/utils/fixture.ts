import { readFile } from "fs";
import { promisify } from "util";
import { PostDBInstance } from "../db";
import { MockPost } from "../types";

const readFileAsync = promisify(readFile);

export const addFixtures = async (path: string) => {
  const data = await readFileAsync(path);
  const parsedData: MockPost[] = JSON.parse(data.toString());

  for (let i = 0; i < parsedData.length; i++) {
    PostDBInstance.add(
      parsedData[i].name,
      parsedData[i].image,
      parsedData[i].description,
      new Date(parsedData[i].dateLastEdited)
    );
  }
};
