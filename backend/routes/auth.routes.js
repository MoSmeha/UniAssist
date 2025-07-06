import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import restrictTo from "../middleware/RoleRestriction.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", protectRoute, restrictTo("admin"), signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
