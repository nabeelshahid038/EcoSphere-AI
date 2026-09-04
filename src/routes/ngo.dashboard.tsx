import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Users,
  BarChart3,
  FileImage,
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
import { approvalSplit, verificationQueue, weeklyVerification } from "@/lib/org-data";

export const ngoNav: OrgNavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/ngo/dashboard" },
  { label: "Campaigns", icon: Megaphone },
  { label: "Verification", icon: ShieldCheck, to: "/ngo/verification" },
  { label: "Volunteers", icon: Users },
  { label: "Impact", icon: BarChart3 },
  { label: "Evidence", icon: FileImage },
  { label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/ngo/dashboard")({
  head: () => ({
    meta: [
      { title: "NGO Dashboard — EcoSphere Verification" },
      {
        name: "description",
        content:
          "Green Earth Foundation's verification workload: pending evidence, weekly verification volume, volunteers and audited recovery totals.",
      },
      { property: "og:title", content: "NGO Dashboard — EcoSphere" },
      {
        property: "og:description",
        content: "Human verification queue and analytics for AI-classified environmental actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NgoDashboard,
});

function NgoDashboard() {
  const pending = verificationQueue.filter((q) => q.status === "Pending").slice(0, 5);
  return (
    <OrgShell
      nav={ngoNav}
      brand="Green Earth Foundation"
      brandSub="Verification partner"
      title="Overview"
      subtitle="Karachi pilot · verification operations"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Pending verifications"
          value="28"
          badge="SLA 24h"
          tone="danger"
          sub="5 breaching today"
        />
        <KpiCard label="Active campaigns" value="7" tone="primary" sub="Across 4 districts" />
        <KpiCard label="Verified actions" value="1,842" tone="info" sub="This month" />
        <KpiCard label="Volunteers" value="423" tone="amber" sub="118 active this week" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel
          title="Pending queue"
          className="lg:col-span-2"
          action={
            <Link to="/ngo/verification" className="text-xs font-semibold text-primary">
              Open queue →
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {pending.map((q) => (
              <li key={q.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-lg">
                  {q.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{q.action}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {q.id} · {q.location} · {q.submitted}
                  </p>
                </div>
                <span className="rounded-full bg-info/10 px-2.5 py-1 text-[11px] font-semibold text-info">
                  AI {q.confidence}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Approval vs rejection">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={approvalSplit}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {approvalSplit.map((s) => (
                    <Cell key={s.name} fill={s.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {approvalSplit.map((s) => (
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

      <Panel title="Weekly verification volume" className="mt-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyVerification}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
              <Tooltip cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="verified" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="rejected" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </OrgShell>
  );
}
