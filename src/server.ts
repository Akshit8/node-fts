import { createExpressApp } from "./app";
import { PORT } from "./config";
import { ServerUtils } from "./utils";
import { exit } from "process";

(async () => {
  try {
    const app = await createExpressApp();

    console.log(await ServerUtils.start(app, +PORT));
  } catch (e) {
    console.log(`Error: ${e}`);
    exit(1);
  }
})();
