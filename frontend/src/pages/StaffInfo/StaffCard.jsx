import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";

const StaffCard = ({ staffMember, lastIdx }) => {
  console.log(staffMember);
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            src={staffMember.profilePic}
            alt="user avatar"
            sx={{ bgcolor: "transparent" }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={`${staffMember.firstName} ${staffMember.lastName}`}
          secondary={
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Email: {staffMember.email}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Department: {staffMember.Department}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Role: {staffMember.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Schedule: {/* man3mel loop bel array */}
                {staffMember.schedule.map((entry) => entry.day).join(", ")}
              </Typography>
              {/* Add more fields as needed */}
            </>
          }
        />
      </ListItem>
      {!lastIdx && <Divider variant="inset" component="li" />}
    </>
  );
};

export default StaffCard;
