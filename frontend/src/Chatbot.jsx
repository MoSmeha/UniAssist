import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Avatar,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Send, Person, SmartToy } from "@mui/icons-material";
import { useAuthStore } from "./zustand/AuthStore";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatMessagesRef = useRef(null);

  const authUser = useAuthStore((state) => state.authUser);
  console.log(authUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setChatHistory((prev) => [...prev, { sender: "user", message: question }]);
    setQuestion("");

    try {
      const response = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: data.answer },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "91vh",
        width: "100%",
        // Use theme background for overall container
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: 0,
        }}
      >
        {/* Chat Messages Container - this is the scrollable part */}
        <Box
          ref={chatMessagesRef}
          sx={{
            flexGrow: 1,
            p: isMobile ? 1.5 : 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            // Use theme background for chat messages area
            backgroundColor: theme.palette.background.paper, // Or a slightly different shade if desired
            minHeight: 0,
          }}
        >
          {chatHistory.length === 0 ? (
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: isMobile ? 40 : 64,
                  height: isMobile ? 40 : 64,
                  // Use theme primary/secondary for bot avatar
                  bgcolor: theme.palette.secondary.main,
                }}
              >
                <SmartToy sx={{ fontSize: isMobile ? 24 : 36 }} />
              </Avatar>
              <Typography
                variant={isMobile ? "body2" : "h6"}
                color="text.primary"
              >
                Welcome! How can I help you today?
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "body2"}
                color="text.secondary"
                sx={{ maxWidth: 350 }}
              >
                Ask me anything about Building A's layout, facilities, room
                locations, and more.
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "caption"}
                color="text.disabled"
                sx={{ fontStyle: "italic", mt: 2 }}
              >
                💡 Try: "What's on the second floor?" or "Where is the
                cafeteria?"
              </Typography>
            </Stack>
          ) : (
            // Map through chat history when there are messages
            chatHistory.map((chat, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    chat.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                {chat.sender === "bot" && (
                  <Avatar
                    sx={{
                      width: isMobile ? 24 : 32,
                      height: isMobile ? 24 : 32,
                      bgcolor: theme.palette.primary.light,
                    }}
                  >
                    <SmartToy sx={{ fontSize: isMobile ? 14 : 18 }} />
                  </Avatar>
                )}

                <Paper
                  elevation={1}
                  sx={{
                    maxWidth: "75%",
                    p: isMobile ? 1 : 1.5,
                    backgroundColor:
                      // Adjust message bubble colors based on sender and theme mode
                      chat.sender === "user"
                        ? theme.palette.mode === "dark"
                          ? theme.palette.primary.dark // Darker primary for user in dark mode
                          : theme.palette.primary.light // Lighter primary for user in light mode
                        : theme.palette.background.paper, // Use paper background for bot messages
                    color: theme.palette.text.primary,
                    borderRadius:
                      chat.sender === "user"
                        ? "12px 12px 4px 12px"
                        : "12px 12px 12px 4px",
                    // Adjust border color for messages based on theme mode
                    border: `1px solid ${
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[700]
                        : theme.palette.grey[300]
                    }`,
                  }}
                >
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    sx={{ wordWrap: "break-word" }}
                  >
                    {chat.message}
                  </Typography>
                </Paper>

                {chat.sender === "user" && (
                  <Avatar
                    sx={{
                      width: isMobile ? 24 : 32,
                      height: isMobile ? 24 : 32,
                      // Use a grey from the theme palette
                      bgcolor: theme.palette.grey[400],
                    }}
                    src={authUser?.profilePic || undefined}
                  >
                    {!authUser?.profilePic && (
                      <Person sx={{ fontSize: isMobile ? 14 : 18 }} />
                    )}
                  </Avatar>
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Input Field Area */}
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 1 : 1.5,
            borderTop: `1px solid ${theme.palette.divider}`, // Use theme divider for border
            backgroundColor: theme.palette.background.paper, // Use paper background for input area
            flexShrink: 0,
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Send a message..."
                disabled={isLoading}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    // Adjust input field background based on theme mode
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[800]
                        : theme.palette.grey[200],
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    pr: "8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    // Adjust text color of the input
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputBase-input::placeholder": {
                    // Adjust placeholder color
                    color: theme.palette.text.secondary,
                    opacity: 1, // Ensure placeholder is visible
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={isLoading || !question.trim()}
                color="primary"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText, // Ensures text/icon color contrasts with primary
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  borderRadius: "50%",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send sx={{ fontSize: isMobile ? 20 : 24 }} />
                )}
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Chatbot;
