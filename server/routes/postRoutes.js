import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  postActions,
  updatePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/post/:id")
  .get(getPost)
  .post(verifyToken, postActions)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost);

router.route("/posts").get(getPosts).post(verifyToken, createPost);

export default router;
