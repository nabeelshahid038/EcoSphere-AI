import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoProfiles, type Role } from "@/lib/mock-data";

export type UserHistoryItem = {
  id: string;
  emoji: string;
  date: string;
  action: string;
  verified: boolean;
  points: number;
};

export type User = {
  name: string;
  email: string;
  phone: string;
  role: Role;
  cnic?: string;
  org?: string;
  city: string;
  points?: number;
  level?: number;
  pendingVerifications?: number;
  invested?: string;
  isCnicVerified?: boolean;
  wasteKg?: number;
  actionsCount?: number;
  hoursVolunteered?: number;
  treesTracked?: number;
  createdAt?: string;
  userHistory?: UserHistoryItem[];
};

type AuthState = {
  user: User | null;
  registeredUsers: User[];
  isDemo: boolean;
  login: (email: string, role?: Role) => void;
  register: (details: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    city: string;
    cnic?: string;
    org?: string;
  }) => void;
  updateProfile: (details: Partial<User>) => void;
  enterDemo: (role: Role) => void;
  logout: () => void;
  addPoints: (pts: number, actionName?: string, emoji?: string) => void;
  addHistoryItem: (item: UserHistoryItem) => void;
  checkDuplicate: (email: string, cnic?: string, phone?: string, currentEmail?: string) => {
    emailExists: boolean;
    cnicExists: boolean;
    phoneExists: boolean;
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],
      isDemo: false,

      checkDuplicate: (email, cnic, phone, currentEmail) => {
        const users = get().registeredUsers;
        const normEmail = email?.trim().toLowerCase();
        const normCnic = cnic?.trim();
        const normPhone = phone?.trim();

        const emailExists = Boolean(
          normEmail && users.some((u) => u.email.toLowerCase() === normEmail && u.email.toLowerCase() !== currentEmail?.toLowerCase())
        );
        const cnicExists = Boolean(
          normCnic && users.some((u) => u.cnic && u.cnic.trim() === normCnic && u.email.toLowerCase() !== currentEmail?.toLowerCase())
        );
        const phoneExists = Boolean(
          normPhone && users.some((u) => u.phone && u.phone.trim() === normPhone && u.email.toLowerCase() !== currentEmail?.toLowerCase())
        );

        return { emailExists, cnicExists, phoneExists };
      },

      login: (email, role = "citizen") => {
        const users = get().registeredUsers;
        const normalizedEmail = email.trim().toLowerCase();
        const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.role === role);

        if (existing) {
          set({ user: existing, isDemo: false });
        } else {
          // Format real name from email if user logged in without initial registry match
          const nameFromEmail = email.split("@")[0].replace(/[._-]/g, " ");
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          const realUser: User = {
            name: formattedName,
            email: normalizedEmail,
            phone: "+92 300 1234567",
            role,
            city: "Karachi",
            points: 0,
            level: 1,
            isCnicVerified: true,
            wasteKg: 0,
            actionsCount: 0,
            hoursVolunteered: 0,
            treesTracked: 0,
            createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            userHistory: [],
          };
          set((state) => ({
            registeredUsers: [...state.registeredUsers, realUser],
            user: realUser,
            isDemo: false,
          }));
        }
      },

      register: ({ name, email, phone, role, city, cnic, org }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const newUser: User = {
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          role,
          city: city || "Karachi",
          cnic: cnic?.trim(),
          org: org || (role === "citizen" ? "Karachi" : "Organization"),
          points: 0, // Clean 0 starting points for real new user
          level: 1,
          isCnicVerified: true,
          wasteKg: 0,
          actionsCount: 0,
          hoursVolunteered: 0,
          treesTracked: 0,
          createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          userHistory: [],
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

      updateProfile: (details) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...details };
          const updatedRegistry = state.registeredUsers.map((u) =>
            u.email.toLowerCase() === state.user?.email.toLowerCase() && u.role === state.user?.role
              ? updatedUser
              : u
          );
          return { user: updatedUser, registeredUsers: updatedRegistry };
        });
      },

      enterDemo: (role) =>
        set({
          user: {
            ...demoProfiles[role],
            phone: "+92 300 9876543",
            city: "Karachi",
            wasteKg: 42,
            actionsCount: 18,
            hoursVolunteered: 12,
            treesTracked: 5,
            createdAt: "12 Jan 2026",
          } as User,
          isDemo: true,
        }),

      logout: () => set({ user: null, isDemo: false }),

      addPoints: (pts, actionName = "Verified Environmental Action", emoji = "⚡") => {
        set((state) => {
          if (!state.user) return state;
          const newHistoryItem: UserHistoryItem = {
            id: `act_${Date.now()}`,
            emoji,
            date: "Just now",
            action: actionName,
            verified: true,
            points: pts,
          };
          const updatedUser: User = {
            ...state.user,
            points: (state.user.points ?? 0) + pts,
            actionsCount: (state.user.actionsCount ?? 0) + 1,
            wasteKg: (state.user.wasteKg ?? 0) + (pts > 20 ? 1.5 : 0.5),
            userHistory: [newHistoryItem, ...(state.user.userHistory ?? [])],
          };
          const updatedRegistry = state.registeredUsers.map((u) =>
            u.email.toLowerCase() === updatedUser.email.toLowerCase() && u.role === updatedUser.role ? updatedUser : u
          );
          return { user: updatedUser, registeredUsers: updatedRegistry };
        });
      },

      addHistoryItem: (item) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser: User = {
            ...state.user,
            actionsCount: (state.user.actionsCount ?? 0) + 1,
            userHistory: [item, ...(state.user.userHistory ?? [])],
          };
          const updatedRegistry = state.registeredUsers.map((u) =>
            u.email.toLowerCase() === updatedUser.email.toLowerCase() && u.role === updatedUser.role ? updatedUser : u
          );
          return { user: updatedUser, registeredUsers: updatedRegistry };
        });
      },
    }),
    { name: "greenpulse-auth-v2" }
  )
);

