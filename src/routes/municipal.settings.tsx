import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Globe2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { OrgShell, Panel } from "@/components/gp/OrgShell";
import { ThemeToggle } from "@/components/gp/ThemeToggle";
import { useThemeStore } from "@/stores/theme";
import { municipalNav } from "./municipal.dashboard";

export const Route = createFileRoute("/municipal/settings")({
  head: () => ({
    meta: [
      { title: "Settings — GreenPulse Karachi Operations" },
      {
        name: "description",
        content: "Municipal operations preferences and notification settings.",
      },
    ],
  }),
  component: MunicipalSettings,
});

function MunicipalSettings() {
  const mode = useThemeStore((state) => state.mode);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailyBrief, setDailyBrief] = useState(true);

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Workspace settings"
      subtitle="Personal display and operational notification preferences"
    >
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-5">
          <Panel title="Display theme">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Choose the workspace appearance</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  System follows your device preference. Your choice persists after reload.
                </p>
              </div>
              <ThemeToggle />
              <p className="text-xs text-muted-foreground">
                Current selection:{" "}
                <span className="font-semibold capitalize text-foreground">{mode}</span>
              </p>
            </div>
          </Panel>
          <Panel title="Notifications">
            <div className="divide-y divide-border">
              <SettingRow
                icon={<Bell className="size-5" />}
                title="Critical incident alerts"
                detail="Notify when high-severity incidents need a response."
                checked={criticalAlerts}
                onChange={setCriticalAlerts}
              />
              <SettingRow
                icon={<Globe2 className="size-5" />}
                title="Daily operations brief"
                detail="Receive a 09:00 PKT district performance summary."
                checked={dailyBrief}
                onChange={setDailyBrief}
              />
            </div>
          </Panel>
          <Panel title="Workspace controls">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Save operational preferences</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This demo stores personal preferences locally in this browser.
                </p>
              </div>
              <button
                onClick={() => toast.success("Workspace preferences saved.")}
                className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Save preferences
              </button>
            </div>
          </Panel>
        </div>
        <aside className="space-y-5">
          <section className="card-surface p-5">
            <ShieldCheck className="size-6 text-primary" />
            <h2 className="mt-3 text-base font-semibold">Operations access</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Municipal operator access is managed by the City Waste Authority.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-4" /> Active workspace
            </div>
          </section>
          <section className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Data region
            </p>
            <p className="mt-2 text-sm font-semibold">Karachi pilot · Pakistan Standard Time</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Times and response targets are shown in PKT.
            </p>
          </section>
        </aside>
      </div>
    </OrgShell>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-muted-foreground/35"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-card shadow transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}
