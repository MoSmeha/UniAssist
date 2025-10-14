import { List, Box, CircularProgress, Typography } from "@mui/material";
import Conversation from "./Conversation";

import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import useConversationStore from "../../zustand/useConversationStore";

const Conversations = ({ setSelectedContact, searchTerm }) => {
  const { setSelectedConversation } = useConversation();
  const conversations = useConversationStore((state) => state.conversations);
  const fetchConversations = useConversationStore(
    (state) => state.fetchConversations
  );
  const updateUnreadCount = useConversationStore(
    (state) => state.updateUnreadCount
  );
  const markAsRead = useConversationStore((state) => state.markAsRead);
  const loading = useConversationStore((state) => state.loading);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const handleNewMessage = (event) => {
      const newMessage = event.detail;
      updateUnreadCount(
        newMessage.senderId,
        (conversations.find((conv) => conv._id === newMessage.senderId)
          ?.unreadCount || 0) + 1
      );
    };

    const handleUpdateUnreadCount = (event) => {
      const { userId, unreadCount } = event.detail;
      updateUnreadCount(userId, unreadCount);
    };

    window.addEventListener("socketNewMessage", handleNewMessage);
    window.addEventListener("socketUpdateUnreadCount", handleUpdateUnreadCount);

    return () => {
      window.removeEventListener("socketNewMessage", handleNewMessage);
      window.removeEventListener(
        "socketUpdateUnreadCount",
        handleUpdateUnreadCount
      );
    };
  }, [conversations, updateUnreadCount]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSelectedContact(conversation);

    // Reset unreadCount in zustand store
    markAsRead(conversation._id);
  };

  // Sort conversations so that those with unreadCount > 0 appear first
  const sortedConversations = [...conversations].sort((a, b) => {
    const aUnread = a.unreadCount || 0;
    const bUnread = b.unreadCount || 0;
    if (aUnread > 0 && bUnread === 0) return -1;
    if (aUnread === 0 && bUnread > 0) return 1;
    return 0;
  });

  // Filter conversations based on searchTerm
  const filteredConversations = searchTerm
    ? sortedConversations.filter((conversation) => {
        const fullName = `${conversation.firstName} ${conversation.lastName}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : sortedConversations;

  return (
    <Box sx={{ width: "100%" }}>
      {filteredConversations.length === 0 && !loading && searchTerm && (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          No users found matching {searchTerm}
        </Typography>
      )}

      <List>
        {filteredConversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            lastIdx={idx === filteredConversations.length - 1}
            setSelectedContact={handleSelectConversation}
            unreadCount={conversation.unreadCount}
          />
        ))}
      </List>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default Conversations;
