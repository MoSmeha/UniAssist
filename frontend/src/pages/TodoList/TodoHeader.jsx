import { memo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  TaskAlt as TaskIcon,
} from '@mui/icons-material';
import useTodoStore from '../../zustand/useTodoStore';

const TodoHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    todos,
    priorityFilter,
    setPriorityFilter,
    handleOpenForm,
  } = useTodoStore();

  const uncompletedCount = todos.filter((todo) => !todo.completed).length;

  return (
    <AppBar position="static" elevation={4} color="primary">
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          py: { xs: 1, sm: 1 },
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          My TODO List
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            flexWrap: 'wrap',
          }}
        >
          <Chip
            icon={<TaskIcon fontSize="small" />}
            label={
              <Typography variant="body2" fontWeight={700}>
                {uncompletedCount} Tasks
              </Typography>
            }
            sx={{
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.action.selected,
              '& .MuiChip-icon': {
                color: theme.palette.primary.contrastText,
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: 120, sm: 140 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.action.hover,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.divider,
                },
              },
              '& .MuiSelect-select': {
                paddingRight: '32px !important',
              },
            }}
          >
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Filter by priority' }}
              startAdornment={
                <FilterIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.text.secondary }}
                />
              }
              sx={{
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
                '& .MuiSelect-icon': {
                  color: theme.palette.text.secondary,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 0.5,
                    boxShadow: theme.shadows[3],
                    borderRadius: 1,
                  },
                },
              }}
            >
              <MenuItem value="All">All Priorities</MenuItem>
              <MenuItem value="Top">Top Priority</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Low">Low Priority</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => handleOpenForm()}
            startIcon={<AddIcon />}
            sx={{
              whiteSpace: 'nowrap',
              px: 2,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {isMobile ? '' : 'Add Task'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default memo(TodoHeader);
