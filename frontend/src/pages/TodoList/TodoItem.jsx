import { memo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit,
  Delete,
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import useTodoStore from '../../zustand/useTodoStore';

const TodoItem = ({ todo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const { handleToggleComplete, handleOpenForm, handleDelete } = useTodoStore();

  const priorityColors = {
    Top: {
      border: isDarkMode ? theme.palette.error.dark : theme.palette.error.main,
      chip: isDarkMode ? theme.palette.error.dark : theme.palette.error.light,
    },
    Moderate: {
      border: isDarkMode
        ? theme.palette.warning.dark
        : theme.palette.warning.main,
      chip: isDarkMode
        ? theme.palette.warning.dark
        : theme.palette.warning.light,
    },
    Low: {
      border: isDarkMode
        ? theme.palette.success.dark
        : theme.palette.success.main,
      chip: isDarkMode
        ? theme.palette.success.dark
        : theme.palette.success.light,
    },
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s',
        opacity: todo.completed ? 0.6 : 1,
        borderTop: `4px solid ${
          priorityColors[todo.priority]?.border || 'transparent'
        }`,
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Accordion
        disableGutters
        sx={{
          '& .MuiAccordionSummary-root': {
            minHeight: 64,
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper': {
              transform: 'none',
              mr: 1,
            },
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
          },
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
            alignItems: 'center',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${todo._id}-content`}
          id={`panel-${todo._id}-header`}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleComplete(todo._id, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                flex: 1,
                textDecoration: todo.completed
                  ? 'line-through'
                  : 'none',
                color: todo.completed
                  ? 'text.secondary'
                  : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {todo.title}
            </Typography>
            <Chip
              label={todo.priority}
              size="small"
              sx={{
                backgroundColor:
                  priorityColors[todo.priority]?.chip ||
                  'transparent',
                color: theme.palette.getContrastText(
                  priorityColors[todo.priority]?.chip || '#ffffff'
                ),
                fontWeight: 500,
                height: 24,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                ml: { xs: 0, sm: 2 },
                mt: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
              }}
            >
              <EventIcon fontSize="small" color="action" />
              <Typography
                variant="caption"
                sx={{ whiteSpace: 'nowrap' }}
              >
                {dayjs(todo.date).format('MMM DD, YYYY')}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <Divider />

        <AccordionDetails sx={{ textAlign: 'left', p: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontStyle: 'italic',
              color: 'grey.600',
              display: 'block',
              mb: 1,
            }}
          >
            {todo.startTime && todo.endTime
              ? `${dayjs(todo.startTime, 'HH:mm').format(
                  'h:mm A'
                )} - ${dayjs(todo.endTime, 'HH:mm').format('h:mm A')}`
              : 'Time not specified'}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 2, mt: 1, whiteSpace: 'pre-line' }}
          >
            {todo.description || 'No description provided.'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => handleOpenForm(true, todo)}
            >
              {isMobile ? '' : 'Edit'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleDelete(todo._id)}
            >
              {isMobile ? '' : 'Delete'}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default memo(TodoItem);
