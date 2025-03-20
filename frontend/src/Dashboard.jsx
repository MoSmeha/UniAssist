import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import ChecklistIcon from "@mui/icons-material/Checklist";
import LogoutIcon from "@mui/icons-material/Logout";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ConstructionIcon from "@mui/icons-material/Construction";
import LayersIcon from "@mui/icons-material/Layers";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import { AccountPreview } from "@toolpad/core/Account";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useAuthStore } from "./zustand/AuthStore";
import useLogout from "./hooks/useLogout";
import ChatApp from "./pages/ChatApp/ChatApp";
import LogoutPage from "./LogoutPage";
import ScheduleTable from "./pages/Schedule/ScheduleComponent";
import TODO from "./TodoList";
import StaffList from "./pages/StaffInfo/StaffList";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "Chat",
    title: "Chat",
    icon: <ChatIcon />,
  },
  {
    segment: "staffList",
    title: "Staff List",
    icon: <RecentActorsIcon />,
  },
  {
    segment: "Schedule",
    title: "Schedule",
    icon: <DateRangeIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Student Tools",
  },
  {
    segment: "tools",
    title: "Tools",
    icon: <ConstructionIcon />,
    children: [
      {
        segment: "checkList",
        title: "checkList",
        icon: <ChecklistIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
  {
    segment: "Logout",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

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

const routes = {
  "/Chat": <ChatApp />,
  "/Logout": <LogoutPage />,
  "/staffList": <StaffList />,
  "/Schedule": <ScheduleTable />,
  "/tools/checkList": <TODO />,
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
          // transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1)",
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

              // Add fade-in effect
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

function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  // Get the authenticated user from your Zustand store
  const authUser = useAuthStore((state) => state.authUser);

  // Create a session object using the real user data
  const userSession = authUser
    ? {
        user: {
          name: authUser.firstName + " " + authUser.lastName || "Guest User",
          email: authUser.email || "guest@example.com",
          image: authUser.profilePic || "https://via.placeholder.com/40", // Fallback image
        },
      }
    : {
        // Fallback user if authUser is null
        user: {
          name: "Guest User",
          email: "guest@example.com",
          image: "https://via.placeholder.com/40",
        },
      };

  // React to auth changes
  React.useEffect(() => {
    // You could add additional logic here if needed
    if (!authUser && router.pathname !== "/login") {
      console.log("User not authenticated");
    }
  }, [authUser, router]);

  return (
    <AppProvider
      navigation={NAVIGATION}
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
