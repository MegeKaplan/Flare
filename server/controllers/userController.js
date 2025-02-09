import db from "../config/db/db_conn.js";
import MESSAGES from "../constants/messages.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const query = req.query;

    const users = await db("users")
      .leftJoin(
        "user_followers as followers",
        "users.id",
        "followers.following_id"
      )
      .leftJoin(
        "user_followers as followings",
        "users.id",
        "followings.follower_id"
      )
      .join("roles", "users.role_id", "roles.id")
      .leftJoin("role_permissions as rp", "roles.id", "rp.role_id")
      .leftJoin("permissions as p", "rp.permission_id", "p.id")
      // .leftJoin("user_images as images", "users.id", "images.user_id")
      .select(
        "users.*",
        db.raw("GROUP_CONCAT(DISTINCT followers.follower_id) as followers"),
        db.raw("GROUP_CONCAT(DISTINCT followings.following_id) as followings"),
        db.raw(`JSON_OBJECT(
                'name', roles.name,
                'description', roles.description,
                'slug', roles.slug,
                'color', roles.color
              ) as role`),
        db.raw(`GROUP_CONCAT(
                DISTINCT JSON_OBJECT(
                  'id', p.id,
                  'name', p.name,
                  'slug', p.slug
                )
              ) as permissions`)
        // db.raw(`GROUP_CONCAT(DISTINCT CASE WHEN images.type = 'banner' THEN images.image_url END) as bannerUrl`),
        // db.raw(`GROUP_CONCAT(DISTINCT CASE WHEN images.type = 'profile_picture' THEN images.image_url END) as profilePictureUrl`)
      )
      .where({ "users.is_deleted": false, ...query })
      .groupBy("users.id");

    res
      .status(200)
      .json({ message: MESSAGES.USERS_FETCH_SUCCESS, response: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const query = req.query;
    const userId = req.params.id;

    const user = await db("users")
      .leftJoin(
        "user_followers as followers",
        "users.id",
        "followers.following_id"
      )
      .leftJoin(
        "user_followers as followings",
        "users.id",
        "followings.follower_id"
      )
      .join("roles", "users.role_id", "roles.id")
      .leftJoin("role_permissions as rp", "roles.id", "rp.role_id")
      .leftJoin("permissions as p", "rp.permission_id", "p.id")
      // .leftJoin("user_images as images", "users.id", "images.user_id")
      .select(
        "users.*",
        db.raw("GROUP_CONCAT(DISTINCT followers.follower_id) as followers"),
        db.raw("GROUP_CONCAT(DISTINCT followings.following_id) as followings"),
        db.raw(`JSON_OBJECT(
                'name', roles.name,
                'description', roles.description,
                'slug', roles.slug,
                'color', roles.color
              ) as role`),
        db.raw(`GROUP_CONCAT(
                DISTINCT JSON_OBJECT(
                  'id', p.id,
                  'name', p.name,
                  'slug', p.slug
                )
              ) as permissions`)
        // db.raw(`GROUP_CONCAT(DISTINCT CASE WHEN images.type = 'banner' THEN images.image_url END) as bannerUrl`),
        // db.raw(`GROUP_CONCAT(DISTINCT CASE WHEN images.type = 'profile_picture' THEN images.image_url END) as profilePictureUrl`)
      )
      .where({ "users.is_deleted": false, "users.id": userId, ...query })
      .groupBy("users.id")
      .first();

    res
      .status(200)
      .json(
        user
          ? { message: MESSAGES.USER_FETCH_SUCCESS, response: user }
          : { message: MESSAGES.USER_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const query = req.query;
    const userId = req.params.id;
    var updatedUserData = req.body;

    if (updatedUserData.password) {
      const updatedPasswordHash = await bcrypt.hash(
        updatedUserData.password,
        10
      );
      updatedUserData = { ...updatedUserData, password: updatedPasswordHash };
    }

    const user = await db("users")
      .select("*")
      .where({ is_deleted: false, id: userId, ...query })
      .first()
      .update(updatedUserData);

    if (!user) {
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
    }

    res
      .status(200)
      .json(
        user
          ? { message: MESSAGES.USER_UPDATE_SUCCESS }
          : { message: MESSAGES.USER_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const query = req.query;
    const userId = req.params.id;

    const user = await db("users")
      .select("*")
      .where({ is_deleted: false, id: userId, ...query })
      .first()
      .update({ is_deleted: true });

    res
      .status(200)
      .json(
        user
          ? { message: MESSAGES.USER_DELETE_SUCCESS }
          : { message: MESSAGES.USER_NOT_FOUND }
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    const existingFollow = await db("user_followers")
      .select("*")
      .where({ follower_id: followerId, following_id: followingId })
      .first();

    if (existingFollow) {
      return res.status(400).json({ message: MESSAGES.USER_ALREADY_FOLLOWING });
    }

    await db("user_followers").insert({
      follower_id: followerId,
      following_id: followingId,
    });

    res.status(200).json({ message: MESSAGES.USER_FOLLOW_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    const followRelationship = await db("user_followers")
      .select("*")
      .where({ follower_id: followerId, following_id: followingId })
      .first();

    if (!followRelationship) {
      return res
        .status(400)
        .json({ message: MESSAGES.USER_NOT_BEING_FOLLOWED });
    }

    await db("user_followers")
      .where({ follower_id: followerId, following_id: followingId })
      .del();

    res.status(200).json({ message: MESSAGES.USER_UNFOLLOW_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.params.id;
    const query = req.query;

    var userInteractions = [];
    if (query.action != "comment") {
      userInteractions = await db("post_actions")
        .join("posts", "posts.id", "post_actions.post_id")
        .where({
          user_id: userId,
          is_deleted: false,
          is_story: false,
          ...query,
        })
        .select("posts.*")
        .orderBy("post_id", "desc");
    } else {
      var userInteractions = await db("post_comments")
        .join("posts", "posts.id", "post_comments.post_id")
        .where({
          user_id: userId,
          "posts.is_deleted": false,
          "post_comments.is_deleted": false,
          is_story: false,
        })
        .select("posts.*", "post_comments.comment as user_comment")
        .orderBy("created_at", "desc");
    }

    res.status(200).json({
      message: MESSAGES.FETCH_SUCCESS,
      response: userInteractions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.params.id;
    const query = req.query;

    var userConnections = [];
    if (query.type == "followers") {
      userConnections = await db("user_followers")
        .join("users", "users.id", "user_followers.follower_id")
        .where({ "user_followers.following_id": userId })
        .select("users.*");
    } else if (query.type == "following") {
      userConnections = await db("user_followers")
        .join("users", "users.id", "user_followers.following_id")
        .where({ "user_followers.follower_id": userId })
        .select("users.*");
    }

    res.status(200).json({
      message: MESSAGES.FETCH_SUCCESS,
      response: userConnections,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};
