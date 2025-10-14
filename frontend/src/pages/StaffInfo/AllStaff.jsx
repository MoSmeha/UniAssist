import { memo, useEffect } from 'react';
import { List, Box, CircularProgress, Typography } from "@mui/material";
import useStaffStore from "../../zustand/useStaffStore";
import StaffCard from "./StaffCard";

const AllStaff = () => {
  const {
    staff,
    loading,
    searchTerm,
    fetchStaff
  } = useStaffStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Filter conversations based on searchTerm
  const fitlteredUsers = searchTerm
    ? staff.filter((conversation) => {
        const fullName = `${conversation.firstName} ${conversation.lastName}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : staff;

  return (
    <Box sx={{ width: "100%" }}>
      {fitlteredUsers.length === 0 && !loading && searchTerm && (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          No users found matching "{searchTerm}"
        </Typography>
      )}

      <List>
        {fitlteredUsers.map((staffMember, idx) => (
          <StaffCard
            key={staffMember._id}
            staffMember={staffMember}
            lastIdx={idx === fitlteredUsers.length - 1}
          />
        ))}
      </List>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default memo(AllStaff);