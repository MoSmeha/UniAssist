import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Divider,
  Typography,
  ListItemButton,
  Box,
} from "@mui/material";
import { useSocketStore } from "../../zustand/SocketStore";
import useConversation from "../../zustand/useConversation";

import React from "react";

const Conversation = React.memo(({ conversation, lastIdx, unreadCount }) => {
  const { setSelectedConversation } = useConversation();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <ListItemButton onClick={() => setSelectedConversation(conversation)}>
        <ListItemAvatar>
          <Badge
            color="success"
            variant="dot"
            invisible={!isOnline}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Optional: Adjust online indicator position
          >
            <Avatar
              src={conversation.profilePic}
              alt="user avatar"
              sx={{ bgcolor: "transparent" }}
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="body1"
                noWrap
                sx={{ flexGrow: 1, minWidth: 0 }}
              >
                {" "}
                {/* flexGrow and minWidth for proper text truncation */}
                {conversation.firstName + " " + conversation.lastName}
              </Typography>
              {unreadCount > 0 && (
                <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                  {" "}
                  {/* Added Box for centering and spacing */}
                  <Badge badgeContent={unreadCount} color="error" />
                </Box>
              )}
            </Box>
          }
          secondary={
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              {conversation.role +
                " - Department of " +
                conversation.Department}
            </Typography>
          }
        />
      </ListItemButton>
      {!lastIdx && <Divider variant="inset" component="li" />}
    </>
  );
});
Conversation.displayName = "Conversation";

export default Conversation;
