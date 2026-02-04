import Todo from "../models/todo.model.js";
import * as notificationService from "../services/notification.service.js";

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

// Combine date + time, handle crossing midnight if endTime < startTime
function combineDateAndTime(date, timeStr, startTimeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);

  // If startTimeStr is given, detect midnight rollover
  if (startTimeStr) {
    const [startHours, startMinutes] = startTimeStr.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    if (combined < startDateTime) {
      combined.setDate(combined.getDate() + 1); // push end time to next day
    }
  }

  return combined;
}

export const sendTodoReminders = async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // Fetch all todos that are not completed
  const todos = await Todo.find({ completed: false });

  // Filter todos whose end datetime is ~1 hour from now (within 1 min window)
  const todosToNotify = todos.filter((todo) => {
    if (!todo.date || !todo.endTime) return false;
    const todoEndDateTime = combineDateAndTime(
      todo.date,
      todo.endTime,
      todo.startTime
    );

    return (
      todoEndDateTime >= oneHourLater &&
      todoEndDateTime < new Date(oneHourLater.getTime() + 60 * 1000)
    );
  });

  // Debugging log
  console.log(
    `[${new Date().toISOString()}] Found ${
      todosToNotify.length
    } todos to notify.`
  );

  for (const todo of todosToNotify) {
    const message = `Reminder: Your todo "${todo.title}" is ending in 1 hour.`;
    const data = {
      todoId: todo._id,
      endTime: todo.endTime,
    };

    await notificationService.notifyUsers({
      recipients: [todo.userId],
      sender: SYSTEM_SENDER_ID,
      type: "reminder",
      message,
      data,
    });

    console.log(`Reminder sent for todo: ${todo.title} (end: ${todo.endTime})`);
  }
};
