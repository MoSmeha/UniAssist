//user.controller.js

import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role; // filter by discriminator (e.g., "teacher")
    }

    const filteredUsers = await User.find(filter).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
