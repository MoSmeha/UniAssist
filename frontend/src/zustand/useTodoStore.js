import { create } from "zustand";
import dayjs from "dayjs";
import toast from "react-hot-toast";

// A centralized place for API calls
const API_URL = "/api/todo";

const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An API error occurred");
  }
  return response.json();
};

export const useTodoStore = create((set, get) => ({
  todos: [],
  priorityFilter: "All",
  loading: false,
  error: null,

  // Getter to derive uncompleted count
  getUncompletedCount: () => {
    return get().todos.filter((todo) => !todo.completed).length;
  },

  // Getter to derive the filtered list of todos
  getFilteredTodos: () => {
    const { todos, priorityFilter } = get();
    if (priorityFilter === "All") {
      return todos;
    }
    return todos.filter((todo) => todo.priority === priorityFilter);
  },

  setPriorityFilter: (priority) => set({ priorityFilter: priority }),

  fetchTodos: async () => {
    set({ loading: true });
    try {
      const todos = await apiFetch(API_URL);
      set({ todos, loading: false });
    } catch (error) {
      toast.error(`Failed to fetch todos: ${error.message}`);
      set({ error: error.message, loading: false });
    }
  },

  addTodo: async (todoData) => {
    set({ loading: true });
    try {
      const newTodo = await apiFetch(API_URL, {
        method: "POST",
        body: JSON.stringify(todoData),
      });
      set((state) => ({ todos: [...state.todos, newTodo], loading: false }));
      toast.success("Todo added successfully");
      get().fetchTodos(); // Re-fetch to ensure data is sorted and consistent
    } catch (error) {
      toast.error(`Failed to add todo: ${error.message}`);
      set({ error: error.message, loading: false });
    }
  },

  updateTodo: async (id, todoData) => {
    set({ loading: true });
    try {
      const updatedTodo = await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(todoData),
      });
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? updatedTodo : t)),
        loading: false,
      }));
      toast.success("Todo updated successfully");
    } catch (error) {
      toast.error(`Failed to update todo: ${error.message}`);
      set({ error: error.message, loading: false });
    }
  },

  deleteTodo: async (id) => {
    try {
      await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
      set((state) => ({ todos: state.todos.filter((t) => t._id !== id) }));
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete todo: ${error.message}`);
    }
  },

  toggleComplete: async (id, completed) => {
    // Optimistic update
    const originalTodos = get().todos;
    set((state) => ({
      todos: state.todos.map((t) => (t._id === id ? { ...t, completed } : t)),
    }));

    try {
      await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed }),
      });
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
      set({ todos: originalTodos }); // Revert on failure
    }
  },
}));
