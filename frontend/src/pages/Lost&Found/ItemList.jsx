import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import { Grid, Typography, Box } from "@mui/material";
import ItemCard from "./ItemCard";

const ItemList = () => {
  const items = useLostAndFoundStore((state) => state.items);

  if (items.length === 0) {
    return (
      <Box textAlign="center" my={5}>
        <Typography variant="h6">No items found.</Typography>
        <Typography color="text.secondary">
          Try adjusting your filters or reporting a new item.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item key={item._id} xs={12} sm={6} md={6} lg={4}>
          <ItemCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemList;
