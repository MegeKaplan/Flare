import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  getUserConnections,
  getUserInteractions,
  getUsers,
  unfollowUser,
  updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/user/:id/interactions", verifyToken, getUserInteractions);

router.get("/user/:id/connections", verifyToken, getUserConnections);

router.post("/user/follow", verifyToken, followUser);
router.post("/user/unfollow", verifyToken, unfollowUser);

router
  .route("/user/:id")
  .get(getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

router.route("/users").get(getUsers);

export default router;
