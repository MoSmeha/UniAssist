import { User } from "../models/user.model.js";

export const getUserSchedule = async (userId) => {
  const user = await User.findById(userId).select("schedule");

  if (!user) {
    throw new Error("User not found");
  }

  return user.schedule;
};
