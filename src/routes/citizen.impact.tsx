import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Clock, Info, Recycle, TreePine, Zap, X } from "lucide-react";
import { CitizenShell, SectionTitle } from "@/components/gp/CitizenShell";
import { citizenProfile, impactSummary, impactTimeline } from "@/lib/citizen-data";

export const Route = createFileRoute("/citizen/impact")({
  head: () => ({
    meta: [
      { title: "My Impact — GreenPulse" },
      {
        name: "description",
        content:
          "Your verified GreenPulse Impact Score, waste recovered, hours volunteered and tree tracking in Karachi.",
      },
      { property: "og:title", content: "My Impact — GreenPulse" },
      { property: "og:description", content: "Audited environmental impact, action by action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImpactPage,
});

function ImpactPage() {
  const [open, setOpen] = useState(false);
  return (
    <CitizenShell>
      <h1 className="text-xl font-bold">My Impact</h1>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {citizenProfile.city} · lifetime, audited
      </p>

      <div className="card-surface mt-5 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Impact Score
        </p>
        <p className="mt-2 text-6xl font-bold text-primary">{citizenProfile.impactScore}</p>
        <button
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-info"
        >
          <Info className="size-3.5" /> How is this calculated?
        </button>
      </div>

      <SectionTitle>Metrics</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Waste", value: `${impactSummary.wasteKg} kg`, icon: Recycle },
          { label: "Actions", value: `${impactSummary.actions}`, icon: Zap },
          { label: "Hours", value: `${impactSummary.hours}`, icon: Clock },
          { label: "Trees", value: `${impactSummary.trees}`, icon: TreePine },
        ].map((m) => (
          <div key={m.label} className="card-surface p-4">
            <m.icon className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">{m.value}</p>
            <p className="text-[11px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Impact Timeline</SectionTitle>
      <ol className="relative space-y-4 border-l border-border pl-5">
        {impactTimeline.map((t) => (
          <li key={t.id} className="relative">
            <span className="absolute -left-[26px] top-4 size-2.5 rounded-full bg-primary" />
            <div className="card-surface p-4">
              <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent text-xl">
                  {t.emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{t.date}</p>
                  <p className="text-sm font-semibold leading-snug">{t.action}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {t.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        <BadgeCheck className="size-3" /> Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-semibold text-amber">
                        Pending
                      </span>
                    )}
                    {t.points > 0 && (
                      <span className="text-[11px] font-bold text-primary">+{t.points} GP</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[oklch(0.21_0.04_265/0.5)] px-5">
          <div className="w-full max-w-sm rounded-xl bg-card p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-bold">How the Impact Score works</h2>
              <button aria-label="Close" onClick={() => setOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Your score blends four audited signals: verified waste recovered (40%), verified
              actions (30%), volunteer hours (20%) and tree survival checks (10%). Only
              human-verified, AI-classified evidence counts.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-5 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </CitizenShell>
  );
}
