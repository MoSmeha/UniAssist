import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import ChecklistIcon from "@mui/icons-material/Checklist";
import InputIcon from "@mui/icons-material/Input";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ConstructionIcon from "@mui/icons-material/Construction";
import LayersIcon from "@mui/icons-material/Layers";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import AssistantIcon from "@mui/icons-material/Assistant";
import ClassIcon from "@mui/icons-material/Class";
import TimerIcon from "@mui/icons-material/Timer";
import TodayIcon from '@mui/icons-material/Today';
import Badge from "@mui/material/Badge";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

import { AccountPreview } from "@toolpad/core/Account";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout, ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

import { useAuthStore } from "./zustand/AuthStore";
import useLogout from "./hooks/useLogout";
import useConversationStore from "./zustand/useConversationStore";

import ChatApp from "./pages/ChatApp/ChatApp";
import SignUp from "./pages/signup/SignUp";
import ScheduleTable from "./pages/Schedule/ScheduleComponent";
import TODO from "./pages/TodoList/TodoList";
import StaffList from "./pages/StaffInfo/StaffList";
import Announcements from "./pages/Announcement/Announcements";
import ChatbotFrontend from "./pages/Chatbot/Chatbot";
import LostAndFoundPage from "./pages/Lost&Found/LostAndFoundPage";
import PomodoroTimer from "./pages/Pomodoro/Pomodoro";
import NotesApp from "./pages/NoteApp/NotesApp";
import AppointmentManager from "./pages/Appointment/Appointment";

import React from "react";
import { useSocketStore } from "./zustand/SocketStore";
const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

const routes = {
  "/Chat": <ChatApp />,
  "/staffList": <StaffList />,
  "/Schedule": <ScheduleTable />,
  "/tools/checkList": <TODO />,
  "/tools/NoteApp": <NotesApp />,
  "/tools/Pomodoro": <PomodoroTimer />,
  "/announcements": <Announcements />,
  "/tools/AIBot": <ChatbotFrontend />,
  "/SignUp": <SignUp />,
  "/LostandFound": <LostAndFoundPage />,
  "/appointmentBooking" : <AppointmentManager/>
};

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      {routes[pathname] || (
        <Typography>Dashboard content for {pathname}</Typography>
      )}
    </Box>
  );
}
DemoPageContent.propTypes = { pathname: PropTypes.string.isRequired };

function SidebarFooterProfile({ mini }) {
  const { logout, loading } = useLogout();

  return (
    <Stack direction="column" p={0}>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          "& .MuiAvatar-root": {
            transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "& .MuiTypography-root": {
            transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
      >
        <Box flexGrow={1}>
          <AccountPreview variant={mini ? "condensed" : "expanded"} />
        </Box>
        {!mini && (
          <IconButton
            aria-label="logout"
            onClick={logout}
            disabled={loading}
            sx={{
              mr: 1,
              color: "text.secondary",
              "&:hover": { color: "error.main" },
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
}
SidebarFooterProfile.propTypes = { mini: PropTypes.bool.isRequired };

// Somewhere at top:


function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const notifications    = useSocketStore((s) => s.notifications);
  const { markAllRead }  = useSocketStore((s) => s.actions);

  // only count unread
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);

    // as soon as menu opens, mark everything read
    markAllRead();
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} size="large">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length === 0 && (
          <MenuItem onClick={handleClose}>No notifications</MenuItem>
        )}
        {notifications.map((note, i) => {
  const { markOneRead } = useSocketStore.getState().actions;
  const handleNotificationClick = () => {
    markOneRead(note._id);
    handleClose();
  };

  // Fallback for sender
  const senderName = note.sender?.firstName;
  const hasSender = Boolean(senderName);
  const isSystem = !hasSender;
  const titleLine = hasSender
    ? `${senderName} to ${note.data?.category || "notifications"}`
    : "System Notification";

  return (
    <MenuItem
      key={i}
      onClick={handleNotificationClick}
      sx={{
        backgroundColor: note.read ? "grey.100" : "inherit",
        fontWeight: note.read ? "normal" : "bold",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0.3,
        minWidth: 250,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {hasSender ? (
          <Avatar
            src={note.sender.profilePic || ""}
            alt={senderName}
            sx={{ width: 30, height: 30 }}
          />
        ) : (
          <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.main" }}>
            S
          </Avatar>
        )}

        <Typography variant="body2" fontWeight="bold" noWrap>
          {titleLine}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          ml: 5,
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {note.message || note.data?.title || "New notification"}
      </Typography>
    </MenuItem>
  );
})}
      </Menu>
    </>
  );
}

// Updated component for toolbar actions - AccountPreview removed
function ToolbarActionsWithNotifications() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <NotificationsMenu />
      <ThemeSwitcher />
    </Stack>
  );
}

function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;
  const authUser = useAuthStore((state) => state.authUser);
  const conversations = useConversationStore((state) => state.conversations);
  const unreadChatMessages = conversations
    ? conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    : 0;

  const baseNavigation = [
    { kind: "header", title: "Main items" },
    { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
    {
      segment: "Chat",
      title: "Chat",
      icon: <ChatIcon />,
      action:
        unreadChatMessages > 0 ? (
          <Chip label={unreadChatMessages} color="primary" size="small" />
        ) : null,
    },
    { segment: "staffList", title: "Staff List", icon: <RecentActorsIcon /> },
    {
      segment: "LostandFound",
      title: "Lost & Found",
      icon: <DeviceUnknownIcon />,
    },
    {
      segment: "appointmentBooking",
      title: "Appointments",
      icon: <TodayIcon />,
    },
    { segment: "Schedule", title: "Schedule", icon: <DateRangeIcon /> },
    {
      segment: "announcements",
      title: "Announcements",
      icon: <AnnouncementIcon />,
    },
    { kind: "divider" },
    { kind: "header", title: "Student Tools" },
    {
      segment: "tools",
      title: "Tools",
      icon: <ConstructionIcon />,
      children: [
        { segment: "checkList", title: "Checklist", icon: <ChecklistIcon /> },
        { segment: "AIBot", title: "AI ChatBot", icon: <AssistantIcon /> },
        { segment: "NoteApp", title: "Note App", icon: <ClassIcon /> },
        { segment: "Pomodoro", title: "Pomodoro", icon: <TimerIcon /> },
      ],
    },
    { kind: "divider" },
    { kind: "header", title: "Analytics" },
    { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
  ];

  const adminNavigation =
    authUser?.role === "admin"
      ? [{ segment: "SignUp", title: "SignUp", icon: <InputIcon /> }]
      : [];

  const navigation = [...baseNavigation, ...adminNavigation];

  const userSession = {
    user: {
      name:
        authUser?.firstName && authUser?.lastName
          ? `${authUser.firstName} ${authUser.lastName}`
          : "Guest User",
      email: authUser?.email || "guest@example.com",
      image: authUser?.profilePic || "https://via.placeholder.com/40",
    },
  };

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        logo: (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuWGq9FqPVwCUcNC30i5iPXnaNKGWGruCs5Q&s"
            alt="UniAssist"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ),
        title: "UniAssist",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={userSession}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: SidebarFooterProfile,
          // Use toolbarActions to control the order of items in the toolbar
          toolbarActions: ToolbarActionsWithNotifications,
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;