import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip"; // Import Chip

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

import { AccountPreview } from "@toolpad/core/Account";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

import { useAuthStore } from "./zustand/AuthStore";
import useLogout from "./hooks/useLogout";

import ChatApp from "./pages/ChatApp/ChatApp";
import SignUp from "./pages/signup/SignUp";
import ScheduleTable from "./pages/Schedule/ScheduleComponent";
import TODO from "./pages/TodoList/TodoList";
import StaffList from "./pages/StaffInfo/StaffList";
import Announcements from "./pages/Announcement/Announcements";
import ChatbotFrontend from "./Chatbot";
import LostAndFoundPage from "./pages/Lost&Found/LostAndFoundPage";

import NotesApp from "./pages/NoteApp/NotesApp";

import useConversationStore from "./zustand/useConversationStore";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Pages rendered based on route
const routes = {
  "/Chat": <ChatApp />,
  "/staffList": <StaffList />,
  "/Schedule": <ScheduleTable />,
  "/tools/checkList": <TODO />,
  "/tools/NoteApp": <NotesApp />,

  "/announcements": <Announcements />,
  "/tools/AIBot": <ChatbotFrontend />,
  "/SignUp": <SignUp />,
  "/Lost&Found": <LostAndFoundPage />,
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

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

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
              "&:hover": {
                color: "error.main",
              },
              opacity: 1,
            }}
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
}

SidebarFooterProfile.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function DashboardLayoutBasic({ window }) {
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;
  const authUser = useAuthStore((state) => state.authUser);

  const conversations = useConversationStore((state) => state.conversations);

  // Calculate total unread messages by summing unreadCount from all conversations
  const unreadChatMessages = conversations
    ? conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0)
    : 0;

  // Immutable navigation logic
  const baseNavigation = [
    { kind: "header", title: "Main items" },
    { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
    {
      segment: "Chat",
      title: "Chat",
      icon: <ChatIcon />,
      // Add the action property with a Chip component
      action:
        unreadChatMessages > 0 ? (
          <Chip label={unreadChatMessages} color="primary" size="small" />
        ) : null,
    },
    { segment: "staffList", title: "Staff List", icon: <RecentActorsIcon /> },
    {
      segment: "Lost&Found",
      title: "Lost & Found",
      icon: <DeviceUnknownIcon />,
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

  // Authenticated user session
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
      <DashboardLayout slots={{ sidebarFooter: SidebarFooterProfile }}>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
