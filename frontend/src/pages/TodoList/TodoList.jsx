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
  alpha,
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

  // Mapping for priority colors - adjusted for both dark and light modes

  const priorityColors = {
    Top: {
      border: isDarkMode ? "#ff5252" : "#f44336",

      chip: isDarkMode ? "#ff5252" : "#f44336",
    },

    Moderate: {
      border: isDarkMode ? "#ffab40" : "#ff9800",

      chip: isDarkMode ? "#ffab40" : "#ff9800",
    },

    Low: {
      border: isDarkMode ? "#69f0ae" : "#4caf50",

      chip: isDarkMode ? "#69f0ae" : "#4caf50",
    },
  };

  // App bar gradient based on theme

  const appBarGradient = isDarkMode
    ? "linear-gradient(45deg, #283593 30%, #1565C0 90%)"
    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)";

  // Mapping for priority colors

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
        elevation={isDarkMode ? 4 : 2}
        sx={{
          background: appBarGradient,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",

            alignItems: "center",

            py: { xs: 1.5, sm: 1 },

            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 600,

              mr: { xs: 1, md: 3 },

              flexShrink: 0,
            }}
          >
            Task Manager
          </Typography>

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: { xs: 1, sm: 2 },

              width: "100%",

              justifyContent: "flex-end",

              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {/* Uncompleted tasks counter */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                py: 0.75,

                px: 1.5,

                borderRadius: 2,

                backgroundColor: alpha(isDarkMode ? "#fff" : "#000", 0.1),

                border: `1px solid ${alpha(
                  isDarkMode ? "#fff" : "#000",

                  0.12
                )}`,
              }}
            >
              <TaskIcon
                fontSize="small"
                sx={{
                  mr: 0.75,

                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "white",
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "white",

                  fontWeight: 500,

                  mr: 0.5,

                  display: { xs: "none", sm: "block" },
                }}
              >
                Tasks:
              </Typography>

              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontWeight: 700,

                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "white",
                }}
              >
                {uncompletedCount}
              </Typography>
            </Box>

            {/* Priority filter */}

            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 110, sm: 140 },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,

                  backgroundColor: alpha(isDarkMode ? "#fff" : "#000", 0.05),

                  border: `1px solid ${alpha(
                    isDarkMode ? "#fff" : "#000",

                    0.15
                  )}`,

                  "&:hover": {
                    borderColor: alpha(isDarkMode ? "#fff" : "#000", 0.25),
                  },

                  "& fieldset": {
                    border: "none",
                  },
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
                    sx={{
                      mr: 1,

                      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "white",
                    }}
                  />
                }
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "white",

                  fontSize: "0.875rem",

                  "& .MuiSelect-icon": {
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "white",
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
                backgroundColor: isDarkMode ? alpha("#fff", 0.15) : "white",

                color: isDarkMode ? "white" : theme.palette.primary.main,

                whiteSpace: "nowrap",

                px: 2,

                borderRadius: 2,

                border: isDarkMode ? `1px solid ${alpha("#fff", 0.2)}` : "none",

                "&:hover": {
                  backgroundColor: isDarkMode ? alpha("#fff", 0.25) : "#e0e0e0",

                  boxShadow: theme.shadows[2],
                },

                fontWeight: 600,
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

          maxWidth: {
            xs: "100%",

            sm: "100%",

            md: "90%",

            lg: "90%",
          },
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

                  opacity: todo.completed ? 0.5 : 1,

                  borderTop: `3px solid ${
                    priorityColors[todo.priority]?.border || "transparent"
                  }`,

                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      padding: "10px",

                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0",

                        display: "flex",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        width: "100%",

                        gap: 1,
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
                        }}
                      >
                        {todo.title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventIcon fontSize="small" color="action" />

                        <Typography
                          variant={isMobile ? "caption" : "body2"}
                          sx={{ margin: "0px 20px 0px 0px" }}
                        >
                          {dayjs(todo.date).format("dddd DD/MM/YYYY")}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <Divider />

                  <AccordionDetails sx={{ textAlign: "left" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",

                        color: "grey.600",
                      }}
                    >
                      {todo.startTime
                        ? dayjs(todo.startTime, "HH:mm").format("h:mm A")
                        : "Not specified"}{" "}
                      -{" "}
                      {todo.endTime
                        ? dayjs(todo.endTime, "HH:mm").format("h:mm A")
                        : "Not specified"}
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

              {/* Description is now optional */}

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
