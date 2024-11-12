import express from "express";
import {
  deleteFromDB,
  uploadToStorage,
} from "../controllers/storageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileLimit = 10;

router.post(
  "/storage",
  verifyToken,
  upload.array("files", fileLimit),
  uploadToStorage
);

router.delete("/storage/:id", verifyToken, deleteFromDB);

export default router;
