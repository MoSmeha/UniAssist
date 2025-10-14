import create from 'zustand';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const useTodoStore = create((set, get) => ({
  todos: [],
  filteredTodos: [],
  priorityFilter: 'All',
  open: false,
  editMode: false,
  editingTodoId: null,
  loading: false,
  formData: {
    title: '',
    description: '',
    date: null,
    startTime: null,
    endTime: null,
    completed: false,
    priority: 'Moderate',
  },

  fetchTodos: async () => {
    try {
      const response = await fetch('/api/todo');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      set({ todos: data });
      get().filterTodos();
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Error fetching todos: ' + error.message);
    }
  },

  filterTodos: () => {
    const { todos, priorityFilter } = get();
    if (priorityFilter === 'All') {
      set({ filteredTodos: todos });
    } else {
      set({ filteredTodos: todos.filter((todo) => todo.priority === priorityFilter) });
    }
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority });
    get().filterTodos();
  },

  handleToggleComplete: async (id, completed) => {
    const originalTodos = get().todos;
    const updatedTodos = originalTodos.map((todo) => (todo._id === id ? { ...todo, completed } : todo));
    set({ todos: updatedTodos });
    get().filterTodos();

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }
    } catch (error) {
      set({ todos: originalTodos });
      get().filterTodos();
      console.error('Error updating todo status:', error);
      toast.error('Error updating todo status: ' + error.message);
    }
  },

  handleOpenForm: (edit = false, todo = null) => {
    if (edit && todo) {
      set({
        formData: {
          title: todo.title,
          description: todo.description,
          date: todo.date ? dayjs(todo.date) : null,
          startTime: todo.startTime ? dayjs(todo.startTime, 'HH:mm') : null,
          endTime: todo.endTime ? dayjs(todo.endTime, 'HH:mm') : null,
          completed: todo.completed,
          priority: todo.priority,
        },
        editMode: true,
        editingTodoId: todo._id,
        open: true,
      });
    } else {
      set({
        formData: {
          title: '',
          description: '',
          date: null,
          startTime: null,
          endTime: null,
          completed: false,
          priority: 'Moderate',
        },
        editMode: false,
        editingTodoId: null,
        open: true,
      });
    }
  },

  handleCloseForm: () => {
    set({ open: false });
  },

  handleChange: (e) => {
    const { name, value, type, checked } = e.target;
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  },

  handleDateChange: (date) => {
    set((state) => ({
      formData: {
        ...state.formData,
        date: date,
      },
    }));
  },

  handleTimeChange: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value ? dayjs(value).format('HH:mm') : null,
      },
    }));
  },

  handleSubmit: async (e) => {
    e.preventDefault();
    set({ loading: true });
    const { formData, editMode, editingTodoId } = get();

    const payload = {
      ...formData,
      date: formData.date ? formData.date.toISOString() : null,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      let response;
      if (editMode) {
        response = await fetch(`/api/todo/${editingTodoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to update todo');
        }
      } else {
        response = await fetch('/api/todo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
      }

      get().fetchTodos();
      set({ open: false });
      toast.success(editMode ? 'Todo updated successfully' : 'Todo added successfully');
    } catch (error) {
      console.error('Error saving todo:', error);
      toast.error('Error saving todo: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  handleDelete: async (id) => {
    const originalTodos = get().todos;
    const updatedTodos = originalTodos.filter((todo) => todo._id !== id);
    set({ todos: updatedTodos });
    get().filterTodos();

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      toast.success('Todo deleted successfully');
    } catch (error) {
      set({ todos: originalTodos });
      get().filterTodos();
      console.error('Error deleting todo:', error);
      toast.error('Error deleting todo: ' + error.message);
    }
  },
}));

export default useTodoStore;