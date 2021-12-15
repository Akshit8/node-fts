import { NextFunction, Request, Response } from "express";
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
  // const sortBy = <string | undefined>req.query.sortBy;
  // const asc = req.query.asc || "true";
  // const page = req.query.page || 0;
  // const limit = req.query.limit || POSTS_PER_PAGE;
  // const posts = PostDBInstance.get(sortBy, asc === "true", {
  //   page: +page,
  //   limit: +limit
  // });
  const query = <string>req.query.query;
  const posts = PostDBInstance.search(query);
  renderAPIResponse({ status_code: 200, data: { posts } }, res);
};
