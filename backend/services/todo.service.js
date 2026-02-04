import Todo from "../models/todo.model.js";

const VALID_PRIORITIES = ["Top", "Moderate", "Low"];

export const getTodoList = async (userId) => {
  return await Todo.find({ userId });
};

export const createTodo = async (todoData, userId) => {
  const { title, description, date, startTime, endTime, completed, priority } = todoData;

  if (!title || !date || !priority) {
    throw new Error("Title, date, and priority are required.");
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    throw new Error("Invalid priority value.");
  }

  const newTodo = new Todo({
    title,
    description: description || "",
    date,
    startTime: startTime || null,
    endTime: endTime || null,
    completed: completed ?? false,
    priority,
    userId,
  });

  return await newTodo.save();
};

export const updateTodo = async (todoId, userId, updateData) => {
  const allowedUpdates = [
    "title",
    "description",
    "date",
    "startTime",
    "endTime",
    "completed",
    "priority",
  ];
  
  const updates = Object.keys(updateData);
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    throw new Error("Invalid update fields.");
  }

  if (updateData.priority && !VALID_PRIORITIES.includes(updateData.priority)) {
    throw new Error("Invalid priority value.");
  }

  const todo = await Todo.findOne({ _id: todoId, userId });

  if (!todo) {
    throw new Error("Todo not found.");
  }

  updates.forEach((update) => {
    todo[update] = updateData[update];
  });

  return await todo.save();
};

export const deleteTodo = async (todoId, userId) => {
  const todo = await Todo.findOneAndDelete({ _id: todoId, userId });

  if (!todo) {
    throw new Error("Todo not found.");
  }

  return true;
};
