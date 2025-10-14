import { useState, useEffect } from "react";
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
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Hidden,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import CreateAnnouncement from "./CreateAnnouncement";
import { useAuthStore } from "../../zustand/AuthStore";
import useAnnouncementsStore from "../../zustand/useAnnouncementsStore";
import AnnouncementList from "./AnnouncementList";

const Announcements = () => {
  const { authUser } = useAuthStore();
  const { announcements, loading, fetchAnnouncements } = useAnnouncementsStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    if (announcements.length === 0) {
      fetchAnnouncements(authUser);
    }
  }, [authUser, fetchAnnouncements, announcements.length]);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    fetchAnnouncements(authUser);
  };

  const handleFilterDialogOpen = () => setOpenFilterDialog(true);
  const handleFilterDialogClose = () => setOpenFilterDialog(false);

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
       <AppBar position="static" color="primary" elevation={3} sx={{ mb: 3, py: 0.5 }}>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            width: '100%',
            minHeight: { xs: '44px', sm: '50px' } 
          }}
        >

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
        ) : (
          <AnnouncementList announcements={filteredAnnouncements} authUser={authUser} />
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