import { useEffect } from "react";
import { useAuthStore } from "./AuthStore";
import { useSocketStore } from "./SocketStore";
import useConversationStore from "./useConversationStore";
import io from "socket.io-client";
export const SocketManager = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const { socket } = useSocketStore();
  const { setSocket, setOnlineUsers } = useSocketStore(
    (state) => state.actions
  );

  const fetchConversations = useConversationStore(
    (state) => state.fetchConversations
  );
  const updateUnreadCount = useConversationStore(
    (state) => state.updateUnreadCount
  );

  useEffect(() => {
    if (authUser) {
      // Fetch conversations once on mount to populate initial state
      fetchConversations();

      const newSocket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Add listeners for newMessage and updateUnreadCount events
      newSocket.on("newMessage", (newMessage) => {
        // Custom event to notify about new message, can be handled in Conversations component
        const event = new CustomEvent("socketNewMessage", {
          detail: newMessage,
        });
        window.dispatchEvent(event);
        // Optionally refetch conversations or update state
        fetchConversations();
      });

      newSocket.on("updateUnreadCount", ({ userId, unreadCount }) => {
        // Custom event to notify about unread count update
        const event = new CustomEvent("socketUpdateUnreadCount", {
          detail: { userId, unreadCount },
        });
        window.dispatchEvent(event);
        updateUnreadCount(userId, unreadCount);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser, fetchConversations, updateUnreadCount]);

  return null;
};
