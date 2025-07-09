import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Card,
    CardContent,
    Alert,
    Tabs,
    Tab,
    Grid,
    Fab,
    Chip,
    Container,
    Paper,
    Stack,
    useTheme // Import useTheme hook
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Restaurant as RestaurantIcon,
    LocalCafe as CafeIcon,
    LunchDining as LunchIcon,
    Cake as CakeIcon,
    FitnessCenter as ProteinIcon,
    LocalFireDepartment as CaloriesIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../zustand/AuthStore';
import toast, { Toaster } from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CATEGORIES = {
    breakfast: { label: 'Breakfast', icon: CafeIcon, color: '#FF6B35' },
    lunch: { label: 'Lunch', icon: LunchIcon, color: '#4ECDC4' },
    dessert: { label: 'Dessert', icon: CakeIcon, color: '#E17055' }
};

export default function CafeteriaMenu() {
    const { authUser } = useAuthStore();
    const isAdmin = authUser?.role === 'admin';
    const theme = useTheme(); // Use the theme hook to access palette

    // State
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentItem, setCurrentItem] = useState({
        name: '',
        protein: '',
        calories: '',
        image: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Validation state
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        protein: '',
        calories: ''
    });

    // Delete confirmation
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        category: ''
    });

    // Fetch menu data
    useEffect(() => {
        fetchMenu(selectedDay);
    }, [selectedDay]);

    const fetchMenu = async (day) => {
        if (!day) return;
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/menu/${day}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setMenu(null);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to fetch menu for ${day}`);
                }
            } else {
                const data = await response.json();
                setMenu(data);
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Failed to load menu: ${err.message}`);
            setMenu(null);
        } finally {
            setLoading(false);
        }
    };

    // Dialog handlers
    const openItemDialog = (mode, category, item = null) => {
        setDialogMode(mode);
        setCurrentCategory(category);
        setCurrentItem(item ? {
            ...item,
            protein: item.protein !== undefined ? String(item.protein) : '',
            calories: item.calories !== undefined ? String(item.calories) : ''
        } : { name: '', protein: '', calories: '', image: '' });
        setValidationErrors({ name: '', protein: '', calories: '' });
        setOpenDialog(true);
    };

    const closeItemDialog = () => {
        setOpenDialog(false);
        setCurrentItem({ name: '', protein: '', calories: '', image: '' });
        setValidationErrors({ name: '', protein: '', calories: '' });
    };

    const validateNumericInput = (fieldName, value) => {
        let error = '';
        if (value.trim() === '') {
            error = 'This field cannot be empty.';
        } else if (isNaN(Number(value))) {
            error = 'Please enter a valid number.';
        } else if (Number(value) < 0) {
            error = 'Value cannot be negative.';
        }
        setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
        return error === '';
    };

    const validateNameInput = (value) => {
        let error = '';
        if (value.trim() === '') {
            error = 'Item name cannot be empty.';
        }
        setValidationErrors(prev => ({ ...prev, name: error }));
        return error === '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));

        if (name === 'protein' || name === 'calories') {
            validateNumericInput(name, value);
        } else if (name === 'name') {
            validateNameInput(value);
        }
    };

    const saveItem = async () => {
        const isNameValid = validateNameInput(currentItem.name);
        const isProteinValid = validateNumericInput('protein', currentItem.protein);
        const isCaloriesValid = validateNumericInput('calories', currentItem.calories);

        if (!isNameValid || !isProteinValid || !isCaloriesValid) {
            toast.error('Please correct the errors in the form.');
            return;
        }

        setIsSaving(true);
        setError('');

        const url = dialogMode === 'add'
            ? `/api/menu/${selectedDay}/${currentCategory}`
            : `/api/menu/${selectedDay}/${currentCategory}/${currentItem._id}`;

        const method = dialogMode === 'add' ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currentItem.name,
                    protein: Number(currentItem.protein),
                    calories: Number(currentItem.calories),
                    image: currentItem.image
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save item');
            }

            await fetchMenu(selectedDay);
            closeItemDialog();
            toast.success(`Item ${dialogMode === 'add' ? 'added' : 'updated'} successfully!`);
        } catch (err) {
            toast.error(`Error saving item: ${err.message}`);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteDialog = (category, item) => {
        setDeleteDialog({
            open: true,
            item,
            category
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, category: '' });
    };

    const deleteItem = async () => {
        const { category, item } = deleteDialog;

        setIsDeleting(true);
        setError('');

        try {
            const response = await fetch(`/api/menu/${selectedDay}/${category}/${item._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }

            await fetchMenu(selectedDay);
            closeDeleteDialog();
            toast.success(`"${item.name}" deleted successfully!`);
        } catch (err) {
            toast.error(`Error deleting item: ${err.message}`);
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    // Render food card
    const renderFoodCard = (item, category) => (
        <Card
            key={item._id} // This key is already correctly placed
            sx={{
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease-in-out'
            }}
        >
            {/* Admin actions */}
            {isAdmin && (
                <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    display: 'flex',
                    gap: 0.5
                }}>
                    <IconButton
                        size="small"
                        onClick={() => openItemDialog('edit', category, item)}
                        sx={{
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            '&:hover': {
                                bgcolor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => openDeleteDialog(category, item)}
                        sx={{
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.error.main,
                            '&:hover': {
                                bgcolor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            {/* Food image */}
            {item.image && (
                <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            )}

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {item.name}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                        icon={<ProteinIcon />}
                        label={`${item.protein || 0}g`}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                    <Chip
                        icon={<CaloriesIcon />}
                        label={`${item.calories || 0} cal`}
                        size="small"
                        variant="outlined"
                        color="warning"
                    />
                </Stack>
            </CardContent>
        </Card>
    );

    // Render category section
    const renderCategory = (categoryKey) => {
        const category = CATEGORIES[categoryKey];
        const items = menu?.[categoryKey] || [];
        const IconComponent = category.icon;

        return (
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconComponent sx={{ color: category.color, fontSize: 28 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {category.label}
                        </Typography>
                    </Box>

                    {isAdmin && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => openItemDialog('add', categoryKey)}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none'
                            }}
                        >
                            Add
                        </Button>
                    )}
                </Box>

                {items.length > 0 ? (
                    <Grid container spacing={2}>
                        {items.map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                {renderFoodCard(item, categoryKey)}
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            border: '2px dashed',
                            borderColor: 'grey.300'
                        }}
                    >
                        <IconComponent sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                            No {category.label.toLowerCase()} items yet
                        </Typography>
                        {isAdmin && (
                            <Typography variant="body2" color="text.disabled">
                                Click "Add" to create the first item
                            </Typography>
                        )}
                    </Paper>
                )}
            </Box>
        );
    };

    const isSaveDisabled =
        isSaving ||
        !currentItem.name.trim() ||
        !!validationErrors.name ||
        !!validationErrors.protein ||
        !!validationErrors.calories;

    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            <Toaster position="top-center" reverseOrder={false} />

            {/* Day selector - Centered */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4
            }}>
                <Tabs
                    value={selectedDay}
                    onChange={(e, value) => setSelectedDay(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        maxWidth: '100%',
                        '& .MuiTabs-flexContainer': {
                            gap: { xs: 0, sm: 1 }
                        }
                    }}
                >
                    {DAYS.map(day => (
                        <Tab
                            key={day} // Key for each Tab
                            label={day}
                            value={day}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                minWidth: { xs: 'auto', sm: 120 },
                                px: { xs: 1, sm: 2 }
                            }}
                        />
                    ))}
                </Tabs>
            </Box>


            {/* Loading state for main menu */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading menu...
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Menu content */}
            {!loading && menu && (
                <Box>
                    {/* Add key to the Box returned by renderCategory */}
                    {Object.keys(CATEGORIES).map(categoryKey =>
                        <Box key={categoryKey}> {/* THIS IS THE KEY ADDITION */}
                            {renderCategory(categoryKey)}
                        </Box>
                    )}
                </Box>
            )}

            {/* Empty state for the selected day */}
            {!loading && !menu && selectedDay && (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <RestaurantIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        No menu available for {selectedDay}
                    </Typography>
                    <Typography color="text.secondary">
                        {isAdmin ? `Click "Add" in any category to create the first item for ${selectedDay}.` : `The menu for ${selectedDay} has not been set yet.`}
                    </Typography>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={async () => {
                                try {
                                    const response = await fetch('/api/menu', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ day: selectedDay })
                                    });
                                    if (!response.ok) {
                                        const errorData = await response.json();
                                        throw new Error(errorData.message || 'Failed to create empty menu for the day');
                                    }
                                    toast.success(`Empty menu created for ${selectedDay}!`);
                                    await fetchMenu(selectedDay);
                                } catch (err) {
                                    toast.error(`Error creating menu: ${err.message}`);
                                }
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? <CircularProgress size={20} color="inherit" /> : `Create Menu for ${selectedDay}`}
                        </Button>
                    )}
                </Paper>
            )}


            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={closeItemDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle>
                    {dialogMode === 'add' ? 'Add New Item' : 'Edit Item'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 2 }}>
                        <TextField
                            label="Item Name"
                            name="name"
                            fullWidth
                            value={currentItem.name}
                            onChange={handleInputChange}
                            autoFocus
                            error={!!validationErrors.name}
                            helperText={validationErrors.name}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Protein (g)"
                                type="text"
                                name="protein"
                                value={currentItem.protein}
                                onChange={handleInputChange}
                                sx={{ flex: 1 }}
                                error={!!validationErrors.protein}
                                helperText={validationErrors.protein}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                            <TextField
                                label="Calories"
                                type="text"
                                name="calories"
                                value={currentItem.calories}
                                onChange={handleInputChange}
                                sx={{ flex: 1 }}
                                error={!!validationErrors.calories}
                                helperText={validationErrors.calories}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                        </Box>

                        <TextField
                            label="Image URL"
                            name="image"
                            fullWidth
                            value={currentItem.image}
                            onChange={handleInputChange}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeItemDialog} disabled={isSaving}>Cancel</Button>
                    <Button
                        onClick={saveItem}
                        variant="contained"
                        disabled={isSaveDisabled}
                    >
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : (dialogMode === 'add' ? 'Add' : 'Save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{deleteDialog.item?.name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</Button>
                    <Button
                        onClick={deleteItem}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}