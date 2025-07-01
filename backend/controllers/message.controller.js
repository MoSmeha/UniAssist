import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, getIO } from "../socket/socket.js";
import notificationService from "../utils/NotificationService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message }         = req.body;
    const receiverId          = req.params.id;
    const senderId            = req.user._id;

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
    const newMessage = new Message({ senderId, receiverId, message });
    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // 3. Emit the normal chat events
    const io              = getIO();
    const receiverSocket  = getReceiverSocketId(receiverId);
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
    if (message.includes("@important")) {
      // notify the receiver that an important message arrived
      await notificationService.notifyUsers({
        recipients: [receiverId],
        sender: senderId,
        type: "chat",                             // or "important"
        message: message.slice(0, 35),
        data: {
          messageId: newMessage._id,
          conversationId: conversation._id,     
          type: "Chat",
        },
      });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversationsWithUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select(
      "_id firstName lastName profilePic role Department"
    );

    const result = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [userId, user._id] },
        }).populate("messages");

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

    res.status(200).json(result);
  } catch (error) {
    console.log(
      "Error in getConversationsWithUnreadCount controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    const userId       = req.user._id;
    const { id: otherId } = req.params;

    // Load the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        _id: { $in: conversation.messages },
        receiverId: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    // Emit updated unreadCount = 0
    const io = getIO();
    const userSocketId = getReceiverSocketId(userId);
    if (userSocketId) {
      io.to(userSocketId).emit("updateUnreadCount", {
        userId,
        unreadCount: 0,
      });
    }

    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markMessagesRead controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};