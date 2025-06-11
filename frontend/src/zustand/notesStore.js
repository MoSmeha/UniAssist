// store/notesStore.js
import { create } from "zustand";

export const useNotesStore = create((set, get) => ({
  notes: [],
  loading: false,
  error: "",
  searchQuery: "",

  // Actions
  setNotes: (notes) => set({ notes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Fetch all notes
  fetchNotes: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/notes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch notes: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success) {
        set({ notes: data.notes, error: "" });
      } else {
        throw new Error(data.message || "Failed to fetch notes");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Create note
  createNote: async (noteData) => {
    set({ loading: true });
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content,
        isPinned: noteData.isPinned,
        color: noteData.color,
        tags: noteData.tags || [], // <--- Add this line
      };
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create note");
      }
      const data = await res.json();
      if (data.success) {
        get().fetchNotes();
        set({ error: "" });
      } else {
        throw new Error(data.message || "Failed to create note");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Update note
  updateNote: async (id, noteData) => {
    set({ loading: true });
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content,
        isPinned: noteData.isPinned,
        color: noteData.color,
        tags: noteData.tags || [], // <--- Add this line
      };
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update note");
      }
      const data = await res.json();
      if (data.success) {
        get().fetchNotes();
        set({ error: "" });
      } else {
        throw new Error(data.message || "Failed to update note");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Delete note
  deleteNote: async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    set({ loading: true });
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete note");
      }
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          notes: state.notes.filter((note) => note._id !== id),
          error: "",
        }));
      } else {
        throw new Error(data.message || "Failed to delete note");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Toggle pin
  togglePin: async (note) => {
    set({ loading: true });
    try {
      const payload = { isPinned: !note.isPinned };
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update pin status");
      }
      const data = await res.json();
      if (data.success) {
        get().fetchNotes();
        set({ error: "" });
      } else {
        throw new Error(data.message || "Failed to update pin status");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Search notes
  searchNotes: async (query) => {
    if (!query.trim()) {
      get().fetchNotes();
      return;
    }

    set({ loading: true });
    try {
      const res = await fetch(
        `/api/notes/search?query=${encodeURIComponent(query.trim())}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success) {
        set({ notes: data.results, error: "" });
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
