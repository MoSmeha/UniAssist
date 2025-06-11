import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const colorMap = {
  default: "#ffffff",
  red: "#ffebee",
  green: "#e8f5e9",
  blue: "#e3f2fd",
  yellow: "#fffde7",
  purple: "#f3e5f5",
};

const colorMapDark = {
  default: "#424242",
  red: "#5c2626",
  green: "#2c5f2d",
  blue: "#234d74",
  yellow: "#6b5e28",
  purple: "#582a5d",
};

const NoteForm = ({ open, onClose, note, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "default",
    isPinned: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
        color: note.color || "default",
        isPinned: note.isPinned || false,
        tags: note.tags || [],
      });
    } else {
      setFormData({
        title: "",
        content: "",
        color: "default",
        isPinned: false,
        tags: [],
      });
    }
    setTagInput("");
  }, [note, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    await onSave(formData);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setTagInput("");
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const getBackgroundColor = (colorKey) =>
    isDarkMode ? colorMapDark[colorKey] : colorMap[colorKey];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: theme.shape.borderRadius * 2,
          minHeight: "400px",
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
          {note ? "Edit Note" : "Create New Note"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange("title")}
            sx={{ mb: 2 }}
            required
            error={!formData.title.trim() && open}
            helperText={
              !formData.title.trim() && open ? "Title is required" : ""
            }
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />

          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            value={formData.content}
            onChange={handleChange("content")}
            sx={{ mb: 2 }}
            required
            error={!formData.content.trim() && open}
            helperText={
              !formData.content.trim() && open ? "Content is required" : ""
            }
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 1,
            }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel
                id="color-select-label"
                sx={{ color: theme.palette.text.secondary }}
              >
                Color
              </InputLabel>
              <Select
                labelId="color-select-label"
                value={formData.color}
                label="Color"
                onChange={handleChange("color")}
                sx={{
                  "& .MuiSelect-select": {
                    backgroundColor: getBackgroundColor(formData.color),
                    borderRadius: "4px",
                    pr: 4,
                    color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.action.hover,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
              >
                {Object.keys(colorMap).map((colorKey) => (
                  <MenuItem
                    key={colorKey}
                    value={colorKey}
                    sx={{
                      backgroundColor: getBackgroundColor(colorKey),
                      color: isDarkMode
                        ? "#ffffff"
                        : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? colorMapDark[colorKey]
                          : colorMap[colorKey],
                        filter: isDarkMode
                          ? "brightness(1.2)"
                          : "brightness(0.9)",
                      },
                    }}
                  >
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPinned: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
              label="Pin Note"
              sx={{ ml: 2, color: theme.palette.text.primary }}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: theme.palette.text.primary }}
            >
              Tags
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Add tag"
                variant="outlined"
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                InputProps={{
                  style: { color: theme.palette.text.primary },
                }}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            {note ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NoteForm;
