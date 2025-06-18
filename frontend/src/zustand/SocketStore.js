import { create } from "zustand";

export const useSocketStore = create((set) => ({
  socket: null,
  onlineUsers: [],
  notifications: [],

  actions: {
    setSocket: (socket) => set({ socket }),
    setOnlineUsers: (users) => set({ onlineUsers: users }),
    setNotifications: (notes) => set({ notifications: notes }),
    addNotification: (notif) =>
      set((s) => ({
        notifications: [{ ...notif, read: false }, ...s.notifications],
      })),
    markAllRead: async () => {
      try {
        const response = await fetch("/api/notifications/markRead", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to mark all notifications as read");
        }
        // Update local state to mark all as read
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }));
      } catch (error) {
        console.error(error);
      }
    },
    addNotificationsBatch: (notes) =>
      set((s) => {
        // Deduplicate notifications by _id
        const existingIds = new Set(s.notifications.map((n) => n._id));
        const filteredNotes = notes.filter((n) => !existingIds.has(n._id));
        return {
          notifications: [...filteredNotes, ...s.notifications],
        };
      }),
    markOneRead: async (id) => {
      try {
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }
        const updatedNote = await response.json();
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n._id === updatedNote._id ? updatedNote : n
          ),
        }));
      } catch (error) {
        console.error(error);
      }
    },
  },
}));
