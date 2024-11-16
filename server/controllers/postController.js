import db from "../config/db/db_conn.js";
import MESSAGES from "../constants/messages.js";
import bcrypt from "bcryptjs";

export const getPosts = async (req, res) => {
  try {
    const { sortBy, sortOrder, offset, limit, ...query } = req.query;

    const posts = await db("posts")
      .leftJoin("post_images", "posts.id", "post_images.post_id")
      .leftJoin("post_actions", "posts.id", "post_actions.post_id")
      .leftJoin("users", "posts.sender_id", "users.id")
      .select(
        "posts.*",
        db.raw("GROUP_CONCAT(DISTINCT post_images.image_url) as images"),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'like' THEN post_actions.user_id END) as likes"
        ),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'save' THEN post_actions.user_id END) as saves"
        ),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'comment' THEN post_actions.user_id END) as comments"
        ),
        // "users.username as sender_username",
        // "users.pp_url as sender_pp_url",
        // "users.is_verified as sender_is_verified",
        // "users.is_private as sender_is_private"
        db.raw(`JSON_OBJECT(
        'username', users.username,
        'pp_url', users.pp_url,
        'is_verified', users.is_verified,
        'is_private', users.is_private
    ) as sender`)
      )
      .where({
        "posts.is_deleted": false,
        "users.is_deleted": false,
        "users.is_freezed": false,
        ...query,
      })

      .groupBy("posts.id")
      .orderBy(sortBy ? sortBy : "created_at", sortOrder ? sortOrder : "desc")
      .offset(offset ? offset : 0)
      .limit(limit);

    res
      .status(200)
      .json({ message: MESSAGES.POSTS_FETCH_SUCCESS, response: posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const query = req.query;
    const postId = req.params.id;

    const post = await db("posts")
      .leftJoin("post_images", "posts.id", "post_images.post_id")
      .leftJoin("post_actions", "posts.id", "post_actions.post_id")
      .leftJoin("users", "posts.sender_id", "users.id")
      .select(
        "posts.*",
        db.raw("GROUP_CONCAT(DISTINCT post_images.image_url) as images"),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'like' THEN post_actions.user_id END) as likes"
        ),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'save' THEN post_actions.user_id END) as saves"
        ),
        db.raw(
          "GROUP_CONCAT(DISTINCT CASE WHEN post_actions.action = 'comment' THEN post_actions.user_id END) as comments"
        ),
        // "users.username as sender_username",
        // "users.pp_url as sender_pp_url",
        // "users.is_verified as sender_is_verified",
        // "users.is_private as sender_is_private"
        db.raw(`JSON_OBJECT(
        'username', users.username,
        'pp_url', users.pp_url,
        'is_verified', users.is_verified,
        'is_private', users.is_private
    ) as sender`)
      )
      .where({
        "posts.id": postId,
        "posts.is_deleted": false,
        "users.is_deleted": false,
        "users.is_freezed": false,
        ...query,
      })
      .groupBy("posts.id")
      .first();

    res
      .status(200)
      .json(
        post
          ? { message: MESSAGES.POST_FETCH_SUCCESS, response: post }
          : { message: MESSAGES.POST_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = req.body;

    const [postId] = await db("posts").insert({
      ...post,
    });

    res.status(201).json({
      message: MESSAGES.POST_CREATE_SUCCESS,
      response: postId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const query = req.query;
    const postId = req.params.id;
    var updatedPostData = req.body;

    const post = await db("posts")
      .select("*")
      .where({ is_deleted: false, id: postId, ...query })
      .first()
      .update(updatedPostData);

    if (!post) {
      return res.status(404).json({ message: MESSAGES.POST_NOT_FOUND });
    }

    res
      .status(200)
      .json(
        post
          ? { message: MESSAGES.POST_UPDATE_SUCCESS }
          : { message: MESSAGES.POST_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const query = req.query;
    const postId = req.params.id;

    const post = await db("posts")
      .select("*")
      .where({ is_deleted: false, id: postId, ...query })
      .first()
      .update({ is_deleted: true });

    res
      .status(200)
      .json(
        post
          ? { message: MESSAGES.POST_DELETE_SUCCESS }
          : { message: MESSAGES.POST_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const postActions = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;
    const { action } = req.query;

    const actionTypes = ["like", "save", "comment"];

    const isActionValid =
      actionTypes.filter((actionType) => actionType == action).length > 0;

    if (!isActionValid) {
      return res.status(400).json({ message: MESSAGES.ACTION_IS_NOT_VALID });
    }

    const existingAction = await db("post_actions")
      .select("*")
      .where({ user_id: userId, post_id: postId, action })
      .first();

    // if (existingAction) {
    //   return res.status(400).json({ message: MESSAGES.ACTION_ALREADY_EXIST });
    // }

    if (existingAction) {
      await db("post_actions")
        .where({ user_id: userId, post_id: postId, action })
        .del();
      return res
        .status(200)
        .json({ message: MESSAGES.ACTION_SUCCESS("un" + action) });
    }

    await db("post_actions").insert({
      user_id: userId,
      post_id: postId,
      action,
    });

    res.status(200).json({ message: MESSAGES.ACTION_SUCCESS(action) });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};
