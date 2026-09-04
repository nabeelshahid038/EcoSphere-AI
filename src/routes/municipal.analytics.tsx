import { useEffect, useMemo, useState, type ReactElement } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OrgShell, Panel } from "@/components/gp/OrgShell";
import { CardGridSkeleton, EmptyState } from "@/components/gp/FeedbackStates";
import {
  categoryData,
  districtReportData,
  municipalIncidents,
  resolutionRateData,
  responseTimeData,
  weeklyTrendData,
} from "@/lib/municipal-data";
import { municipalNav } from "./municipal.dashboard";

export const Route = createFileRoute("/municipal/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — GreenPulse Karachi Operations" },
      {
        name: "description",
        content: "Operational trends for city waste, drainage and cleanup response across Karachi.",
      },
    ],
  }),
  component: MunicipalAnalytics,
});

const districtOptions = [
  "All districts",
  "Karachi South",
  "Korangi",
  "Karachi West",
  "Karachi East",
  "Malir",
  "Karachi Central",
];
type ActivityFilter = "All activity" | "Operational queue" | "Resolved activity";

function MunicipalAnalytics() {
  const [mounted, setMounted] = useState(false);
  const [district, setDistrict] = useState("All districts");
  const [activity, setActivity] = useState<ActivityFilter>("All activity");

  useEffect(() => setMounted(true), []);

  const incidents = useMemo(
    () =>
      municipalIncidents.filter((incident) => {
        const inDistrict = district === "All districts" || incident.district === district;
        const inActivity =
          activity === "All activity" ||
          (activity === "Resolved activity"
            ? incident.status === "Resolved"
            : incident.status !== "Resolved");
        return inDistrict && inActivity;
      }),
    [activity, district],
  );

  const districtData =
    district === "All districts"
      ? districtReportData
      : districtReportData.filter((item) => item.district === district.replace("Karachi ", ""));
  const isEmpty = incidents.length === 0;

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Operational analytics"
      subtitle="Response performance and recurring signal trends"
    >
      <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-semibold text-muted-foreground">
          District
          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="mt-1 block h-10 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {districtOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-xs font-semibold text-muted-foreground">
          Activity
          <select
            value={activity}
            onChange={(event) => setActivity(event.target.value as ActivityFilter)}
            className="mt-1 block h-10 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {(["All activity", "Operational queue", "Resolved activity"] as const).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            setDistrict("All districts");
            setActivity("All activity");
          }}
          className="h-10 rounded-lg border border-border px-3 text-sm font-semibold transition hover:bg-muted"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Signals in view"
          value={String(incidents.length)}
          detail={district === "All districts" ? "Live Karachi sample" : district}
        />
        <Metric
          label="Resolved rate"
          value="78%"
          detail="Up 4 points since August"
          tone="text-primary"
        />
        <Metric label="Avg response" value="28h" detail="Down 18h since April" tone="text-info" />
      </div>

      {!mounted ? (
        <div className="mt-5">
          <CardGridSkeleton count={5} />
        </div>
      ) : isEmpty ? (
        <div className="mt-5">
          <EmptyState
            title="No analytics for these filters"
            detail="There are no current municipal signals in this district and activity view."
            action={
              <button
                onClick={() => {
                  setDistrict("All districts");
                  setActivity("All activity");
                }}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Show all analytics
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <Panel title="Reports by district">
            <ChartFrame>
              <BarChart data={districtData}>
                <XAxis dataKey="district" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} />
                <Bar
                  dataKey="reports"
                  fill="var(--color-primary)"
                  radius={[6, 6, 0, 0]}
                  name="Reports"
                />
              </BarChart>
            </ChartFrame>
          </Panel>
          <Panel title="Resolution rate">
            <ChartFrame>
              <LineChart data={resolutionRateData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} unit="%" width={38} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-primary)" }}
                  name="Resolved"
                />
              </LineChart>
            </ChartFrame>
          </Panel>
          <Panel title="Average response time">
            <ChartFrame>
              <LineChart data={responseTimeData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} unit="h" width={36} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--color-info)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-info)" }}
                  name="Hours"
                />
              </LineChart>
            </ChartFrame>
          </Panel>
          <Panel title="Issue categories">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {categoryData.map((category) => (
                      <Cell key={category.name} fill={category.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}{" "}
                  <strong className="ml-auto text-foreground">{category.value}%</strong>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Weekly report and resolution trend" className="xl:col-span-2">
            <ChartFrame>
              <AreaChart data={weeklyTrendData}>
                <defs>
                  <linearGradient id="reportedArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="var(--color-destructive)"
                  strokeWidth={2.5}
                  fill="url(#reportedArea)"
                  name="Reported"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#resolvedArea)"
                  name="Resolved"
                />
              </AreaChart>
            </ChartFrame>
          </Panel>
        </div>
      )}
    </OrgShell>
  );
}

function ChartFrame({ children }: { children: ReactElement }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
function Metric({
  label,
  value,
  detail,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <section className="card-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </section>
  );
}
