import { Router } from "express";
import postRouter from "./post.router";

const router: Router = Router();

router.use("/post", postRouter);

export default router;
