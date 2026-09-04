import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Route as RouteIcon, Truck, Users } from "lucide-react";
import { OrgShell, KpiCard, Panel, MockMap } from "@/components/gp/OrgShell";
import { municipalNav } from "./municipal.dashboard";
import { collectionRoutes, fleetVehicles } from "@/lib/org-data";

export const Route = createFileRoute("/municipal/routes")({
  head: () => ({
    meta: [
      { title: "Collection Routes — EcoSphere Municipal Portal" },
      {
        name: "description",
        content: "Plan, monitor and optimise municipal waste collection routes across Karachi.",
      },
      { property: "og:title", content: "Collection Routes — EcoSphere" },
      {
        property: "og:description",
        content: "Live route tracking and crew scheduling for city waste operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MunicipalRoutes,
});

const routePins = [
  {
    id: "r1",
    type: "scan" as const,
    label: "Clifton Beach Loop",
    area: "Clifton",
    top: 68,
    left: 42,
  },
  {
    id: "r2",
    type: "scan" as const,
    label: "Korangi Industrial Sweep",
    area: "Korangi",
    top: 55,
    left: 70,
  },
  {
    id: "r3",
    type: "dumping" as const,
    label: "Lyari Riverbank Clearance",
    area: "Lyari",
    top: 24,
    left: 30,
  },
  {
    id: "r4",
    type: "tree" as const,
    label: "Saddar Market Run",
    area: "Saddar",
    top: 40,
    left: 52,
  },
];

function MunicipalRoutes() {
  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Collection routes"
      subtitle="9 active routes · 42 trucks deployed"
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Active routes" value="9" tone="primary" sub="3 pending start" />
        <KpiCard label="Trucks deployed" value="42" tone="info" sub="38 active, 4 maintenance" />
        <KpiCard label="Stops today" value="186" tone="amber" sub="Across 6 districts" />
        <KpiCard label="Completion" value="58%" tone="primary" sub="City-wide average" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Route map">
          <MockMap pins={routePins} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary" /> Active collection
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-destructive" /> Dumping clearance
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary-dark" /> Green routes
            </span>
          </div>
        </Panel>

        <Panel title="Fleet status">
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

      <Panel title="Route schedule" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {[
                  "Route",
                  "Start time",
                  "Stops",
                  "Trucks",
                  "Crew",
                  "Progress",
                  "ETA",
                  "Status",
                ].map((h) => (
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
                    <td className="px-3 py-3 text-muted-foreground">{r.trucks * 2} workers</td>
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
                    <td className="px-3 py-3 text-muted-foreground">
                      {pct === 100 ? "Done" : "2h 10m"}
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
