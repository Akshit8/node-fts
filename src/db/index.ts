import { DB } from "../types";
import { PostDB } from "./post";

// interface DB seperated implmentation and usage
// DB provides 3 methods add, get, search
// the implmentation can be done using in-memory or any specialized db for the same
export let PostDBInstance: DB;

export const createNewPostDB = () => {
  PostDBInstance = new PostDB();
};
