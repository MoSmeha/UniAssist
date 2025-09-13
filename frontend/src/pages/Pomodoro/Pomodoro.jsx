// Pomodoro.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Howl } from "howler";

// Import the new components
import PomodoroStatsBadges from "./PomodoroStatsBadges";
import ModeSelector from "./ModeSelector";
import PomodoroTimer from "./PomodoroTimer";

const WORK_DURATION = 25; // 25; // Original: 25 minutes
const SHORT_BREAK_DURATION = 5; // 5; // Original: 5 minutes

function Pomodoro() {
  // State to store Pomodoro statistics (total sessions, total hours) fetched from backend
  const [pomodoroStats, setPomodoroStats] = useState({
    totalSessions: 0,
    totalHours: 0,
  });
  // State to store all badges earned by the user
  const [allBadges, setAllBadges] = useState([]);
  // State to store badges newly earned in the last session (not used for display after initial fetch)
  const [newBadges, setNewBadges] = useState([]); // This state is kept here as it's directly related to recording sessions.

  // Timer-related states
  const [currentMode, setCurrentMode] = useState("work");
  const [minutes, setMinutes] = useState(WORK_DURATION);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null); // Ref to hold the interval ID

  // Create a ref for the audio element (Howl handles audio, but this could be a fallback)
  const audioRef = useRef(null);

  // UI related states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect hook to fetch initial stats and badges when the component mounts
  useEffect(() => {
    fetchStats();
  }, []);

  // useEffect for timer logic
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timerRef.current);
          setIsTimerActive(false);
          handleTimerCompletion();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, minutes, seconds, currentMode]);

  /**
   * Resets the timer to the initial duration for the given mode.
   * @param {string} mode - The mode to reset the timer to ('work' or 'shortBreak').
   */
  const resetTimer = (mode) => {
    setIsTimerActive(false);
    if (mode === "work") {
      setMinutes(WORK_DURATION);
    } else if (mode === "shortBreak") {
      setMinutes(SHORT_BREAK_DURATION);
    }
    setSeconds(0);
  };

  /**
   * Plays a notification sound using Howl.
   */
  const playNotificationSound = () => {
    const sound = new Howl({
      src: ["/mixkit-correct-answer-reward-952.wav"],
      volume: 1.0,
    });
    sound.play();
  };

  /**
   * Handles the completion of a timer phase (work or short break).
   * Plays a sound and transitions to the next phase.
   */
  const handleTimerCompletion = () => {
    playNotificationSound();

    if (currentMode === "work") {
      recordSessionBackend(WORK_DURATION);
      setCurrentMode("shortBreak");
      resetTimer("shortBreak");
      setIsTimerActive(true);
    } else {
      setCurrentMode("work");
      resetTimer("work");
      setIsTimerActive(false);
    }
  };

  /**
   * Skips the current timer phase and moves to the next.
   * Plays a sound and transitions to the next phase.
   */
  const handleSkip = () => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    playNotificationSound();

    if (currentMode === "work") {
      recordSessionBackend(WORK_DURATION);
      setCurrentMode("shortBreak");
      resetTimer("shortBreak");
    } else {
      setCurrentMode("work");
      resetTimer("work");
    }
  };

  /**
   * Fetches the user's Pomodoro stats and badges from the backend.
   * Handles loading and error states.
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pomodoro/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch stats");
      }

      const data = await response.json();
      setPomodoroStats({
        totalSessions: data.pomodoroStats.totalSessions,
        totalHours: data.pomodoroStats.totalHours,
      });
      setAllBadges(data.allBadges || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(
        err.message || "An unexpected error occurred while fetching stats."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Records a new Pomodoro session by sending data to the backend.
   * Updates stats and checks for new badges.
   * @param {number} sessionMinutes - The duration of the completed session in minutes.
   */
  const recordSessionBackend = async (sessionMinutes) => {
    setLoading(true);
    setError(null);
    setNewBadges([]);

    try {
      const response = await fetch("/api/pomodoro/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionMinutes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to record session");
      }

      const data = await response.json();
      setPomodoroStats({
        totalSessions: data.pomodoroStats.totalSessions,
        totalHours: data.pomodoroStats.totalHours,
      });
      setAllBadges(data.allBadges || []);
      if (data.newBadges && data.newBadges.length > 0) {
        setNewBadges(data.newBadges);
      }
    } catch (err) {
      console.error("Error recording session:", err);
      setError(
        err.message || "An unexpected error occurred while recording session."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handlers for timer controls
  const handleStartPause = () => {
    setIsTimerActive(!isTimerActive);
  };

  const handleReset = () => {
    resetTimer(currentMode);
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    resetTimer(mode);
  };

  return (
    <Box sx={{ width: "100vw" }}>
      {/* Top Bar for Stats and Badges */}
      <PomodoroStatsBadges
        pomodoroStats={pomodoroStats}
        allBadges={allBadges}
      />

      <Container
        maxWidth="md"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Mode Selection buttons */}
        <ModeSelector
          currentMode={currentMode}
          WORK_DURATION={WORK_DURATION}
          SHORT_BREAK_DURATION={SHORT_BREAK_DURATION}
          handleModeChange={handleModeChange}
        />

        {/* Error Message Display */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading...
            </Typography>
          </Box>
        )}

        {/* Pomodoro Timer Section */}
        <PomodoroTimer
          minutes={minutes}
          seconds={seconds}
          currentMode={currentMode}
          isTimerActive={isTimerActive}
          WORK_DURATION={WORK_DURATION}
          SHORT_BREAK_DURATION={SHORT_BREAK_DURATION}
          handleStartPause={handleStartPause}
          handleReset={handleReset}
          handleSkip={handleSkip}
        />
      </Container>
      {/* Hidden audio element for sound playback (Howl handles audio, but this could be a fallback) */}
      <audio
        ref={audioRef}
        src="/mixkit-correct-answer-reward-952.wav"
        preload="auto"
      />
    </Box>
  );
}

export default Pomodoro;
