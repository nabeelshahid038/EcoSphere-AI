import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoProfiles, type Role } from "@/lib/mock-data";

export type User = {
  name: string;
  email: string;
  role: Role;
  cnic?: string;
  org?: string;
  city?: string;
  points?: number;
  level?: number;
  pendingVerifications?: number;
  invested?: string;
  isCnicVerified?: boolean;
};

type AuthState = {
  user: User | null;
  registeredUsers: User[];
  isDemo: boolean;
  login: (email: string, role?: Role) => void;
  register: (name: string, email: string, role: Role, org?: string, cnic?: string) => void;
  enterDemo: (role: Role) => void;
  logout: () => void;
  addPoints: (pts: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],
      isDemo: false,
      login: (email, role = "citizen") => {
        const users = get().registeredUsers;
        const normalizedEmail = email.trim().toLowerCase();
        const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.role === role);

        if (existing) {
          set({ user: existing, isDemo: false });
        } else {
          // Format real name from email if user not found in local registry
          const nameFromEmail = email.split("@")[0].replace(/[._-]/g, " ");
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          const realUser: User = {
            name: formattedName,
            email: normalizedEmail,
            role,
            city: "Karachi",
            points: 150, // Real starting bonus points
            level: 1,
            isCnicVerified: true,
          };
          set((state) => ({
            registeredUsers: [...state.registeredUsers, realUser],
            user: realUser,
            isDemo: false,
          }));
        }
      },
      register: (name, email, role, org, cnic) => {
        const normalizedEmail = email.trim().toLowerCase();
        const newUser: User = {
          name: name.trim(),
          email: normalizedEmail,
          role,
          org: org || (role === "citizen" ? "Karachi" : "Organization"),
          city: "Karachi",
          cnic: cnic || "42101-1234567-1",
          points: 150, // Starting real bonus points for new signup
          level: 1,
          isCnicVerified: true,
        };

        set((state) => {
          const filtered = state.registeredUsers.filter(
            (u) => !(u.email.toLowerCase() === normalizedEmail && u.role === role)
          );
          return {
            registeredUsers: [...filtered, newUser],
            user: newUser,
            isDemo: false,
          };
        });
      },
      enterDemo: (role) => set({ user: { ...demoProfiles[role] } as User, isDemo: true }),
      logout: () => set({ user: null, isDemo: false }),
      addPoints: (pts) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, points: (state.user.points ?? 0) + pts };
          const updatedRegistry = state.registeredUsers.map((u) =>
            u.email === updatedUser.email && u.role === updatedUser.role ? updatedUser : u
          );
          return { user: updatedUser, registeredUsers: updatedRegistry };
        });
      },
    }),
    { name: "greenpulse-auth-v2" }
  )
);

