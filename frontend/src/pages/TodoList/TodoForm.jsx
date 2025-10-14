import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import useTodoStore from '../../zustand/useTodoStore';

const TodoForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    open,
    editMode,
    loading,
    formData,
    handleCloseForm,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  } = useTodoStore();

  return (
    <Dialog open={open} onClose={handleCloseForm} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        {editMode ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Priority"
            name="priority"
            fullWidth
            value={formData.priority}
            onChange={handleChange}
            required
            variant="outlined"
            select
            sx={{ mb: 2 }}
          >
            <MenuItem value="Top">Top</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="Date"
              value={formData.date ? dayjs(formData.date) : null}
              onChange={handleDateChange}
              disablePast
              slotProps={{
                textField: {
                  required: true,
                  variant: 'outlined',
                  fullWidth: true,
                  margin: 'dense',
                  sx: { mb: 2 },
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <TimePicker
                label="Start Time"
                value={
                  formData.startTime
                    ? dayjs(formData.startTime, 'HH:mm')
                    : null
                }
                onChange={(value) => handleTimeChange('startTime', value)}
                ampm={true}
                sx={{ flex: 1 }}
              />

              <TimePicker
                label="End Time"
                value={
                  formData.endTime ? dayjs(formData.endTime, 'HH:mm') : null
                }
                onChange={(value) => handleTimeChange('endTime', value)}
                ampm={true}
                sx={{ flex: 1 }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseForm} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(TodoForm);
