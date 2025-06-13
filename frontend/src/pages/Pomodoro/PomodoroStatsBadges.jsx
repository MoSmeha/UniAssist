// PomodoroStatsBadges.jsx
import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import { MilitaryTech as MilitaryTechIcon } from "@mui/icons-material";

import FirstSessionBadgeSvg from "./Crown-Book.png";
import FiveSessionsBadgeSvg from "./Crown-Book.png";

const badgeImagePaths = {
  first_session: FirstSessionBadgeSvg,
  five_sessions: FiveSessionsBadgeSvg,
};

const PomodoroStatsBadges = ({ pomodoroStats, allBadges }) => {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-around", flexWrap: "wrap", py: 1 }}>
        {/* Pomodoro Stats Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
            my: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "white" }}>
              Sessions: <strong>{pomodoroStats.totalSessions}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              Hours: <strong>{pomodoroStats.totalHours.toFixed(2)}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Badges Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
            my: 1,
          }}
        >
          {allBadges.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "white", fontStyle: "italic" }}
            >
              No badges earned yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {allBadges.map((badgeId, index) => {
                const badgeSrc = badgeImagePaths[badgeId];
                if (badgeSrc) {
                  return (
                    <img
                      key={index}
                      src={badgeSrc}
                      alt={`${badgeId.replace(/_/g, " ").toUpperCase()} Badge`}
                      style={{
                        width: 24,
                        height: 24,
                        verticalAlign: "middle",
                      }}
                      title={badgeId.replace(/_/g, " ").toUpperCase()}
                    />
                  );
                } else {
                  return (
                    <MilitaryTechIcon
                      key={index}
                      sx={{ color: "gold" }}
                      titleAccess={badgeId.replace(/_/g, " ").toUpperCase()}
                    />
                  );
                }
              })}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PomodoroStatsBadges;
