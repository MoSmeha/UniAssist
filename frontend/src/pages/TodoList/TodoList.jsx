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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // <-- Import plugin
import toast from "react-hot-toast";

dayjs.extend(customParseFormat); // <-- Extend dayjs with the plugin

const TODO = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  // Mapping for priority colors
  const priorityColors = {
    Top: {
      border: isDarkMode ? theme.palette.error.dark : theme.palette.error.main,
      chip: isDarkMode ? theme.palette.error.dark : theme.palette.error.light,
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
      border: isDarkMode
        ? theme.palette.success.dark
        : theme.palette.success.main,
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
    date: null,
    startTime: null,
    endTime: null,
    completed: false,
    priority: "Moderate",
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

  const uncompletedCount = todos.filter((todo) => !todo.completed).length;

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

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? dayjs(value).format("HH:mm") : null,
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
      date: null,
      startTime: null,
      endTime: null,
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
      date: todo.date ? dayjs(todo.date) : null,
      startTime: todo.startTime ? dayjs(todo.startTime, "HH:mm") : null,
      endTime: todo.endTime ? dayjs(todo.endTime, "HH:mm") : null,
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

    const payload = {
      ...formData,
      date: formData.date ? formData.date.toISOString() : null,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    try {
      if (editMode) {
        const response = await fetch(`/api/todo/${editingTodoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
      } else {
        const response = await fetch("/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
      <AppBar position="static" elevation={4} color="primary">
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            py: { xs: 1, sm: 1 },
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            My TODO List
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<TaskIcon fontSize="small" />}
              label={
                <Typography variant="body2" fontWeight={700}>
                  {uncompletedCount} Tasks
                </Typography>
              }
              sx={{
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.action.selected,
                "& .MuiChip-icon": {
                  color: theme.palette.primary.contrastText,
                },
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 120, sm: 140 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
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
                  paddingRight: "32px !important",
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

            <Button
              variant="contained"
              onClick={handleOpenForm}
              startIcon={<AddIcon />}
              sx={{
                whiteSpace: "nowrap",
                px: 2,
                borderRadius: 2,
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
          maxWidth: "md",
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
                  opacity: todo.completed ? 0.6 : 1,
                  borderTop: `4px solid ${
                    priorityColors[todo.priority]?.border || "transparent"
                  }`,
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Accordion
                  disableGutters
                  sx={{
                    "& .MuiAccordionSummary-root": {
                      minHeight: 64,
                      flexDirection: "row-reverse",
                      "& .MuiAccordionSummary-expandIconWrapper": {
                        transform: "none",
                        mr: 1,
                      },
                      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        transform: "rotate(180deg)",
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
                        flexWrap: "wrap",
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
                          wordBreak: "break-word",
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Chip
                        label={todo.priority}
                        size="small"
                        sx={{
                          backgroundColor:
                            priorityColors[todo.priority]?.chip ||
                            "transparent",
                          color: theme.palette.getContrastText(
                            priorityColors[todo.priority]?.chip || "#ffffff"
                          ),
                          fontWeight: 500,
                          height: 24,
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 },
                          width: { xs: "100%", sm: "auto" },
                          justifyContent: { xs: "flex-end", sm: "flex-start" },
                        }}
                      >
                        <EventIcon fontSize="small" color="action" />
                        <Typography
                          variant="caption"
                          sx={{ whiteSpace: "nowrap" }}
                        >
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
                        display: "block",
                        mb: 1,
                      }}
                    >
                      {todo.startTime && todo.endTime
                        ? `${dayjs(todo.startTime, "HH:mm").format(
                            "h:mm A"
                          )} - ${dayjs(todo.endTime, "HH:mm").format("h:mm A")}`
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
                sx={{ mb: 2 }}
              >
                <MenuItem value="Top">Top</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Date"
                  value={formData.date ? dayjs(formData.date) : null}
                  onChange={handleDateChange}
                  disablePast
                  slotProps={{
                    textField: {
                      required: true,
                      variant: "outlined",
                      fullWidth: true,
                      margin: "dense",
                      sx: { mb: 2 },
                    },
                  }}
                />

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
