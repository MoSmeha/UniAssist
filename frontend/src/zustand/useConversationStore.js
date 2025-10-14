import create from "zustand";
import toast from "react-hot-toast";

const useConversationStore = create((set) => ({
  conversations: [],
  loading: false,
  fetchConversations: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      set({ conversations: data, loading: false });
    } catch (error) {
      toast.error(error.message);
      set({ loading: false });
    }
  },

  updateUnreadCount: (userId, unreadCount) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === userId ? { ...conv, unreadCount } : conv
      ),
    })),

  markAsRead: async (userId) => {
    try {
      const res = await fetch(`/api/messages/read/${userId}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to mark messages as read");
      }
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === userId ? { ...conv, unreadCount: 0 } : conv
        ),
      }));
    } catch (error) {
      console.error(error.message);
    }
  },

}));

export default useConversationStore;
