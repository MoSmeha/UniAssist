import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import {
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "ID Cards/Keys",
  "Other",
];

import { memo } from 'react';

const FilterControls = memo(() => {
  const { filters, setFilters } = useLostAndFoundStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters({ [name]: value });
  };

  return (
    <Box component="form" noValidate autoComplete="off" mb={2}>
      {/* Compact margin-bottom */}
      <Grid container spacing={1}>
  <Grid item xs={4}> {/* Changed from xs={12} */}
    <FormControl fullWidth size="small">
      <InputLabel>Type</InputLabel>
      <Select
        name="type"
        value={filters.type}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        <MenuItem value="lost">Lost</MenuItem>
        <MenuItem value="found">Found</MenuItem>
      </Select>
    </FormControl>
  </Grid>
  <Grid item xs={4}> {/* Changed from xs={12} */}
    <FormControl fullWidth size="small">
      <InputLabel>Category</InputLabel>
      <Select
        name="category"
        value={filters.category}
        label="Category"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
  <Grid item xs={4}> {/* Changed from xs={12} */}
    <FormControl fullWidth size="small">
      <InputLabel>Status</InputLabel>
      <Select
        name="resolved"
        value={filters.resolved}
        label="Status"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        <MenuItem value="false">Unresolved</MenuItem>
        <MenuItem value="true">Resolved</MenuItem>
      </Select>
    </FormControl>
  </Grid>
</Grid>
    </Box>
  );
});

export default FilterControls;
