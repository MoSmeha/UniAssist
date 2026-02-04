import * as todoService from "../services/todo.service.js";

// Get todos for logged-in user
export const getTodoList = async (req, res) => {
  try {
    const todos = await todoService.getTodoList(req.user._id);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new todo
export const postTodo = async (req, res) => {
  try {
    const newTodo = await todoService.createTodo(req.body, req.user._id);
    res.status(201).json(newTodo);
  } catch (error) {
    if (error.message.includes("required") || error.message.includes("Invalid priority")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.user._id, req.body);
    res.json(updatedTodo);
  } catch (error) {
    if (error.message.includes("Invalid update") || error.message.includes("Invalid priority")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Todo not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id, req.user._id);
    res.json({ message: "Deleted successfully." });
  } catch (error) {
    if (error.message === "Todo not found.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
