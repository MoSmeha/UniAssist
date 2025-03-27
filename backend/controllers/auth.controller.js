import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      uniId,
      firstName,
      lastName,
      email,
      password,
      gender,
      role,
      Department, // Required for all users
      title, // Teacher-specific
      major, // Student-specific
      schedule,
    } = req.body;

    // Check for existing email and uniId
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ error: "Email already exists" });

    const uniIdExists = await User.findOne({ uniId });
    if (uniIdExists)
      return res.status(400).json({ error: "University ID already exists" });

    // Ensure Department is provided for all roles
    if (!Department) {
      return res.status(400).json({ error: "Department is required" });
    }

    // Role-specific validations
    if (role === "teacher" && !title) {
      return res.status(400).json({ error: "Title is required for teachers" });
    }
    if (role === "student" && !major) {
      return res.status(400).json({ error: "Major is required for students" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate profile picture
    function getLightColor() {
      const r = Math.floor(Math.random() * 106) + 150; // 150-255
      const g = Math.floor(Math.random() * 106) + 150;
      const b = Math.floor(Math.random() * 106) + 150;
      return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }
    const randomColor = getLightColor();
    const profilePic = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${randomColor}`;

    // Base user data
    const userData = {
      uniId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      profilePic,
      role,
      Department,
      schedule: schedule || [],
    };

    // Add role-specific fields
    if (role === "teacher") {
      userData.title = title;
    } else if (role === "student") {
      userData.major = major;
    } else if (role === "admin") {
      userData.title = title;
    }
    // Create and save user
    const newUser = new User(userData);
    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    // Build response
    const responseData = {
      _id: newUser._id,
      uniId: newUser.uniId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      gender: newUser.gender,
      profilePic: newUser.profilePic,
      role: newUser.role,
      Department: newUser.Department,
      schedule: newUser.schedule,
    };

    if (role === "teacher") {
      responseData.title = newUser.title;
    } else if (role === "student") {
      responseData.major = newUser.major;
    }

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { uniId, password } = req.body;

    const user = await User.findOne({ uniId }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid university ID or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid university ID or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    const responseData = {
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
    };

    if (user.role === "teacher") {
      responseData.title = user.title;
    } else if (user.role === "student") {
      responseData.major = user.major;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
