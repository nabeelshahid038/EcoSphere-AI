import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, Landmark, Mail, Lock, MapPin, Sprout, User, Phone, ShieldCheck, CheckCircle2, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, Field } from "./auth.login";
import { useAuthStore } from "@/stores/auth";
import { roleHome, type Role } from "@/lib/mock-data";
import { sendRealEmailOTP } from "@/lib/otp-service";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create your EcoSphere account — Citizen, NGO, Corporate or City" },
      {
        name: "description",
        content:
          "Join EcoSphere as a citizen, NGO verifier, corporate sponsor or municipal authority and turn action into audit-ready impact.",
      },
      { property: "og:title", content: "Create your EcoSphere account" },
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

export const COUNTRY_CODES = [
  { code: "+92", flag: "🇵🇰", country: "Pakistan" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
] as const;

const CITIES = ["Karachi", "Lahore", "Islamabad", "Hyderabad"] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const checkDuplicate = useAuthStore((s) => s.checkDuplicate);

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState<string>("Karachi");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");

  const [verifyingModal, setVerifyingModal] = useState(false);
  const [secretOtp, setSecretOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [countdown, setCountdown] = useState(45);

  const [duplicateErrors, setDuplicateErrors] = useState<{ cnic?: string; email?: string; phone?: string }>({});

  const fullPhone = `${countryCode} ${phoneNum.trim()}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verifyingModal && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [verifyingModal, countdown]);

  const handleLiveDuplicateCheck = (field: "email" | "cnic" | "phone", value: string) => {
    const checkEmail = field === "email" ? value : email;
    const checkCnic = field === "cnic" ? value : cnic;
    const checkPhone = field === "phone" ? value : `${countryCode} ${phoneNum}`;

    if (field === "email") setEmail(value);
    if (field === "cnic") setCnic(value);

    const dup = checkDuplicate(checkEmail, checkCnic, checkPhone);

    setDuplicateErrors({
      email: dup.emailExists ? "⚠️ Already registered with this email" : undefined,
      cnic: dup.cnicExists ? "⚠️ Already registered with this CNIC number" : undefined,
      phone: dup.phoneExists ? "⚠️ Already registered with this phone number" : undefined,
    });
  };

  const dispatchVerificationOtp = async () => {
    // Generate genuine 6-digit OTP code (never shown on screen)
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSecretOtp(generated);
    setOtpInput("");
    setCountdown(45);

    await sendRealEmailOTP(email, name, generated);
  };

  const startVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateErrors.email || duplicateErrors.cnic || duplicateErrors.phone) {
      toast.error("Please resolve duplicate registration warnings first.");
      return;
    }

    void dispatchVerificationOtp();
    setVerifyingModal(true);
  };

  const completeRegistration = () => {
    if (otpInput.trim() !== secretOtp) {
      toast.error("❌ Invalid verification code! Please enter the exact 6-digit code sent to your email.");
      return;
    }

    register({
      name,
      email,
      phone: fullPhone,
      role: role ?? "citizen",
      city: role === "citizen" || role === "municipal" ? city : undefined,
      cnic: role === "citizen" ? cnic : undefined,
      org: role !== "citizen" ? org : city,
    });

    toast.success("🎉 Identity verified & account created successfully!");
    setVerifyingModal(false);
    navigate({ to: roleHome[role ?? "citizen"] });
  };

  const hasDuplicateError = Boolean(
    duplicateErrors.email || duplicateErrors.cnic || duplicateErrors.phone
  );

  return (
    <AuthShell
      title={role ? "Tell us about you" : "Create your account"}
      subtitle={
        role
          ? "We tailor verification workflows to your role."
          : "First, choose how you'll use EcoSphere."
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
                setOrg(
                  r.role === "ngo"
                    ? "Green Earth Foundation"
                    : r.role === "corporate"
                    ? "Acme Consumer Group"
                    : "Municipal Operations"
                );
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
        <form className="mt-6 grid gap-4 border-t border-border pt-6" onSubmit={startVerification}>
          {role === "citizen" && (
            <div>
              <Field icon={BadgeCheck} label="CNIC Number (National ID) *">
                <input
                  required
                  value={cnic}
                  onChange={(e) => handleLiveDuplicateCheck("cnic", e.target.value)}
                  placeholder="42101-1234567-1"
                  className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </Field>
              {duplicateErrors.cnic && (
                <p className="mt-1 text-xs font-semibold text-destructive">{duplicateErrors.cnic}</p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                🔒 <strong>CNIC Verified:</strong> 1 Citizen = 1 Account anti-fraud security.
              </p>
            </div>
          )}

          <Field icon={User} label={role === "citizen" ? "Full name *" : "Contact person *"}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "citizen" ? "e.g. Alex Morgan" : "e.g. Sara Iqbal"}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>

          {/* Country Code & Phone Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Mobile Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  handleLiveDuplicateCheck("phone", `${e.target.value} ${phoneNum}`);
                }}
                className="h-10 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 shrink-0"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  value={phoneNum}
                  onChange={(e) => {
                    setPhoneNum(e.target.value);
                    handleLiveDuplicateCheck("phone", `${countryCode} ${e.target.value}`);
                  }}
                  placeholder="300 1234567"
                  className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>
            {duplicateErrors.phone && (
              <p className="mt-1 text-xs font-semibold text-destructive">{duplicateErrors.phone}</p>
            )}
          </div>

          {(role === "citizen" || role === "municipal") && (
            <div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  City / District *
                </span>
                <span className="relative block">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>
          )}

          {role !== "citizen" && (
            <Field
              icon={Building2}
              label={
                role === "ngo"
                  ? "NGO Name *"
                  : role === "corporate"
                  ? "Company Name *"
                  : "Department Name *"
              }
            >
              <input
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </Field>
          )}

          <div>
            <Field icon={Mail} label="Email Address *">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleLiveDuplicateCheck("email", e.target.value)}
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </Field>
            {duplicateErrors.email && (
              <p className="mt-1 text-xs font-semibold text-destructive">{duplicateErrors.email}</p>
            )}
          </div>

          <Field icon={Lock} label="Password *">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </Field>

          <button
            type="submit"
            disabled={hasDuplicateError}
            className={`mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition active:scale-[0.97] ${
              hasDuplicateError
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[var(--shadow-glow)]"
            }`}
          >
            <Send className="size-4" /> Send Email Verification Code <ArrowRight className="size-4" />
          </button>
        </form>
      )}

      {/* Genuine OTP Verification Modal */}
      {verifyingModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[oklch(0.21_0.04_265/0.65)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border animate-[gp-pop_300ms_ease-out]">
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <h2 className="text-center text-lg font-bold">Email Security Verification</h2>
            <p className="mt-1 text-center text-xs text-muted-foreground leading-relaxed">
              We dispatched a 6-digit verification code to your email address: <br />
              <strong className="text-foreground font-semibold">
                {email}
              </strong>
            </p>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-muted-foreground mb-1 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="h-12 w-full text-center text-2xl tracking-[0.4em] font-mono rounded-lg border border-border bg-background outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Didn't receive code?</span>
              {countdown > 0 ? (
                <span className="font-mono text-primary font-semibold">{countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={dispatchVerificationOtp}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <RefreshCw className="size-3" /> Resend Code
                </button>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setVerifyingModal(false)}
                className="h-10 flex-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={completeRegistration}
                className="h-10 flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition active:scale-[0.97]"
              >
                <CheckCircle2 className="size-4" /> Verify & Complete
              </button>
            </div>
          </div>
        </div>
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



