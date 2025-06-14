import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import CreateAnnouncement from "./CreateAnnouncement";
import { useAuthStore } from "../../zustand/AuthStore";
import toast from "react-hot-toast";

const Announcements = () => {
  const { authUser } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [authUser]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
     let endpoint;
     if (authUser.role === "student") {
       endpoint = "/api/announcements/student";
     } else if (authUser.role === "teacher") {
       endpoint = "/api/announcements/teacher";
     } else if (authUser.role === "admin") {
       endpoint = "/api/announcements/admin";
     } else {
       throw new Error("Unknown role");
     }

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAnnouncements(data.announcements || []);
      } else {
        toast.error(data.message || "Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    // Refresh announcements after closing dialog
    fetchAnnouncements();
  };

  // Helper function to format ISO date to dd/mm/yyyy
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <>
      {/* Top Bar */}
      <AppBar
        position="static"
        color="primary"
        elevation={3} // Adds shadow
        sx={{
          mb: 3,
          // Adds margin bottom
          padding: { xs: 1, sm: 1 }, // Responsive padding
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            component="span"
            variant="h5"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} // Responsive font size
          >
            {authUser.role === "student"
              ? "Announcements:"
              : "Your Announcements"}
          </Typography>
          {(authUser.role === "teacher" || authUser.role === "admin") && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleDialogOpen}
            >
              Create Announcement
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : announcements.length === 0 ? (
          <Typography
            component="span"
            variant="body1"
            color="textSecondary"
            sx={{ my: 4, textAlign: "center" }}
          >
            {authUser.role === "student"
              ? "No announcements available for you"
              : "You haven't created any announcements yet"}
          </Typography>
        ) : (
          announcements.map((announcement) => (
            <Accordion key={announcement._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" width="100%">
                  {/* Avatar */}
                  <Avatar
                    src={announcement.sender.profilePic}
                    alt={announcement.sender.firstName}
                    sx={{ mr: 2 }}
                  />

                  {/* Sender Name & Target Subject */}
                  <Box flexGrow={1}>
                    <Typography variant="subtitle1">
                      {announcement.sender.firstName}{" "}
                      {announcement.sender.lastName}{" "}
                      <Typography
                        component="span"
                        variant="subtitle2"
                        color="textSecondary"
                      >
                        to{" "}
                        {announcement.announcementType === "subject"
                          ? announcement.targetSubject
                          : announcement.targetMajor}
                      </Typography>
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      {announcement.title}
                    </Typography>
                  </Box>

                  {/* Date on the Right */}
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(announcement.createdAt)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign={"left"} variant="body2" paragraph>
                  {announcement.content}
                </Typography>
                <Divider />
                <Box textAlign={"left"} mt={2}>
                  <Typography variant="caption" color="textSecondary">
                    {announcement.sender.title} -{" "}
                    {announcement.sender.Department}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Container>

      {/* Create Announcement Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="span" variant="h6">
              Create New Announcement
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CreateAnnouncement onSuccess={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Announcements;
