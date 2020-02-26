import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import MessageControllerKnex from "../controllers_knex/message";

const router = Router();

router.post("/me", [checkJwt], MessageControllerKnex.sendMessage);

router.delete("/me/:id([0-9]+)", [checkJwt], MessageControllerKnex.deleteMessage);

router.get("/me", [checkJwt], MessageControllerKnex.listAll);

router.get("/me/:id([0-9]+)", [checkJwt], MessageControllerKnex.getOneMessages);

export default router;