import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Divider,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReportIcon from "@mui/icons-material/Report";
import toast from "react-hot-toast";
import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import { useAuthStore } from "../../zustand/AuthStore";

const ItemCard = React.memo(function ItemCard({ item }) {
  const theme = useTheme();
  const { deleteItem, updateResolvedStatus } = useLostAndFoundStore();
  const authUser = useAuthStore((state) => state.authUser);
  const USER_ID = authUser?._id;
  const isOwner = USER_ID === item.postedBy._id;

  const [confirmOpen, setConfirmOpen] = useState(false);

  const timeAgo = item.createdAt
    ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
    : null;

  const handleDeleteConfirm = () => {
    deleteItem(item._id);
    setConfirmOpen(false);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleToggleResolved = () => {
    updateResolvedStatus(item._id, !item.resolved);
  };

  // Function for handling chat initiation
  const handleChat = async () => {
    try {
      const message =
        item.type === "lost"
          ? `Hey I found ${item.title}, text me!`
          : `Hey ${item.title} is my item, text me!`;

      const response = await fetch(`/api/lost-and-found/${item._id}/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to send notification");
      } else {
        toast.success("Notification sent to the item poster.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error sending notification. Please try again.");
    }
  };

  return (
    <>
      <Card
        elevation={4}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          bgcolor: "background.paper",
          color: "text.primary",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: theme.shadows[6],
          },
          position: "relative",

          maxWidth: 380,
        }}
      >
        <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={
              item.image ||
              "https://via.placeholder.com/400x200.png?text=No+Image"
            }
            alt={item.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.grey[100],
            }}
          />
          {/* Item Type Chip (Lost/Found) - Placed over image for prominence */}
          <Chip
            label={item.type}
            color={item.type === "lost" ? "error" : "success"}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              textTransform: "uppercase",
              fontWeight: "bold",
              borderRadius: 1,
            }}
          />
          {/* Resolved Chip - Also placed over image if resolved */}
          {item.resolved && (
            <Chip
              label="Resolved"
              color="success"
              icon={<CheckCircleOutlineIcon />}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: "bold",
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Stack spacing={1.5}>
            {/* Title */}
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 600, textAlign: "left", lineHeight: 1.3 }}
            >
              {item.title}
            </Typography>

            {/* Category, Location & Timestamp */}
            <Box display="flex" flexWrap="wrap" gap={2.5} mt={0.5}>
              <Box display="flex" alignItems="center">
                <CategoryIcon fontSize="small" color="info" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {item.category}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon
                  fontSize="small"
                  color="info"
                  sx={{ mr: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.location}
                </Typography>
              </Box>
              {timeAgo && (
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: "small", mr: 0.5 }} />
                  <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                    {timeAgo}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                minHeight: "2.8em",
                textAlign: "left",
                mt: 1.5,
              }}
            >
              {item.description}
            </Typography>

            {/* Poster Name and Chat Button (if not owner) */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between" // This will now correctly space items
              mt={2}
              sx={{ color: "text.secondary" }}
            >
              {/* This Box now only contains the avatar and name */}
              <Box display="flex" alignItems="center">
                <Avatar
                  src={item.postedBy.profilePic}
                  sx={{
                    width: 28,
                    height: 28,
                    mr: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.postedBy.firstName} {item.postedBy.lastName}
                </Typography>
              </Box>

              {/* The Chat Button is now a direct child of the outer Box */}
              {!isOwner && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleChat}
                  startIcon={<ReportIcon />}
                  size="small"
                  sx={{ textTransform: "none", borderRadius: 1 }}
                >
                  Notify
                </Button>
              )}
            </Box>

            {/* Phone Number */}
            {item.phoneNumber && (
              <Box display="flex" alignItems="center" mt={2}>
                <PhoneIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                <Link color="primary" variant="body2" sx={{ fontWeight: 500 }}>
                  {item.phoneNumber}
                </Link>
              </Box>
            )}
          </Stack>
        </CardContent>

        {/* Owner Actions */}
        {isOwner && (
          <>
            <Divider sx={{ mx: 2.5, my: 0 }} />
            <Box
              sx={{
                py: 1,
                px: 1.5,
                backgroundColor: theme.palette.action.hover,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                {!item.resolved && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleToggleResolved}
                    startIcon={<CheckCircleOutlineIcon />}
                    size="small"
                    sx={{ flexGrow: 1, textTransform: "none", borderRadius: 1 }}
                  >
                    Mark Resolved
                  </Button>
                )}
                {item.resolved && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleToggleResolved}
                    startIcon={<RadioButtonUncheckedIcon />}
                    size="small"
                    sx={{ flexGrow: 1, textTransform: "none", borderRadius: 1 }}
                  >
                    Unresolve
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                  size="small"
                  sx={{ flexGrow: 1, textTransform: "none", borderRadius: 1 }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDeleteConfirm}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ItemCard;
