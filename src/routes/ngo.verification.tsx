import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MapPin, ThumbsUp, X } from "lucide-react";
import { toast } from "sonner";
import { OrgShell } from "@/components/gp/OrgShell";
import { ngoNav } from "./ngo.dashboard";
import {
  ngoCampaignNames,
  rejectReasons,
  verificationQueue,
  type EvidenceItem,
  type VerificationStatus,
} from "@/lib/org-data";

export const Route = createFileRoute("/ngo/verification")({
  head: () => ({
    meta: [
      { title: "Verification Queue — GreenPulse NGO Portal" },
      {
        name: "description",
        content:
          "Review AI-classified evidence with GPS, duplicate checks and community votes, then approve, reject or request more info.",
      },
      { property: "og:title", content: "Verification Queue — GreenPulse" },
      {
        property: "og:description",
        content: "Human-in-the-loop review of environmental action evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificationQueue,
});

const statuses = ["All", "Pending", "Approved", "Rejected", "More info"] as const;
const ranges = ["Last 7 days", "Last 30 days", "Last 90 days", "Custom"] as const;

function VerificationQueue() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [campaign, setCampaign] = useState(ngoCampaignNames[0]);
  const [range, setRange] = useState<(typeof ranges)[number]>("Last 30 days");
  const [minConfidence, setMinConfidence] = useState(60);
  const [selected, setSelected] = useState<EvidenceItem | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(rejectReasons[0]);
  const [notes, setNotes] = useState("");
  const [statusByEvidence, setStatusByEvidence] = useState<Record<string, VerificationStatus>>({});

  const reviewSelected = (nextStatus: VerificationStatus, message: string) => {
    if (!selected) return;
    setStatusByEvidence((current) => ({ ...current, [selected.id]: nextStatus }));
    toast.success(message);
    setSelected(null);
  };

  const rows = useMemo(
    () =>
      verificationQueue.filter(
        (r) =>
          (status === "All" || (statusByEvidence[r.id] ?? r.status) === status) &&
          (campaign === ngoCampaignNames[0] || r.campaign === campaign) &&
          r.confidence >= minConfidence,
      ),
    [status, campaign, minConfidence, statusByEvidence],
  );

  return (
    <OrgShell
      nav={ngoNav}
      brand="Green Earth Foundation"
      brandSub="Verification partner"
      title="Verification queue"
      subtitle={`${rows.length} submissions match your filters`}
    >
      <div className="card-surface flex flex-wrap items-end gap-4 p-4">
        <label className="text-xs font-semibold text-muted-foreground">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])}
            className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Campaign
          <select
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {ngoCampaignNames.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Date range
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as (typeof ranges)[number])}
            className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
          >
            {ranges.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="min-w-52 text-xs font-semibold text-muted-foreground">
          AI confidence ≥ {minConfidence}%
          <input
            type="range"
            min={0}
            max={100}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="mt-3 block w-full accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div className="card-surface mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {[
                "Evidence",
                "User",
                "Action type",
                "Location",
                "AI",
                "Votes",
                "Status",
                "Submitted",
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
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-muted text-lg">
                      {r.emoji}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{r.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{r.user}</td>
                <td className="px-4 py-3">{r.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.location}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-info/10 px-2.5 py-1 text-[11px] font-semibold text-info">
                    {r.confidence}%
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.votes}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={statusByEvidence[r.id] ?? r.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No submissions match these filters.
          </p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSelected(null)} />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col overflow-y-auto border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{selected.action}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.id} · {selected.user}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 pb-32">
              <div className="grid h-48 place-items-center rounded-xl bg-gradient-to-br from-primary-deep to-primary-dark text-6xl">
                {selected.emoji}
              </div>

              <section className="rounded-xl border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  AI analysis
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Waste detected</span>
                    <span className="font-medium">
                      {selected.weightKg ? `${selected.weightKg} kg` : "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{selected.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-info">{selected.confidence}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Duplicate check</span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      <CheckCircle2 className="size-4" /> Passed
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Location check</span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      <CheckCircle2 className="size-4" /> Passed
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Location · 500 m radius
                </p>
                <div className="relative mt-2 h-40 overflow-hidden rounded-xl border border-border bg-muted">
                  <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px]" />
                  <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 bg-primary/10" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary p-1.5 ring-4 ring-card">
                    <MapPin className="size-3.5 text-primary-foreground" />
                  </span>
                  <p className="absolute bottom-2 left-3 text-[11px] font-medium text-muted-foreground">
                    {selected.location} · {selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}
                  </p>
                </div>
              </section>

              <section>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Community upvotes ({selected.votes})
                </p>
                <ul className="mt-2 space-y-2">
                  {["Zara Ali", "Bilal Raza", "Nida Kamal", "Usman Tariq"].map((n) => (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="size-4 text-primary" />
                      <span>{n}</span>
                      <span className="ml-auto text-xs text-muted-foreground">verified peer</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="sticky bottom-0 mt-auto grid grid-cols-3 gap-2 border-t border-border bg-card p-4">
              <button
                onClick={() =>
                  reviewSelected("Approved", "Evidence approved and the citizen has been notified.")
                }
                className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
              >
                Approve
              </button>
              <button
                onClick={() => setRejecting(true)}
                className="h-10 rounded-lg bg-destructive text-sm font-semibold text-destructive-foreground transition active:scale-[0.97]"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  reviewSelected("More info", "More information requested from the citizen.")
                }
                className="h-10 rounded-lg bg-amber text-sm font-semibold text-white transition active:scale-[0.97]"
              >
                More info
              </button>
            </div>
          </aside>
        </div>
      )}

      {rejecting && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-5">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setRejecting(false)} />
          <div className="card-surface relative w-full max-w-md p-6">
            <h3 className="text-base font-bold">Reject evidence</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The citizen is notified with your reason and notes.
            </p>
            <label className="mt-4 block text-xs font-semibold text-muted-foreground">
              Reason
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block h-10 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground"
              >
                {rejectReasons.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-xs font-semibold text-muted-foreground">
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add context for the reviewer trail…"
                className="mt-1 block w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRejecting(false)}
                className="h-10 rounded-lg border border-border px-4 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reviewSelected("Rejected", `Evidence rejected: ${reason}.`);
                  setRejecting(false);
                  setNotes("");
                }}
                className="h-10 rounded-lg bg-destructive px-4 text-sm font-semibold text-destructive-foreground"
              >
                Confirm rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </OrgShell>
  );
}

function StatusBadge({ status }: { status: EvidenceItem["status"] }) {
  const cls = {
    Pending: "bg-amber/15 text-amber",
    Approved: "bg-primary/15 text-primary",
    Rejected: "bg-destructive/10 text-destructive",
    "More info": "bg-info/10 text-info",
  }[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>{status}</span>
  );
}
