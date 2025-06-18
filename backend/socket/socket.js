// socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
export const getIO = () => io;            // ← new getter

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendNotification", ({ receiverId, notification }) => {
    const recvSock = getReceiverSocketId(receiverId);
    if (recvSock) io.to(recvSock).emit("receiveNotification", notification);
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };
