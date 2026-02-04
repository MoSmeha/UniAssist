import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const filteredUsers = await userService.getUsers(req.query.role);
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    const statusCode = err.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ message: err.message || "Server error" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Authorize: only the user themself (or an admin) may change their pic
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 2) Ensure file arrived
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 3) Update the user document via service
    const profilePic = await userService.updateProfilePic(id, req.file.path);

    res.json({ profilePic });
  } catch (err) {
    console.error("updateProfilePic error:", err);
    const statusCode = err.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ message: err.message || "Server error" });
  }
};

export const editUser = async (req, res) => {
  try {
    const updatedUser = await userService.editUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in editUser: ", error.message);
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message || "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser: ", error.message);
    const statusCode = error.message === "User not found" ? 404 : 500;
    res.status(statusCode).json({ error: error.message || "Internal server error" });
  }
};
