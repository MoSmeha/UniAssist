import { create } from 'zustand';
import dayjs from 'dayjs'; // Import dayjs to handle date objects consistently
import toast from 'react-hot-toast'; // assume toast is already set up in your app

const apiBaseUrl = "/api";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  teachers: [],
  newAppt: { teacher: '', startTime: null, interval: 30, appointmentReason: '' },
  rejecting: null,
  reason: '',
  showBookingForm: false,

  // Actions to update state
  setAppointments: (appointments) => set({ appointments }),
  setTeachers: (teachers) => set({ teachers }),
  setNewAppt: (newAppt) => set({ newAppt }),
  setRejecting: (rejecting) => set({ rejecting }),
  setReason: (reason) => set({ reason }),
  setShowBookingForm: (showBookingForm) => set({ showBookingForm }),

  // Async actions
  fetchTeachers: async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/users?role=teacher`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch teachers');
      set({ teachers: data });
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error(`Load teachers failed: ${error.message}`);
    }
  },

  fetchAppointments: async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/appointments`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments');
      set({ appointments: data });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(`Load appointments failed: ${error.message}`);
    }
  },

  handleCreate: async (authUser) => {
    const { newAppt, fetchAppointments, setNewAppt, setShowBookingForm } = get();
    try {
      const formattedStartTime = newAppt.startTime ? newAppt.startTime.toISOString() : null;
      const res = await fetch(`${apiBaseUrl}/appointments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: authUser?._id,
          teacher: newAppt.teacher,
          startTime: formattedStartTime,
          intervalMinutes: newAppt.interval,
          appointmentReason: newAppt.appointmentReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create appointment');
      toast.success('Appointment created');
      fetchAppointments();
      setNewAppt({ teacher: '', startTime: null, interval: 30, appointmentReason: '' });
      setShowBookingForm(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(`Create failed: ${error.message}`);
    }
  },

  handleAccept: async (id) => {
    const { fetchAppointments } = get();
    try {
      const res = await fetch(`${apiBaseUrl}/appointments/${id}/accept`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept appointment');
      toast.success('Appointment accepted');
      fetchAppointments();
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast.error(`Accept failed: ${error.message}`);
    }
  },

  openReject: (appt) => {
    set({ rejecting: appt, reason: '' });
  },

  handleReject: async () => {
    const { rejecting, reason, fetchAppointments, setRejecting } = get();
    try {
      const res = await fetch(`${apiBaseUrl}/appointments/${rejecting._id}/reject`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject appointment');
      toast.success('Appointment rejected');
      setRejecting(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error(`Reject failed: ${error.message}`);
    }
  },

  getStatusChipColor: (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'info';
    }
  },
}));
