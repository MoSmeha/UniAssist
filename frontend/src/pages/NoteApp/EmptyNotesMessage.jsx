import React from "react";
import { Box, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const EmptyNotesMessage = ({ searchQuery }) => {
  return (
    <Box
      sx={{
        textAlign: "left", // Align text to the left
        mt: 10,
        py: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        px: 3,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {searchQuery
          ? "No notes found matching your search."
          : "You haven't created any notes yet."}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Click the <AddIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
        button in the top bar to add your first note!
      </Typography>
    </Box>
  );
};

export default EmptyNotesMessage;
