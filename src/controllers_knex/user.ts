import { Request, Response } from "express";
import { knex } from "../../knex";

class UserControllerKnex {
    static getCurrent = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id;
        try {
            const user = await knex('users')
                .select("user_id", "first_name", "second_name", "birth_date", "profile_picture_url", "ismale")
                .where('user_id', user_id)
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        return;
    };

    static editUser = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id;
        const { first_name, second_name, birth_date, profile_picture_url } = req.body;

        try {
            await knex('users')
                .where('user_id', user_id)
                .returning('*')
                .update({
                    first_name: first_name,
                    second_name: second_name,
                    birth_date: birth_date,
                    profile_picture_url: profile_picture_url
                });
            res.status(204).send();
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        return;
    };

    static getAllFollowing = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id;

        try {
            const followings = await knex('followings')
                .select()
                .where('user_id', user_id)
            res.send(followings);
        } catch (e) {
            res.status(404).send("User not found");
            return;
        }
        return;
    };

    static followUser = async (req: Request, res: Response) => {
        const following_id = res.locals.jwtPayload.user_id;
        const { user_id_to } = req.body;
        try {
            await knex('followings')
                .insert({
                    following_id: following_id,
                    user_id: user_id_to
                });
            res.status(201).send("Following created");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };

    static unFollowUser = async (req: Request, res: Response) => {
        const following_id = res.locals.jwtPayload.user_id;
        const user_id_to = req.params.id;;
        try {
            await knex('followings')
                .where({
                    following_id: following_id,
                    user_id: user_id_to
                })
                .del();
            res.status(201).send("Following deleted");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };
}

export default UserControllerKnex;