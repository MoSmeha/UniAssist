import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useAuthStore } from "../../zustand/AuthStore";

const StudentSchedule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const authUser = useAuthStore((state) => state.authUser);
  const userId = authUser._id;
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sch/${userId}/schedule`);

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const sortedSchedule = data.sort((a, b) => {
          const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
          if (dayDiff !== 0) return dayDiff;

          const aTime = new Date(`1970/01/01 ${a.startTime}`);
          const bTime = new Date(`1970/01/01 ${b.startTime}`);
          return aTime - bTime;
        });

        setSchedule(sortedSchedule);
        setError(null);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to load schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSchedule();
  }, [userId]);

  const scheduleByDay = daysOrder
    .map((day) => ({
      day,
      classes: schedule.filter((item) => item.day === day),
    }))
    .filter((daySchedule) => daySchedule.classes.length > 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={6}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  if (schedule.length === 0) {
    return (
      <Box mt={4}>
        <Alert severity="info" variant="filled">
          No schedule found for this student.
        </Alert>
      </Box>
    );
  }

  const DayHeader = ({ day }) => (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        mb: 3,
        pl: 2,
        py: 1.5,
        fontWeight: 600,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(66, 165, 245, 0.15)"
            : "rgba(25, 118, 210, 0.1)",
        borderRadius: "8px",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "8px 0 0 8px",
        },
      }}
    >
      {day}
    </Typography>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          mt: 4,
          mb: 6,
          fontWeight: 700,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          [theme.breakpoints.down("sm")]: {
            fontSize: "2rem",
            mb: 4,
          },
        }}
      >
        <SchoolIcon sx={{ fontSize: "2.75rem" }} />
        Class Schedule
      </Typography>

      {scheduleByDay.map(({ day, classes }) => (
        <Box key={day} mb={5} mx={{ xs: 0, md: 3 }}>
          <DayHeader day={day} />

          {isMobile ? (
            /* Mobile Card Layout */
            <Box display="grid" gap={2}>
              {classes.map((classItem, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Box display="grid" gap={1.5}>
                    {/* Top Row */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {classItem.subject}
                      </Typography>
                      <Chip
                        size="small"
                        icon={
                          classItem.mode === "online" ? (
                            <VideocamIcon fontSize="small" />
                          ) : (
                            <SchoolIcon fontSize="small" />
                          )
                        }
                        label={
                          classItem.mode === "online" ? "Online" : "On Campus"
                        }
                        color={
                          classItem.mode === "online" ? "primary" : "secondary"
                        }
                        sx={{
                          fontWeight: 500,
                          "& .MuiChip-icon": { ml: 0.5 },
                        }}
                      />
                    </Box>

                    {/* Bottom Row */}
                    <Box
                      display="flex"
                      gap={2}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {classItem.startTime} - {classItem.endTime}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <MeetingRoomIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {classItem.room}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            /* Desktop Table Layout */
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.paper
                          : theme.palette.grey[50],
                    }}
                  >
                    <TableCell sx={{ py: 2.5, fontWeight: 600, width: "30%" }}>
                      Subject
                    </TableCell>
                    <TableCell sx={{ py: 2.5, fontWeight: 600, width: "25%" }}>
                      Time
                    </TableCell>
                    <TableCell sx={{ py: 2.5, fontWeight: 600, width: "20%" }}>
                      Mode
                    </TableCell>
                    <TableCell sx={{ py: 2.5, fontWeight: 600, width: "25%" }}>
                      Location
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.map((classItem, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:nth-of-type(even)": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "text.primary",
                          width: "30%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {classItem.subject}
                      </TableCell>
                      <TableCell sx={{ width: "25%" }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <AccessTimeIcon fontSize="small" color="primary" />
                          <span>
                            {classItem.startTime} - {classItem.endTime}
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Chip
                          icon={
                            classItem.mode === "online" ? (
                              <VideocamIcon fontSize="small" />
                            ) : (
                              <SchoolIcon fontSize="small" />
                            )
                          }
                          label={
                            classItem.mode === "online" ? "Online" : "On Campus"
                          }
                          color={
                            classItem.mode === "online"
                              ? "primary"
                              : "secondary"
                          }
                          variant="filled"
                          size="medium"
                          sx={{
                            fontWeight: 500,
                            width: "100%",
                            maxWidth: 140,
                            justifyContent: "flex-start",
                            "& .MuiChip-label": {
                              flexGrow: 1,
                              textAlign: "center",
                              px: 0,
                            },
                            "& .MuiChip-icon": {
                              ml: 1,
                              mr: 1.5,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "25%" }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <MeetingRoomIcon fontSize="small" color="primary" />
                          <span>{classItem.room}</span>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default StudentSchedule;
