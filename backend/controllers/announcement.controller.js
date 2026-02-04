import * as announcementService from "../services/announcement.service.js";

export const createAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = await announcementService.createAnnouncement(req.body, req.user._id);
    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create announcement",
    });
  }
};

export const getAnnouncementsForStudent = async (req, res) => {
  try {
    const announcements = await announcementService.getAnnouncementsForStudent(req.user._id);
    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements for student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

export const getTeacherAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementService.getTeacherAnnouncements(req.user._id);
    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching teacher announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher announcements",
      error: error.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    const statusCode = error.message === "Announcement not found" ? 404 : 
                      error.message === "Not authorized to delete this announcement" ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete announcement",
    });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching all announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};
