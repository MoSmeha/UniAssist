import { useEffect } from "react";
import { useAuthStore } from "./AuthStore";
import { useSocketStore } from "./SocketStore";
import useConversationStore from "./useConversationStore";
import io from "socket.io-client";

export const SocketManager = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const { socket } = useSocketStore();
  const { setSocket, setOnlineUsers, addNotificationsBatch, setNotifications } = useSocketStore(
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

      // Fetch persisted notifications on login using fetch API
      // Clear existing notifications before adding new batch to avoid duplicates
      setNotifications([]);

      fetch("/api/notifications", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            addNotificationsBatch(data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);
        });

      const newSocket = io("https://uniassist-d16j.onrender.com/", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("receiveNotification", (notification) => {
        // push into our Zustand store
        useSocketStore.getState().actions.addNotification(notification);

        // if you also want to fire toasts immediately, you can do:
        const event = new CustomEvent("socketNotification", { detail: notification });
        window.dispatchEvent(event);
      });

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
  }, [authUser, fetchConversations, updateUnreadCount, addNotificationsBatch]);

  return null;
};
