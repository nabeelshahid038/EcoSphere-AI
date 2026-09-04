import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { DemoModeButton } from "./DemoMode";

export function SiteHeader({ inverted = false }: { inverted?: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4">
        <Logo inverted={inverted} />
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {[
            ["How it works", "#how"],
            ["Stakeholders", "#stakeholders"],
            ["Verification", "#trust"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={
                inverted
                  ? "text-primary-foreground/70 transition hover:text-primary-foreground"
                  : "text-muted-foreground transition hover:text-foreground"
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <DemoModeButton inverted={inverted} />
          <Link
            to="/auth/login"
            className="hidden h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97] sm:inline-flex"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
