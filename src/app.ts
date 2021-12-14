import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

export const createExpressApp = async (): Promise<Express> => {
  const app = express();

  app.use(helmet({ dnsPrefetchControl: { allow: true } }));
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
