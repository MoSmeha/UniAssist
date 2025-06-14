import Announcement from "../models/announcement.model.js";
import { Student } from "../models/user.model.js";

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, content, announcementType, targetMajor, targetSubject } =
      req.body;

    // Validate request based on announcement type
    if (announcementType === "major" && !targetMajor) {
      return res
        .status(400)
        .json({ message: "Target major is required for major announcements" });
    }

    if (announcementType === "subject" && !targetSubject) {
      return res.status(400).json({
        message: "Target subject is required for subject announcements",
      });
    }

    // Create the announcement
    const newAnnouncement = new Announcement({
      title,
      content,
      sender: req.user.id,
      announcementType,
      targetMajor,
      targetSubject,
    });

    await newAnnouncement.save();

    res.status(201).json({
      success: true,
      announcement: newAnnouncement,
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};

// Get all announcements relevant to a specific student
export const getAnnouncementsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get the student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all subjects in the student's schedule
    const studentSubjects = student.schedule.map((item) => item.subject);

    // Find announcements that target the student's major or any of their subjects
    const announcements = await Announcement.find({
      $or: [
        { announcementType: "major", targetMajor: student.major },
        {
          announcementType: "subject",
          targetSubject: { $in: studentSubjects },
        },
      ],
    }).populate(
      "sender",
      "firstName lastName profilePic Department title createdAt"
    );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

// Get all announcements created by a teacher
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming authentication middleware

    const announcements = await Announcement.find({ sender: teacherId })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title createdAt"
      );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher announcements",
      error: error.message,
    });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check if the user is the creator of the announcement
    if (announcement.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this announcement" });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    // no filters — just grab everything
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title createdAt"
      );

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