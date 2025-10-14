import create from 'zustand';

const useStaffStore = create((set) => ({
  staff: [],
  loading: false,
  error: null,
  searchTerm: '',

  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchStaff: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const staffRoles = ["teacher", "admin"];
      const staffOnly = data.filter((user) => staffRoles.includes(user.role));
      set({ staff: staffOnly, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useStaffStore;
