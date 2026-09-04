import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  MapPinned,
  ChartNoAxesCombined,
  AlertTriangle,
  Route as RouteIcon,
  FileBarChart,
  Settings,
  Truck,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
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
  Legend,
} from "recharts";
import { OrgShell, KpiCard, Panel, type OrgNavItem } from "@/components/gp/OrgShell";
import {
  collectionRoutes,
  dailyIssueVolume,
  fleetVehicles,
  issueStatusSplit,
  municipalDistricts,
  municipalIssues,
} from "@/lib/org-data";

export const municipalNav: OrgNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/municipal/dashboard" },
  { label: "Live Map", icon: Map, to: "/municipal/map" },
  { label: "Hotspots", icon: MapPinned, to: "/municipal/hotspots" },
  { label: "Analytics", icon: ChartNoAxesCombined, to: "/municipal/analytics" },
  { label: "Issues", icon: AlertTriangle, to: "/municipal/issues" },
  { label: "Routes", icon: RouteIcon, to: "/municipal/routes" },
  { label: "Reports", icon: FileBarChart, to: "/municipal/reports" },
  { label: "Settings", icon: Settings, to: "/municipal/settings" },
];

export const Route = createFileRoute("/municipal/dashboard")({
  head: () => ({
    meta: [
      { title: "Municipal Dashboard — GreenPulse Karachi Operations" },
      {
        name: "description",
        content:
          "Karachi Municipal Operations command dashboard: open reports, fleet status, district breakdown and verified citizen actions.",
      },
      { property: "og:title", content: "Municipal Dashboard — GreenPulse" },
      {
        property: "og:description",
        content: "City-scale waste operations dashboard for Karachi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MunicipalDashboard,
});

function MunicipalDashboard() {
  const latestIssues = municipalIssues.slice(0, 5);

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Municipal Operations Center"
      subtitle="Karachi pilot · 6 districts · real-time citizen reports"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard
          label="Open reports"
          value="214"
          badge="38 today"
          tone="danger"
          sub="Across 6 districts"
        />
        <KpiCard label="Scheduled" value="38" tone="amber" sub="Crews assigned" />
        <KpiCard label="Resolved this week" value="96" tone="primary" sub="Avg 31h resolution" />
        <KpiCard label="Active trucks" value="42" tone="info" sub="3 in maintenance" />
        <KpiCard label="Avg resolution" value="31h" tone="default" sub="Down 4h vs last week" />
        <KpiCard label="Citizen rating" value="4.6" tone="primary" sub="From 1,840 responses" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel
          title="Latest citizen reports"
          className="lg:col-span-2"
          action={
            <Link to="/municipal/issues" className="text-xs font-semibold text-primary">
              View all →
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {latestIssues.map((issue) => (
              <li key={issue.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-lg">
                  {issue.type === "Illegal dumping" && "🚛"}
                  {issue.type === "Blocked drain" && "🚰"}
                  {issue.type === "Public litter" && "🗑️"}
                  {issue.type === "Open burning" && "🔥"}
                  {issue.type === "Waste mismanagement" && "⚠️"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{issue.type}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {issue.id} · {issue.location} · {issue.reported}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    issue.severity === "Major"
                      ? "bg-destructive/10 text-destructive"
                      : issue.severity === "Moderate"
                        ? "bg-amber/15 text-amber"
                        : "bg-info/10 text-info"
                  }`}
                >
                  {issue.severity}
                </span>
                <StatusBadge status={issue.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Issue status">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueStatusSplit}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {issueStatusSplit.map((s) => (
                    <Cell key={s.name} fill={s.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {issueStatusSplit.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold">{s.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Daily issue volume" className="mt-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyIssueVolume}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
              <Tooltip cursor={{ fill: "var(--color-muted)" }} />
              <Legend verticalAlign="top" height={24} iconType="circle" />
              <Bar
                dataKey="open"
                fill="var(--color-destructive)"
                radius={[6, 6, 0, 0]}
                name="Reported"
              />
              <Bar
                dataKey="resolved"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                name="Resolved"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="District breakdown">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {["District", "Open", "Scheduled", "Resolved", "Status"].map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {municipalDistricts.map((d) => (
                  <tr key={d.name} className="transition hover:bg-muted/60">
                    <td className="px-3 py-3 font-medium">{d.name}</td>
                    <td className="px-3 py-3 text-destructive">{d.open}</td>
                    <td className="px-3 py-3 text-amber">{d.scheduled}</td>
                    <td className="px-3 py-3 text-primary">{d.resolved}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          d.status === "Critical"
                            ? "bg-destructive/10 text-destructive"
                            : d.status === "Moderate"
                              ? "bg-amber/15 text-amber"
                              : "bg-primary/15 text-primary"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Fleet status"
          action={<span className="text-xs text-muted-foreground">Live</span>}
        >
          <ul className="space-y-3">
            {fleetVehicles.map((v) => (
              <li
                key={v.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-muted">
                  <Truck className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{v.id}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {v.driver} · {v.route}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      v.status === "Active"
                        ? "bg-primary/15 text-primary"
                        : v.status === "Maintenance"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.status}
                  </span>
                  {v.status === "Active" && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{v.load}% load</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Today's collection routes" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Route", "Start", "Stops", "Trucks", "Progress", "Status"].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {collectionRoutes.map((r) => {
                const pct = parseInt(r.completion, 10);
                return (
                  <tr key={r.id} className="transition hover:bg-muted/60">
                    <td className="px-3 py-3">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-[11px] text-muted-foreground">{r.id}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{r.start}</td>
                    <td className="px-3 py-3">{r.stops}</td>
                    <td className="px-3 py-3">{r.trucks}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{r.completion}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          r.status === "In progress"
                            ? "bg-primary/15 text-primary"
                            : r.status === "Pending"
                              ? "bg-amber/15 text-amber"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {r.status}
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

function StatusBadge({ status }: { status: "Open" | "Scheduled" | "Resolved" }) {
  const cls = {
    Open: "bg-destructive/10 text-destructive",
    Scheduled: "bg-amber/15 text-amber",
    Resolved: "bg-primary/15 text-primary",
  }[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>{status}</span>
  );
}
