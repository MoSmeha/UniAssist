import * as appointmentService from '../services/appointment.service.js';

export const createAppointment = async (req, res, next) => {
  try {
    const newAppt = await appointmentService.createAppointment(req.body);
    return res.status(201).json(newAppt);
  } catch (err) {
    if (err.message === 'Appointment reason is required.' || 
        err.message === 'Cannot create an appointment in the past.' ||
        err.message === 'An appointment overlaps with this time slot.') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const listAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const appts = await appointmentService.listAppointments(userId, role);
    return res.json(appts);
  } catch (err) {
    if (err.message === 'Unauthorized access.') {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appt = await appointmentService.getAppointmentById(req.params.id, req.user._id, req.user.role);
    return res.json(appt);
  } catch (err) {
    if (err.message === 'Appointment not found.') {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === 'Unauthorized to view this appointment.') {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

export const acceptAppointment = async (req, res, next) => {
  try {
    const appt = await appointmentService.acceptAppointment(req.params.id);
    return res.json(appt);
  } catch (err) {
    if (err.message === 'Appointment not found.') {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.startsWith('Cannot accept an appointment')) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const rejectAppointment = async (req, res, next) => {
  try {
    const appt = await appointmentService.rejectAppointment(req.params.id, req.body.rejectionReason);
    return res.json(appt);
  } catch (err) {
    if (err.message === 'Appointment not found.') {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.startsWith('Cannot reject an appointment')) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};
