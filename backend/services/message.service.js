import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, getIO } from "../socket/socket.js";
import notificationService from "../utils/NotificationService.js";

export const sendMessage = async (messageText, receiverId, senderId) => {
  // 1. Find or create the conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // 2. Create & save the new message
  const newMessage = new Message({ senderId, receiverId, message: messageText });
  conversation.messages.push(newMessage._id);
  await Promise.all([conversation.save(), newMessage.save()]);

  // 3. Emit the normal chat events
  const io = getIO();
  const receiverSocket = getReceiverSocketId(receiverId);
  if (receiverSocket) {
    io.to(receiverSocket).emit("newMessage", newMessage);

    const unreadCount = await Message.countDocuments({
      receiverId,
      senderId,
      read: false,
    });
    io.to(receiverSocket).emit("updateUnreadCount", {
      userId: senderId,
      unreadCount,
    });
  }

  // 4. If the text contains "@important", send a notification
  if (messageText.includes("@important")) {
    await notificationService.notifyUsers({
      recipients: [receiverId],
      sender: senderId,
      type: "chat",
      message: messageText.slice(0, 35),
      data: {
        messageId: newMessage._id,
        conversationId: conversation._id,
        type: "Chat",
      },
    });
  }

  return newMessage;
};

export const getMessages = async (userId, otherId) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherId] },
  }).populate("messages");

  if (!conversation) return [];

  return conversation.messages;
};

export const getConversationsWithUnreadCount = async (userId) => {
  const users = await User.find({ _id: { $ne: userId } }).select(
    "_id firstName lastName profilePic role Department"
  );

  return await Promise.all(
    users.map(async (user) => {
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, user._id] },
      });

      let unreadCount = 0;
      if (conversation) {
        unreadCount = await Message.countDocuments({
          receiverId: userId,
          senderId: user._id,
          read: false,
        });
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        role: user.role,
        Department: user.Department,
        unreadCount,
      };
    })
  );
};

export const markMessagesRead = async (userId, otherId) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherId] },
  });
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await Message.updateMany(
    {
      _id: { $in: conversation.messages },
      receiverId: userId,
      read: false,
    },
    { $set: { read: true } }
  );

  const io = getIO();
  const userSocketId = getReceiverSocketId(userId);
  if (userSocketId) {
    io.to(userSocketId).emit("updateUnreadCount", {
      userId,
      unreadCount: 0,
    });
  }

  return true;
};
