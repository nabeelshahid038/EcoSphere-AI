import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, Calendar, Mail, MapPin, Phone, Save, User as UserIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { CitizenShell, SectionTitle } from "@/components/gp/CitizenShell";
import { useAuthStore } from "@/stores/auth";
import { COUNTRY_CODES } from "./auth.register";

export const Route = createFileRoute("/citizen/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — GreenPulse" },
      {
        name: "description",
        content: "View and update your GreenPulse CNIC-verified citizen profile and account settings.",
      },
    ],
  }),
  component: ProfilePage,
});

const CITIES = ["Karachi", "Lahore", "Islamabad", "Hyderabad"] as const;

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const checkDuplicate = useAuthStore((s) => s.checkDuplicate);

  const initialCode = COUNTRY_CODES.find((c) => user?.phone?.startsWith(c.code))?.code ?? "+92";
  const initialNum = user?.phone ? user.phone.replace(/^[+\d]+\s*/, "") : "300 1234567";

  const [name, setName] = useState(user?.name ?? "");
  const [countryCode, setCountryCode] = useState(initialCode);
  const [phoneNum, setPhoneNum] = useState(initialNum);
  const [city, setCity] = useState(user?.city ?? "Karachi");
  const [cnic, setCnic] = useState(user?.cnic ?? "42101-1234567-1");
  const [email, setEmail] = useState(user?.email ?? "");

  const fullPhone = `${countryCode} ${phoneNum.trim()}`;

  const [duplicateErrors, setDuplicateErrors] = useState<{ cnic?: string; phone?: string; email?: string }>({});

  const handleFieldChange = (field: "cnic" | "phone" | "email", val: string) => {
    if (field === "cnic") setCnic(val);
    if (field === "email") setEmail(val);

    const dup = checkDuplicate(
      field === "email" ? val : email,
      field === "cnic" ? val : cnic,
      field === "phone" ? val : fullPhone,
      user?.email
    );

    setDuplicateErrors({
      email: dup.emailExists ? "⚠️ Email already registered" : undefined,
      cnic: dup.cnicExists ? "⚠️ CNIC already registered to another account" : undefined,
      phone: dup.phoneExists ? "⚠️ Phone number already registered" : undefined,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const dup = checkDuplicate(email, cnic, fullPhone, user?.email);
    if (dup.emailExists || dup.cnicExists || dup.phoneExists) {
      toast.error("Please fix duplicate registration errors before saving.");
      return;
    }

    updateProfile({
      name: name.trim(),
      phone: fullPhone,
      city,
      cnic: cnic.trim(),
      email: email.trim(),
    });

    toast.success("Profile details saved successfully.");
  };

  return (
    <CitizenShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Profile</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage your CNIC-verified citizen identity and contact details
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          <BadgeCheck className="size-4 text-primary" /> CNIC Verified
        </span>
      </div>

      {/* Profile Overview Card */}
      <div className="card-surface mt-5 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
            {name.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold truncate">{name || "Citizen User"}</h2>
            <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <Mail className="size-3.5" /> {email} · <MapPin className="size-3.5 text-primary" /> {city}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-semibold">
              <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-amber">
                🪙 {user?.points ?? 0} GreenPoints
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3" /> Member since {user?.createdAt ?? "2026"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle>Update Profile Details</SectionTitle>

      <form onSubmit={handleSave} className="card-surface p-5 sm:p-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nabeel Shahid"
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
        </div>

        {/* CNIC Number */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            CNIC Number (National ID) <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              required
              value={cnic}
              onChange={(e) => handleFieldChange("cnic", e.target.value)}
              placeholder="42101-1234567-1"
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          {duplicateErrors.cnic && (
            <p className="mt-1 text-xs font-semibold text-destructive">{duplicateErrors.cnic}</p>
          )}
          <p className="mt-1 text-[11px] text-muted-foreground">
            🔒 Enforces 1 Citizen = 1 Account anti-sybil validation.
          </p>
        </div>

        {/* Phone Number & City Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Mobile Phone Number <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-10 rounded-lg border border-border bg-card px-2 text-xs font-semibold outline-none transition focus:border-primary shrink-0"
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
                    handleFieldChange("phone", `${countryCode} ${e.target.value}`);
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              City / District <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="you@example.com"
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          {duplicateErrors.email && (
            <p className="mt-1 text-xs font-semibold text-destructive">{duplicateErrors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
        >
          <Save className="size-4" /> Save Profile Changes
        </button>
      </form>
    </CitizenShell>
  );
}
