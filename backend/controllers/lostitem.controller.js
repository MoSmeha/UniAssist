import * as lostitemService from "../services/lostitem.service.js";

// Create a new Lost and Found item
export const createLostAndFoundItem = async (req, res) => {
  try {
    const savedItem = await lostitemService.createLostAndFoundItem(req.body, req.user._id, req.file?.path);
    res.status(201).json(savedItem);
  } catch (error) {
    if (error.message.includes("required") || error.message.includes("Type must be")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all Lost and Found items
export const getLostAndFoundItems = async (req, res) => {
  try {
    const result = await lostitemService.getLostAndFoundItems(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Lost and Found item by ID
export const getLostAndFoundItem = async (req, res) => {
  try {
    const item = await lostitemService.getLostAndFoundItemById(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    const statusCode = error.message === "Item not found" ? 404 :
                      error.kind === "ObjectId" ? 400 : 500;
    res.status(statusCode).json({ message: error.message === "Item not found" ? "Item not found" : (error.kind === "ObjectId" ? "Invalid item ID" : error.message) });
  }
};

// Update the resolved status of an item
export const updateResolvedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    const item = await lostitemService.updateResolvedStatus(id, resolved, req.user._id);
    res.status(200).json(item);
  } catch (error) {
    const statusCode = error.message === "Item not found" ? 404 :
                      error.message === "You are not authorized to update this item." ? 403 :
                      error.message.includes("must be a boolean") || error.kind === "ObjectId" ? 400 : 500;
    res.status(statusCode).json({ message: error.kind === "ObjectId" ? "Invalid item ID" : error.message });
  }
};

// Delete a Lost and Found item
export const deleteLostAndFoundItem = async (req, res) => {
  try {
    await lostitemService.deleteLostAndFoundItem(req.params.id, req.user._id);
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    const statusCode = error.message === "Item not found" ? 404 :
                      error.message === "You are not authorized to delete this item." ? 403 :
                      error.kind === "ObjectId" ? 400 : 500;
    res.status(statusCode).json({ message: error.kind === "ObjectId" ? "Invalid item ID" : error.message });
  }
};

// New controller function to send notification to poster
export const sendNotificationToPoster = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    await lostitemService.sendNotificationToPoster(id, req.user._id, message);
    res.status(200).json({ message: "Notification sent to item poster." });
  } catch (error) {
    const statusCode = error.message === "Item not found" ? 404 :
                      error.kind === "ObjectId" ? 400 : 500;
    res.status(statusCode).json({ message: error.kind === "ObjectId" ? "Invalid item ID" : error.message });
  }
};
