import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  AppBar,
  Toolbar,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { AccessTime, Check, Clear, AddCircleOutline, Schedule, Add } from '@mui/icons-material';
import { useAuthStore } from '../../zustand/AuthStore';
import { useAppointmentStore } from '../../zustand/useAppointmentStore';

// Date picker imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

export default function AppointmentManager() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Destructure state and actions from the Zustand stores
  const authUser = useAuthStore((state) => state.authUser);
  const {
    appointments,
    teachers,
    newAppt,
    rejecting,
    reason,
    showBookingForm,
    fetchTeachers,
    fetchAppointments,
    setNewAppt,
    setRejecting,
    setReason,
    setShowBookingForm,
    handleCreate,
    handleAccept,
    openReject,
    handleReject,
    getStatusChipColor,
    isLoadingAppointments,
  } = useAppointmentStore();

  useEffect(() => {
    fetchTeachers();
    fetchAppointments();
  }, [fetchTeachers, fetchAppointments]);

  const handleCloseForm = () => {
    setShowBookingForm(false);
  };

  const handleBookAppointment = () => {
    handleCreate(authUser);
    setShowBookingForm(false);
  };

  // Function to determine card width based on appointment count
  const getCardWidth = (appointmentCount) => {
    if (appointmentCount === 1) return { maxWidth: '500px', width: '100%' };
    if (appointmentCount === 2) return { maxWidth: '450px', width: '100%' };
    return { maxWidth: '380px', width: '100%' }; // Default for 3+ appointments
  };

  const cardStyle = getCardWidth(appointments.length);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? theme.palette.grey[900]
              : theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: 'none' }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="h1"
              sx={{
                color: theme.palette.mode === 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.primary.contrastText,
                fontWeight: 600,
                fontSize: isMobile ? '1.1rem' : '1.5rem'
              }}
            >
              {isMobile ? "Appointments" : "Appointment Management"}
            </Typography>
            {/* Only show the button if the user is NOT a teacher */}
            {authUser?.role !== 'teacher' && (
              <Button
                variant="contained"
                startIcon={isMobile ? undefined : <AddCircleOutline />}
                onClick={() => setShowBookingForm(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 1,
                  bgcolor: theme.palette.mode === 'dark'
                    ? theme.palette.primary.main
                    : theme.palette.common.white,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                  padding: isMobile ? '4px 8px' : '8px 16px',
                  minWidth: isMobile ? '40px' : 'auto',
                  fontSize: isMobile ? '0.875rem' : '0.875rem',
                  '&:hover': {
                    boxShadow: 2,
                    bgcolor: theme.palette.mode === 'dark'
                      ? theme.palette.primary.dark
                      : theme.palette.grey[100]
                  }
                }}
              >
                {isMobile ? <Add /> : "Book New Appointment"}
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ width: '100%', p: 3 }}>
          {/* Loader when fetching appointments */}
          {isLoadingAppointments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', mt: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ ml: 2 }}>Loading Appointments...</Typography>
            </Box>
          ) : appointments.length === 0 ? (
            <Card sx={{
              mt: 3,
              textAlign: 'center',
              py: 6,
              width: '100%',
              elevation: 4,
              bgcolor: theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[50], // Keep this slightly off-white for "no appointments" card
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              color: 'text.primary',
              position: 'relative',
              // DEFINITELY more visible border and stronger shadow for light mode clarity
              border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : 'none',
              boxShadow: theme.palette.mode === 'light' ? theme.shadows[3] : theme.shadows[4], // Use a standard MUI shadow
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: theme.palette.mode === 'light' ? theme.shadows[6] : theme.shadows[6]
              }
            }}>
              <CardContent>
                <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No appointments found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {authUser?.role === 'teacher' ? 'No appointments scheduled yet' : 'Book your first appointment to get started'}
                </Typography>
              </CardContent>
            </Card>
          ) : (
           <Box
          sx={{
            mt: 1,
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
              justifyContent: appointments.length <= 2 ? 'center' : 'space-between'
            }
          }}
        >
              {appointments.map((appt) => (
               <Card
                key={appt._id}
                sx={{
                  ...cardStyle,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  bgcolor: theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : theme.palette.common.white, // Keep background white for cards
                  color: 'text.primary',
                  position: 'relative',
                  // DEFINITELY more visible border and stronger shadow for light mode clarity
                  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : 'none',
                  boxShadow: theme.palette.mode === 'light' ? theme.shadows[3] : theme.shadows[4], // Use a standard MUI shadow
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: theme.palette.mode === 'light' ? theme.shadows[6] : theme.shadows[6]
                  }
                }}
              >
                    <CardContent sx={{ p: 3 }}>
                      {/* Status Chip */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                            color={getStatusChipColor(appt.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />

                          {/* Rejection Reason next to rejected status */}
                          {appt.status === 'rejected' && appt.rejectionReason && (
                            <Chip
                              label={appt.rejectionReason}
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{
                                fontStyle: 'italic',
                                maxWidth: '200px',
                                '& .MuiChip-label': {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }
                              }}
                            />
                          )}
                        </Box>

                        {/* Action Buttons */}
                        {appt.status === 'pending' && appt.teacher._id === authUser?._id && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleAccept(appt._id)}
                              sx={{
                                bgcolor: theme.palette.mode === 'dark'
                                  ? 'rgba(76, 175, 80, 0.1)'
                                  : 'rgba(76, 175, 80, 0.08)',
                                color: 'success.main',
                                '&:hover': {
                                  bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(76, 175, 80, 0.2)'
                                    : 'rgba(76, 175, 80, 0.12)'
                                }
                              }}
                            >
                              <Check fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => openReject(appt)}
                              sx={{
                                bgcolor: theme.palette.mode === 'dark'
                                  ? 'rgba(244, 67, 54, 0.1)'
                                  : 'rgba(244, 67, 54, 0.08)',
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(244, 67, 54, 0.2)'
                                    : 'rgba(244, 67, 54, 0.12)'
                                }
                              }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      {/* Participants */}
                      <Stack spacing={2}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                        {appt.student.profilePic && (
                          <img
                            src={appt.student.profilePic}
                            alt={`${appt.student.firstName} ${appt.student.lastName}'s profile`}
                            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Student
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {appt.student.firstName} {appt.student.lastName}
                          </Typography>
                        </Box>
                      </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           {appt.teacher.profilePic && (
                          <img
                            src={appt.teacher.profilePic}
                            alt={`${appt.teacher.firstName} ${appt.teacher.lastName}'s profile`}
                            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              Teacher
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {appt.teacher.firstName} {appt.teacher.lastName}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Time & Duration */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {new Date(appt.startTime).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(appt.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} • {appt.intervalMinutes} min
                            </Typography>
                          </Box>
                        </Box>

                        {/* Appointment Reason */}
                        {appt.appointmentReason && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                              Reason
                            </Typography>
                            <Typography variant="body2" sx={{
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : theme.palette.grey[100],
                              p: 1.5,
                              borderRadius: 1,
                              fontStyle: 'italic'
                            }}>
                              {appt.appointmentReason}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Booking Form Dialog - Only render if user is not a teacher */}
        {authUser?.role !== 'teacher' && (
          <Dialog
            open={showBookingForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 3 }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Book New Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Schedule a meeting with a teacher
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Teacher</InputLabel>
                    <Select
                      value={newAppt.teacher}
                      label="Teacher"
                      onChange={(e) => setNewAppt({ ...newAppt, teacher: e.target.value })}
                    >
                      {teachers.map((t) => (
                        <MenuItem key={t._id} value={t._id}>
                          {t.firstName} {t.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={newAppt.interval}
                      label="Duration"
                      onChange={(e) => setNewAppt({ ...newAppt, interval: e.target.value })}
                    >
                      {[15, 30, 60].map((i) => (
                        <MenuItem key={i} value={i}>{i} minutes</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <MobileDateTimePicker
                    label="Start Time"
                    value={newAppt.startTime}
                    onChange={(newValue) => setNewAppt({ ...newAppt, startTime: newValue })}
                    sx={{ width: '100%' }}
                    slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Appointment Reason"
                    value={newAppt.appointmentReason}
                    onChange={(e) => setNewAppt({ ...newAppt, appointmentReason: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Describe the purpose of this appointment..."
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={handleCloseForm}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleBookAppointment}
                startIcon={<AccessTime />}
                disabled={!newAppt.teacher || !newAppt.startTime || !newAppt.appointmentReason}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Rejection Dialog */}
        <Dialog
          open={!!rejecting}
          onClose={() => setRejecting(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>
            <Typography variant="h6">
              Reject Appointment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              with {rejecting?.student?.firstName} {rejecting?.student?.lastName}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Rejection (Optional)"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              variant="outlined"
              placeholder="Provide a reason for rejecting this appointment..."
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setRejecting(null)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              variant="contained"
              color="error"
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Reject Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}