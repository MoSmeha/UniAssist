import * as chatbotService from "../services/chatbot.service.js";

export const getBuildingInfo = async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await chatbotService.getAnswer(question);
    res.json({ answer });
  } catch (error) {
    console.error("Error in chatbot controller:", error);
    res.status(500).json({ error: error.message || "Failed to get campus information" });
  }
};

export const getFloors = (req, res) => {
  try {
    const floors = chatbotService.getFloors();
    res.json({ floors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFloorDetails = (req, res) => {
  const { floor } = req.params;
  try {
    const details = chatbotService.getFloorDetails(floor);
    res.json({ floor, details });
  } catch (error) {
    const statusCode = error.message === "Floor not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

export const getStaffList = (req, res) => {
  try {
    const staff = chatbotService.getStaffList();
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
