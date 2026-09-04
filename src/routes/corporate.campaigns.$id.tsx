import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { OrgShell, KpiCard, Panel, MockMap } from "@/components/gp/OrgShell";
import { corporateNav } from "./corporate.dashboard";
import {
  campaignTimeline,
  corporateCampaigns,
  evidenceGallery,
  mapPins,
  topContributors,
} from "@/lib/org-data";

export const Route = createFileRoute("/corporate/campaigns/$id")({
  head: () => ({
    meta: [
      { title: "Campaign Detail — EcoSphere Corporate Portal" },
      {
        name: "description",
        content:
          "Sponsored campaign performance: investment, verified recovery, impact map, participants, timeline and evidence trail.",
      },
      { property: "og:title", content: "Campaign Detail — EcoSphere" },
      {
        property: "og:description",
        content: "Verified campaign impact with geo-tagged evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignDetail,
});

const tabs = [
  "Overview",
  "Impact Map",
  "Participants",
  "Timeline",
  "Evidence",
  "Settings",
] as const;
const pinFilters = ["All", "Dumping", "Scans", "Trees"] as const;

function CampaignDetail() {
  const { id } = Route.useParams();
  const campaign = corporateCampaigns.find((c) => c.id === id) ?? corporateCampaigns[0]!;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [pinFilter, setPinFilter] = useState<(typeof pinFilters)[number]>("All");
  const pct = Math.round((campaign.verifiedKg / campaign.targetKg) * 100);

  const pins = mapPins.filter((p) =>
    pinFilter === "All"
      ? true
      : pinFilter === "Dumping"
        ? p.type === "dumping"
        : pinFilter === "Scans"
          ? p.type === "scan"
          : p.type === "tree",
  );

  return (
    <OrgShell
      nav={corporateNav}
      brand="Acme Consumer Group"
      brandSub="Sustainability office"
      title={campaign.name}
      subtitle={`${campaign.city} · sponsored campaign`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${campaign.cover} p-8 text-white`}
      >
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
          {campaign.status}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{campaign.name}</h1>
        <p className="mt-1 text-sm text-white/80">
          {campaign.sponsor} · {campaign.city}
        </p>
        <Link
          to="/corporate/dashboard"
          className="mt-4 inline-block text-xs text-white/80 hover:text-white"
        >
          ← Back to command center
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Investment" value={campaign.investment} />
        <KpiCard label="Target" value={`${campaign.targetKg.toLocaleString()} kg`} />
        <KpiCard
          label="Verified"
          value={`${campaign.verifiedKg.toLocaleString()} kg`}
          tone="primary"
        />
        <KpiCard label="Progress" value={`${pct}%`} tone="info" />
        <KpiCard label="Participants" value={campaign.participants.toLocaleString()} tone="amber" />
        <KpiCard label="Verification rate" value={`${campaign.verificationRate}%`} tone="primary" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-px">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "Overview" && (
          <Panel title="About this campaign">
            <p className="text-sm leading-relaxed text-muted-foreground">{campaign.about}</p>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {campaign.verifiedKg.toLocaleString()} kg of {campaign.targetKg.toLocaleString()} kg
              verified by Green Earth Foundation
            </p>
          </Panel>
        )}

        {tab === "Impact Map" && (
          <Panel
            title="Impact map"
            action={
              <div className="flex flex-wrap gap-2">
                {pinFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setPinFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      pinFilter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          >
            <MockMap pins={pins} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-destructive" /> Dumping reports
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-primary" /> Verified scans
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-primary-dark" /> Tree plantings
              </span>
              <span>{pins.length} clustered locations shown</span>
            </div>
          </Panel>
        )}

        {tab === "Participants" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-4">
              <KpiCard label="Total participants" value={campaign.participants.toLocaleString()} />
              <KpiCard label="Active this month" value="1,182" tone="primary" />
              <KpiCard label="Volunteer hours" value="6,940" tone="info" />
              <KpiCard label="Retention" value="68%" tone="amber" />
            </div>
            <Panel title="Top contributors">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      {["Name", "Area", "Actions", "Recovered", "Hours"].map((h) => (
                        <th key={h} className="px-3 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topContributors.map((c) => (
                      <tr key={c.name}>
                        <td className="px-3 py-3 font-medium">{c.name}</td>
                        <td className="px-3 py-3 text-muted-foreground">{c.area}</td>
                        <td className="px-3 py-3">{c.actions}</td>
                        <td className="px-3 py-3">{c.kg} kg</td>
                        <td className="px-3 py-3 text-muted-foreground">{c.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {tab === "Timeline" && (
          <Panel title="Campaign timeline">
            <ol className="relative space-y-6 border-l border-border pl-6">
              {campaignTimeline.map((e) => (
                <li key={e.title} className="relative">
                  <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary ring-4 ring-card" />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{e.title}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        e.status === "Completed"
                          ? "bg-primary/15 text-primary"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                </li>
              ))}
            </ol>
          </Panel>
        )}

        {tab === "Evidence" && (
          <Panel
            title="Evidence samples"
            action={
              <Link to="/corporate/evidence" className="text-xs font-semibold text-primary">
                Open Evidence Center →
              </Link>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {evidenceGallery.slice(0, 4).map((e) => (
                <div key={e.id} className="overflow-hidden rounded-xl border border-border">
                  <div
                    className={`grid h-28 place-items-center bg-gradient-to-br ${e.cover} text-4xl`}
                  >
                    {e.emoji}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground">{e.id}</p>
                    <p className="truncate text-sm font-medium">{e.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "Settings" && (
          <Panel title="Campaign settings">
            <ul className="divide-y divide-border text-sm">
              {[
                ["Verification partner", "Green Earth Foundation"],
                ["Geo-fence radius", "500 m"],
                ["Evidence retention", "7 years"],
                ["Public reporting", "Enabled"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button
          onClick={() => toast.success(`${campaign.name} ESG report export is ready.`)}
          className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary-hover active:scale-[0.97]"
        >
          Export ESG report
        </button>
      </div>
    </OrgShell>
  );
}
