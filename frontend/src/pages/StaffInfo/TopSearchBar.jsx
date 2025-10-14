import { memo, useState } from 'react';
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
import { useTheme } from "@mui/material/styles";
import useStaffStore from '../../zustand/useStaffStore';

const TopSearchBar = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { setSearchTerm } = useStaffStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the search term to parent component
    setSearchTerm(search);
  };
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
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
                  <IconButton type="submit">
                    <SearchIcon sx={{ color: theme.palette.text.primary }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Toolbar>
    </AppBar>
  );
};
export default memo(TopSearchBar);