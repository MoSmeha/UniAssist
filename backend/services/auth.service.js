import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

/**
 * Generates a profile picture URL based on name and a random color.
 */
const getProfilePic = (firstName, lastName) => {
  const getLightColor = () => {
    const r = Math.floor(Math.random() * 106) + 150;
    const g = Math.floor(Math.random() * 106) + 150;
    const b = Math.floor(Math.random() * 106) + 150;
    return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  };
  const randomColor = getLightColor();
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${randomColor}`;
};

export const signupUser = async (userData) => {
  const {
    uniId,
    firstName,
    lastName,
    email,
    password,
    gender,
    role,
    Department,
    title,
    major,
    schedule,
  } = userData;

  // Validation
  const emailExists = await User.findOne({ email });
  if (emailExists) throw new Error("Email already exists");

  const uniIdExists = await User.findOne({ uniId });
  if (uniIdExists) throw new Error("University ID already exists");

  if (!Department) throw new Error("Department is required");

  if (role === "teacher" && !title) throw new Error("Title is required for teachers");
  if (role === "student" && !major) throw new Error("Major is required for students");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    uniId,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    gender,
    profilePic: getProfilePic(firstName, lastName),
    role,
    Department,
    schedule: schedule || [],
    title: (role === "teacher" || role === "admin") ? title : undefined,
    major: role === "student" ? major : undefined,
  });

  await newUser.save();
  return newUser;
};

export const loginUser = async (uniId, password) => {
  const user = await User.findOne({ uniId }).select("+password");
  if (!user) throw new Error("Invalid university ID or password");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new Error("Invalid university ID or password");

  return user;
};
