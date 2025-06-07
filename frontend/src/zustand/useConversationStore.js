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
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv._id === userId ? { ...conv, unreadCount } : conv
      );
      return { conversations: updatedConversations };
    }),
  addNewMessage: (newMessage) => {
    // Optionally handle new message addition if needed
    // For now, just refetch conversations or update state accordingly
  },
}));

export default useConversationStore;
