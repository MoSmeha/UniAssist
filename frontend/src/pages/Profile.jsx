import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera,
  School,
  Work,
  AdminPanelSettings,
  EmojiEvents,
  Schedule,
  Timer,
  Upload
} from '@mui/icons-material';
import { useAuthStore } from '../zustand/AuthStore';

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const authUser = useAuthStore((state) => state.authUser);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Badge configurations for students
  const badgeConfig = {
    starter: { label: 'Focus Initiate', description: '5 sessions completed', color: '#4CAF50' },
    amateur: { label: 'Task Climber', description: '20 sessions completed', color: '#2196F3' },
    pro: { label: 'Flow Achiever', description: '50 sessions completed', color: '#FF9800' },
    master: { label: 'Deep Work Devotee', description: '100 sessions completed', color: '#9C27B0' },
    weekend_machine: { label: 'Weekend Warrior', description: 'Weekend session completed', color: '#F44336' }
  };

  useEffect(() => {
    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${authUser._id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/api/users/${authUser._id}/profile-pic`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUserData(prev => ({ ...prev, profilePic: data.profilePic }));
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getRoleIcon = (role) => {
    const iconProps = { sx: { fontSize: isSmallMobile ? 16 : 20 } };
    switch (role) {
      case 'student': return <School color="primary" {...iconProps} />;
      case 'teacher': return <Work color="secondary" {...iconProps} />;
      case 'admin': return <AdminPanelSettings color="error" {...iconProps} />;
      default: return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'primary';
      case 'teacher': return 'secondary';
      case 'admin': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box 
              display="flex" 
              alignItems="center" 
              gap={{ xs: 2, sm: 3 }}
              flexDirection={{ xs: 'column', sm: 'row' }}
              textAlign={{ xs: 'center', sm: 'left' }}
            >
              <Box position="relative">
                <Avatar
                  src={userData.profilePic}
                  sx={{ 
                    width: { xs: 80, sm: 100, md: 120 }, 
                    height: { xs: 80, sm: 100, md: 120 } 
                  }}
                >
                  {userData.firstName[0]}{userData.lastName[0]}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleProfilePicUpload}
                />
                <label htmlFor="profile-pic-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    disabled={uploading}
                  >
                    {uploading ? 
                      <CircularProgress size={isSmallMobile ? 14 : 16} color="inherit" /> : 
                      <PhotoCamera sx={{ fontSize: { xs: 14, sm: 16 } }} />
                    }
                  </IconButton>
                </label>
              </Box>
              
              <Box flex={1} width="100%">
                <Typography variant={isSmallMobile ? "h5" : "h4"} gutterBottom>
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  {getRoleIcon(userData.role)}
                  <Chip
                    label={userData.role.toUpperCase()}
                    color={getRoleColor(userData.role)}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  ID: {userData.uniId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {userData.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Department: {userData.Department}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Role-specific content */}
        <Grid item xs={12} md={8}>
          {/* Student-specific content */}
          {userData.role === 'student' && (
            <>
              <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant={isSmallMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                >
                  <School sx={{ fontSize: { xs: 18, sm: 24 } }} /> Academic Information
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  <strong>Major:</strong> {userData.major}
                </Typography>
              </Paper>

              {userData.badges && userData.badges.length > 0 && (
                <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant={isSmallMobile ? "subtitle1" : "h6"} 
                    gutterBottom 
                    display="flex" 
                    alignItems="center" 
                    gap={1}
                  >
                    <EmojiEvents sx={{ fontSize: { xs: 18, sm: 24 } }} /> Achievements
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {userData.badges.map((badge, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card sx={{ 
                          borderLeft: `4px solid ${badgeConfig[badge]?.color || '#ccc'}`,
                          height: '100%'
                        }}>
                          <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight="bold"
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            >
                              {badgeConfig[badge]?.label || badge}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {badgeConfig[badge]?.description || 'Achievement unlocked'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </>
          )}

          {/* Teacher-specific content */}
          {userData.role === 'teacher' && (
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isSmallMobile ? "subtitle1" : "h6"} 
                gutterBottom 
                display="flex" 
                alignItems="center" 
                gap={1}
              >
                <Work sx={{ fontSize: { xs: 18, sm: 24 } }} /> Professional Information
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                <strong>Title:</strong> {userData.title}
              </Typography>
            </Paper>
          )}

          {/* Admin-specific content */}
          {userData.role === 'admin' && (
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isSmallMobile ? "subtitle1" : "h6"} 
                gutterBottom 
                display="flex" 
                alignItems="center" 
                gap={1}
              >
                <AdminPanelSettings sx={{ fontSize: { xs: 18, sm: 24 } }} /> Administrative Information
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                <strong>Title:</strong> {userData.title}
              </Typography>
            </Paper>
          )}

          {/* Schedule */}
          {userData.schedule && userData.schedule.length > 0 && (
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={{ xs: 1, sm: 0 }}
              >
                <Typography 
                  variant={isSmallMobile ? "subtitle1" : "h6"} 
                  display="flex" 
                  alignItems="center" 
                  gap={1}
                >
                  <Schedule sx={{ fontSize: { xs: 18, sm: 24 } }} /> Weekly Schedule
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setScheduleOpen(true)}
                  startIcon={<Schedule sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                  size={isSmallMobile ? "small" : "medium"}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  View Full Schedule
                </Button>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {userData.schedule.length} classes scheduled this week
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Pomodoro Stats Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant={isSmallMobile ? "subtitle1" : "h6"} 
              gutterBottom 
              display="flex" 
              alignItems="center" 
              gap={1}
            >
              <Timer sx={{ fontSize: { xs: 18, sm: 24 } }} /> Pomodoro Statistics
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              <Box textAlign="center">
                <Typography 
                  variant={isSmallMobile ? "h4" : "h3"} 
                  color="primary.main" 
                  fontWeight="bold"
                >
                  {userData.pomodoroStats?.totalSessions || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Total Sessions
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography 
                  variant={isSmallMobile ? "h4" : "h3"} 
                  color="secondary.main" 
                  fontWeight="bold"
                >
                  {userData.pomodoroStats?.totalHours?.toFixed(1) || '0.0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Hours Focused
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Schedule Dialog */}
      <Dialog 
        open={scheduleOpen} 
        onClose={() => setScheduleOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isSmallMobile}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Weekly Schedule
        </DialogTitle>
        <DialogContent>
          {userData.schedule && userData.schedule.length > 0 ? (
            <TableContainer>
              <Table size={isSmallMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Day</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Subject</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Time</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Mode</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Room</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.schedule.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        {item.day}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        {item.subject}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.mode}
                          color={item.mode === 'online' ? 'primary' : 'secondary'}
                          size="small"
                          sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        {item.room}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              No schedule available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setScheduleOpen(false)}
            size={isSmallMobile ? "small" : "medium"}
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;