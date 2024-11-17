import db from "../config/db/db_conn.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import MESSAGES from "../constants/messages.js";

export const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const { username, email, password } = user;

    const existingUser = await db("users").select("*").where({ email }).first();

    if (existingUser) {
      return res.status(409).json({ message: MESSAGES.USER_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db("users").insert({
      ...user,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: MESSAGES.USER_REGISTER_SUCCESS,
      response: { userId, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};

export const authUser = async (req, res) => {
  try {
    const user = req.body;
    const { username, email, password } = user;

    const existingUser = await db("users").select("*").where({ email }).first();

    if (!existingUser) {
      return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
    }

    const passwordAuth = await bcrypt.compare(password, existingUser.password);

    if (!passwordAuth) {
      return res.status(401).json({ message: MESSAGES.USER_WRONG_PASSWORD });
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message: MESSAGES.USER_LOGIN_SUCCESS,
      response: { userId: existingUser.id, token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGES.ERROR_OCCURRED, error: error.message });
  }
};
