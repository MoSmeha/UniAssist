import { useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";

const TopBar = ({ contact, onBack, setSearchTerm }) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(search);
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {contact && (
          <IconButton edge="start" onClick={onBack} color="inherit">
            <ArrowBackIcon />
          </IconButton>
        )}

        {contact ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={contact.profilePic} alt="user avatar" />
            <Typography variant="h6">
              {contact.firstName + " " + contact.lastName}
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "40%" }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.common.white,
                borderRadius: 1,
                input: { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.primary }} />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
