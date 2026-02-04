import * as pomodoroService from "../services/pomodoro.service.js";

// POST /api/pomodoro/session
export async function recordSession(req, res) {
  try {
    const result = await pomodoroService.recordSession(req.user._id, req.body.sessionMinutes);
    res.json({
      message: "Session recorded",
      ...result
    });
  } catch (err) {
    console.error(err);
    const statusCode = err.message === "Invalid sessionMinutes" ? 400 :
                      err.message === "User not found" ? 404 : 500;
    return res.status(statusCode).json({ message: err.message || "Server error" });
  }
}

export async function getStats(req, res) {
  try {
    const stats = await pomodoroService.getStats(req.user._id);
    res.json(stats);
  } catch (err) {
    console.error(err);
    const statusCode = err.message === "User not found" ? 404 : 500;
    return res.status(statusCode).json({ message: err.message || "Server error" });
  }
}
