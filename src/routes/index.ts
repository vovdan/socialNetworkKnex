import { Router } from "express";
import auth from "./auth";
import user from "./user";
import message from "./message";
import post from "./post";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/messages", message);
routes.use("/posts", post);
export default routes;