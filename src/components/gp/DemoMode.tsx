import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Landmark, Sprout, User, Gamepad2, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth";
import { roleHome, type Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const options: {
  role: Role;
  icon: typeof User;
  title: string;
  subtitle: string;
  detail: string;
}[] = [
  {
    role: "citizen",
    icon: User,
    title: "Ahmed Khan",
    subtitle: "Citizen · Karachi",
    detail: "2,450 GP · Level 7",
  },
  {
    role: "ngo",
    icon: Sprout,
    title: "Green Earth Foundation",
    subtitle: "NGO Verifier",
    detail: "28 pending verifications",
  },
  {
    role: "corporate",
    icon: Building2,
    title: "Acme Consumer Group",
    subtitle: "Corporate Sponsor",
    detail: "₨8.4M invested",
  },
  {
    role: "municipal",
    icon: Landmark,
    title: "Karachi Municipal Operations",
    subtitle: "City Authority",
    detail: "Live operations map",
  },
];

export function DemoModeDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const enterDemo = useAuthStore((s) => s.enterDemo);

  function pick(role: Role) {
    enterDemo(role);
    onOpenChange(false);
    navigate({ to: roleHome[role] });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Experience as…</DialogTitle>
          <DialogDescription>
            Explore GreenPulse with pre-loaded Karachi pilot data. No account needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {options.map((o) => (
            <button
              key={o.role}
              onClick={() => pick(o.role)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition active:scale-[0.985] hover:border-primary/50 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <o.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{o.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {o.subtitle} · {o.detail}
                </span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DemoModeButton({ inverted = false }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <DemoModeDialog open={open} onOpenChange={setOpen}>
      <button
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition active:scale-[0.97]",
          inverted
            ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            : "border-border bg-card text-foreground hover:border-primary/50",
        )}
      >
        <Gamepad2 className="size-4" />
        Demo Mode
      </button>
    </DemoModeDialog>
  );
}
