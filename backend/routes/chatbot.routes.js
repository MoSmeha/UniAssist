import express from "express";
const router = express.Router();
import {
  getBuildingInfo,
  getFloors,
  getFloorDetails,
} from "../controllers/chatbot.controller.js";

router.post("/ask", getBuildingInfo);
router.get("/floors", getFloors);
router.get("/floor/:floor", getFloorDetails);

export default router;
