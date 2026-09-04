import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import { CitizenShell } from "@/components/gp/CitizenShell";
import { campaignFilters, campaigns } from "@/lib/citizen-data";

export const Route = createFileRoute("/citizen/campaigns/")({
  head: () => ({
    meta: [
      { title: "Campaigns — EcoSphere Karachi" },
      {
        name: "description",
        content:
          "Browse Karachi cleanup, recycling and tree-planting campaigns, see live progress and join in one tap.",
      },
      { property: "og:title", content: "Campaigns — EcoSphere" },
      { property: "og:description", content: "Sponsored environmental campaigns across Karachi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? campaigns : campaigns.filter((c) => c.tags.includes(filter));

  return (
    <CitizenShell>
      <h1 className="text-xl font-bold">Campaigns</h1>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Karachi pilot · {campaigns.length} live
      </p>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {campaignFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {list.map((c) => (
          <Link
            key={c.id}
            to="/citizen/campaigns/$id"
            params={{ id: c.id }}
            className="card-surface block overflow-hidden"
          >
            <div className="grid h-32 w-full place-items-center bg-accent text-5xl">{c.emoji}</div>
            <div className="p-5">
              <p className="font-semibold">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Sponsored by {c.sponsor}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {c.location}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="size-3.5" /> {c.participants.toLocaleString()} participants
                </span>
                <span className="font-semibold text-primary">{c.reward}</span>
              </div>
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No campaigns match “{filter}” yet.
          </p>
        )}
      </div>
    </CitizenShell>
  );
}
