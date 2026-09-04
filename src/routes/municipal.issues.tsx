import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { OrgShell, KpiCard, Panel } from "@/components/gp/OrgShell";
import { municipalNav } from "./municipal.dashboard";
import {
  municipalIssues,
  type MunicipalIssue,
  type MunicipalIssueStatus,
  type MunicipalSeverity,
} from "@/lib/org-data";

export const Route = createFileRoute("/municipal/issues")({
  head: () => ({
    meta: [
      { title: "Issue Queue — GreenPulse Municipal Portal" },
      {
        name: "description",
        content:
          "Review, schedule and resolve citizen-reported waste issues across Karachi districts.",
      },
      { property: "og:title", content: "Issue Queue — GreenPulse" },
      {
        property: "og:description",
        content: "City operations issue queue with severity filters and location verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MunicipalIssues,
});

const statuses: ("All" | MunicipalIssueStatus)[] = ["All", "Open", "Scheduled", "Resolved"];
const severities: ("All" | MunicipalSeverity)[] = ["All", "Minor", "Moderate", "Major"];
const types = [
  "All",
  "Illegal dumping",
  "Blocked drain",
  "Public litter",
  "Open burning",
  "Waste mismanagement",
];
const districts = ["All", "Clifton", "Korangi", "Lyari", "Saddar", "Gulshan", "Orangi"];

function MunicipalIssues() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [severity, setSeverity] = useState<(typeof severities)[number]>("All");
  const [type, setType] = useState("All");
  const [district, setDistrict] = useState("All");
  const [selected, setSelected] = useState<MunicipalIssue | null>(null);
  const [statusByIssue, setStatusByIssue] = useState<Record<string, MunicipalIssueStatus>>({});

  const rows = useMemo(
    () =>
      municipalIssues.filter(
        (issue) =>
          (status === "All" || (statusByIssue[issue.id] ?? issue.status) === status) &&
          (severity === "All" || issue.severity === severity) &&
          (type === "All" || issue.type === type) &&
          (district === "All" || issue.district === district),
      ),
    [status, severity, type, district, statusByIssue],
  );
  const selectedStatus = selected ? (statusByIssue[selected.id] ?? selected.status) : null;
  const updateSelectedStatus = (nextStatus: MunicipalIssueStatus, message: string) => {
    if (!selected) return;
    setStatusByIssue((current) => ({ ...current, [selected.id]: nextStatus }));
    toast.success(message);
  };

  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Issue queue"
      subtitle={`${rows.length} reports match your filters`}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Open" value="214" tone="danger" />
        <KpiCard label="Scheduled" value="38" tone="amber" />
        <KpiCard label="Resolved this week" value="96" tone="primary" />
        <KpiCard label="Avg resolution" value="31h" tone="info" />
      </div>

      <div className="card-surface mt-5 flex flex-wrap items-end gap-4 p-4">
        <FilterSelect label="Status" value={status} options={statuses} onChange={setStatus} />
        <FilterSelect
          label="Severity"
          value={severity}
          options={severities}
          onChange={setSeverity}
        />
        <FilterSelect label="Type" value={type} options={types} onChange={setType} />
        <FilterSelect
          label="District"
          value={district}
          options={districts}
          onChange={setDistrict}
        />
      </div>

      <div className="card-surface mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {[
                "Issue",
                "Type",
                "District",
                "Location",
                "Severity",
                "Status",
                "Reported",
                "Reporter",
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="cursor-pointer transition hover:bg-muted/60"
              >
                <td className="px-4 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    {r.id}
                  </span>
                </td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.district}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.location}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={r.severity} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={statusByIssue[r.id] ?? r.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.reported}</td>
                <td className="px-4 py-3">{r.reportedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No reports match these filters.
          </p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSelected(null)} />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col overflow-y-auto border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{selected.type}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.id} · {selected.reported}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 pb-28">
              <section className="rounded-xl border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Location
                </p>
                <div className="mt-2 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 text-primary" />
                  {selected.location}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.district} · {selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}
                </p>
                <div className="relative mt-3 h-40 overflow-hidden rounded-xl border border-border bg-muted">
                  <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px]" />
                  <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 bg-primary/10" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary p-1.5 ring-4 ring-card">
                    <MapPin className="size-3.5 text-primary-foreground" />
                  </span>
                </div>
              </section>

              <section className="rounded-xl border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Details
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Severity</span>
                    <SeverityBadge severity={selected.severity} />
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={selectedStatus ?? selected.status} />
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Reported by</span>
                    <span className="font-medium">{selected.reportedBy}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">AI verification</span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      <CheckCircle2 className="size-4" /> Passed
                    </span>
                  </li>
                </ul>
              </section>
            </div>

            <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 border-t border-border bg-card p-4">
              {selectedStatus !== "Resolved" && (
                <button
                  onClick={() =>
                    updateSelectedStatus("Scheduled", "Crew scheduled for this issue.")
                  }
                  className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
                >
                  Schedule crew
                </button>
              )}
              {selectedStatus !== "Resolved" ? (
                <button
                  onClick={() => updateSelectedStatus("Resolved", "Issue marked as resolved.")}
                  className="h-10 rounded-lg border border-border text-sm font-medium transition active:scale-[0.97]"
                >
                  Mark resolved
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateSelectedStatus("Open", "Issue reopened and returned to the queue.")
                  }
                  className="col-span-2 h-10 rounded-lg border border-border text-sm font-medium transition active:scale-[0.97]"
                >
                  Reopen issue
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </OrgShell>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="text-xs font-semibold text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function SeverityBadge({ severity }: { severity: MunicipalSeverity }) {
  const cls = {
    Minor: "bg-info/10 text-info",
    Moderate: "bg-amber/15 text-amber",
    Major: "bg-destructive/10 text-destructive",
  }[severity];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>{severity}</span>
  );
}

function StatusBadge({ status }: { status: MunicipalIssueStatus }) {
  const cls = {
    Open: "bg-destructive/10 text-destructive",
    Scheduled: "bg-amber/15 text-amber",
    Resolved: "bg-primary/15 text-primary",
  }[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>{status}</span>
  );
}
