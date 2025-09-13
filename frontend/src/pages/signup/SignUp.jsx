import React, { useState, useMemo } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";

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

function App() {
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

  const [formData, setFormData] = useState({
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
    startTime: null,
    endTime: null,
    mode: "",
    room: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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

  const handleTimeChange = (newValue, fieldName) => {
    setScheduleEntry((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleAddSchedule = () => {
    const newScheduleEntry = {
      ...scheduleEntry,
      startTime: scheduleEntry.startTime
        ? dayjs(scheduleEntry.startTime).format("HH:mm")
        : "",
      endTime: scheduleEntry.endTime
        ? dayjs(scheduleEntry.endTime).format("HH:mm")
        : "",
    };

    if (Object.values(newScheduleEntry).some((field) => field === "")) {
      toast.error("Please fill all schedule fields before adding.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newScheduleEntry],
    }));

    setScheduleEntry({
      day: "",
      subject: "",
      startTime: null,
      endTime: null,
      mode: "",
      room: "",
    });
  };

  const handleRemoveSchedule = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = { ...formData };
    if (formData.role !== "student") delete submissionData.major;
    if (formData.role !== "teacher" && formData.role !== "admin")
      delete submissionData.title;

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up user.");
      }

      toast.success(
        `User ${result.firstName} ${result.lastName} created successfully!`
      );
      setFormData({
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
    } catch (err) {
      toast.error(err.message);
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-center" />
        <Container component="main" maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Create New User
            </Typography>
            <Typography
              component="p"
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Fill in the details below to create a new user account.
            </Typography>

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
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="University ID"
                    name="uniId"
                    value={formData.uniId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
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
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
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
                      value={formData.Department}
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
                {formData.role === "student" && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Major</InputLabel>
                      <Select
                        name="major"
                        value={formData.major}
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
                {(formData.role === "teacher" || formData.role === "admin") && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Title</InputLabel>
                      <Select
                        name="title"
                        value={formData.title}
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
                  <MobileTimePicker
                    label="Start Time"
                    value={scheduleEntry.startTime}
                    onChange={(newValue) =>
                      handleTimeChange(newValue, "startTime")
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <MobileTimePicker
                    label="End Time"
                    value={scheduleEntry.endTime}
                    onChange={(newValue) =>
                      handleTimeChange(newValue, "endTime")
                    }
                    slotProps={{ textField: { fullWidth: true } }}
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

              {formData.schedule.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {formData.schedule.map((entry, index) => (
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create User"
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
