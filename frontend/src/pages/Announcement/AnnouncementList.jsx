import React from 'react';
import {
  Typography,
  Box,
} from '@mui/material';
import AnnouncementCard from './AnnouncementCard';

const AnnouncementList = ({ announcements, authUser }) => {
  if (announcements.length === 0) {
    return (
      <Typography component="span" variant="body1" color="textSecondary" sx={{ my: 4, textAlign: 'center' }}>
        {authUser.role === 'student'
          ? 'No announcements available for you'
          : 'No announcements match your criteria'}
      </Typography>
    );
  }

  return (
    <Box>
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement._id} announcement={announcement} />
      ))}
    </Box>
  );
};

export default AnnouncementList;
