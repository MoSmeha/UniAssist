import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CssBaseline,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CSVLink } from "react-csv";

// --- Data Definitions ---
const MAJORS = [
  "Computer Science",
  "Computer Engineering",
  "Accounting",
  "Sports Training",
  "Dental Lab",
];
const SUBJECTS = [
  "Oral and Written Communication - COMM001",
  "Data Structures and Algorithms - SYS332",
  "Web Development 2 - SYS554",
  "Accounting and finance - BUS112",
  "Nutrituin - SPO451",
];
const DEPARTMENTS = [
  "Computer and Communications Engineering",
  "Business",
  "Sports Sciences",
  "Public Health",
  "Administration",
];
const ROLES = ["student", "teacher", "admin"];
const GENDERS = ["male", "female"];
const TITLES = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Administrator",
  "Dean",
];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MODES = ["campus", "online"];

// --- CSV Headers ---
const headers = [
  { label: "University ID", key: "uniId" },
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Email", key: "email" },
  { label: "Gender", key: "gender" },
  { label: "Role", key: "role" },
  { label: "Department", key: "Department" },
  { label: "Title", key: "title" },
  { label: "Major", key: "major" },
];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    _id: null,
    uniId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    role: "",
    Department: "",
    title: "",
    major: "",
    schedule: [],
  });
  const [scheduleEntry, setScheduleEntry] = useState({
    day: "",
    subject: "",
    startTime: "",
    endTime: "",
    mode: "",
    room: "",
  });

  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#1976d2",
                },
                secondary: {
                  main: "#dc004e",
                },
                background: {
                  default: "#f4f6f8",
                  paper: "#ffffff",
                },
              }
            : {
                primary: {
                  main: "#90caf9",
                },
                secondary: {
                  main: "#f48fb1",
                },
                background: {
                  default: "#121212",
                  paper: "#1d1d1d",
                },
              }),
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif",
        },
      }),
    [mode]
  );

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "role") {
        newState.title = "";
        newState.major = "";
      }
      return newState;
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e, fieldName) => {
    setScheduleEntry((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const handleAddSchedule = () => {
    const newScheduleEntry = {
      ...scheduleEntry,
    };

    if (Object.values(newScheduleEntry).some((field) => field === "")) {
      toast.error("Please fill all schedule fields before adding.");
      return;
    }
    setFormState((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newScheduleEntry],
    }));

    setScheduleEntry({
      day: "",
      subject: "",
      startTime: "",
      endTime: "",
      mode: "",
      room: "",
    });
  };

  const handleRemoveSchedule = (indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = { ...formState };
    if (formState.role !== "student") delete submissionData.major;
    if (formState.role !== "teacher" && formState.role !== "admin")
      delete submissionData.title;

    const isEditing = !!formState._id;

    if (isEditing && !formState.password) {
      delete submissionData.password;
    }

    const url = isEditing ? `/api/users/${formState._id}` : "/api/auth/signup";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to ${isEditing ? "update" : "sign up"} user.`
        );
      }

      toast.success(
        `User ${result.firstName} ${result.lastName} ${
          isEditing ? "updated" : "created"
        } successfully!`
      );
      resetForm();
      setOpenFormDialog(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserClick = () => {
    resetForm();
    setOpenFormDialog(true);
  };

  const handleEdit = (user) => {
    setFormState({
      _id: user._id,
      uniId: user.uniId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      gender: user.gender,
      role: user.role,
      Department: user.Department,
      title: user.title || "",
      major: user.major || "",
      schedule: user.schedule || [],
    });
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    resetForm();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    try {
      const response = await fetch(`/api/users/${userToDelete._id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete user");
      }
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const resetForm = () => {
    setFormState({
      _id: null,
      uniId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "",
      role: "",
      Department: "",
      title: "",
      major: "",
      schedule: [],
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" />
      <Box sx={{ p: { xs: 3, md: 6 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            Admin User Management
          </Typography>

          {/* This Box now wraps the heading and the buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              mb: 2, // Adjusted margin to provide space before the table
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUserClick}
              >
                Create New User
              </Button>
              <CSVLink
                data={users}
                headers={headers}
                filename={"users-data.csv"}
                style={{ textDecoration: "none" }}
              >
                <Button variant="outlined" color="primary">
                  Export to CSV
                </Button>
              </CSVLink>
            </Box>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.uniId}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.email}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.role}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {user.Department}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* Create/Edit User Form Dialog */}
        <Dialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {formState._id ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: "100%" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    required
                    fullWidth
                    label="First Name"
                    value={formState.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="University ID"
                    name="uniId"
                    value={formState.uniId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formState.gender}
                      label="Gender"
                      onChange={handleChange}
                    >
                      {GENDERS.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required={!formState._id}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={formState.role}
                      label="Role"
                      onChange={handleChange}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="Department"
                      value={formState.Department}
                      label="Department"
                      onChange={handleChange}
                    >
                      {DEPARTMENTS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {formState.role === "student" && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Major</InputLabel>
                      <Select
                        name="major"
                        value={formState.major}
                        label="Major"
                        onChange={handleChange}
                      >
                        {MAJORS.map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {(formState.role === "teacher" ||
                  formState.role === "admin") && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Title</InputLabel>
                      <Select
                        name="title"
                        value={formState.title}
                        label="Title"
                        onChange={handleChange}
                      >
                        {TITLES.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 4 }}>
                <Typography variant="h6">Schedule</Typography>
              </Divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Day</InputLabel>
                    <Select
                      name="day"
                      value={scheduleEntry.day}
                      label="Day"
                      onChange={handleScheduleChange}
                    >
                      {DAYS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      name="subject"
                      value={scheduleEntry.subject}
                      label="Subject"
                      onChange={handleScheduleChange}
                    >
                      {SUBJECTS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Start Time"
                    type="time"
                    name="startTime"
                    value={scheduleEntry.startTime}
                    onChange={(e) => handleTimeChange(e, "startTime")}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="End Time"
                    type="time"
                    name="endTime"
                    value={scheduleEntry.endTime}
                    onChange={(e) => handleTimeChange(e, "endTime")}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Mode</InputLabel>
                    <Select
                      name="mode"
                      value={scheduleEntry.mode}
                      label="Mode"
                      onChange={handleScheduleChange}
                    >
                      {MODES.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    name="room"
                    label="Room/Link"
                    value={scheduleEntry.room}
                    onChange={handleScheduleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleAddSchedule}
                    sx={{ mt: 1 }}
                  >
                    Add Schedule Entry
                  </Button>
                </Grid>
              </Grid>

              {formState.schedule.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {formState.schedule.map((entry, index) => (
                    <ListItem
                      key={index}
                      divider
                      sx={{
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={`${entry.subject} (${entry.day})`}
                        secondary={`${entry.startTime} - ${entry.endTime} | ${entry.mode} @ ${entry.room}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveSchedule(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseFormDialog}
              sx={{ flexGrow: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{ flexGrow: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : formState._id ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user "{userToDelete?.firstName}{" "}
              {userToDelete?.lastName}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPanel;
