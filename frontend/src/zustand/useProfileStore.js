import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProfileStore = create(
  persist(
    (set) => ({
      profile: null,
      loading: false,
      error: null,

      fetchProfile: async (userId) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/users/${userId}`);
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          set({ profile: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    {
      name: "profile-storage", // unique name
    }
  )
);

export default useProfileStore;
