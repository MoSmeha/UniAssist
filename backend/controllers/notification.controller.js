import * as notificationService from "../services/notification.service.js";

// GET /api/notifications
export const listNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.listNotifications(req.user._id);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
};

// PATCH /api/notifications/markRead
export const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead(req.user._id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all read" });
  }
};

// PATCH /api/notifications/:id/read
export const markOneRead = async (req, res) => {
  try {
    const notification = await notificationService.markOneRead(req.params.id, req.user._id);
    res.json(notification);
  } catch (err) {
    console.error(err);
    const statusCode = err.message === "Notification not found" ? 404 : 500;
    res.status(statusCode).json({ error: err.message || "Failed to mark read" });
  }
};
