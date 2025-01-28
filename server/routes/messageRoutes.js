import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/messages/:id")
  .get(verifyToken, getMessages)
  .post(verifyToken, sendMessage);

router
  .route("/message/:id")
  .put(verifyToken, updateMessage)
  .delete(verifyToken, deleteMessage);

export default router;
