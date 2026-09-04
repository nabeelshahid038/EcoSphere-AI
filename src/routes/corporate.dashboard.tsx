import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  Megaphone,
  BarChart3,
  FileImage,
  FileText,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OrgShell, KpiCard, Panel, type OrgNavItem } from "@/components/gp/OrgShell";
import { corporateCampaigns, monthlyActions, wasteBreakdown } from "@/lib/org-data";

export const corporateNav: OrgNavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/corporate/dashboard" },
  { label: "Projects", icon: FolderKanban },
  { label: "Campaigns", icon: Megaphone },
  { label: "Impact", icon: BarChart3 },
  { label: "Evidence", icon: FileImage, to: "/corporate/evidence" },
  { label: "Reports", icon: FileText },
  { label: "Team", icon: Users },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/corporate/dashboard")({
  head: () => ({
    meta: [
      { title: "Environmental Impact Command Center — GreenPulse" },
      {
        name: "description",
        content:
          "Acme Consumer Group's sponsored recovery campaigns, verified tonnage, cost per kilogram and audit-ready ESG evidence.",
      },
      { property: "og:title", content: "Corporate Command Center — GreenPulse" },
      {
        property: "og:description",
        content: "Sponsored environmental impact, verified and ready for ESG disclosure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CorporateDashboard,
});

const dateRanges = ["Last 30 days", "Last 90 days", "This year", "Custom"] as const;

function CorporateDashboard() {
  const [range, setRange] = useState<(typeof dateRanges)[number]>("Last 90 days");

  return (
    <OrgShell
      nav={corporateNav}
      brand="Acme Consumer Group"
      brandSub="Sustainability office"
      title="Environmental Impact Command Center"
      subtitle={`FY26 plastic pledge · ${range}`}
      actions={
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as (typeof dateRanges)[number])}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium"
        >
          {dateRanges.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      }
    >
      <h1 className="text-2xl font-bold">Environmental Impact Command Center</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every number below traces back to verified, geo-tagged citizen evidence.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Investment" value="₨8.4M" sub="Across 8 campaigns" />
        <KpiCard label="Impact" value="82.4 t" sub="Verified recovery" tone="primary" />
        <KpiCard label="Actions" value="31,820" sub="+18% QoQ" tone="info" />
        <KpiCard label="Participants" value="12,480" sub="Karachi pilot" tone="amber" />
        <KpiCard label="Campaigns" value="8" sub="4 active now" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="Monthly verified actions" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActions}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} />
                <Bar dataKey="actions" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Waste breakdown (tonnes)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteBreakdown}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {wasteBreakdown.map((w) => (
                    <Cell key={w.name} fill={w.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {wasteBreakdown.map((w) => (
              <li key={w.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full" style={{ background: w.color }} />
                  {w.name}
                </span>
                <span className="font-semibold">{w.value} t</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Active campaigns" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Campaign", "City", "Investment", "Progress", "Participants", "Status"].map(
                  (h) => (
                    <th key={h} className="px-3 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {corporateCampaigns.map((c) => {
                const pct = Math.round((c.verifiedKg / c.targetKg) * 100);
                return (
                  <tr key={c.id} className="transition hover:bg-muted/60">
                    <td className="px-3 py-3">
                      <Link
                        to="/corporate/campaigns/$id"
                        params={{ id: c.id }}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{c.city}</td>
                    <td className="px-3 py-3">{c.investment}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {c.participants.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          c.status === "Active"
                            ? "bg-primary/15 text-primary"
                            : "bg-amber/15 text-amber"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </OrgShell>
  );
}
