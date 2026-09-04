import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { OrgShell } from "@/components/gp/OrgShell";
import { MunicipalLeafletMap } from "@/components/gp/MunicipalLeafletMap";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  municipalIncidents,
  workflowSteps,
  type MunicipalIncident,
  type MunicipalLayer,
} from "@/lib/municipal-data";
import { municipalNav } from "./municipal.dashboard";

export const Route = createFileRoute("/municipal/map")({
  head: () => ({
    meta: [
      { title: "Municipal Live Map — EcoSphere Karachi Operations" },
      {
        name: "description",
        content:
          "Live operational view of reported waste, drainage and cleanup incidents across Karachi.",
      },
    ],
  }),
  component: MunicipalMap,
});

const layers: { label: MunicipalLayer; color: string }[] = [
  { label: "Dumping", color: "bg-destructive" },
  { label: "Litter", color: "bg-amber" },
  { label: "Burning", color: "bg-orange-500" },
  { label: "Blocked Drain", color: "bg-info" },
  { label: "Cleanup", color: "bg-primary" },
  { label: "Resolved", color: "bg-slate-400" },
];

function MunicipalMap() {
  const [enabledLayers, setEnabledLayers] = useState<MunicipalLayer[]>(
    layers.map((layer) => layer.label),
  );
  const [timeframe, setTimeframe] = useState("24h");
  const [customHours, setCustomHours] = useState("72");
  const [highSeverityOnly, setHighSeverityOnly] = useState(false);
  const [statsOpen, setStatsOpen] = useState(true);
  const [selected, setSelected] = useState<MunicipalIncident | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const hours =
    timeframe === "24h"
      ? 24
      : timeframe === "7d"
        ? 168
        : timeframe === "30d"
          ? 720
          : Number(customHours);
  const incidents = useMemo(
    () =>
      municipalIncidents.filter(
        (incident) =>
          enabledLayers.includes(incident.layer) &&
          incident.hoursAgo <= hours &&
          (!highSeverityOnly || incident.severity === "High" || incident.severity === "Critical"),
      ),
    [enabledLayers, highSeverityOnly, hours],
  );
  const resolved = incidents.filter((incident) => incident.status === "Resolved").length;
  const pending = incidents.length - resolved;
  const hotspots = new Set(
    incidents
      .filter((incident) => incident.severity === "High" || incident.severity === "Critical")
      .map((incident) => incident.location),
  ).size;

  const selectedTeam = selected ? (assigned[selected.id] ?? selected.assignedTeam) : "";
  const selectedStep = selected ? workflowSteps.indexOf(selected.status) : -1;

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Live operations map"
      subtitle={`${incidents.length} active signals · Karachi, PKT`}
      fullBleed
    >
      <div className="relative h-[calc(100dvh-4rem)] min-h-[600px] bg-muted">
        <MunicipalLeafletMap incidents={incidents} onSelect={setSelected} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-col gap-3 p-3 sm:p-4 lg:right-auto lg:w-[370px]">
          <section className="pointer-events-auto rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Incident layers</p>
                <p className="text-xs text-muted-foreground">Click a pin for field detail</p>
              </div>
              <Filter className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {layers.map((layer) => (
                <button
                  key={layer.label}
                  onClick={() =>
                    setEnabledLayers((current) =>
                      current.includes(layer.label)
                        ? current.filter((item) => item !== layer.label)
                        : [...current, layer.label],
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${enabledLayers.includes(layer.label) ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground"}`}
                >
                  <span className={`size-2 rounded-full ${layer.color}`} /> {layer.label}
                </button>
              ))}
              <button
                onClick={() => setHighSeverityOnly((current) => !current)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${highSeverityOnly ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-card text-muted-foreground"}`}
              >
                <span className="size-2 rounded-full bg-destructive pulse-ring" /> High severity
              </button>
            </div>
          </section>
          <section className="pointer-events-auto rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Time window
            </p>
            <ToggleGroup
              type="single"
              value={timeframe}
              onValueChange={(value) => value && setTimeframe(value)}
              className="mt-2 justify-start rounded-lg bg-muted p-1"
            >
              <ToggleGroupItem value="24h" className="h-8 px-2.5 text-xs">
                24h
              </ToggleGroupItem>
              <ToggleGroupItem value="7d" className="h-8 px-2.5 text-xs">
                7d
              </ToggleGroupItem>
              <ToggleGroupItem value="30d" className="h-8 px-2.5 text-xs">
                30d
              </ToggleGroupItem>
              <ToggleGroupItem value="custom" className="h-8 px-2.5 text-xs">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
            {timeframe === "custom" && (
              <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                Show last{" "}
                <select
                  value={customHours}
                  onChange={(event) => setCustomHours(event.target.value)}
                  className="h-8 rounded-md border border-border bg-card px-2 text-foreground"
                >
                  <option value="12">12 hours</option>
                  <option value="72">3 days</option>
                  <option value="336">14 days</option>
                </select>
              </label>
            )}
          </section>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-3 z-[500] w-[calc(100%-1.5rem)] sm:right-4 sm:w-72">
          <section className="pointer-events-auto overflow-hidden rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur">
            <button
              onClick={() => setStatsOpen((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold">Live operations</span>
              {statsOpen ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </button>
            {statsOpen && (
              <div className="grid grid-cols-2 gap-px border-t border-border bg-border">
                <Stat label="Total reports" value={String(incidents.length)} />
                <Stat label="Hotspots" value={String(hotspots)} />
                <Stat
                  label="Resolved"
                  value={`${incidents.length ? Math.round((resolved / incidents.length) * 100) : 0}%`}
                  tone="text-primary"
                />
                <Stat
                  label="Pending"
                  value={`${incidents.length ? Math.round((pending / incidents.length) * 100) : 0}%`}
                  tone="text-amber"
                />
              </div>
            )}
          </section>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-3 z-[500] hidden rounded-lg border border-border bg-card/95 px-3 py-2 text-[11px] text-muted-foreground shadow-lg sm:block">
          Map data · OpenStreetMap · Last refreshed 09:14 PKT
        </div>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b border-border px-6 py-5 pr-12">
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>
                  {selected.id} · {selected.reportedAt}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 p-6">
                <div
                  className={`relative h-44 overflow-hidden rounded-xl bg-gradient-to-br ${selected.photoTheme} p-4 text-white`}
                >
                  {(selected.layer === "Dumping" || selected.layer === "Blocked Drain") && (
                    <img
                      src={
                        selected.layer === "Dumping"
                          ? "/municipal-incident-dumping.png"
                          : "/municipal-incident-drain.png"
                      }
                      alt={`${selected.title} at ${selected.location}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative inline-flex rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold">
                    Field photo · citizen verified
                  </span>
                  <p className="absolute bottom-4 left-4 text-sm font-semibold">
                    {selected.location}
                  </p>
                </div>
                <section className="rounded-xl border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Incident detail
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selected.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Detail
                      icon={<MapPin className="size-4" />}
                      label="District"
                      value={selected.district}
                    />
                    <Detail
                      icon={<ShieldCheck className="size-4" />}
                      label="AI confidence"
                      value={`${selected.aiConfidence}%`}
                    />
                    <Detail
                      icon={<Users className="size-4" />}
                      label="Assigned team"
                      value={selectedTeam}
                    />
                    <Detail
                      icon={<Navigation className="size-4" />}
                      label="Response due"
                      value={selected.responseDue}
                    />
                  </div>
                </section>
                <section>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Workflow
                    </p>
                    <span className="text-xs font-semibold text-primary">{selected.status}</span>
                  </div>
                  <ol className="mt-4 space-y-0">
                    {workflowSteps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${index <= selectedStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {index + 1}
                          </span>
                          {index < workflowSteps.length - 1 && (
                            <span
                              className={`h-6 w-px ${index < selectedStep ? "bg-primary" : "bg-border"}`}
                            />
                          )}
                        </div>
                        <div className="pb-3 pt-0.5">
                          <p
                            className={`text-sm ${index <= selectedStep ? "font-semibold" : "text-muted-foreground"}`}
                          >
                            {step}
                          </p>
                          {index === selectedStep && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Current operational state
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Repeat pattern
                  </p>
                  <p className="mt-1 text-sm font-medium">{selected.repeatFrequency}</p>
                  <button
                    onClick={() => toast.success("Investigation note added to the hotspot record.")}
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    Add hotspot investigation note
                  </button>
                </section>
              </div>
              <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-border bg-card p-4">
                <button
                  onClick={() => {
                    setAssigned((current) => ({
                      ...current,
                      [selected.id]: "Rapid Response Unit 2",
                    }));
                    toast.success("Rapid Response Unit 2 assigned.");
                  }}
                  className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                >
                  Assign team
                </button>
                <button
                  onClick={() => {
                    toast.success("Crew status request sent.");
                  }}
                  className="h-10 rounded-lg border border-border text-sm font-semibold transition hover:bg-muted"
                >
                  Request update
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </OrgShell>
  );
}

function Stat({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="bg-card px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-medium leading-snug">{value}</p>
    </div>
  );
}
