import path from "path";
import { exit } from "process";
import { createExpressApp } from "./app";
import { PORT } from "./config";
import { createNewPostDB } from "./db";
import { addFixtures, ServerUtils } from "./utils";

(async () => {
  try {
    // create post db instance
    createNewPostDB();

    // install mock fixture data in-memory
    await addFixtures(path.join(__dirname, "../fixtures/mock_data.json"));

    const app = await createExpressApp();
    console.log(await ServerUtils.start(app, +PORT));
  } catch (e) {
    console.log(`Error: ${e}`);
    exit(1);
  }
})();
