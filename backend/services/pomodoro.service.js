import { User, Student } from "../models/user.model.js";
import { BADGES } from "../models/Constants.js";
import * as notificationService from "./notification.service.js";

export const recordSession = async (userId, sessionMinutes) => {
  if (!sessionMinutes || sessionMinutes <= 0) {
    throw new Error("Invalid sessionMinutes");
  }

  const sessionHours = sessionMinutes / 60;

  // 1. Update base user stats
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.pomodoroStats.totalSessions += 1;
  user.pomodoroStats.totalHours += sessionHours;
  await user.save();

  let earned = [];
  let studentBadges = [];

  // 2. Badge logic only for students
  if (user.role === "student") {
    const student = await Student.findById(userId);
    const currentBadges = new Set(student.badges);
    const now = { timestamp: Date.now() };

    // Determine newly earned badges
    const earnedBadges = BADGES.filter((b) => {
      const already = currentBadges.has(b.id);
      if (already) return false;

      if (b.threshold !== undefined) {
        return (
          user.pomodoroStats.totalSessions >= b.threshold ||
          user.pomodoroStats.totalHours >= b.threshold
        );
      }
      if (b.condition) {
        return b.condition(now);
      }
      return false;
    });

    earned = earnedBadges.map((b) => b.id);

    if (earned.length) {
      student.badges.push(...earned);
      await student.save();

      // Send notifications for each earned badge
      for (const badge of earnedBadges) {
        await notificationService.notifyUsers({
          recipients: [userId],
          sender: process.env.SYSTEM_SENDER_ID,
          type: "pomodoro",
          message: badge.description,
          data: { badgeId: badge.id, type: "pomodoro" },
        });
      }
    }
    studentBadges = student.badges;
  }

  return {
    pomodoroStats: user.pomodoroStats,
    newBadges: earned,
    allBadges: studentBadges,
  };
};

export const getStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.role === "student") {
    const student = await Student.findById(userId);
    return {
      pomodoroStats: user.pomodoroStats,
      allBadges: student.badges || [],
    };
  }

  return {
    pomodoroStats: user.pomodoroStats,
    allBadges: [],
  };
};
