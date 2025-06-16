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
} from '@mui/material';
import { AccessTime, Check, Clear, AddCircleOutline, Schedule } from '@mui/icons-material';
import { useAuthStore } from '../../zustand/AuthStore';
import { useAppointmentStore } from '../../zustand/useAppointmentStore';

// Date picker imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

export default function AppointmentManager() {
  const theme = useTheme();
  
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Top App Bar */}
        <AppBar position="static" elevation={0} sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white', 
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" component="h1" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Appointment Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => setShowBookingForm(true)}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 1,
                '&:hover': { boxShadow: 2 }
              }}
            >
              Book New Appointment
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          {/* Appointments Grid */}
          {appointments.length === 0 ? (
            <Card sx={{ mt: 3, textAlign: 'center', py: 6 }}>
              <CardContent>
                <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No appointments found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Book your first appointment to get started
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {appointments.map((appt) => (
                <Grid item xs={12} sm={6} lg={4} key={appt._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 2px 8px rgba(0,0,0,0.3)' 
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: theme.palette.mode === 'dark' 
                          ? '0 4px 16px rgba(0,0,0,0.4)' 
                          : '0 4px 16px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)'
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
                            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} // Example styling
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
                            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} // Example styling
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
                                : 'grey.50', 
                              p: 1.5, 
                              borderRadius: 1,
                              fontStyle: 'italic'
                            }}>
                              {appt.appointmentReason}
                            </Typography>
                          </Box>
                        )}

                        {/* Rejection Reason - removed from here since it's now next to status */}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Booking Form Dialog */}
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
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
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
            <Typography variant="h6" component="h2">
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