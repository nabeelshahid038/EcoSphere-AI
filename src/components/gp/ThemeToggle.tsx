import { Laptop, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeStore, type ThemeMode } from "@/stores/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => value && setMode(value as ThemeMode)}
      aria-label="Color theme"
      className={
        compact
          ? "rounded-lg border border-border p-0.5"
          : "justify-start rounded-lg border border-border p-1"
      }
    >
      <ToggleGroupItem
        value="light"
        aria-label="Use light theme"
        className={compact ? "size-8 p-0" : "px-3"}
      >
        <Sun className="size-4" />
        {!compact && <span className="ml-1.5">Light</span>}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Use dark theme"
        className={compact ? "size-8 p-0" : "px-3"}
      >
        <Moon className="size-4" />
        {!compact && <span className="ml-1.5">Dark</span>}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="Use system theme"
        className={compact ? "size-8 p-0" : "px-3"}
      >
        <Laptop className="size-4" />
        {!compact && <span className="ml-1.5">System</span>}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
