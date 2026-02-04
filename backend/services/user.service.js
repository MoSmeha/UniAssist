import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (role) => {
  const filter = {};
  if (role) {
    filter.role = role;
  }
  return await User.find(filter).select("-password");
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateProfilePic = async (userId, newUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePic: newUrl },
    { new: true, select: "profilePic" }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user.profilePic;
};

export const editUser = async (userId, updatedData) => {
  // Check if the password field is being updated
  if (updatedData.password) {
    const salt = await bcrypt.genSalt(10);
    updatedData.password = await bcrypt.hash(updatedData.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return true;
};
