import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import router from "./api";
import { notFoundHandler, serverErrorHandler } from "./utils";

export const createExpressApp = async (): Promise<Express> => {
  const app = express();

  app.use(helmet({ dnsPrefetchControl: { allow: true } }));
  app.use(cors());

  app.use("/api", router);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(notFoundHandler);
  app.use(serverErrorHandler);

  return app;
};
