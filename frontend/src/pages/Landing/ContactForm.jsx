import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAuthStore } from '../../zustand/AuthStore';
import toast from 'react-hot-toast'; // Import react-hot-toast

const ContactForm = ({ open, onClose }) => {
  const authUser = useAuthStore((state) => state.authUser);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');

  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug' },
    { value: 'feedback and suggestions', label: 'Feedback and Suggestions' },
    { value: 'feature request', label: 'Feature Request' },
    { value: 'help', label: 'Help' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // Client-side Validation
    if (!title.trim()) {
      toast.error('Title is required.');
      setLoading(false);
      return;
    }
    if (title.trim().length > 100) {
      toast.error('Title cannot exceed 100 characters.');
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required.');
      setLoading(false);
      return;
    }
    if (description.trim().length > 2000) {
      toast.error('Description cannot exceed 2000 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', { // CHANGED FROM /api/contactus TO /api/contact
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ensure you are sending the actual token from authUser.token, not just "include"
          ...(authUser && { 'Authorization': `Bearer ${authUser.token}` }),
        },
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      });

      // Check if the response content type is JSON before trying to parse it
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          toast.success('Message submitted successfully!');
          setTitle('');
          setDescription('');
          setCategory('other');
          onClose(); // Close the main ContactForm dialog on successful submission
        } else {
          toast.error(data.message || 'Failed to submit message.');
        }
      } else {
        // If it's not JSON, it's likely an HTML error page or plain text
        const errorText = await response.text(); // Get the response as plain text
        console.error('Non-JSON response from server:', errorText);
        toast.error('An unexpected server error occurred. Please try again.');
        // You might want to display errorText in a more controlled way for debugging
      }
    } catch (error) {
      console.error('Error submitting contact message:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogContent sx={{ padding: '24px', position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.500',
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 4,
          }}
        >
          {/* Title TextField */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 characters`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            required
          />

          {/* Description TextField */}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 2000 }}
            helperText={`${description.length}/2000 characters`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            required
          />

          {/* Category Select (Dropdown) */}
          <TextField
            fullWidth
            select
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 0,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Message'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'none' }}>
        {/* The Cancel button was here and has been removed */}
      </DialogActions>
    </Dialog>
  );
};

export default ContactForm;
