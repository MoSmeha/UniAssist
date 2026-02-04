import Appointment from '../models/appointment.model.js';
import * as notificationService from "./notification.service.js";

export const createAppointment = async (appointmentData) => {
  const { student, teacher, startTime, intervalMinutes, appointmentReason } = appointmentData;

  if (!appointmentReason) {
    throw new Error('Appointment reason is required.');
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + intervalMinutes * 60000);

  if (start < new Date()) {
    throw new Error('Cannot create an appointment in the past.');
  }

  const conflict = await Appointment.findOne({
    teacher,
    status: { $in: ['pending', 'accepted'] },
    startTime: { $lt: end },
    endTime: { $gt: start }
  });

  if (conflict) {
    throw new Error('An appointment overlaps with this time slot.');
  }

  const newAppt = await Appointment.create({
    student,
    teacher,
    startTime: start,
    intervalMinutes,
    appointmentReason,
  });

  // Notify the teacher
  await notificationService.notifyUsers({
    recipients: [teacher],
    sender: student,
    type: "appointment",
    message: "New appointment request received.",
    data: {
      appointmentId: newAppt._id,
      appointmentReason,
      startTime: start,
      type: "Appointments",
    },
  });

  return newAppt;
};

export const listAppointments = async (userId, role) => {
  const filter = {};

  if (role === 'student') {
    filter.student = userId;
  } else if (role === 'teacher') {
    filter.teacher = userId;
  } else if (role === 'admin') {
    // no additional filter
  } else {
    throw new Error('Unauthorized access.');
  }

  return await Appointment.find(filter)
    .populate('student', 'firstName lastName profilePic')
    .populate('teacher', 'firstName lastName profilePic')
    .sort({ startTime: 1 });
};

export const getAppointmentById = async (appointmentId, userId, role) => {
  const appt = await Appointment.findById(appointmentId)
    .populate('student', 'firstName lastName profilePic')
    .populate('teacher', 'firstName lastName profilePic');

  if (!appt) {
    throw new Error('Appointment not found.');
  }

  const isStudent = appt.student._id.toString() === userId.toString();
  const isTeacher = appt.teacher._id.toString() === userId.toString();

  if (!(role === 'admin' || isStudent || isTeacher)) {
    throw new Error('Unauthorized to view this appointment.');
  }

  return appt;
};

export const acceptAppointment = async (appointmentId) => {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) {
    throw new Error('Appointment not found.');
  }

  if (appt.status !== 'pending') {
    throw new Error(`Cannot accept an appointment in '${appt.status}' status.`);
  }

  appt.status = 'accepted';
  await appt.save();

  // Notify the student
  await notificationService.notifyUsers({
    recipients: [appt.student],
    sender: appt.teacher,
    type: "appointment",
    message: "Your appointment has been accepted.",
    data: {
      appointmentId: appt._id,
      startTime: appt.startTime,
    },
  });

  return appt;
};

export const rejectAppointment = async (appointmentId, rejectionReason) => {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) {
    throw new Error('Appointment not found.');
  }

  if (appt.status !== 'pending') {
    throw new Error(`Cannot reject an appointment in '${appt.status}' status.`);
  }

  appt.status = 'rejected';
  if (rejectionReason) {
    appt.rejectionReason = rejectionReason;
  }
  await appt.save();

  // Notify the student
  await notificationService.notifyUsers({
    recipients: [appt.student],
    sender: appt.teacher,
    type: "appointment",
    message: "Your appointment has been rejected.",
    data: {
      appointmentId: appt._id,
      rejectionReason: rejectionReason || "",
    },
  });

  return appt;
};
