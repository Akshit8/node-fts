import { Express } from "express";

export class ServerUtils {
  static start(app: Express, port: number): Promise<string> {
    return new Promise((resolve, reject) => {
      app
        .listen(port, () => {
          resolve(`started server at :${port}`);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}
