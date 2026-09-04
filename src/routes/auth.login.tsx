import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/gp/Logo";
import { useAuthStore } from "@/stores/auth";
import { roleHome, type Role } from "@/lib/mock-data";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — EcoSphere Verified Impact Platform" },
      {
        name: "description",
        content:
          "Sign in to EcoSphere to log environmental actions, verify field evidence and report measured impact.",
      },
      { property: "og:title", content: "Sign in — EcoSphere" },
      {
        property: "og:description",
        content: "Access your EcoSphere workspace for verified environmental impact.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue verifying environmental impact.">
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          login(email, role);
          navigate({ to: roleHome[role] });
        }}
      >
        <Field icon={Mail} label="Work / Personal email">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </Field>
        <Field icon={Lock} label="Password">
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </Field>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Workspace
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          >
            <option value="citizen">Citizen</option>
            <option value="ngo">NGO</option>
            <option value="corporate">Corporate</option>
            <option value="municipal">Municipal</option>
          </select>
        </label>
        <button className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]">
          Sign in <ArrowRight className="size-4" />
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to EcoSphere?{" "}
        <Link to="/auth/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-14">
      <Logo className="mb-7" />
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)]`}
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>
        {children}
      </div>
      <Link to="/" className="mt-6 text-xs text-muted-foreground hover:text-foreground">
        ← Back to ecosphere.io
      </Link>
    </main>
  );
}

export function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </span>
    </label>
  );
}
