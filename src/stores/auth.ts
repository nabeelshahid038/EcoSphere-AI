import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoProfiles, type Role } from "@/lib/mock-data";

export type User = {
  name: string;
  email: string;
  role: Role;
  org?: string;
  city?: string;
  points?: number;
  level?: number;
  pendingVerifications?: number;
  invested?: string;
};

type AuthState = {
  user: User | null;
  isDemo: boolean;
  login: (email: string, role?: Role) => void;
  register: (name: string, email: string, role: Role, org?: string) => void;
  enterDemo: (role: Role) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isDemo: false,
      login: (email, role = "citizen") =>
        set({
          user: { ...demoProfiles[role], email } as User,
          isDemo: false,
        }),
      register: (name, email, role, org) =>
        set({
          user: { ...demoProfiles[role], name, email, org: org ?? demoProfiles[role].org } as User,
          isDemo: false,
        }),
      enterDemo: (role) => set({ user: { ...demoProfiles[role] } as User, isDemo: true }),
      logout: () => set({ user: null, isDemo: false }),
    }),
    { name: "greenpulse-auth" },
  ),
);
