import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Chip, // Import Chip for priority display
} from "@mui/material";
import {
  Edit,
  Delete,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
  TaskAlt as TaskIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const TODO = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  // Mapping for priority colors
  const priorityColors = {
    Top: {
      border: isDarkMode ? theme.palette.error.dark : theme.palette.error.main,
      chip: isDarkMode ? theme.palette.error.dark : theme.palette.error.light, // Using light for chip background in dark mode for better contrast
    },
    Moderate: {
      border: isDarkMode
        ? theme.palette.warning.dark
        : theme.palette.warning.main,
      chip: isDarkMode
        ? theme.palette.warning.dark
        : theme.palette.warning.light,
    },
    Low: {
      border: isDarkMode ? theme.palette.success.dark : theme.palette.success.main,
      chip: isDarkMode
        ? theme.palette.success.dark
        : theme.palette.success.light,
    },
  };

  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    completed: false,
    priority: "Moderate", // default priority
  });

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Error fetching todos: " + error.message);
    }
  };

  // Count uncompleted tasks
  const uncompletedCount = todos.filter((todo) => !todo.completed).length;

  // Apply priority filter
  useEffect(() => {
    if (priorityFilter === "All") {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(
        todos.filter((todo) => todo.priority === priorityFilter)
      );
    }
  }, [todos, priorityFilter]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeChange = (field, value) => {
    const formattedTime = value ? dayjs(value).format("HH:mm") : "";
    setFormData((prev) => ({
      ...prev,
      [field]: formattedTime,
    }));
  };

  const handleToggleComplete = async (id, completed) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
    );

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }
    } catch (error) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
      console.error("Error updating todo status:", error);
      toast.error("Error updating todo status: " + error.message);
    }
  };

  const handleOpenForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      completed: false,
      priority: "Moderate",
    });
    setEditMode(false);
    setEditingTodoId(null);
    setOpen(true);
  };

  const handleEdit = (todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      date: todo.date.split("T")[0],
      startTime: todo.startTime,
      endTime: todo.endTime,
      completed: todo.completed,
      priority: todo.priority,
    });
    setEditMode(true);
    setEditingTodoId(todo._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        const response = await fetch(`/api/todo/${editingTodoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
      } else {
        const response = await fetch("/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
      }

      fetchTodos();
      setOpen(false);
      toast.success(
        editMode ? "Todo updated successfully" : "Todo added successfully"
      );
    } catch (error) {
      console.error("Error saving todo:", error);
      toast.error("Error saving todo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      fetchTodos();
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo: " + error.message);
    }
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={4} // Consistent elevation
        color="primary" // Use primary color from theme
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
            alignItems: { xs: "flex-start", sm: "center" }, // Align items
            py: { xs: 1, sm: 1 },
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap", // Allow wrapping on smaller screens
          }}
        >


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
              justifyContent: { xs: "space-between", sm: "flex-end" }, // Space between on mobile, end on desktop
              flexWrap: "wrap", // Allow wrapping for filter and button
            }}
          >
            {/* Uncompleted tasks counter */}
            <Chip
              icon={<TaskIcon fontSize="small" />}
              label={
                <Typography variant="body2" fontWeight={700}>
                  {uncompletedCount} Tasks
                </Typography>
              }
              sx={{
                color: theme.palette.primary.contrastText, // Text color from theme
                backgroundColor: theme.palette.action.selected, // A subtle background
                "& .MuiChip-icon": {
                  color: theme.palette.primary.contrastText,
                },
              }}
            />

            {/* Priority filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 120, sm: 140 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  // Use theme colors for better consistency
                  backgroundColor: theme.palette.action.hover,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.divider,
                  },
                },
                "& .MuiSelect-select": {
                  paddingRight: "32px !important", // Ensure space for dropdown icon
                },
              }}
            >
              <Select
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                displayEmpty
                inputProps={{ "aria-label": "Filter by priority" }}
                startAdornment={
                  <FilterIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  />
                }
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "0.875rem",
                  "& .MuiSelect-icon": {
                    color: theme.palette.text.secondary,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      mt: 0.5,
                      boxShadow: theme.shadows[3],
                      borderRadius: 1,
                    },
                  },
                }}
              >
                <MenuItem value="All">All Priorities</MenuItem>
                <MenuItem value="Top">Top Priority</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Low">Low Priority</MenuItem>
              </Select>
            </FormControl>

            {/* Add task button */}
            <Button
              variant="contained"
              onClick={handleOpenForm}
              startIcon={<AddIcon />}
              sx={{
                whiteSpace: "nowrap",
                px: 2,
                borderRadius: 2,
                fontWeight: 600,
                // Use default contained button colors, which adapt to theme
              }}
            >
              {isMobile ? "" : "Add Task"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          mt: 4,
          px: isMobile ? 1 : 3,
          maxWidth: "md", // Use a fixed max width for better layout control
        }}
      >
        {filteredTodos.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 3, textAlign: "center", mt: 2, borderRadius: 2 }}
          >
            <Typography variant="h6" color="text.secondary">
              {todos.length === 0
                ? "No tasks yet. Add your first task to get started!"
                : "No tasks match the selected priority filter."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 1 }}>
            {filteredTodos.map((todo) => (
              <Paper
                key={todo._id}
                elevation={1}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.2s",
                  opacity: todo.completed ? 0.6 : 1, // Slightly more opaque when completed
                  borderTop: `4px solid ${
                    priorityColors[todo.priority]?.border || "transparent"
                  }`,
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Accordion disableGutters expanded={false} // Control expansion manually if needed or set to true for always expanded
                  sx={{
                    "& .MuiAccordionSummary-root": {
                      minHeight: 64, // Ensure consistent height
                      flexDirection: "row-reverse", // Place expand icon on left
                      "& .MuiAccordionSummary-expandIconWrapper": {
                        transform: "none", // Remove initial rotation
                        mr: 1, // Margin right for icon
                      },
                      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        transform: "rotate(180deg)", // Rotate on expand
                      },
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                      alignItems: "center",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${todo._id}-content`}
                    id={`panel-${todo._id}-header`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        gap: 1,
                        flexWrap: "wrap", // Allow content to wrap
                      }}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(todo._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        color="primary"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          flex: 1,
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          color: todo.completed
                            ? "text.secondary"
                            : "text.primary",
                          wordBreak: "break-word", // Break long words
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Chip
                        label={todo.priority}
                        size="small"
                        sx={{
                          backgroundColor:
                            priorityColors[todo.priority]?.chip || "transparent",
                          color: theme.palette.getContrastText(
                            priorityColors[todo.priority]?.chip || "#ffffff"
                          ),
                          fontWeight: 500,
                          height: 24, // Standard chip height
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          ml: { xs: 0, sm: 2 }, // Margin left on larger screens
                          mt: { xs: 1, sm: 0 }, // Margin top on mobile for date
                          width: { xs: "100%", sm: "auto" }, // Full width on mobile
                          justifyContent: { xs: "flex-end", sm: "flex-start" }, // Align date
                        }}
                      >
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                          {dayjs(todo.date).format("MMM DD, YYYY")}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <Divider />

                  <AccordionDetails sx={{ textAlign: "left", p: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",
                        color: "grey.600",
                        display: "block", // Ensure it takes its own line
                        mb: 1,
                      }}
                    >
                      {todo.startTime && todo.endTime
                        ? `${dayjs(todo.startTime, "HH:mm").format(
                            "h:mm A"
                          )} - ${dayjs(todo.endTime, "HH:mm").format(
                            "h:mm A"
                          )}`
                        : "Time not specified"}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ mb: 2, mt: 1, whiteSpace: "pre-line" }}
                    >
                      {todo.description || "No description provided."}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(todo)}
                      >
                        {isMobile ? "" : "Edit"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(todo._id)}
                      >
                        {isMobile ? "" : "Delete"}
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Box>
        )}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ pb: 1 }}>
            {editMode ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Description"
                name="description"
                fullWidth
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Priority"
                name="priority"
                fullWidth
                value={formData.priority}
                onChange={handleChange}
                required
                variant="outlined"
                select
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="Top">Top</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </TextField>

              <TextField
                margin="dense"
                label="Date"
                name="date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  <TimePicker
                    label="Start Time"
                    value={
                      formData.startTime
                        ? dayjs(formData.startTime, "HH:mm")
                        : null
                    }
                    onChange={(value) => handleTimeChange("startTime", value)}
                    ampm={true}
                    sx={{ flex: 1 }}
                  />

                  <TimePicker
                    label="End Time"
                    value={
                      formData.endTime ? dayjs(formData.endTime, "HH:mm") : null
                    }
                    onChange={(value) => handleTimeChange("endTime", value)}
                    ampm={true}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </LocalizationProvider>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} />}
              >
                {loading ? "Saving..." : editMode ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};

export default TODO;