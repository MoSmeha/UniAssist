
import {create} from 'zustand';
import toast from 'react-hot-toast';

const useAnnouncementsStore = create((set) => ({
  announcements: [],
  loading: true,
  error: null,
  fetchAnnouncements: async (authUser) => {
    try {
      set({ loading: true, error: null });
      let endpoint;
      if (authUser.role === 'student') {
        endpoint = '/api/announcements/student';
      } else if (authUser.role === 'teacher') {
        endpoint = '/api/announcements/teacher';
      } else if (authUser.role === 'admin') {
        endpoint = '/api/announcements/admin';
      } else {
        throw new Error('Unknown role');
      }

      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        set({ announcements: data.announcements || [], loading: false });
      } else {
        toast.error(data.message || 'Failed to fetch announcements');
        set({ loading: false, error: data.message || 'Failed to fetch announcements' });
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
      set({ loading: false, error: 'Failed to load announcements' });
    }
  },
}));

export default useAnnouncementsStore;
