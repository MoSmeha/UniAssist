import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, getIO } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message }      = req.body;
    const { id: receiverId } = req.params;
    const senderId         = req.user._id;

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create & save the new message
    const newMessage = new Message({ senderId, receiverId, message });
    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit via Socket.IO
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // Send the actual message event
      io.to(receiverSocketId).emit("newMessage", newMessage);

      // Recompute unread count and emit update
      const unreadCount = await Message.countDocuments({
        receiverId,
        senderId,
        read: false,
      });
      io.to(receiverSocketId).emit("updateUnreadCount", {
        userId: senderId,
        unreadCount,
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