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

const FilterControls = () => {
  const { filters, setFilters } = useLostAndFoundStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters({ [name]: value });
  };

  return (
    <Box component="form" noValidate autoComplete="off" mb={2}>
      {/* Compact margin-bottom */}
      <Grid container spacing={1}>
        {/* Compact spacing between items */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            {/* Small size for vertical compactness */}
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            {" "}
            {/* Small size for vertical compactness */}
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            {" "}
            {/* Small size for vertical compactness */}
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
};

export default FilterControls;
