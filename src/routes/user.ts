import { Router } from "express";
import UserControllerKnex from "../controllers_knex/user";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/me", [checkJwt], UserControllerKnex.getCurrent);

router.patch("/me", [checkJwt], UserControllerKnex.editUser);

router.get("/me/followings", [checkJwt], UserControllerKnex.getAllFollowing);

router.post("/me/follow", [checkJwt], UserControllerKnex.followUser);

router.delete("/me/follow/:id([0-9]+)", [checkJwt], UserControllerKnex.unFollowUser);

export default router;