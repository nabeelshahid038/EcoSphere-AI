import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  FileText,
  HeartHandshake,
  Home,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

const commandEvent = "ecosphere:open-command-palette";

const pages = [
  { label: "Home", detail: "EcoSphere landing", to: "/", icon: Home, group: "Explore" },
  {
    label: "Citizen home",
    detail: "Personal impact dashboard",
    to: "/citizen/home",
    icon: Users,
    group: "Citizen",
  },
  {
    label: "Report an issue",
    detail: "Submit a city report",
    to: "/citizen/report",
    icon: Sparkles,
    group: "Citizen",
  },
  {
    label: "Municipal dashboard",
    detail: "Karachi operations center",
    to: "/municipal/dashboard",
    icon: Building2,
    group: "Municipal",
  },
  {
    label: "Live operations map",
    detail: "Reports across Karachi",
    to: "/municipal/map",
    icon: Map,
    group: "Municipal",
  },
  {
    label: "Hotspots",
    detail: "Recurring incident locations",
    to: "/municipal/hotspots",
    icon: ShieldCheck,
    group: "Municipal",
  },
  {
    label: "Municipal analytics",
    detail: "Reports and response trends",
    to: "/municipal/analytics",
    icon: BarChart3,
    group: "Municipal",
  },
  {
    label: "Operations reports",
    detail: "Monthly city reporting",
    to: "/municipal/reports",
    icon: FileText,
    group: "Municipal",
  },
  {
    label: "NGO dashboard",
    detail: "Verification and drives",
    to: "/ngo/dashboard",
    icon: HeartHandshake,
    group: "Organisation",
  },
  {
    label: "Corporate dashboard",
    detail: "Campaign performance",
    to: "/corporate/dashboard",
    icon: Building2,
    group: "Organisation",
  },
] as const;

export function openCommandPalette() {
  window.dispatchEvent(new Event(commandEvent));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const openPalette = () => setOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener(commandEvent, openPalette);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(commandEvent, openPalette);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and workspaces…" />
      <CommandList>
        <CommandEmpty>No matching page found.</CommandEmpty>
        {Array.from(new Set(pages.map((page) => page.group))).map((group) => (
          <CommandGroup key={group} heading={group}>
            {pages
              .filter((page) => page.group === group)
              .map((page) => (
                <CommandItem
                  key={page.to}
                  value={`${page.label} ${page.detail}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: page.to });
                  }}
                >
                  <page.icon />
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span>{page.label}</span>
                    <span className="text-xs text-muted-foreground">{page.detail}</span>
                  </span>
                  <Search className="size-3.5 text-muted-foreground" />
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <span>Search every workspace</span>
        <CommandShortcut>ESC</CommandShortcut>
      </div>
    </CommandDialog>
  );
}
