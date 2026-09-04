import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { OrgShell, type OrgNavItem } from "@/components/gp/OrgShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/gp/FeedbackStates";
import { municipalHotspots, municipalTeams } from "@/lib/municipal-data";
import { municipalNav } from "./municipal.dashboard";

export const Route = createFileRoute("/municipal/hotspots")({
  head: () => ({
    meta: [
      { title: "Hotspots — GreenPulse Karachi Operations" },
      {
        name: "description",
        content: "Prioritised recurring waste and drainage hotspots across Karachi.",
      },
    ],
  }),
  component: MunicipalHotspots,
});

type SeverityFilter = "All" | "Critical" | "High" | "Medium";
type Hotspot = (typeof municipalHotspots)[number];

function MunicipalHotspots() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<SeverityFilter>("All");
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [team, setTeam] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const hotspots = useMemo(
    () =>
      municipalHotspots.filter((hotspot) => {
        const matchesSearch = `${hotspot.location} ${hotspot.district}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        return matchesSearch && (severity === "All" || hotspot.severity === severity);
      }),
    [query, severity],
  );

  const selectHotspot = (hotspot: Hotspot) => {
    setSelected(hotspot);
    setTeam(
      assignments[hotspot.id] ??
        (hotspot.team === "Unassigned" ? (municipalTeams[0] ?? "") : hotspot.team),
    );
  };

  const assignTeam = () => {
    if (!selected || !team) return;
    setAssignments((current) => ({ ...current, [selected.id]: team }));
    toast.success(`${team} assigned to ${selected.location}.`);
    setSelected(null);
  };

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Recurring hotspots"
      subtitle="Prioritise repeat locations before they escalate"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Summary
          label="Tracked hotspots"
          value={String(municipalHotspots.length)}
          detail="Across 5 districts"
        />
        <Summary
          label="Critical priority"
          value="1"
          detail="Response target: 2 hours"
          tone="text-destructive"
        />
        <Summary
          label="Recurring reports"
          value="123"
          detail="In the past 30 days"
          tone="text-amber"
        />
      </div>

      <div className="card-surface mt-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search hotspots</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a location or district"
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Severity
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value as SeverityFilter)}
            className="ml-2 h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {(["All", "Critical", "High", "Medium"] as const).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <Link
          to="/municipal/map"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold transition hover:bg-muted"
        >
          <MapPin className="size-4" /> View map
        </Link>
      </div>

      {hotspots.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No matching hotspots"
            detail="Try a broader location search or clear the severity filter."
            action={
              <button
                onClick={() => {
                  setQuery("");
                  setSeverity("All");
                }}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="card-surface mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {[
                    "Location",
                    "Reports",
                    "Severity",
                    "Last response",
                    "Repeat frequency",
                    "Assigned team",
                    "",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hotspots.map((hotspot) => (
                  <tr key={hotspot.id} className="transition hover:bg-muted/60">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{hotspot.location}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {hotspot.id} · {hotspot.district}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold">{hotspot.reports}</td>
                    <td className="px-4 py-4">
                      <SeverityBadge severity={hotspot.severity} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{hotspot.lastResponse}</td>
                    <td className="px-4 py-4 text-muted-foreground">{hotspot.repeatFrequency}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium">
                        {assignments[hotspot.id] ?? hotspot.team}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => selectHotspot(hotspot)}
                        className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover"
                      >
                        Assign team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 md:hidden">
            {hotspots.map((hotspot) => (
              <article key={hotspot.id} className="card-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{hotspot.location}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {hotspot.id} · {hotspot.district}
                    </p>
                  </div>
                  <SeverityBadge severity={hotspot.severity} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Metric label="Reports" value={String(hotspot.reports)} />
                  <Metric label="Last response" value={hotspot.lastResponse} />
                  <Metric label="Repeat frequency" value={hotspot.repeatFrequency} />
                  <Metric label="Assigned team" value={assignments[hotspot.id] ?? hotspot.team} />
                </dl>
                <button
                  onClick={() => selectHotspot(hotspot)}
                  className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                >
                  <Users className="size-4" /> Assign team
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign a response team</DialogTitle>
            <DialogDescription>
              {selected?.location} · {selected?.repeatFrequency}
            </DialogDescription>
          </DialogHeader>
          <label className="text-sm font-semibold">
            Response team
            <select
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm font-normal"
            >
              <option value="">Choose a team</option>
              {municipalTeams.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <DialogFooter>
            <button
              onClick={() => setSelected(null)}
              className="h-10 rounded-lg border border-border px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={assignTeam}
              disabled={!team}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm assignment
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OrgShell>
  );
}

function Summary({
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
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
function SeverityBadge({ severity }: { severity: Hotspot["severity"] }) {
  const className = {
    Critical: "bg-destructive/10 text-destructive",
    High: "bg-amber/15 text-amber",
    Medium: "bg-info/10 text-info",
  }[severity];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}>
      {severity}
    </span>
  );
}
