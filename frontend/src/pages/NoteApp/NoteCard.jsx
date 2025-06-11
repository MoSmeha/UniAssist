import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPin as PinIcon,
  PushPinOutlined as PinOutlinedIcon,
} from "@mui/icons-material";

// Updated: Brighter background colors
const colorMap = {
  default: "#ffffff",
  red: "#ffcdd2",
  green: "#c8e6c9",
  blue: "#bbdefb",
  yellow: "#fff59d",
  purple: "#e1bee7",
};

// Darker borders for more contrast
const borderColorMap = {
  default: "#bdbdbd",
  red: "#e57373",
  green: "#81c784",
  blue: "#64b5f6",
  yellow: "#fdd835",
  purple: "#ba68c8",
};

const darkTextColor = "#212121";
const mediumDarkTextColor = "#424242";
const lightDarkTextColor = "#616161";
const iconColor = "#424242";
const primaryIconColor = "#1976d2"; // You can keep this or adjust if needed for other icons

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const { title, content, updatedAt, color, isPinned, tags } = note;

  const formatNoteDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      const isToday = date.toDateString() === now.toDateString();
      const isYesterday =
        new Date(now.getTime() - oneDay).toDateString() === date.toDateString();

      if (isToday) {
        return `Edited ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else if (isYesterday) {
        return "Edited Yesterday";
      } else {
        return `Edited ${date.toLocaleDateString()}`;
      }
    } catch (e) {
      console.error("Date format error:", e);
      return "Invalid Date";
    }
  };

  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorMap[color] || colorMap.default,
        border: `1px solid ${borderColorMap[color] || borderColorMap.default}`,
        borderRadius: "4px", // square-ish edges
        position: "relative",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        height: "auto",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          transform: "translateY(-1px)",
          "& .note-actions": {
            opacity: 1,
          },
          "& .pin-icon-button:not(.isPinned)": {
            color: `${lightDarkTextColor} !important`,
          },
        },
      }}
      onClick={() => onEdit(note)}
    >
      <IconButton
        aria-label="toggle pin"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(note);
        }}
        size="small"
        className={`pin-icon-button ${isPinned ? "isPinned" : ""}`}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 2,
          color: isPinned ? "black !important" : "transparent",
          transition: "color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            color: "black",
          },
        }}
      >
        {isPinned ? (
          <PinIcon fontSize="small" />
        ) : (
          <PinOutlinedIcon fontSize="small" />
        )}
      </IconButton>

      <CardContent
        sx={{
          flexGrow: 1,
          pb: 1,
          pt: 2,
          pr: 2,
          pl: 2,
          maxHeight: "300px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        {title && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              lineHeight: 1.4,
              color: darkTextColor,
              mb: content ? 1 : 0,
              wordBreak: "break-word",
              flexShrink: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        )}

        {content && (
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.5,
                color: mediumDarkTextColor,
                fontSize: "0.875rem",
              }}
            >
              {content}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Tags and Date - ALWAYS VISIBLE, on the same line */}
      <Box
        sx={{
          px: 2,
          pb: 1,
          display: "flex",
          justifyContent: "space-between", // Align tags and date to the left
          alignItems: "center", // Align items vertically in the middle
          flexWrap: "wrap", // Allow tags to wrap to the next line if too many
          gap: 0.5, // Space between tags and the date
          minHeight: "24px", // Ensure consistent height even if no tags
        }}
      >
        {tags && tags.length > 0 && (
          <>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: borderColorMap[color] || borderColorMap.default,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: lightDarkTextColor,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  px: 0.5,
                  py: 0.25,
                  borderRadius: "4px",
                  height: "auto",
                  "& .MuiChip-label": {
                    px: "6px",
                  },
                }}
              />
            ))}
            {/* Add a separator or just a small gap if you want space between last tag and date */}
            {/* <Box sx={{ width: '8px' }} /> */}
          </>
        )}
        <Typography
          variant="caption"
          sx={{
            color: lightDarkTextColor,
            fontSize: "0.75rem",
            opacity: 0.8,
            // flexShrink: 0, // Prevent date from shrinking if tags are too long
            ml: tags && tags.length > 0 ? 0.5 : 0, // Add left margin only if there are tags
          }}
        >
          {updatedAt ? formatNoteDate(updatedAt) : "No Date"}
        </Typography>
      </Box>

      {/* CardActions for Edit/Delete icons - ONLY ON HOVER */}
      <CardActions
        className="note-actions"
        sx={{
          opacity: 0,
          transition: "opacity 0.2s",
          justifyContent: "flex-end", // Align icons to the right
          p: 1,
          pt: 0, // No top padding if date/tags are above
          minHeight: "auto",
        }}
      >
        <IconButton
          aria-label="edit note"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          size="small"
          sx={{
            color: iconColor,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          aria-label="delete note"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          size="small"
          sx={{
            color: iconColor,
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.04)",
              color: "#f44336",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default NoteCard;
