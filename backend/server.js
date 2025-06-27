import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import todoRoutes from "./routes/todo.routes.js";
import annonncementRoutes from "./routes/announcements.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import LostAndFoundRoutes from "./routes/lost.routes.js";
import NoteAppRoutes from "./routes/note.routes.js";
import PomodoroRoutes from "./routes/pomodoro.routes.js";
import AppointmentRoutes from "./routes/appointment.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import { app, server } from "./socket/socket.js";

import { sendAppointmentReminders } from "./jobs/RemindAppointment.js"
import cron from "node-cron";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


cron.schedule("* * * * *", async () => {
  await sendAppointmentReminders();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sch", scheduleRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/announcements", annonncementRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/lost-and-found", LostAndFoundRoutes);
app.use("/api/notes", NoteAppRoutes);
app.use("/api/pomodoro", PomodoroRoutes);
app.use("/api/appointments", AppointmentRoutes);
app.use("/api/notifications" , notificationRoutes)

// Import note app routes
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
