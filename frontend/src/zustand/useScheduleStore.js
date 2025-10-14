import {create} from 'zustand';

const useScheduleStore = create((set) => ({
  schedule: [],
  loading: true,
  error: null,
  fetchSchedule: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/sch/${userId}/schedule`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const daysOrder = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const sortedSchedule = data.sort((a, b) => {
        const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        const aTime = new Date(`1970/01/01 ${a.startTime}`);
        const bTime = new Date(`1970/01/01 ${b.startTime}`);
        return aTime - bTime;
      });
      set({ schedule: sortedSchedule, loading: false });
    } catch (err) {
      console.error("Error fetching schedule:", err);
      set({ error: "Failed to load schedule. Please try again later.", loading: false });
    }
  },
}));

export default useScheduleStore;
