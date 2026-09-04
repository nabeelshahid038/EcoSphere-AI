import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Flag, Users, TreePine, ChevronRight, Coins, Target } from "lucide-react";
import { CitizenShell, SectionTitle } from "@/components/gp/CitizenShell";
import { citizenProfile, impactSummary, nearbyActivity, campaigns } from "@/lib/citizen-data";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/citizen/home")({
  head: () => ({
    meta: [
      { title: "Citizen Home — GreenPulse Karachi" },
      {
        name: "description",
        content:
          "Your daily GreenPulse mission, GreenPoints, nearby verified activity and active Karachi campaigns.",
      },
      { property: "og:title", content: "Citizen Home — GreenPulse" },
      { property: "og:description", content: "Your verified environmental actions in Karachi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CitizenHome,
});

const actionStyles = {
  scan: "bg-primary text-primary-foreground",
  report: "bg-destructive text-destructive-foreground",
  cleanup: "bg-info text-primary-foreground",
  trees: "bg-primary-dark text-primary-foreground",
};

function CitizenHome() {
  const user = useAuthStore((s) => s.user);
  const first = user?.name?.split(" ")[0] ?? citizenProfile.firstName;
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <CitizenShell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">Good morning, {first}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{today} · Karachi</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1.5 text-sm font-bold text-amber">
          <Coins className="size-4" />
          {(user?.points ?? citizenProfile.points).toLocaleString()} GP
        </span>
      </header>

      <div className="mt-5 rounded-xl bg-primary p-4 sm:p-5 text-primary-foreground shadow-[var(--shadow-glow)]">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide opacity-90">
          <Target className="size-4" /> Today&apos;s Mission
        </p>
        <p className="mt-2 text-base sm:text-lg font-bold leading-snug">Dispose waste at a Smart Bin or report dumping</p>
        <p className="mt-1 text-xs opacity-90">Earn +150 GP · Verified real-world impact</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/citizen/report"
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg bg-card px-3 sm:px-4 text-xs sm:text-sm font-semibold text-primary transition active:scale-[0.97]"
          >
            Report Issue
          </Link>
          <Link
            to="/citizen/scanner"
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg border border-primary-foreground/30 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10 active:scale-[0.97]"
          >
            Scan Guide
          </Link>
        </div>
      </div>

      <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "scan", label: "Scan Waste", to: "/citizen/scanner", icon: Camera },
          { key: "report", label: "Report Issue", to: "/citizen/report", icon: Flag },
          { key: "cleanup", label: "Join Cleanup", to: "/citizen/campaigns", icon: Users },
          { key: "trees", label: "Track Trees", to: "/citizen/impact", icon: TreePine },
        ].map((a) => (
          <Link
            key={a.key}
            to={a.to}
            className={`rounded-xl p-4 transition active:scale-[0.97] ${
              actionStyles[a.key as keyof typeof actionStyles]
            }`}
          >
            <a.icon className="size-6" />
            <p className="mt-3 text-sm font-semibold">{a.label}</p>
          </Link>
        ))}
      </div>

      <SectionTitle>Nearby Activity</SectionTitle>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {nearbyActivity.map((n) => (
          <div key={n.id} className="card-surface w-52 shrink-0 p-4">
            <div className="grid h-20 w-full place-items-center rounded-lg bg-accent text-3xl">
              {n.emoji}
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug">{n.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{n.area}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {n.distance} · {n.time}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle
        action={
          <Link to="/citizen/campaigns" className="text-xs font-semibold text-primary">
            See all
          </Link>
        }
      >
        Active Campaigns
      </SectionTitle>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {campaigns.slice(0, 3).map((c) => (
          <div key={c.id} className="card-surface w-[85%] shrink-0 snap-center p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {c.emoji} {c.title}
              </p>
              <span className="text-sm font-bold text-primary">{c.progress}%</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{c.location}</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {c.participants.toLocaleString()} joined
              </p>
              <Link
                to="/citizen/campaigns/$id"
                params={{ id: c.id }}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition active:scale-[0.97]"
              >
                Join <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Impact Summary</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Waste", value: `${impactSummary.wasteKg} kg` },
          { label: "Actions", value: `${impactSummary.actions}` },
          { label: "Hours", value: `${impactSummary.hours}` },
        ].map((m) => (
          <div key={m.label} className="card-surface p-4 text-center">
            <p className="text-lg font-bold text-primary">{m.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </CitizenShell>
  );
}
