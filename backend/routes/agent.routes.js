import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as agentController from "../controllers/agent.controller.js";

const router = express.Router();

// POST /api/agent/chat - Send a message to the AI agent
router.post("/chat", protectRoute, agentController.chat);

export default router;
