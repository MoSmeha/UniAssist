// routes/user.routes.js
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../utils/multerconfig.js";
import {
  getUsers,        
  getUserById,
  updateProfilePic,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getUsers);

// GET /api/users/:id
router.get("/:id", getUserById);

// PATCH /api/users/:id/profile-pic
router.patch("/:id/profile-pic", upload.single("avatar"), updateProfilePic);

export default router;
