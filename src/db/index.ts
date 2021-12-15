import { PostDB } from "./post";

export let PostDBInstance: PostDB;

export const createNewPostDB = () => {
  PostDBInstance = new PostDB();
};
