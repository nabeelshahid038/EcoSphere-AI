import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Search, X, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { NotificationPanel } from "./NotificationPanel";
import { ThemeToggle } from "./ThemeToggle";
import { openCommandPalette } from "./CommandPalette";
import { useAuthStore } from "@/stores/auth";

export type OrgNavItem = {
  label: string;
  icon: LucideIcon;
  to?: string;
};

export function OrgShell({
  nav,
  brand,
  brandSub,
  title,
  subtitle,
  actions,
  children,
  fullBleed = false,
}: {
  nav: OrgNavItem[];
  brand: string;
  brandSub: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  fullBleed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const user = useAuthStore((state) => state.user);
  const isDemo = useAuthStore((state) => state.isDemo);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const sidebar = (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <Logo />
      </div>
      <div className="px-5 py-4">
        <p className="truncate text-sm font-semibold">{brand}</p>
        <p className="truncate text-xs text-muted-foreground">{brandSub}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active = item.to ? pathname === item.to : false;
          const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
          if (!item.to) {
            return (
              <button
                key={item.label}
                onClick={() => toast.info(`${item.label} is outside this demo workspace.`)}
                className={`${className} opacity-60`}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className={className}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
        className="m-3 inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:border-primary/50"
      >
        <LogOut className="size-4" /> Exit workspace
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 cursor-default bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 h-full">{sidebar}</div>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-lg bg-card p-2"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-border p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{title}</p>
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={openCommandPalette}
              className="hidden h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs text-muted-foreground transition hover:bg-muted sm:inline-flex"
              aria-label="Search pages"
            >
              <Search className="size-4" /> Search{" "}
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <button
              onClick={openCommandPalette}
              className="grid size-9 place-items-center rounded-lg border border-border sm:hidden"
              aria-label="Search pages"
            >
              <Search className="size-4" />
            </button>
            <NotificationPanel />
            <ThemeToggle compact />
            {isDemo && (
              <span className="hidden rounded-full bg-amber/15 px-2.5 py-1 text-[11px] font-semibold text-amber xl:block">
                Demo data
              </span>
            )}
            <span className="hidden text-sm text-muted-foreground xl:block">
              {user?.name ?? "Guest"}
            </span>
            {actions}
          </div>
        </header>
        <main
          className={
            fullBleed
              ? "min-h-0 flex-1 overflow-hidden"
              : "mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-5 sm:py-7"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  badge,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  tone?: "default" | "amber" | "info" | "primary" | "danger";
}) {
  const toneClass = {
    default: "text-foreground",
    amber: "text-amber",
    info: "text-info",
    primary: "text-primary",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="card-surface p-5 transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {badge && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
            {badge}
          </span>
        )}
      </div>
      <p className={`mt-2 text-3xl font-bold ${toneClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-surface overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function MockMap({
  pins,
  height = "h-[420px]",
}: {
  pins: {
    id: string;
    type: "dumping" | "scan" | "tree";
    label: string;
    area: string;
    top: number;
    left: number;
  }[];
  height?: string;
}) {
  const color = { dumping: "bg-destructive", scan: "bg-primary", tree: "bg-primary-dark" };
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-muted ${height}`}
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-info/10" />
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
        >
          <span className={`block size-3.5 rounded-full ring-4 ring-card ${color[pin.type]}`} />
          <div className="pointer-events-none absolute left-1/2 top-5 z-10 hidden w-44 -translate-x-1/2 rounded-lg border border-border bg-card p-2 text-left shadow-md group-hover:block">
            <p className="text-xs font-semibold">{pin.label}</p>
            <p className="text-[11px] text-muted-foreground">{pin.area}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
