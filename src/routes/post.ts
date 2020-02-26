import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import PostControllerKnex from "../controllers_knex/post";

const router = Router();

router.get("/posts", [checkJwt], PostControllerKnex.getAllPost);

router.get("/post/:id([0-9]+)", [checkJwt], PostControllerKnex.getOnePost);

router.post("/post", [checkJwt], PostControllerKnex.createPost);

router.patch("/post/:id([0-9]+)", [checkJwt], PostControllerKnex.editPost);

router.post("/like/:id([0-9]+)", [checkJwt], PostControllerKnex.likePost);

router.get("/like/:id([0-9]+)", [checkJwt], PostControllerKnex.getAllLikePost);

router.post("/comment/:id([0-9]+)", [checkJwt], PostControllerKnex.createCommentPost);

router.get("/comment/:id([0-9]+)", [checkJwt], PostControllerKnex.getAllCommentPost);

router.delete("/post/:id([0-9]+)", [checkJwt], PostControllerKnex.deletePost);

export default router;