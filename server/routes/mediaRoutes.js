import express from "express";
import { uploadFiles } from "../controllers/mediaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileLimit = 10;

router.post(
  "/media",
  verifyToken,
  upload.array("files", fileLimit),
  uploadFiles
);

export default router;
