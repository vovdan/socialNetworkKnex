import { Request, Response } from "express";
import { validate } from "class-validator";
import { Message } from "../models/Message";
import { knex } from "../../knex";

class MessageControllerKnex {
    static listAll = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id;
        try {
            const messages = await knex("messages")
                .select()
                .where('user_id_from', user_id)
                .orWhere('user_id_to', user_id)
            res.send(messages);
        } catch (e) {
            res.status(401).send();
            return;
        }
        return;
    }

    static getOneMessages = async (req: Request, res: Response) => {
        const message_id = req.params.id;
        const user_id = res.locals.jwtPayload.user_id;
        try {
            const message = await await knex("messages")
                .select()
                .where('user_id_from', user_id)
                .andWhere('message_id', message_id)
            res.send(message);
        } catch (error) {
            res.status(404).send("Message not found");
            return;
        }
        return;
    };

    static sendMessage = async (req: Request, res: Response) => {
        let { content, user_id_to } = req.body;
        const user_id_from = res.locals.jwtPayload.user_id;
        let message: Message = {
            message_id: 0,
            content: content,
            date_created: new Date(),
            user_id_from: user_id_from,
            user_id_to: user_id_to
        };

        const errors = await validate(message);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await knex('messages')
                .insert({
                    content: message.content,
                    date_created: message.date_created,
                    user_id_from: message.user_id_from,
                    user_id_to: message.user_id_to
                });
            res.status(201).send("Message created");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };

    static deleteMessage = async (req: Request, res: Response) => {
        const message_id = req.params.id;
        try {
            await knex('messages')
                .where('message_id', message_id)
                .del();
            res.status(204).send('Message deleted');
        } catch (error) {
            console.log('error!', error);
            res.status(404).send("message not found");
            return;
        }
        return;
    };
}

export default MessageControllerKnex;