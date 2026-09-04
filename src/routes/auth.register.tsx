import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, Landmark, Mail, Lock, MapPin, Sprout, User } from "lucide-react";
import { AuthShell, Field } from "./auth.login";
import { useAuthStore } from "@/stores/auth";
import { roleHome, type Role } from "@/lib/mock-data";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create your GreenPulse account — Citizen, NGO, Corporate or City" },
      {
        name: "description",
        content:
          "Join GreenPulse as a citizen, NGO verifier, corporate sponsor or municipal authority and turn action into audit-ready impact.",
      },
      { property: "og:title", content: "Create your GreenPulse account" },
      {
        property: "og:description",
        content: "Pick your role and start producing verified environmental impact evidence.",
      },
    ],
  }),
  component: RegisterPage,
});

const roles: { role: Role; icon: typeof User; emoji: string; title: string; blurb: string }[] = [
  {
    role: "citizen",
    icon: User,
    emoji: "👤",
    title: "Citizen",
    blurb: "Scan, report, earn points",
  },
  { role: "ngo", icon: Sprout, emoji: "🌱", title: "NGO", blurb: "Verify field evidence" },
  {
    role: "corporate",
    icon: Building2,
    emoji: "🏢",
    title: "Corporate",
    blurb: "Sponsor & report ESG",
  },
  {
    role: "municipal",
    icon: Landmark,
    emoji: "🏛️",
    title: "Municipal",
    blurb: "Operate city cleanups",
  },
];

const orgLabel: Record<Role, string> = {
  citizen: "City",
  ngo: "Organisation name",
  corporate: "Company name",
  municipal: "Department",
};

const orgPlaceholder: Record<Role, string> = {
  citizen: "Karachi",
  ngo: "Green Earth Foundation",
  corporate: "Acme Consumer Group",
  municipal: "Karachi Municipal Operations",
};

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title={role ? "Tell us about you" : "Create your account"}
      subtitle={
        role
          ? "We tailor verification workflows to your role."
          : "First, choose how you'll use GreenPulse."
      }
      wide={!role}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {roles.map((r) => {
          const active = role === r.role;
          return (
            <button
              key={r.role}
              type="button"
              onClick={() => {
                setRole(r.role);
                setOrg(orgPlaceholder[r.role]);
              }}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition active:scale-[0.985] ${
                active
                  ? "border-primary bg-accent shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              }`}
            >
              <span className="text-xl leading-none">{r.emoji}</span>
              <span>
                <span className="block text-sm font-semibold">{r.title}</span>
                <span className="block text-xs text-muted-foreground">{r.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      {role && (
        <form
          className="mt-6 grid gap-4 border-t border-border pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            register(name, email, role, org);
            navigate({ to: roleHome[role] });
          }}
        >
          {role === "citizen" && (
            <div>
              <Field icon={BadgeCheck} label="CNIC Number (National ID)">
                <input
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="42101-1234567-1"
                  className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </Field>
              <p className="mt-1 text-[11px] text-muted-foreground">
                🔒 <strong>CNIC Verified:</strong> Enforces 1 Citizen = 1 Account to eliminate fake accounts and point-farming.
              </p>
            </div>
          )}
          <Field icon={User} label={role === "citizen" ? "Full name" : "Contact person"}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "citizen" ? "Ahmed Khan" : "Sara Iqbal"}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <Field icon={role === "citizen" ? MapPin : Building2} label={orgLabel[role]}>
            <input
              required
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <Field icon={Mail} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>
          <button className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]">
            Create account <ArrowRight className="size-4" />
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
