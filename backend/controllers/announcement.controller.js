import Announcement from "../models/announcement.model.js";
import { Student } from "../models/user.model.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";
import Notification from "../models/notification.model.js";

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, content, category, announcementType, targetMajor, targetSubject } = req.body;

    // Validate required fields
    if (!title || !content || !category || !announcementType) {
      return res.status(400).json({
        message: "Title, content, category, and announcementType are required."
      });
    }

    // Validate announcementType and related targets
    if (announcementType === "major" && !targetMajor) {
      return res.status(400).json({
        message: "Target major is required for major announcements."
      });
    }

    if (announcementType === "subject" && !targetSubject) {
      return res.status(400).json({
        message: "Target subject is required for subject announcements."
      });
    }

    // Create the announcement document
    const newAnnouncement = new Announcement({
      title,
      content,
      sender: req.user.id,
      category,
      announcementType,
      targetMajor,
      targetSubject,
    });

    await newAnnouncement.save();

    // Find target users for notification
    let targetUsers = [];
    if (announcementType === "major") {
      targetUsers = await Student.find({ major: targetMajor }).select("_id");
    } else if (announcementType === "subject") {
      targetUsers = await Student.find({ "schedule.subject": targetSubject }).select("_id");
    }

    const io = getIO();

    // Create notification documents and emit socket notifications to each user
    for (const user of targetUsers) {
      const notification = new Notification({
        user: user._id,
        sender: req.user.id,
        type: "announcement",
        message: `📢 [${category}] ${title}`,
        data: {
          announcementId: newAnnouncement._id,
          title,
          content,
          category,
          announcementType,
          targetMajor,
          targetSubject,
          createdAt: newAnnouncement.createdAt,
        },
      });
      await notification.save();

      // Emit notification to specific user socket if connected
      const socketId = getReceiverSocketId(user._id.toString());
      if (socketId) {
        io.to(socketId).emit("receiveNotification", {
          _id: notification._id,
          user: notification.user,
          sender: {
            _id: req.user.id,
          },
          type: notification.type,
          message: notification.message,
          data: notification.data,
          read: notification.read,
          createdAt: notification.createdAt,
        });
      }
    }

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
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentSubjects = student.schedule.map((item) => item.subject);

    const announcements = await Announcement.find({
      $or: [
        { announcementType: "major", targetMajor: student.major },
        { announcementType: "subject", targetSubject: { $in: studentSubjects } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
      );

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

// Get all announcements created by a teacher
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const announcements = await Announcement.find({ sender: teacherId })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
      );

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

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (announcement.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this announcement" });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

// Get all announcements (admin)
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "firstName lastName profilePic Department title"
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
