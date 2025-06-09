import { useLostAndFoundStore } from "../../zustand/useLostFoundstore";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";

// This is a placeholder. In a real app, you'd get this from your auth context.
const MOCK_USER_ID = "current_user_id_from_auth"; // <-- REPLACE WITH ACTUAL LOGGED-IN USER ID

const ItemCard = ({ item }) => {
  const { deleteItem, updateResolvedStatus } = useLostAndFoundStore();

  // Replace this with your actual user from your auth hook/context
  // const { user } = useAuth();
  // const isOwner = user?.id === item.postedBy._id;
  const isOwner = MOCK_USER_ID === item.postedBy._id; // Using mock for example

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item._id);
    }
  };

  const handleToggleResolved = () => {
    updateResolvedStatus(item._id, !item.resolved);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="160"
        image={
          item.image || "https://via.placeholder.com/300x160.png?text=No+Image"
        }
        alt={item.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6" component="div" gutterBottom>
            {item.title}
          </Typography>
          <Chip
            label={item.type}
            color={item.type === "lost" ? "error" : "success"}
            size="small"
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {item.description}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          Category: {item.category}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Location: {item.location}
        </Typography>

        <Box display="flex" alignItems="center" mt={2}>
          <Avatar
            src={item.postedBy.profilePic}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {item.postedBy.firstName} {item.postedBy.lastName}
          </Typography>
        </Box>

        {item.resolved && (
          <Chip label="Resolved" color="default" size="small" sx={{ mt: 2 }} />
        )}
      </CardContent>
      {isOwner && (
        <Box sx={{ p: 1, display: "flex", justifyContent: "space-around" }}>
          <Button size="small" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
          <Tooltip
            title={item.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
          >
            <Button size="small" onClick={handleToggleResolved}>
              {item.resolved ? "Unresolve" : "Resolve"}
            </Button>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default ItemCard;
