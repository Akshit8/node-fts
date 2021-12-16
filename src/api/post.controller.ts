import { NextFunction, Request, Response } from "express";
import { PostPaginatedResponse } from "../types";
import { POSTS_PER_PAGE } from "../config";
import { PostDBInstance } from "../db";
import { renderAPIResponse } from "../utils";

export const addPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, image, description } = req.body;
  const post = PostDBInstance.add(name, image, description);
  renderAPIResponse({ status_code: 201, data: { post } }, res);
};

export const getPostsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sortBy = <string | undefined>req.query.sortBy;
  const asc = Boolean(req.query.asc) || true;
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || POSTS_PER_PAGE;
  const query = <string | undefined>req.query.query;
  const searchIn = <string | undefined>req.query.searchIn;
  let posts: PostPaginatedResponse;
  if (query) {
    posts = PostDBInstance.search(query, searchIn, { page, limit });
  } else {
    posts = PostDBInstance.get(sortBy, asc, { page, limit });
  }
  renderAPIResponse({ status_code: 200, data: { posts } }, res);
};
