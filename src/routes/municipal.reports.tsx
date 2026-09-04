import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, TrendingDown, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { OrgShell, KpiCard, Panel } from "@/components/gp/OrgShell";
import { municipalNav } from "./municipal.dashboard";

export const Route = createFileRoute("/municipal/reports")({
  head: () => ({
    meta: [
      { title: "Operations Reports — EcoSphere Municipal Portal" },
      {
        name: "description",
        content: "Monthly and quarterly operations reports for Karachi municipal waste management.",
      },
      { property: "og:title", content: "Operations Reports — EcoSphere" },
      {
        property: "og:description",
        content: "Verified impact reports for city council and public disclosure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MunicipalReports,
});

const monthlyReports = [
  {
    month: "September 2026",
    issues: 312,
    resolved: 184,
    tonnes: 18.6,
    rating: "4.6",
    status: "Draft",
  },
  {
    month: "August 2026",
    issues: 298,
    resolved: 176,
    tonnes: 17.2,
    rating: "4.5",
    status: "Published",
  },
  {
    month: "July 2026",
    issues: 276,
    resolved: 158,
    tonnes: 15.8,
    rating: "4.4",
    status: "Published",
  },
  {
    month: "June 2026",
    issues: 254,
    resolved: 142,
    tonnes: 14.1,
    rating: "4.3",
    status: "Published",
  },
];

const highlights = [
  { label: "Citizen reports up", value: "+12%", tone: "primary" as const, icon: Users },
  { label: "Resolution time down", value: "-8%", tone: "info" as const, icon: TrendingDown },
  { label: "Verified tonnage up", value: "+9%", tone: "primary" as const, icon: TrendingUp },
];

function MunicipalReports() {
  return (
    <OrgShell
      nav={municipalNav}
      brand="Karachi Municipal Operations"
      brandSub="City Waste Authority"
      title="Operations reports"
      subtitle="Monthly summaries for council review"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monthly operations reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every figure is backed by citizen-submitted, AI-verified evidence.
          </p>
        </div>
        <button
          onClick={() => toast.success("September operations report export is ready.")}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
        >
          <Download className="size-4" /> Export September report
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.label} className="card-surface p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-accent">
                <h.icon className="size-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {h.label}
                </p>
                <p
                  className={`text-2xl font-bold ${h.tone === "primary" ? "text-primary" : "text-info"}`}
                >
                  {h.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Report archive" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {[
                  "Month",
                  "Reports received",
                  "Resolved",
                  "Tonnage",
                  "Citizen rating",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyReports.map((r) => (
                <tr key={r.month} className="transition hover:bg-muted/60">
                  <td className="px-3 py-3 font-medium">{r.month}</td>
                  <td className="px-3 py-3">{r.issues}</td>
                  <td className="px-3 py-3 text-primary">{r.resolved}</td>
                  <td className="px-3 py-3">{r.tonnes} t</td>
                  <td className="px-3 py-3">{r.rating}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        r.status === "Published"
                          ? "bg-primary/15 text-primary"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toast.success(`${r.month} report is ready for download.`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <FileText className="size-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Report contents">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>Executive summary</span>
              <span className="text-xs text-primary">Included</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>District-level issue breakdown</span>
              <span className="text-xs text-primary">Included</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>Fleet utilisation and route efficiency</span>
              <span className="text-xs text-primary">Included</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>Verified evidence gallery</span>
              <span className="text-xs text-primary">Included</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>Citizen satisfaction analysis</span>
              <span className="text-xs text-primary">Included</span>
            </li>
          </ul>
        </Panel>

        <Panel title="Public disclosure">
          <p className="text-sm leading-relaxed text-muted-foreground">
            EcoSphere publishes a redacted version of every monthly report so citizens can track
            how their reports translate into city action. Locations are shown at district level to
            protect contributor privacy.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-muted p-4">
            <p className="text-sm font-medium">September report status</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Draft · scheduled for publication on 05 Oct 2026
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-border">
              <div className="h-2 rounded-full bg-primary" style={{ width: "78%" }} />
            </div>
          </div>
        </Panel>
      </div>
    </OrgShell>
  );
}
