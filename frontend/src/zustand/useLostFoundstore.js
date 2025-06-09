import { create } from "zustand";

// Assume your API is running on this base URL
const API_BASE_URL = "api/lost&found"; // Adjust if needed

// Helper function to handle API requests
const apiFetch = async (url, options = {}) => {
  // Assume you get the token from local storage or an auth context
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};

export const useLostAndFoundStore = create((set, get) => ({
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
  },
  filters: {
    type: "", // 'lost', 'found', or '' for all
    category: "",
    resolved: "", // 'true', 'false', or '' for all
  },
  loading: false,
  error: null,

  // Set filters and fetch items
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page on filter change
    }));
    get().fetchItems();
  },

  // Set page and fetch items
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchItems();
  },

  // Fetch all items based on current filters and pagination
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.resolved) params.append("resolved", filters.resolved);

      const data = await apiFetch(`${API_BASE_URL}?${params.toString()}`);
      set({
        items: data.items,
        pagination: data.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create a new item
  createItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      // We use FormData because of the image file
      const formData = new FormData();
      Object.keys(itemData).forEach((key) => {
        if (itemData[key] != null) {
          formData.append(key, itemData[key]);
        }
      });

      const newItem = await apiFetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });

      set((state) => ({
        items: [newItem, ...state.items],
        loading: false,
      }));
      get().fetchItems(); // Refresh list to ensure consistency
      return newItem;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update an item's resolved status
  updateResolvedStatus: async (itemId, resolved) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await apiFetch(`${API_BASE_URL}/${itemId}/resolved`, {
        method: "PATCH",
        body: JSON.stringify({ resolved }),
      });

      // Update the item in the local state
      set((state) => ({
        items: state.items.map((item) =>
          item._id === itemId ? updatedItem : item
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Delete an item
  deleteItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`${API_BASE_URL}/${itemId}`, {
        method: "DELETE",
      });

      // Remove the item from the local state
      set((state) => ({
        items: state.items.filter((item) => item._id !== itemId),
        loading: false,
      }));
      get().fetchItems(); // Refresh list to ensure total count is correct
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
