import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getCategoryChipColor = (category) => {
  switch (category) {
    case 'Exam':
      return 'error';
    case 'Makeup Session':
      return 'warning';
    case 'Event':
      return 'info';
    case 'Other':
      return 'default';
    default:
      return 'default';
  }
};

const AnnouncementCard = React.memo(({ announcement }) => {
  return (
    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" width="100%">
          <Avatar
            src={announcement.sender.profilePic}
            alt={announcement.sender.firstName}
            sx={{ mr: 2, width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}
          />
          <Box flexGrow={1} textAlign="left">
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
            >
              {announcement.sender.firstName} {announcement.sender.lastName}
              <Typography
                component="span"
                variant="subtitle2"
                color="textSecondary"
                sx={{ ml: 1, fontSize: { xs: '0.5rem', sm: '0.85rem', md: '0.875rem' } }}
              >
                to {announcement.announcementType === 'subject' ? announcement.targetSubject : announcement.targetMajor}
              </Typography>
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                color="textPrimary"
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}
              >
                {announcement.title}
              </Typography>
              {announcement.category && (
                <Chip
                  label={announcement.category}
                  size="small"
                  color={getCategoryChipColor(announcement.category)}
                />
              )}
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ ml: 2, flexShrink: 0, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}
          >
            {formatDate(announcement.createdAt)}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          textAlign="left"
          variant="body2"
          paragraph
          sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
        >
          {announcement.content}
        </Typography>
        <Divider />
        <Box textAlign="left" mt={2}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.75rem' } }}
          >
            {announcement.sender.title} - {announcement.sender.Department}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default AnnouncementCard;
