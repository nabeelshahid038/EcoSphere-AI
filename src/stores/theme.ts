import { useEffect } from "react";
import { create } from "zustand";

export type ThemeMode = "light";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export function applyTheme(_mode?: string) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
}

export const useThemeStore = create<ThemeState>()(() => ({
  mode: "light",
  setMode: () => {
    applyTheme("light");
  },
}));

export function ThemeInitializer() {
  useEffect(() => {
    applyTheme("light");
  }, []);

  return null;
}

