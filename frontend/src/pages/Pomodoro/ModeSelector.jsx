// ModeSelector.jsx
import React from "react";
import { Button, ButtonGroup } from "@mui/material";

const ModeSelector = ({
  currentMode,
  WORK_DURATION,
  SHORT_BREAK_DURATION,
  handleModeChange,
}) => {
  return (
    <ButtonGroup
      variant="contained"
      aria-label="timer mode selection"
      sx={{
        borderRadius: "25px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "400px",
        mx: "auto",
      }}
    >
      <Button
        onClick={() => handleModeChange("work")}
        color={currentMode === "work" ? "primary" : "inherit"}
        sx={{
          py: 1.5,
          flex: 1,
          borderRadius: "0 !important",
        }}
      >
        Work ({WORK_DURATION}min)
      </Button>
      <Button
        onClick={() => handleModeChange("shortBreak")}
        color={currentMode === "shortBreak" ? "primary" : "inherit"}
        sx={{
          py: 1.5,
          flex: 1,
          borderRadius: "0 !important",
        }}
      >
        Short Break ({SHORT_BREAK_DURATION}min)
      </Button>
    </ButtonGroup>
  );
};

export default ModeSelector;
