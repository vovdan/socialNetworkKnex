import { Response, Request, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config"

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    //console.log(token);

    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send(error);
        return;
    };

    //The token is valid for 1 hour
    //We want to send a  new token on every request 
    const { user_id, email } = jwtPayload;
    const newToken = jwt.sign({ user_id, email }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};