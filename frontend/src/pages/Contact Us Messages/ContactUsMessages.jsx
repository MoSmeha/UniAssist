import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Collapse,
  Divider,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

const ContactUsMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const theme = useTheme();

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter((msg) => msg.category === selectedCategory));
    }
  }, [messages, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDeleteClick = (e, message) => {
    e.stopPropagation();
    setMessageToDelete(message);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      const response = await fetch(`/api/contact/${messageToDelete._id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete message');
      }
      setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete._id));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.message || 'An error occurred during deletion.');
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const handleToggleExpand = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const validCategories = ['bug', 'feedback and suggestions', 'feature request', 'help', 'other'];

  const renderCategoryChip = (category) => {
    const colors = {
      bug: { bg: '#FFEBEE', text: '#D32F2F' },
      'feature request': { bg: '#E3F2FD', text: '#1976D2' },
      'feedback and suggestions': { bg: '#E8F5E9', text: '#388E3C' },
      help: { bg: '#FFF3E0', text: '#F57C00' },
      other: { bg: '#F5F5F5', text: '#616161' },
    };

    const darkColors = {
      bug: { bg: '#7F0000', text: '#FFEBEE' },
      'feature request': { bg: '#0D47A1', text: '#E3F2FD' },
      'feedback and suggestions': { bg: '#1B5E20', text: '#E8F5E9' },
      help: { bg: '#E65100', text: '#FFF3E0' },
      other: { bg: '#424242', text: '#F5F5F5' },
    };

    const style = theme.palette.mode === 'dark' ? darkColors[category] || darkColors.other : colors[category] || colors.other;

    return (
      <Box
        component="span"
        sx={{
          backgroundColor: style.bg,
          color: style.text,
          padding: '2px 10px',
          borderRadius: '12px',
          fontWeight: 500,
          fontSize: { xs: '0.6rem', sm: '0.75rem' }, // Responsive font size for category chip
          textTransform: 'uppercase',
          flexShrink: 0,
        }}
      >
        {category}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar sx={{ paddingX: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Contact Messages
          </Typography>
          <FormControl variant="outlined" size="small">
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiSvgIcon-root': { color: 'white' },
                minWidth: 180,
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
                '& .MuiSelect-select': {
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : undefined,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {validCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Messages...</Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ m: 2, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {!loading && !error && filteredMessages.length === 0 && (
          <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
            No messages found.
          </Alert>
        )}

        <Box component="div" sx={{ p: { xs: 1, sm: 2 } }}> {/* Adjusted padding for responsiveness */}
          {filteredMessages.map((message) => {
            const isExpanded = expandedMessageId === message._id;
            return (
              <Box
                key={message._id}
                sx={{
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  mb: 1.5,
                  overflow: 'hidden',
                  bgcolor: theme.palette.background.paper,
                  transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Added box-shadow transition
                  boxShadow: theme.shadows[2], // Add a subtle shadow
                  '&:hover': {
                    boxShadow: theme.shadows[4], // Slightly stronger shadow on hover
                  },
                }}
              >
                <Box
                  onClick={() => handleToggleExpand(message._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: { xs: 1.5, sm: 2 }, // Responsive padding
                    cursor: 'pointer',
                    bgcolor: isExpanded ? theme.palette.action.selected : 'transparent',
                    '&:hover': {
                      bgcolor: isExpanded ? theme.palette.action.selected : theme.palette.action.hover,
                    },
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                >
                  {/* Left Group: Avatar, Name, Title, Category */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <Avatar
                      src={message.user?.profilePic}
                      alt={message.user?.firstName}
                      sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, mr: { xs: 1, sm: 2 }, flexShrink: 0 }} // Responsive Avatar size
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mr: { xs: 0.3, sm: 0.7 },
                        flexShrink: 0,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '0.65rem', sm: '1rem' } // Responsive font size
                      }}
                    >
                      {message.user ? `${message.user.firstName} ${message.user.lastName}` : 'Unknown User'}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, mr: { xs: 0.3, sm: 0.7}, flexShrink: 0, fontSize: { xs: '0.65rem', sm: '1rem' } }}>|</Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 500,
                        mr: { xs:0.3, sm: 0.7 },
                        fontSize: { xs: '0.65rem', sm: '1rem' } // Responsive font size
                      }}
                    >
                      {message.title}
                    </Typography>
                    {renderCategoryChip(message.category)}
                  </Box>

                  {/* Right Group: Date, Expand Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 }, flexShrink: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap', mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }} // Responsive font size
                    >
                      {new Date(message.createdAt).toLocaleDateString()}
                    </Typography>
                    <IconButton size="small" sx={{ color: theme.palette.action.active }}>
                      <KeyboardArrowDownIcon sx={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: theme.palette.background.default }}> {/* Responsive padding */}
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        color: theme.palette.text.primary,
                        textAlign: 'left',
                        mb: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Responsive font size for description
                      }}
                    >
                      {message.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => handleDeleteClick(e, message)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Dialog open={showDeleteConfirm} onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete the message titled "<b>{messageToDelete?.title}</b>" from{' '}
            <b>{messageToDelete?.user ? `${messageToDelete.user.firstName} ${messageToDelete.user.lastName}` : 'Unknown User'}</b>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactUsMessages;