import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCafeteriaStore = create(
  persist(
    (set, get) => ({
      menus: {},
      loading: false,
      error: null,

      fetchMenu: async (day) => {
        if (get().menus[day]) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/menu/${day}`);
          if (!res.ok) {
            if (res.status === 404) {
              set((state) => ({
                menus: { ...state.menus, [day]: null },
                loading: false,
              }));
              return;
            }
            throw new Error("Failed to fetch menu");
          }

          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await res.json();
            if (data.error) {
              throw new Error(data.error);
            }
            set((state) => ({
              menus: { ...state.menus, [day]: data },
              loading: false,
            }));
          } else {
            const text = await res.text();
            console.log("Received non-JSON response:", text);
            throw new Error("Received non-JSON response from server");
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      addMenuItem: async (day, category, item) => {
        const res = await fetch(`/api/menu/${day}/${category}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) {
          throw new Error("Failed to add item");
        }
        set((state) => ({
          menus: { ...state.menus, [day]: null },
        }));
      },

      updateMenuItem: async (day, category, itemId, item) => {
        const res = await fetch(`/api/menu/${day}/${category}/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) {
          throw new Error("Failed to update item");
        }
        set((state) => ({
          menus: { ...state.menus, [day]: null },
        }));
      },

      deleteMenuItem: async (day, category, itemId) => {
        const res = await fetch(`/api/menu/${day}/${category}/${itemId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete item");
        }
        set((state) => ({
          menus: { ...state.menus, [day]: null },
        }));
      },

      createMenuForDay: async (day) => {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day }),
        });
        if (!res.ok) {
          throw new Error("Failed to create menu for the day");
        }
        set((state) => ({
          menus: { ...state.menus, [day]: null },
        }));
      },
    }),
    {
      name: "cafeteria-menu-storage", // unique name
    }
  )
);

export default useCafeteriaStore;
