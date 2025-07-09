import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  Fade,
  Zoom,
  Slide,
  Button
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ContactForm from './ContactForm';
import { styled, keyframes } from '@mui/material/styles';

// Advanced animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-20px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(25, 118, 210, 0.6);
    transform: scale(1.02);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.info.main}, ${theme.palette.primary.light})`,
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 15s ease infinite`,
  color: 'white',
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '92.5vh',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: `${floatAnimation} 20s ease-in-out infinite`,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
    minHeight: '93vh',
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: `linear-gradient(45deg, ${theme.palette.primary.light}20, ${theme.palette.info.light}20)`,
  animation: `${floatAnimation} 10s ease-in-out infinite`,
  zIndex: 0,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  borderRadius: theme.spacing(3),
  border: `2px solid ${theme.palette.primary.main}20`,
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? theme.shadows[8]
    : theme.shadows[3],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 20px 40px ${theme.palette.primary.main}40`
      : `0 20px 40px ${theme.palette.primary.main}30`,
    borderColor: theme.palette.primary.main,
    '&::before': {
      left: '100%',
    },
    '& .feature-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      color: theme.palette.primary.main,
    },
    '& .feature-chip': {
      transform: 'scale(1.05)',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '&:hover': {
      transform: 'translateY(-8px) scale(1.01)',
    },
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: 56,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 80,
  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  filter: `drop-shadow(0 4px 8px ${theme.palette.primary.main}40)`,
}));

const GlowingChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  transition: 'all 0.3s ease',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
    zIndex: -1,
    animation: `${pulseGlow} 2s ease-in-out infinite`,
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(45deg, #ffffff, ${theme.palette.grey[300]})`
    : `linear-gradient(45deg, #ffffff, ${theme.palette.grey[200]})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.info.light}, transparent)`,
    borderRadius: '2px',
  },
}));

const features = [
  {
    name: 'ChatApp',
    description: 'Connect with fellow students and staff instantly with real-time messaging.',
    icon: <ChatBubbleOutlineIcon />,
    badge: 'Popular',
    color: 'primary',
  },
  {
    name: 'Lost & Found',
    description: 'Easily report or find lost items on campus with smart matching.',
    icon: <FindInPageIcon />,
    badge: 'New',
    color: 'info',
  },
  {
    name: 'Staff Directory',
    description: 'Access comprehensive directory with contact info and office hours.',
    icon: <GroupIcon />,
    badge: 'Essential',
    color: 'primary',
  },
  {
    name: 'Appointments',
    description: 'Schedule and manage meetings with teachers effortlessly.',
    icon: <EventIcon />,
    badge: 'Smart',
    color: 'info',
  },
  {
    name: 'Announcements',
    description: 'Stay updated with events, exams, and important notices.',
    icon: <CampaignIcon />,
    badge: 'Live',
    color: 'primary',
  },
  {
    name: 'AI Assistant',
    description: 'Get instant answers to your frequently asked questions.',
    icon: <HelpOutlineIcon />,
    badge: 'AI-Powered',
    color: 'info',
  },
  {
    name: 'Cafeteria Menu',
    description: 'View daily menus, nutrition info, and special offerings.',
    icon: <RestaurantMenuIcon />,
    badge: 'Daily',
    color: 'primary',
  },
  {
    name: 'Study Tools',
    description: 'Pomodoro timer, note-taking, and todo lists for productivity.',
    icon: <BuildIcon />,
    badge: 'Pro',
    color: 'info',
  },
];
const UniAssistLandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false); // This state will control the dialog's open/close

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleOpenForm = () => { // Function to open the dialog
    setShowForm(true);
  };

  const handleCloseForm = () => { // Function to close the dialog
    setShowForm(false);
  };

  return (
    <Box sx={{ flexGrow: 1, overflowX: 'hidden' }}>
      {/* Hero Section */}
      <HeroSection >
        <FloatingElement sx={{ top: '10%', left: '10%', animationDelay: '0s' }} />
        <FloatingElement sx={{ top: '20%', right: '15%', animationDelay: '2s' }} />
        <FloatingElement sx={{ bottom: '15%', left: '20%', animationDelay: '4s' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in={visible} timeout={1000}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  animation: `${floatAnimation} 6s ease-in-out infinite`,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <SchoolIcon sx={{ fontSize: { xs: 60, md: 80 }, filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))' }} />
              </Box>
              <HeroTitle variant={isMobile ? 'h3' : 'h2'} component="h1">
                UniAssist
              </HeroTitle>
            </Box>
          </Fade>

          <Slide direction="up" in={visible} timeout={1200}>
            <HeroTitle variant={isMobile ? 'h4' : 'h3'} component="h2" gutterBottom sx={{ mb: 3 }}>
              Your Ultimate University Companion
            </HeroTitle>
          </Slide>

          <Fade in={visible} timeout={1500}>
            <Box sx={{ mb: 4, opacity: 0.95 }}>
              <Typography variant={isMobile ? 'h6' : 'h5'} component="p" gutterBottom>
                UniAssist is designed to streamline your university life, connecting you with resources, people, and tools you need to succeed.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleOpenForm} // Call handleOpenForm to set showForm to true
                sx={{ mt: 2, borderRadius: 2, px: 4 }}
              >
                Contact Us
              </Button>
            </Box>
          </Fade>

          <ContactForm
            open={showForm}      // Pass the showForm state to the 'open' prop
            onClose={handleCloseForm} // Pass the closing function to 'onClose'
          />
        </Container>
      </HeroSection>

      <Box sx={{ py: 8, px: { xs: 2, md: 8, lg: 12 } }}>
          <Slide direction="up" in={visible} timeout={800}>
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 700,
                color: 'primary.main',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                  borderRadius: '2px',
                },
              }}
            >
              Features
            </Typography>
          </Slide>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Zoom in={visible} timeout={600 + index * 100} style={{ transitionDelay: `${index * 100}ms` }}>
                  <FeatureCard elevation={6}>
                    <GlowingChip
                      label={feature.badge}
                      size="small"
                      className="feature-chip"
                      color={feature.color}
                    />
                    <CardContent sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                    }}>
                      <FeatureIcon className="feature-icon">
                        {feature.icon}
                      </FeatureIcon>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                          mb: 2,
                        }}
                      >
                        {feature.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 5,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={visible} timeout={2000}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                © {new Date().getFullYear()} UniAssist. All rights reserved.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Made with ❤️ for students
                <TrendingUpIcon sx={{ ml: 1, fontSize: 18 }} />
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default UniAssistLandingPage;