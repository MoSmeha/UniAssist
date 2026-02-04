import * as agentService from "../services/agent.service.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await agentService.chat(message, req.user._id);

    res.json({ response });
  } catch (error) {
    console.error("Agent chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process message" });
  }
};
