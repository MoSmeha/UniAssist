import { forwardRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useAuthStore } from "../../zustand/AuthStore";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = forwardRef(({ message }, ref) => {
  const authUser = useAuthStore((state) => state.authUser);
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  const isUnread = !fromMe && !message.read;

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: fromMe ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {!fromMe && (
        <Avatar
          src={profilePic}
          sx={{
            width: 35,
            height: 35,
            mr: 1,
          }}
        />
      )}

      <Box
        sx={{
          maxWidth: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: fromMe ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            backgroundColor: isUnread
              ? "#e0e0e0"
              : fromMe
              ? "#0084ff"
              : "#ffffff",
            color: fromMe ? "#ffffff" : "#000000",
            px: 1,
            py: 1,
            borderRadius: 4,
            borderTopLeftRadius: !fromMe ? 2 : 16,
            borderTopRightRadius: fromMe ? 2 : 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            fontWeight: isUnread ? "bold" : "normal",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: "grey.500",
            mt: 0.5,
            fontSize: "0.75rem",
          }}
        >
          {formattedTime}
        </Typography>
      </Box>

      {fromMe && (
        <Avatar
          src={profilePic}
          sx={{
            width: 35,
            height: 35,
            ml: 1,
          }}
        />
      )}
    </Box>
  );
});

Message.displayName = "Message";

export default Message;
