import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User, checkIfUnencryptedPasswordIsValid, hashPassword } from "../models/UserModel";
import config from "../config/config";
import { validate } from "class-validator";
import { knex } from "../../knex";

class AuthControllerKnex {
    static signin = async (req: Request, res: Response) => {
        //Check if username and password are set 
        let { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send();
            return;
        }

        //Get user from database
        let user: User;
        try {
            user = await knex('users')
                .where('users.email', email)
                .first();
        } catch (error) {
            res.status(401).send(error);
            return;
        }
        if (user == null) {
            res.status(401).send();
            return;
        }
        //check if ecrypted password match
        if (!checkIfUnencryptedPasswordIsValid(password, user.password)) {
            res.status(401).send("Wrong password!");
            return;
        }

        //Sign JWT, valid for 1 hour
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        //Send the jwt in the response
        res.send(token);
        return;
    };

    static signup = async (req: Request, res: Response) => {
        //get params from body
        let { email, password, first_name } = req.body;
        let user: User = {
            user_id: 0,
            email: email,
            password: password,
            birth_date: "",
            first_name: first_name,
            second_name: "",
            date_created: new Date(),
            date_updated: new Date(),
            profile_picture_url: "",
        };

        //validate if params are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //hash the password 
        user.password = hashPassword(user.password);

        //try to save
        try {
            await knex('users')
                .insert({
                    email: user.email,
                    password: user.password,
                    first_name: user.first_name,
                    date_created: new Date()
                });
            res.status(201).send("User created");
        } catch (e) {
            res.status(409).send("Email already in use");
            return;
        }
        return;
    }

    static changePassword = async (req: Request, res: Response) => {
        // Get Id from jwt
        const id = res.locals.jwtPayload.user_id;

        //get pararmeters from the body
        const { oldPassword, newPassword, email } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
            return;
        }

        //get user from the database 
        let user: User;
        try {
            user = await knex('users')
                .where('users.user_id', id)
                .first();
        }
        catch (e) {
            res.status(401).send(e);
            return;
        }

        //check if old password matchs
        if (checkIfUnencryptedPasswordIsValid(oldPassword, user.password)) {
            res.status(401).send("Wrong password");
            return;
        }

        //Validate model (password length)
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        let newPasswordHashAndSalt = hashPassword(newPassword);
        try {
            await knex('users')
                .where({
                    email: email,
                })
                .returning('*')
                .update({
                    password: newPasswordHashAndSalt
                });
            res.status(204).send("Password changed.");
        } catch (e) {
            res.status(409).send();
            return;
        }
        return;
    };
}




export default AuthControllerKnex;