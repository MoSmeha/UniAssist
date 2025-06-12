import { useEffect, useState } from "react";
import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  useMediaQuery, // Import useMediaQuery
  useTheme, // Import useTheme
} from "@mui/material";
import ItemList from "./ItemList";
import FilterControls from "./FilterControls";
import PaginationControls from "./PaginationControls";
import CreateItemModal from "./CreateItemModal";

const LostAndFoundPage = () => {
  const { fetchItems, loading, error } = useLostAndFoundStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Get the current Material-UI theme
  const theme = useTheme();
  // Check if the screen is smaller than 'sm' breakpoint (e.g., typically < 600px)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h1"
            sx={{
              flexGrow: 0,
              color: "white",
              mr: 2,
              fontSize: isMobile ? "1.2rem" : "1.7rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Seen Something? Report It.
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setModalOpen(true)}
            size={isMobile ? "small" : "medium"} // Smaller button for mobile
            sx={{
              bgcolor: "white",
              color: "#1976d2",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
              // Optional: Reduce padding for small buttons on mobile
              padding: isMobile ? "6px 12px" : "8px 22px",
              minWidth: isMobile ? "auto" : "unset", // Allow button to shrink if needed
            }}
          >
            {isMobile ? "Report" : "Report an Item"}{" "}
            {/* Shorter text for mobile */}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>
        <FilterControls />

        {loading && (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <ItemList />
            <PaginationControls />
          </>
        )}

        <CreateItemModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      </Container>
    </>
  );
};

export default LostAndFoundPage;
