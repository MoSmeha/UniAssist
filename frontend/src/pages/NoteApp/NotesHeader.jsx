import {
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Box,
  Button,
  IconButton,
} from "@mui/material";

import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

const NotesHeader = ({ searchQuery, onSearchChange, onCreateNote }) => {
  return (
    <AppBar position="sticky" elevation={2} sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <TextField
          variant="standard" // Keeping standard variant for a minimalist base
          size="small"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                {" "}
                {/* Added left margin to the search icon */}
                <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
            disableUnderline: true, // Hides the default underline
            sx: {
              "& input": {
                paddingTop: "6px",
                paddingBottom: "6px",
                // Ensure text itself doesn't have extra padding that misaligns
              },
              // For consistent minimalist look across states
              "&:before": { borderBottom: "none !important" }, // Hides default underline
              "&:after": { borderBottom: "none !important" }, // Hides focused underline
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none !important",
              }, // Hides hover underline
            },
          }}
          sx={{
            mr: 2,
            minWidth: { xs: "120px", sm: "200px", md: "300px" },
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle background
            borderRadius: 1,
            "& .MuiInputBase-input": {
              color: "white", // Text color
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.7)", // Placeholder color
              opacity: 1, // Ensure placeholder opacity is full
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Add Note Button for larger screens */}
        <Button
          variant="contained"
          // color="default" // Removed color="default" to allow sx to control text color
          startIcon={<AddIcon />}
          onClick={onCreateNote}
          sx={{
            ml: 2,
            display: { xs: "none", sm: "flex" },
            bgcolor: "white", // Set background color to white
            color: "primary.main", // Set text color to primary main to contrast with white background
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.8)", // Slightly less opaque white on hover
            },
          }}
        >
          Add Note
        </Button>

        {/* Add Note IconButton for smaller screens */}
        <IconButton
          color="inherit" // Keeps the icon color white (from AppBar's default text color)
          aria-label="add new note"
          onClick={onCreateNote}
          sx={{ ml: 2, display: { xs: "flex", sm: "none" } }}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NotesHeader;
