import { Router } from "express";
import { addPostController, getPostsController } from "./post.controller";

const router: Router = Router();

router.post("/", addPostController);
router.get("/", getPostsController);

export default router;
