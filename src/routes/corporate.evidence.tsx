import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download, X } from "lucide-react";
import { toast } from "sonner";
import { OrgShell } from "@/components/gp/OrgShell";
import { corporateNav } from "./corporate.dashboard";
import { evidenceGallery, evidenceTimeline, evidenceTypes } from "@/lib/org-data";

export const Route = createFileRoute("/corporate/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Center — GreenPulse Corporate Portal" },
      {
        name: "description",
        content:
          "Browse the full verification trail behind every sponsored action: photos, GPS, timestamps, AI analysis and NGO sign-off.",
      },
      { property: "og:title", content: "Evidence Center — GreenPulse" },
      {
        property: "og:description",
        content: "Audit-ready verification trail for sponsored environmental impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvidenceCenter,
});

function EvidenceCenter() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = evidenceGallery.find((e) => e.id === openId) ?? null;

  return (
    <OrgShell
      nav={corporateNav}
      brand="Acme Consumer Group"
      brandSub="Sustainability office"
      title="Evidence Center"
      subtitle="Every claim traceable to its source"
    >
      <h1 className="text-2xl font-bold">Evidence Center</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Each verified action carries a complete trail — original photo, GPS fix, timestamp, AI
        classification, community votes and NGO sign-off. Locations are shown at city level to
        protect contributor privacy.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {evidenceTypes.map((t) => (
          <div
            key={t.key}
            className="rounded-xl border border-border bg-card px-4 py-3 transition hover:-translate-y-0.5"
          >
            <p className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="size-4 text-primary" />
              {t.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {evidenceGallery.map((e) => (
          <button
            key={e.id}
            onClick={() => setOpenId(e.id)}
            className="card-surface overflow-hidden text-left transition hover:-translate-y-1"
          >
            <div className={`grid h-36 place-items-center bg-gradient-to-br ${e.cover} text-5xl`}>
              {e.emoji}
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {e.id}
              </p>
              <p className="mt-1 truncate text-sm font-semibold">{e.action}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {e.date} · {e.location}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="size-3.5" /> {e.level}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex flex-col bg-foreground/80 lg:flex-row">
          <button
            onClick={() => setOpenId(null)}
            className="absolute right-4 top-4 z-10 rounded-lg bg-card p-2"
            aria-label="Close viewer"
          >
            <X className="size-5" />
          </button>
          <div
            className={`grid flex-1 place-items-center bg-gradient-to-br ${active.cover} text-[8rem]`}
          >
            {active.emoji}
          </div>
          <aside className="w-full shrink-0 overflow-y-auto bg-card p-6 lg:w-[380px]">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {active.id}
            </p>
            <h2 className="mt-1 text-lg font-bold">{active.action}</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {[
                ["Date", active.date],
                ["Location", active.location],
                ["AI confidence", `${active.confidence}%`],
                ["Verification level", active.level],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-2.5">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Verification timeline
            </p>
            <ol className="mt-3 space-y-4 border-l border-border pl-5">
              {evidenceTimeline.map((t) => (
                <li key={t.label} className="relative">
                  <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card" />
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.time}</p>
                </li>
              ))}
            </ol>

            <button
              onClick={() => toast.success(`${active.id} evidence pack is ready for download.`)}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
            >
              <Download className="size-4" /> Download evidence pack
            </button>
          </aside>
        </div>
      )}
    </OrgShell>
  );
}
