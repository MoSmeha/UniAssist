import * as scheduleService from "../services/schedule.service.js";

export const getUserSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.getUserSchedule(req.params.id);
    res.status(200).json(schedule);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ message: error.message || "Server error" });
  }
};
