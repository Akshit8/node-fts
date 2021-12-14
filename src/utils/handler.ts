import { NextFunction, Request, Response } from "express";
import { APIError, InternalError, NotFoundError } from "../errors";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
};

export const serverErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let e: APIError = <APIError>err;
  if (!(err instanceof APIError)) {
    // log error
    if (err instanceof InternalError) {
      console.log(
        `Error:\ncode: ${err.code}\nmessage: ${err.message}\nerror:${err.error}`
      );
    } else {
      console.log(`Error:\n${err}`);
    }
    e = new APIError();
  }

  res.status(e.status_code).send(e);
};
