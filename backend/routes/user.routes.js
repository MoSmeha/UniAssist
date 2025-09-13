// routes/user.routes.js
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/RoleRestriction.js";
import upload from "../utils/multerconfig.js";
import {
  getUsers,
  getUserById,
  updateProfilePic,
  deleteUser,
  editUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getUsers);

// GET /api/users/:id
router.get("/:id", getUserById);

// PATCH /api/users/:id/profile-pic
router.patch("/:id/profile-pic", upload.single("avatar"), updateProfilePic);

router.delete("/:id", restrictTo("admin"), deleteUser);
router.put("/:id", restrictTo("admin"), editUser);

export default router;
