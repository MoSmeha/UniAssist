import path from "path";
import express from "express";
import cors from "cors";
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
import CafeteriaRoutes from "./routes/cafeteria.routes.js"
import ContactUsRoutes from "./routes/contactUs.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import { initAgent } from "./services/agent.service.js";

import { app, server } from "./socket/socket.js";

import { sendAppointmentReminders } from "./jobs/RemindAppointment.js"
import { sendTodoReminders } from "./jobs/RemindTodo.js";
import { rejectUnacceptedAppointments } from "./jobs/RejectUnacceptedAppointments.js";
import cron from "node-cron";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

cron.schedule("* * * * *", async () => {
  await sendAppointmentReminders();
  await sendTodoReminders();
  await rejectUnacceptedAppointments();
});

// API Routes
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
app.use("/api/menu" , CafeteriaRoutes)
app.use("/api/contact" , ContactUsRoutes)
app.use("/api/agent", agentRoutes);


app.use((err, req, res, next) => {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  console.error(err);

  // Send a JSON response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    // In production, you might not want to send the stack trace
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, async () => {
  await connectToMongoDB();
  await initAgent();
  console.log(`Server Running on port ${PORT}`);
});
