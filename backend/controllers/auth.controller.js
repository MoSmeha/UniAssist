import { signupUser, loginUser } from "../services/auth.service.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    uniId: user.uniId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
    profilePic: user.profilePic,
    role: user.role,
    Department: user.Department,
    schedule: user.schedule,
    title: user.title,
    major: user.major,
  };
};

export const signup = async (req, res) => {
  try {
    const newUser = await signupUser(req.body);
    res.status(201).json(formatUserResponse(newUser));
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { uniId, password } = req.body;
    const user = await loginUser(uniId, password);

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
