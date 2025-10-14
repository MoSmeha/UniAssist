import { useState } from "react";

import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "ID Cards/Keys",
  "Other",
];

import { memo } from "react";

const CreateItemModal = memo(({ open, handleClose }) => {
  const { createItem, error, loading } = useLostAndFoundStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    phoneNumber: "",
    type: "lost",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.description.trim())
      tempErrors.description = "Description is required.";
    if (!formData.category) tempErrors.category = "Category is required.";
    if (!formData.location.trim())
      tempErrors.location = "Location is required.";
    if (!formData.phoneNumber.trim())
      tempErrors.phoneNumber = "Phone number is required.";
    else if (!/^\+?[0-9]{7,15}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Invalid phone number format.";
    }
    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await createItem(formData);
        handleClose();
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          phoneNumber: "",
          type: "lost",
          image: null,
        });
        setFormErrors({});
      } catch (e) {
        // Error is already handled in the store, but you could add more logic here
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          Report a Lost or Found Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <FormHelperText>{formErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="lost">Lost</MenuItem>
                  <MenuItem value="found">Found</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Contact Phone"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ display: "inline", ml: 2 }}>
                  {formData.image.name}
                </Typography>
              )}
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
            >
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
});

export default CreateItemModal;
