import db from "../config/db/db_conn.js";
import MESSAGES from "../constants/messages.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const query = req.query;

    const users = await db("users")
      .select("*")
      .where({ is_deleted: false, ...query });

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
      .select("*")
      .where({ is_deleted: false, id: userId, ...query })
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
