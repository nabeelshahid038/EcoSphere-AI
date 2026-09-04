import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  ClipboardCheck,
  Coins,
  FileBarChart,
  Gift,
  Landmark,
  MapPin,
  Ruler,
  ScanLine,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { SiteHeader } from "@/components/gp/SiteHeader";
import { Logo } from "@/components/gp/Logo";
import { globalImpact } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoPulse AI — Verified Environmental, EPR & CSR Infrastructure" },
      {
        name: "description",
        content:
          "EcoPulse AI connects Citizens, NGOs, Corporate CSR/EPR Sponsors, and Municipalities into one AI-verified environmental ecosystem.",
      },
      {
        property: "og:title",
        content: "EcoPulse AI — Verified Environmental & CSR Ecosystem",
      },
      {
        property: "og:description",
        content:
          "Earn real marketplace rewards for eco-actions while corporations get audit-ready CSR Act 2026 disclosures.",
      },
    ],
  }),
  component: Landing,
});

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const steps = [
  { icon: Camera, label: "1. CITIZEN ACTION", desc: "Dispose waste at Smart Bins, report dumping, or plant trees" },
  { icon: ScanLine, label: "2. AI AUDIT", desc: "Alibaba Cloud AI checks EXIF, pHash & waste classification" },
  { icon: ClipboardCheck, label: "3. NGO VERIFICATION", desc: "Local NGO verifies field evidence & approves report" },
  { icon: Gift, label: "4. INSTANT REWARDS", desc: "Points released to Citizen's CNIC wallet for Marketplace" },
  { icon: FileBarChart, label: "5. CSR/EPR REPORT", desc: "Audit-ready ESG disclosure generated for Corporates & Cities" },
];

const entityDetails = [
  {
    id: "citizen",
    icon: User,
    emoji: "🎁",
    role: "Citizens & Everyday Users",
    badge: "Earn Real Marketplace Rewards",
    headline: "Turn Everyday Waste & Eco-Actions into Real Cash & Vouchers",
    points: [
      "🔒 CNIC-Verified Account: 1 Citizen = 1 Account to prevent fake accounts & point-farming.",
      "🔍 AI Waste Classifier: Scan any item for educational sorting advice & bin color guidance (Blue = Recyclable, Green = Organic, Red = Hazardous).",
      "🤖 Digital Smart Bin Drop-offs: Scan CNIC/QR at partner bins to measure weight & unlock instant reward points.",
      "🚨 Dual-Mode Civic Patrol: Report illegal dumping hotspots or public littering with camera & auto GPS.",
      "🌱 Tree Growth Quest: Submit weekly plant updates and earn points as your tree grows.",
      "🛒 Eco-Marketplace: Redeem points for Jazz/Zong Mobile Top-ups, Foodpanda & Careem Vouchers, and Eco-brand discounts!",
    ],
    ctaText: "Start as Citizen & Earn Rewards",
    ctaTo: "/auth/register",
  },
  {
    id: "ngo",
    icon: Sprout,
    emoji: "🌱",
    role: "Environmental NGOs",
    badge: "Mobilize & Verify",
    headline: "Run Impact Campaigns & Verify Ground Evidence Effortlessly",
    points: [
      "⚡ AI Pre-Screening Queue: Vision model pre-filters spam so your team only reviews high-confidence field reports.",
      "📢 Geo-Targeted Volunteer Recruitment: Push cleanup alerts to active citizens within a 3-5 km radius.",
      "🎟️ QR Code Attendance Manager: Instantly scan volunteer app passes at cleanup drives.",
      "💰 Corporate CSR Funding Access: Receive campaign operational budgets from top enterprise sponsors.",
    ],
    ctaText: "Join as NGO Partner",
    ctaTo: "/auth/register",
  },
  {
    id: "corporate",
    icon: Building2,
    emoji: "🏢",
    role: "Corporate CSR & EPR Sponsors",
    badge: "CSR Act 2026 & EPR Compliant",
    headline: "Audit-Ready ESG Compliance & Extended Producer Responsibility",
    points: [
      "📜 Pakistan CSR Act 2026 Ready: Fulfill mandatory 1% post-tax profit disclosures with legally defensible data.",
      "♻️ Extended Producer Responsibility (EPR): Track packaging waste recovery (tonnes of PET plastic offset).",
      "📊 One-Click Audit PDF Export: Cryptographic proof-of-impact ready for Big 4 / ISO auditor inspection.",
      "🎯 Branded CSR Challenges: Sponsor high-visibility community drives with direct citizen engagement.",
    ],
    ctaText: "Explore Corporate CSR Hub",
    ctaTo: "/demo",
  },
  {
    id: "municipal",
    icon: Landmark,
    emoji: "🏛️",
    role: "Municipal Authorities & Cities",
    badge: "Live City Intelligence",
    headline: "Real-Time GIS Heatmaps & Automated Sanitation Truck Dispatch",
    points: [
      "🗺️ Live Waste GIS Heatmap: Monitor critical dumping clusters and overflowing public dumpsters in real time.",
      "🚛 Fleet Route Optimization: Automatically route municipal sanitation trucks to high-priority hotspots.",
      "📸 Verified Resolution Loop: Upload post-cleanup photos to mark reports as resolved, notifying citizens automatically.",
      "📈 Ward Performance Analytics: Measure district-level collection efficiency across city sectors.",
    ],
    ctaText: "Open City Dashboard",
    ctaTo: "/demo",
  },
];

const rewardsList = [
  { brand: "Jazz & Zong", category: "Mobile Load", pts: "200 Pts", desc: "PKR 100 Instant Mobile Balance" },
  { brand: "Foodpanda", category: "Food Delivery", pts: "350 Pts", desc: "PKR 250 Discount Coupon" },
  { brand: "Careem / InDrive", category: "Rideshare", pts: "150 Pts", desc: "20% Off Next 3 Rides" },
  { brand: "Eco-Store", category: "Green Product", pts: "500 Pts", desc: "Reusable Stainless Steel Water Bottle" },
];

const evidence = [
  "Geo-tagged, timestamped photo capture with EXIF validation",
  "Alibaba Cloud AI classification with confidence scoring",
  "Independent NGO human review before point credit release",
  "Digital Smart Bin weight reconciliation at drop-off point",
  "Immutable audit trail exportable to PDF under CSR Act 2026",
];

function Landing() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-background">
      <SiteHeader inverted />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden px-5 pb-24 pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.span
              initial="hidden"
              animate="show"
              custom={0}
              variants={fade}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90"
            >
              <BadgeCheck className="size-3.5" /> AI-Verified Environmental & CSR Infrastructure
            </motion.span>
            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fade}
              className="mt-5 text-4xl font-bold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl"
            >
              One Platform. <br />
              Four Stakeholders. <br />
              <span className="text-gradient-green">Verified Impact & Rewards.</span>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fade}
              className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80"
            >
              EcoPulse AI connects <strong>Citizens</strong>, <strong>NGOs</strong>, <strong>Corporate CSR Sponsors</strong>, and <strong>Municipalities</strong> into one closed-loop ecosystem. Citizens earn real marketplace rewards for verified eco-actions; Corporates receive audit-ready ESG disclosures.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fade}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/auth/register"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97] shadow-lg"
              >
                <Coins className="size-4" /> Start as Citizen & Earn Rewards <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex h-11 items-center rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/20 active:scale-[0.97]"
              >
                Enterprise & City Demo
              </Link>
            </motion.div>

            {/* Micro Stats Ticker */}
            <div className="mt-8 flex flex-wrap gap-6 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/75">
              <div><strong className="text-sm font-bold text-primary-foreground">2,450+</strong> Active Citizens</div>
              <div><strong className="text-sm font-bold text-primary-foreground">82.4 t</strong> Waste Recovered</div>
              <div><strong className="text-sm font-bold text-primary-foreground">100%</strong> CNIC Anti-Sybil</div>
              <div><strong className="text-sm font-bold text-primary-foreground">CSR Act 2026</strong> Aligned</div>
            </div>
          </div>

          <PhoneMockup />
        </div>
      </section>

      {/* Stakeholder Deep-Dive Section */}
      <section id="stakeholders" className="border-y border-border bg-card/60 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Built for the whole ecosystem"
            title="How EcoPulse empowers each entity"
            sub="Click any role below to see how our AI-verified ecosystem creates specific value for them."
          />

          {/* Role Tab Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {entityDetails.map((entity, idx) => {
              const active = activeTab === idx;
              return (
                <button
                  key={entity.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition active:scale-[0.97] ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{entity.emoji}</span>
                  {entity.role}
                </button>
              );
            })}
          </div>

          {/* Active Entity Card */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-[var(--shadow-card)]">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-accent text-2xl">
                    {entityDetails[activeTab].emoji}
                  </span>
                  <div>
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                      {entityDetails[activeTab].badge}
                    </span>
                    <h3 className="mt-1.5 text-2xl font-bold text-foreground">
                      {entityDetails[activeTab].headline}
                    </h3>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {entityDetails[activeTab].points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                        ✓
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5 lg:w-72">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ready to experience it?
                </p>
                <p className="text-xs text-muted-foreground">
                  Access the dedicated workspace for {entityDetails[activeTab].role}.
                </p>
                <Link
                  to={entityDetails[activeTab].ctaTo}
                  className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
                >
                  {entityDetails[activeTab].ctaText} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Excitement Banner */}
      <section className="bg-primary/5 border-b border-border px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">
              <Coins className="size-4" /> Eco-Marketplace Rewards
            </span>
            <h2 className="mt-3 text-3xl font-bold">Earn Real Rewards for Everyday Action</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Citizens convert verified points earned from Smart Bin drop-offs, dumping reports, and tree challenges into real marketplace rewards.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rewardsList.map((r, i) => (
              <div key={i} className="card-surface p-5 hover:border-primary/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-primary">{r.category}</span>
                  <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-bold text-amber">
                    {r.pts}
                  </span>
                </div>
                <h4 className="mt-2 font-bold text-foreground">{r.brand}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <SectionHead
          eyebrow="The verification pipeline"
          title="How the closed feedback loop works"
          sub="From street action to AI verification, NGO approval, citizen rewards, and corporate ESG reports."
        />
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-primary lg:block"
          />
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="relative"
              >
                <span className="relative z-10 grid size-12 place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-card)]">
                  <s.icon className="size-5 text-primary" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-widest text-primary">{s.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Audit-Ready Section */}
      <section id="trust" className="mx-auto max-w-6xl px-5 py-20 border-t border-border">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Evidence-Grade Compliance"
              title="Audit-Ready CSR & EPR Disclosures"
              sub="Most platforms count unverified clicks. EcoPulse AI produces tamper-proof audit trails for government disclosures and Big 4 auditor inspection."
              align="left"
            />
            <Link
              to="/demo"
              className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-card px-5 text-sm font-semibold text-primary transition hover:bg-accent active:scale-[0.97]"
            >
              View Sample Audit Disclosure <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="card-surface divide-y divide-border p-2">
            {evidence.map((e) => (
              <li key={e} className="flex items-start gap-3 px-4 py-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Global impact */}
      <section className="hero-gradient px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/60">
            Global impact to date
          </p>
          <div className="mt-10 grid gap-8 text-center sm:grid-cols-4">
            {[
              [globalImpact.actions.toLocaleString(), "Verified actions"],
              [`${globalImpact.tonnes}`, "Tonnes recovered"],
              [globalImpact.participants.toLocaleString(), "Participants"],
              [`${globalImpact.countries}`, "Countries"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-4xl font-bold text-primary-foreground">{value}</p>
                <p className="mt-1 text-sm text-primary-foreground/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="animate-float"
      >
        <div className="rounded-[2.2rem] border border-primary-foreground/15 bg-primary-dark/60 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur">
          <div className="overflow-hidden rounded-[1.7rem] bg-card">
            <div className="flex items-center justify-between bg-muted px-4 py-2 text-[10px] font-semibold text-muted-foreground">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" /> Karachi
              </span>
            </div>
            <div className="relative h-64 bg-[linear-gradient(0deg,transparent_19px,oklch(0.929_0.013_255.508)_20px),linear-gradient(90deg,transparent_19px,oklch(0.929_0.013_255.508)_20px)] bg-[length:20px_20px]">
              {[
                { top: "24%", left: "26%" },
                { top: "52%", left: "62%" },
                { top: "70%", left: "34%" },
              ].map((m, i) => (
                <span key={i} className="absolute" style={{ top: m.top, left: m.left }}>
                  <span className="absolute inset-0 rounded-full bg-primary pulse-ring" />
                  <span className="block size-3 rounded-full bg-primary ring-4 ring-card" />
                </span>
              ))}
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-card/95 p-3">
                <p className="text-[11px] font-semibold">PET bottle · 0.6 kg</p>
                <p className="text-[10px] text-muted-foreground">
                  AI confidence 97% · awaiting NGO review
                </p>
              </div>
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                <ScanLine className="size-3" /> Scanning
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {[
        { value: "12,840", label: "Verified Actions", cls: "-left-10 -top-4", delay: 0.6 },
        { value: "82.4 t", label: "Tonnes Recovered", cls: "-right-10 -bottom-6", delay: 0.8 },
      ].map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: s.delay, duration: 0.5 }}
          className={`absolute ${s.cls} rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-card-hover)]`}
        >
          <p className="text-lg font-bold text-primary">{s.value}</p>
          <p className="text-[11px] text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Verified environmental impact infrastructure. Karachi pilot operated with Green Earth
            Foundation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
            <span className="size-2 rounded-full bg-amber" /> Powered by Alibaba Cloud
          </span>
          <Link to="/auth/login" className="text-xs font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-[11px] text-muted-foreground">
        © 2026 EcoSphere. All impact figures reflect independently verified records.
      </p>
    </footer>
  );
}
