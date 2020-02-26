import { Router } from "express";
import AuthControllerKnex from "../controllers_knex/auth";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/signin", AuthControllerKnex.signin);

router.post("/signup", AuthControllerKnex.signup);

router.post("/change-password", [checkJwt], AuthControllerKnex.changePassword);

export default router;