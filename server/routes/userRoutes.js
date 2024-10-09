import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/users").get(getUsers);

router
  .route("/user/:id")
  .get(getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

export default router;
