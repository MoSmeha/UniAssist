import  Appointment  from "../models/appointment.model.js";
import notificationService from "../utils/NotificationService.js"

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

export const sendAppointmentReminders = async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // Populate student and teacher with firstName and lastName
  const appointments = await Appointment.find({
    status: "accepted",
    startTime: {
      $gte: oneHourLater,
      $lt: new Date(oneHourLater.getTime() + 60 * 1000) // window of 1 min
    }
  }).populate('student', 'firstName lastName').populate('teacher', 'firstName lastName');

  for (const appt of appointments) {
    const data = {
      appointmentId: appt._id,
      startTime: appt.startTime,
    };

    // Personalized message for student
    const studentMessage = `Reminder: You have an appointment with ${appt.teacher.firstName} ${appt.teacher.lastName} in 1 hour.`;

    // Personalized message for teacher
    const teacherMessage = `Reminder: You have an appointment with ${appt.student.firstName} ${appt.student.lastName} in 1 hour.`;

    // Send notification to student
    await notificationService.notifyUsers({
      recipients: [appt.student._id],
      sender: SYSTEM_SENDER_ID,
      type: "reminder",
      message: studentMessage,
      data,
    });

    // Send notification to teacher
    await notificationService.notifyUsers({
      recipients: [appt.teacher._id],
      sender: SYSTEM_SENDER_ID,
      type: "reminder",
      message: teacherMessage,
      data,
    });
  }
};
