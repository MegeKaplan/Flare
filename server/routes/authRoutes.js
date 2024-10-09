import express from "express";
import { registerUser, authUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", authUser);

export default router;
