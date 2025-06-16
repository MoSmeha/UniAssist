// controllers/appointmentsController.js

import Appointment from '../models/appointment.model.js';

/**
 * Create a new appointment.
 * - appointmentReason is required
 * - startTime cannot be in the past
 * - no overlapping appointments (pending/accepted) for the same teacher
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { student, teacher, startTime, intervalMinutes, appointmentReason } = req.body;

    // 1. Reason is required
    if (!appointmentReason) {
      return res.status(400).json({ message: 'Appointment reason is required.' });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + intervalMinutes * 60000);

    // 2. Prevent past appointments
    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot create an appointment in the past.' });
    }

    // 3. Prevent overlapping appointments for the same teacher
    // Conflict if existing.startTime < new end AND existing.endTime > new start
    const conflict = await Appointment.findOne({
      teacher,
      status: { $in: ['pending', 'accepted'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (conflict) {
      return res.status(400).json({ message: 'An appointment overlaps with this time slot.' });
    }

    // 4. Create and return
    const newAppt = await Appointment.create({
      student,
      teacher,
      startTime: start,
      intervalMinutes,
      appointmentReason,
      // status defaults to 'pending' via model default
      // endTime is auto‑computed in your pre('validate') hook
    });

    return res.status(201).json(newAppt);
  } catch (err) {
    next(err);
  }
};


/**
 * List appointments visible to the current user:
 * - students see their own bookings
 * - teachers see their own bookings
 * - admins see all
 */
export const listAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const filter = {};

    if (role === 'student') {
      filter.student = userId;
    } else if (role === 'teacher') {
      filter.teacher = userId;
    } else if (role === 'admin') {
      // no additional filter
    } else {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }

    const appts = await Appointment.find(filter)
      .populate('student', 'firstName lastName profilePic')
      .populate('teacher', 'firstName lastName profilePic')
      .sort({ startTime: 1 });

    return res.json(appts);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single appointment by ID.
 * Only the student, the teacher, or an admin may view.
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('student', 'firstName lastName profilePic')
      .populate('teacher', 'firstName lastName profilePic');

    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const userId = req.user._id.toString();
    const role = req.user.role;
    const isStudent = appt.student._id.toString() === userId;
    const isTeacher = appt.teacher._id.toString() === userId;

    if (!(role === 'admin' || isStudent || isTeacher)) {
      return res.status(403).json({ message: 'Unauthorized to view this appointment.' });
    }

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};

/**
 * Accept a pending appointment.
 * Only teachers may accept, and only if status === 'pending'
 */
export const acceptAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (appt.status !== 'pending') {
      return res.status(400).json({ message: `Cannot accept an appointment in '${appt.status}' status.` });
    }

    appt.status = 'accepted';
    await appt.save();

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};

/**
 * Reject a pending appointment, optionally with a rejectionReason.
 * Only teachers may reject, and only if status === 'pending'
 */
export const rejectAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    if (appt.status !== 'pending') {
      return res.status(400).json({ message: `Cannot reject an appointment in '${appt.status}' status.` });
    }

    appt.status = 'rejected';
    if (req.body.rejectionReason) {
      appt.rejectionReason = req.body.rejectionReason;
    }
    await appt.save();

    return res.json(appt);
  } catch (err) {
    next(err);
  }
};
