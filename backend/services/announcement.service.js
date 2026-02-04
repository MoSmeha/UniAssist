import Announcement from "../models/announcement.model.js";
import { Student } from "../models/user.model.js";
import * as notificationService from "./notification.service.js";

export const createAnnouncement = async (announcementData, senderId) => {
  const {
    title,
    content,
    category,
    announcementType,
    targetMajor,
    targetSubject,
  } = announcementData;

  // 1. Validate required fields
  if (!title || !content || !category || !announcementType) {
    throw new Error("Title, content, category, and announcementType are required.");
  }

  // 2. Conditional target validation
  if (announcementType === "major" && !targetMajor) {
    throw new Error("Target major is required for major announcements.");
  }
  if (announcementType === "subject" && !targetSubject) {
    throw new Error("Target subject is required for subject announcements.");
  }

  // 3. Save the announcement
  const newAnnouncement = new Announcement({
    title,
    content,
    sender: senderId,
    category,
    announcementType,
    targetMajor,
    targetSubject,
  });
  await newAnnouncement.save();

  // 4. Determine recipient IDs
  let recipients = [];
  if (announcementType === "major") {
    const students = await Student.find({ major: targetMajor }).select("_id");
    recipients = students.map(s => s._id.toString());
  } else if (announcementType === "subject") {
    const students = await Student
      .find({ "schedule.subject": targetSubject })
      .select("_id");
    recipients = students.map(s => s._id.toString());
  }

  // 5. Send notifications
  await notificationService.notifyUsers({
    recipients,
    sender: senderId,
    type: "announcement",
    message: `[${category}] ${title}`,
    data: {
      announcementId: newAnnouncement._id,
      title,
      content,
      category,
      announcementType,
      targetMajor,
      targetSubject,
      createdAt: newAnnouncement.createdAt,
      type: "Announcements",
    },
  });

  return newAnnouncement;
};

export const getAnnouncementsForStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const studentSubjects = student.schedule.map((item) => item.subject);

  return await Announcement.find({
    $or: [
      { announcementType: "major", targetMajor: student.major },
      { announcementType: "subject", targetSubject: { $in: studentSubjects } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "firstName lastName profilePic Department title");
};

export const getTeacherAnnouncements = async (teacherId) => {
  return await Announcement.find({ sender: teacherId })
    .sort({ createdAt: -1 })
    .populate("sender", "firstName lastName profilePic Department title");
};

export const deleteAnnouncement = async (announcementId, userId) => {
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  if (announcement.sender.toString() !== userId) {
    throw new Error("Not authorized to delete this announcement");
  }

  await Announcement.findByIdAndDelete(announcementId);
  return true;
};

export const getAllAnnouncements = async () => {
  return await Announcement.find({})
    .sort({ createdAt: -1 })
    .populate("sender", "firstName lastName profilePic Department title");
};
