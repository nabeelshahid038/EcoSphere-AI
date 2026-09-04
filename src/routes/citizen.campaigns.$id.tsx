import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Users, Recycle, Trophy } from "lucide-react";
import { CitizenBottomNav } from "@/components/gp/CitizenShell";
import { campaigns } from "@/lib/citizen-data";

export const Route = createFileRoute("/citizen/campaigns/$id")({
  head: () => ({
    meta: [
      { title: "Campaign Detail — GreenPulse" },
      {
        name: "description",
        content:
          "Campaign progress, verification map and gallery for GreenPulse Karachi environmental campaigns.",
      },
      { property: "og:title", content: "Campaign Detail — GreenPulse" },
      { property: "og:description", content: "Track live campaign progress and join the drive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignDetail,
});

const tabs = ["About", "Progress", "Map", "Gallery"] as const;

function CampaignDetail() {
  const { id } = useParams({ from: "/citizen/campaigns/$id" });
  const campaign = campaigns.find((c) => c.id === id) ?? campaigns[0]!;
  const [tab, setTab] = useState<(typeof tabs)[number]>("About");
  const [joined, setJoined] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-44">
        <div className="relative grid h-44 place-items-center bg-accent text-6xl">
          {campaign.emoji}
          <Link
            to="/citizen/campaigns"
            className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-card"
            aria-label="Back to campaigns"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        <div className="px-4 pt-5">
          <h1 className="text-xl font-bold">{campaign.title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Sponsored by {campaign.sponsor}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {campaign.location}
          </p>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { label: "Progress", value: `${campaign.progress}%`, icon: Trophy },
              {
                label: "Recovered",
                value: `${(campaign.currentKg / 1000).toFixed(1)}t`,
                icon: Recycle,
              },
              {
                label: "People",
                value: `${(campaign.participants / 1000).toFixed(1)}k`,
                icon: Users,
              },
              { label: "Reward", value: campaign.reward.split(" ")[0]!, icon: Trophy },
            ].map((m) => (
              <div key={m.label} className="card-surface p-3 text-center">
                <m.icon className="mx-auto size-4 text-primary" />
                <p className="mt-1.5 text-sm font-bold">{m.value}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2 rounded-lg bg-muted p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-9 flex-1 rounded-md text-xs font-semibold transition ${
                  tab === t
                    ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "About" && (
              <p className="text-sm leading-relaxed text-muted-foreground">{campaign.about}</p>
            )}
            {tab === "Progress" && (
              <div className="card-surface p-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {campaign.currentKg.toLocaleString()} / {campaign.targetKg.toLocaleString()} kg
                  </p>
                  <span className="text-sm font-bold text-primary">{campaign.progress}%</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <li>• 412 kg verified this week</li>
                  <li>• 96% AI-classification accuracy</li>
                  <li>• Audited by Green Earth Foundation</li>
                </ul>
              </div>
            )}
            {tab === "Map" && (
              <div className="card-surface relative h-56 overflow-hidden">
                <div className="absolute inset-0 hero-gradient opacity-90" />
                {[
                  { top: "30%", left: "25%" },
                  { top: "55%", left: "60%" },
                  { top: "70%", left: "35%" },
                ].map((p) => (
                  <span key={p.left} className="absolute" style={p}>
                    <span className="pulse-ring absolute inset-0 rounded-full bg-primary" />
                    <span className="relative block size-3 rounded-full bg-primary" />
                  </span>
                ))}
                <p className="absolute bottom-3 left-4 text-xs font-medium text-primary-foreground">
                  3 active collection zones
                </p>
              </div>
            )}
            {tab === "Gallery" && (
              <div className="grid grid-cols-3 gap-2">
                {["♻️", "🧹", "🌊", "🗑️", "🌳", "📸"].map((e) => (
                  <div
                    key={e}
                    className="grid aspect-square place-items-center rounded-lg bg-accent text-2xl"
                  >
                    {e}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[60px] z-40 mx-auto max-w-md border-t border-border bg-card px-4 py-3">
        <button
          onClick={() => setJoined(true)}
          className={`h-11 w-full rounded-lg text-sm font-semibold transition active:scale-[0.98] ${
            joined ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {joined ? "✓ You joined this campaign" : "Join Campaign"}
        </button>
      </div>

      <CitizenBottomNav />
    </div>
  );
}
