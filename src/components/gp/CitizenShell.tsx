import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, ScanLine, Flag, BarChart3, Megaphone, LogOut, BadgeCheck, User as UserIcon } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/stores/auth";

const tabs = [
  { to: "/citizen/home", label: "Home", icon: Home },
  { to: "/citizen/scanner", label: "Scan", icon: ScanLine },
  { to: "/citizen/report", label: "Report", icon: Flag },
  { to: "/citizen/impact", label: "Impact", icon: BarChart3 },
  { to: "/citizen/profile", label: "Profile", icon: UserIcon },
] as const;

export function CitizenBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <t.icon className={`size-5 ${active ? "scale-110" : ""} transition-transform`} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function CitizenShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-full overflow-x-hidden">
      {/* Top Desktop & Mobile Responsive Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-3 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link to="/citizen/home" className="flex items-center gap-2 shrink-0">
              <Logo />
            </Link>
            
            {/* Desktop Nav Links */}
            <nav className="hidden items-center gap-1 sm:flex">
              {tabs.map((t) => {
                const active = pathname.startsWith(t.to);
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <t.icon className="size-4" />
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              to="/citizen/profile"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold hover:border-primary/50"
            >
              <UserIcon className="size-3.5 text-primary" />
              <span className="hidden sm:inline">{user?.name?.split(" ")[0] ?? "Profile"}</span>
            </Link>
            <span className="hidden items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-primary md:inline-flex">
              <BadgeCheck className="size-3" /> CNIC Verified
            </span>
            <ThemeToggle compact />
            
            {/* Exit Workspace Button */}
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2 sm:px-3 text-xs font-semibold text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-[0.97]"
            >
              <LogOut className="size-3.5" /> <span className="hidden xs:inline sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Content Area */}
      <main className="mx-auto max-w-5xl px-3 pb-24 pt-4 sm:px-6">
        <div className={`mx-auto max-w-3xl ${className}`}>{children}</div>
      </main>

      {/* Mobile Navigation */}
      <CitizenBottomNav />
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {children}
      </h2>
      {action}
    </div>
  );
}
