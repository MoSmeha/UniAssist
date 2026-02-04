import Notification from "../models/notification.model.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";
import { User } from "../models/user.model.js";

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

export const listNotifications = async (userId) => {
  return await Notification.find({ user: userId })
    .sort("-createdAt")
    .populate("sender", "firstName lastName profilePic");
};

export const markAllRead = async (userId) => {
  return await Notification.updateMany(
    { user: userId, read: false },
    { read: true }
  );
};

export const markOneRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    throw new Error("Notification not found");
  }
  return notification;
};

export const notifyUsers = async ({
  recipients,
  sender = SYSTEM_SENDER_ID,
  type,
  message,
  data = {},
  emitEvent = "receiveNotification",
}) => {
  const io = getIO();
  const senderDetails = await User.findById(sender)
    .select("firstName profilePic")
    .lean();

  for (const userId of recipients) {
    const notif = await new Notification({
      user: userId,
      sender,
      type,
      message,
      data,
    }).save();

    const socketId = getReceiverSocketId(userId.toString());
    if (socketId) {
      io.to(socketId).emit(emitEvent, {
        _id: notif._id,
        user: userId,
        sender: senderDetails || { _id: sender },
        type,
        message,
        data: notif.data,
        read: notif.read,
        createdAt: notif.createdAt,
      });
    }
  }
};
