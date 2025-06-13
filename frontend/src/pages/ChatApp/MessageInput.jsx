// MessageInput.js
import { useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", display: "flex", alignItems: "center", p: 1 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Send a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton type="submit" disabled={loading} color="primary">
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

export default MessageInput;
