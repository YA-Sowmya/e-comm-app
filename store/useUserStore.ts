// store/useUserStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 'admin' or 'customer'
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => {
  // Initialize state from localStorage
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    setUser: (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user));
      set({ user });
    },
    clearUser: () => {
      localStorage.removeItem("currentUser");
      set({ user: null });
    },
  };
});
