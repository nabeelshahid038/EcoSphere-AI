import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthStore } from "@/stores/auth";

export function RoleShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Logo />
            {isDemo && (
              <span className="rounded-full bg-amber/15 px-2.5 py-1 text-[11px] font-semibold text-amber">
                Demo data
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.name ?? "Guest"}
            </span>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:border-primary/50 active:scale-[0.97]"
            >
              <LogOut className="size-4" /> Exit
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <Link
          to="/"
          className="mt-10 inline-block text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to landing page
        </Link>
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "amber" | "info" | "primary";
}) {
  const toneClass = {
    default: "text-foreground",
    amber: "text-amber",
    info: "text-info",
    primary: "text-primary",
  }[tone];
  return (
    <div className="card-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${toneClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
