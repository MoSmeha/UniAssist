// PomodoroTimer.jsx
import React from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Replay as ReplayIcon,
  SkipNext as SkipNextIcon,
} from "@mui/icons-material";

// Custom Circular Timer Component (moved directly into this file or kept separate)
const CircularTimer = ({
  minutes,
  seconds,
  totalMinutes,
  currentMode,
  isActive,
}) => {
  const totalSeconds = totalMinutes * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  const radius = 120;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (min, sec) => {
    const formattedMinutes = String(min).padStart(2, "0");
    const formattedSeconds = String(sec).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const getTimerColor = () => {
    if (currentMode === "work") return "#1976d2"; // Blue for work
    if (currentMode === "shortBreak") return "#4caf50"; // Green for short break
    return "#ff9800"; // Orange for other modes (if any)
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: radius * 2 + strokeWidth * 4,
        height: radius * 2 + strokeWidth * 4,
        margin: "0 auto",
      }}
    >
      <svg
        height={radius * 2 + strokeWidth * 4}
        width={radius * 2 + strokeWidth * 4}
        style={{
          transform: "rotate(-90deg)",
          filter: isActive ? "none" : "grayscale(30%)",
        }}
      >
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius + strokeWidth * 2}
          cy={radius + strokeWidth * 2}
        />
        <circle
          stroke={getTimerColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.3s ease-in-out",
            strokeLinecap: "round",
          }}
          r={normalizedRadius}
          cx={radius + strokeWidth * 2}
          cy={radius + strokeWidth * 2}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{
            fontFamily: "monospace",
            fontWeight: "bold",
            color: getTimerColor(),
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {formatTime(minutes, seconds)}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Inter, sans-serif",
            textTransform: "capitalize",
            color: "text.secondary",
            mt: 1,
            fontSize: { xs: "0.8rem", sm: "1rem" },
          }}
        >
          {currentMode.replace(/([A-Z])/g, " $1")}
        </Typography>
      </Box>
    </Box>
  );
};

const PomodoroTimer = ({
  minutes,
  seconds,
  currentMode,
  isTimerActive,
  WORK_DURATION,
  SHORT_BREAK_DURATION,
  handleStartPause,
  handleReset,
  handleSkip,
}) => {
  /**
   * Returns the total duration in minutes for the current mode.
   * Used for calculating timer progress.
   * @returns {number} Total minutes.
   */
  const getTotalMinutes = () => {
    if (currentMode === "work") return WORK_DURATION;
    if (currentMode === "shortBreak") return SHORT_BREAK_DURATION;
    return WORK_DURATION; // Default to work duration
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: "12px",
        bgcolor: "background.paper",
        textAlign: "center",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}
    >
      <CircularTimer
        minutes={minutes}
        seconds={seconds}
        totalMinutes={getTotalMinutes()}
        currentMode={currentMode}
        isActive={isTimerActive}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartPause}
          startIcon={isTimerActive ? <PauseIcon /> : <PlayArrowIcon />}
          sx={{
            borderRadius: "25px",
            py: 1.5,
            px: 3,
            minWidth: "120px",
            fontSize: "1.1rem",
          }}
        >
          {isTimerActive ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          startIcon={<ReplayIcon />}
          sx={{
            borderRadius: "25px",
            py: 1.5,
            px: 3,
            minWidth: "100px",
          }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={handleSkip}
          startIcon={<SkipNextIcon />}
          sx={{
            borderRadius: "25px",
            py: 1.5,
            px: 3,
            minWidth: "100px",
          }}
        >
          Skip
        </Button>
      </Box>
    </Box>
  );
};

export default PomodoroTimer;
