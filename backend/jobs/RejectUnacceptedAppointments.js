import Appointment from "../models/appointment.model.js";
import notificationService from "../utils/NotificationService.js";

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

export const rejectUnacceptedAppointments = async () => {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  const appointmentsToReject = await Appointment.find({
    status: "pending",
    startTime: { $lt: oneHourFromNow },
  }).populate("student").populate("teacher");

  for (const appt of appointmentsToReject) {
    appt.status = "rejected";
    appt.rejectionReason = "Teacher did not respond in time.";
    await appt.save();

    const studentMessage = `Your appointment with ${appt.teacher.firstName} ${appt.teacher.lastName} has been automatically rejected because the teacher did not respond in time.`;

    await notificationService.notifyUsers({
      recipients: [appt.student._id],
      sender: SYSTEM_SENDER_ID,
      type: "appointment_rejected",
      message: studentMessage,
      data: { appointmentId: appt._id },
    });
  }
};
