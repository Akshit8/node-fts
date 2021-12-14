import { exit } from "process";
import { createExpressApp } from "./app";
import { PORT } from "./config";
import { ServerUtils } from "./utils";

(async () => {
  try {
    // const PostDBInstance = new PostDB();
    const app = await createExpressApp();

    console.log(await ServerUtils.start(app, +PORT));
  } catch (e) {
    console.log(`Error: ${e}`);
    exit(1);
  }
})();
