import * as messageService from "../services/message.service.js";

export const sendMessage = async (req, res) => {
  try {
    const newMessage = await messageService.sendMessage(req.body.message, req.params.id, req.user._id);
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages(req.user._id, req.params.id);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversationsWithUnreadCount = async (req, res) => {
  try {
    const result = await messageService.getConversationsWithUnreadCount(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getConversationsWithUnreadCount controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    await messageService.markMessagesRead(req.user._id, req.params.id);
    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markMessagesRead controller:", error);
    const statusCode = error.message === "Conversation not found" ? 404 : 500;
    return res.status(statusCode).json({ error: error.message || "Internal server error" });
  }
};