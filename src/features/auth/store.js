import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),

      logout: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      version: 1,

      // 🔥 only persist user (clean state)
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);