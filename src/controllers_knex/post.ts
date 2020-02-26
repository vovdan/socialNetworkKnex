import { Request, Response } from "express";
import { validate } from "class-validator";
import { Post } from "../models/PostModel";
import { Like } from "../models/Like";
import { Comment } from "../models/Comment";
import { knex } from "../../knex";

class PostControllerKnex {
    static getAllPost = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id;
        try {
            const posts = await knex('posts')
                .select()
                .where('user_id', user_id)
            res.send(posts);
        } catch (e) {
            res.status(401).send();
            return;
        }
        return;
    };

    static getOnePost = async (req: Request, res: Response) => {
        const post_id = req.params.id;
        const user_id = res.locals.jwtPayload.user_id;
        try {
            const message = await await knex("posts")
                .select()
                .where('user_id', user_id)
                .andWhere('post_id', post_id)
            res.send(message);
        } catch (error) {
            res.status(404).send("Post not found");
            return;
        }
        return;
    };

    static createPost = async (req: Request, res: Response) => {
        let { description, type } = req.body;
        const user_id = res.locals.jwtPayload.user_id;
        let post: Post = {
            post_id: 0,
            description: description,
            date_created: new Date(),
            date_updated: new Date(),
            type: type,
            user_id: user_id
        };

        const errors = await validate(post);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await knex('posts')
                .insert({
                    user_id: post.user_id,
                    description: post.description,
                    date_created: post.date_created,
                    date_updated: post.date_updated,
                    type: post.type
                });
            res.status(201).send("Post created");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };

    static deletePost = async (req: Request, res: Response) => {
        const post_id = req.params.id;
        try {
            await knex('posts')
                .where('post_id', post_id)
                .del();
            res.status(204).send('Post deleted');
        } catch (error) {
            console.log('error!', error);
            res.status(404).send("Post not found");
            return;
        }
        return;
    };

    static editPost = async (req: Request, res: Response) => {
        const { description } = req.body;
        const post_id = req.params.id;
        try {
            await knex('posts')
                .where('post_id', post_id)
                .returning('*')
                .update({
                    description: description,
                    date_updated: new Date()
                });
            res.status(204).send();
        } catch (error) {
            res.status(404).send("Post not found");
        }
        return;
    };

    static likePost = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id
        const post_id = req.params.id;
        let like: Like = {
            user_id: user_id,
            post_id: +post_id
        };

        try {
            await knex('likes')
                .insert({
                    user_id: like.user_id,
                    post_id: like.post_id
                });
            res.status(201).send("Like created");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };

    static getAllLikePost = async (req: Request, res: Response) => {
        const post_id = req.params.id;
        try {
            const likes = await knex('likes')
                .select()
                .where('post_id', post_id);
            res.send(likes);
        } catch (e) {
            res.status(404).send('Post not found');
        }
        return;
    };

    static createCommentPost = async (req: Request, res: Response) => {
        const user_id = res.locals.jwtPayload.user_id
        const post_id = req.params.id;
        const { content } = req.body;
        let comment: Comment = {
            comment_id: 0,
            user_id: user_id,
            content: content,
            post_id: +post_id,
            date_created: new Date(),
            date_updated: new Date()
        };

        const errors = await validate(comment);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await knex('comments')
                .insert({
                    user_id: comment.user_id,
                    content: comment.content,
                    date_created: comment.date_created,
                    post_id: comment.post_id
                });
            res.status(201).send("Comment created");
        } catch (error) {
            res.status(404).send();
            return;
        }
        return;
    };


    static getAllCommentPost = async (req: Request, res: Response) => {
        const post_id = req.params.id;
        try {
            const comments = await knex('comments')
                .select()
                .where('post_id', post_id);
            res.send(comments);
        } catch (e) {
            res.status(404).send('Post not found');
            return;
        }
        return;
    };
}

export default PostControllerKnex;