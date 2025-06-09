import { useEffect, useState } from "react";
import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import ItemList from "./ItemList";
import FilterControls from "./FilterControls";
import PaginationControls from "./PaginationControls";
import CreateItemModal from "./CreateItemModal";

const LostAndFoundPage = () => {
  const { fetchItems, loading, error } = useLostAndFoundStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Lost & Found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Report an Item
        </Button>
      </Box>

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
  );
};

export default LostAndFoundPage;
