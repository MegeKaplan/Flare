import express from "express";
import {
  assignRole,
  createRole,
  deleteRole,
  getRole,
  getRoles,
  revokeRole,
  updateRole,
} from "../controllers/roleController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/role/:id")
  .get(getRole)
  .put(verifyToken, updateRole)
  .delete(verifyToken, deleteRole);

router.route("/role/:id/assign").post(verifyToken, assignRole);
router.route("/role/:id/revoke").delete(verifyToken, revokeRole);

router.route("/roles").get(getRoles).post(verifyToken, createRole);

export default router;
