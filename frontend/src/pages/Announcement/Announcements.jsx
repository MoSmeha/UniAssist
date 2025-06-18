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
  Chip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Hidden,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import CreateAnnouncement from "./CreateAnnouncement";
import { useAuthStore } from "../../zustand/AuthStore";
import toast from "react-hot-toast";

const Announcements = () => {
  const { authUser } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

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
    fetchAnnouncements();
  };

  const handleFilterDialogOpen = () => setOpenFilterDialog(true);
  const handleFilterDialogClose = () => setOpenFilterDialog(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getCategoryChipColor = (category) => {
    switch (category) {
      case "Exam":
        return "error";
      case "Makeup Session":
        return "warning";
      case "Event":
        return "info";
      case "Other":
        return "default";
      default:
        return "default";
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.sender.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.sender.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? announcement.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const announcementCategories = [
    "Exam",
    "Makeup Session",
    "Event",
    "Other",
  ];

  return (
    <>
      <AppBar position="static" color="primary" elevation={3} sx={{ mb: 3, p: 1 }}>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            width: '100%',
          }}
        >
          {authUser.role === "student" ? (
            <Typography
              component="span"
              variant="h5"
              sx={{ fontSize: { xs: "1.0rem", sm: "1.5rem" } }}
            >
              Announcements:
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                gap: { xs: 0.5, sm: 1 },
                minWidth: 0,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search announcements..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                  sx: { fontSize: { xs: "0.85rem", sm: "inherit" } }
                }}
                sx={{
                  flexGrow: 1,
                  minWidth: { xs: "80px", sm: "150px" },
                  maxWidth: { xs: "200px", sm: "400px" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.7)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& ::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                    opacity: 1,
                  },
                }}
              />

              <Hidden mdDown>
                <FormControl size="small" sx={{ minWidth: "120px", flexShrink: 0 }}>
                  <InputLabel id="category-select-label" sx={{ color: "white" }}>Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                      fontSize: { xs: "0.85rem", sm: "inherit" },
                    }}
                  >
                    <MenuItem value="">
                      <em>All Categories</em>
                    </MenuItem>
                    {announcementCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Hidden>

              <Hidden mdUp>
                <IconButton color="inherit" onClick={handleFilterDialogOpen} sx={{ flexShrink: 0 }}>
                  <FilterListIcon />
                </IconButton>
              </Hidden>
            </Box>
          )}

          {(authUser.role === "teacher" || authUser.role === "admin") && (
            <Box sx={{ flexShrink: 0, ml: { xs: 1, sm: 2 } }}>
              <Hidden mdDown>
                <Button color="inherit" variant="outlined" onClick={handleDialogOpen} sx={{ whiteSpace: 'nowrap' }}>
                  Create Announcement
                </Button>
              </Hidden>
              <Hidden mdUp>
                <IconButton color="inherit" onClick={handleDialogOpen}>
                  <AddIcon />
                </IconButton>
              </Hidden>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredAnnouncements.length === 0 ? (
          <Typography component="span" variant="body1" color="textSecondary" sx={{ my: 4, textAlign: "center" }}>
            {authUser.role === "student"
              ? "No announcements available for you"
              : "No announcements match your criteria"}
          </Typography>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Accordion key={announcement._id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar src={announcement.sender.profilePic} alt={announcement.sender.firstName} sx={{ mr: 2, width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }} /> {/* Responsive Avatar size */}
                  <Box flexGrow={1} textAlign="left">
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }} 
                    >
                      {announcement.sender.firstName} {announcement.sender.lastName}
                      <Typography
                        component="span"
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ ml: 1, fontSize: { xs: "0.5rem", sm: "0.85rem", md: "0.875rem" } }} 
                      >
                        to {announcement.announcementType === "subject" ? announcement.targetSubject : announcement.targetMajor}
                      </Typography>
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" } }} 
                      >
                        {announcement.title}
                      </Typography>
                      {announcement.category && (
                        <Chip label={announcement.category} size="small" color={getCategoryChipColor(announcement.category)} />
                      )}
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 2, flexShrink: 0, fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" } }} 
                  >
                    {formatDate(announcement.createdAt)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  textAlign="left"
                  variant="body2"
                  paragraph
                  sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" } }} 
                >
                  {announcement.content}
                </Typography>
                <Divider />
                <Box textAlign="left" mt={2}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.75rem" } }} 
                  >
                    {announcement.sender.title} - {announcement.sender.Department}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Container>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography component="span" variant="h6">
              Create New Announcement
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CreateAnnouncement onSuccess={handleDialogClose} />
        </DialogContent>
      </Dialog>

      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose} fullWidth maxWidth="xs">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography component="span" variant="h6">
              Filter by Category
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleFilterDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel id="category-select-label-dialog">Category</InputLabel>
            <Select
              labelId="category-select-label-dialog"
              value={selectedCategory}
              label="Category"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterDialogClose();
              }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {announcementCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Announcements;