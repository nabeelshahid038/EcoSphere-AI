import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Check, Clock, MapPin, Sparkles } from "lucide-react";
import { CitizenShell } from "@/components/gp/CitizenShell";
import { myReports, reportTypes, type ReportStatus } from "@/lib/citizen-data";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/citizen/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — EcoSphere" },
      {
        name: "description",
        content:
          "Report illegal dumping, litter, open burning or blocked drains with live camera evidence, GPS and AI verification.",
      },
      { property: "og:title", content: "Report an Issue — EcoSphere" },
      { property: "og:description", content: "Tamper-proof issue reporting for Karachi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

const typeTone: Record<string, string> = {
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  amber: "border-amber/40 bg-amber/10 text-amber",
  info: "border-info/40 bg-info/10 text-info",
  primary: "border-primary/40 bg-accent text-accent-foreground",
};

const statusTone: Record<ReportStatus, string> = {
  Pending: "bg-amber/15 text-amber",
  Verified: "bg-accent text-accent-foreground",
  Rejected: "bg-destructive/10 text-destructive",
};

function ReportPage() {
  const [tab, setTab] = useState<"new" | "mine">("new");
  return (
    <CitizenShell>
      <h1 className="text-xl font-bold">Report an Issue</h1>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Live evidence only · GPS and timestamp captured automatically
      </p>

      <div className="mt-4 flex gap-2 rounded-lg bg-muted p-1">
        {(["new", "mine"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-9 flex-1 rounded-md text-xs font-semibold transition ${
              tab === t
                ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                : "text-muted-foreground"
            }`}
          >
            {t === "new" ? "New Report" : "My Reports"}
          </button>
        ))}
      </div>

      {tab === "new" ? <ReportWizard /> : <MyReports />}
    </CitizenShell>
  );
}

function MyReports() {
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);

  const reports = isDemo
    ? myReports
    : (user?.userHistory ?? []).map((h, i) => ({
        id: `REP-2026-00${i + 1}`,
        type: h.action,
        area: `${user?.city ?? "Karachi"} District`,
        date: h.date,
        status: h.verified ? ("Verified" as const) : ("Pending" as const),
      }));

  if (reports.length === 0) {
    return (
      <div className="mt-5 card-surface p-8 text-center border-dashed border-2">
        <p className="text-sm font-semibold">No reports submitted yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the "New Report" tab above to record dumping hotspots or environmental hazards!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="card-surface flex items-center justify-between p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{r.type}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {r.id} · {r.area}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{r.date}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone[r.status]}`}
          >
            {r.status}
          </span>
        </div>
      ))}
    </div>
  );
}

const severities = ["Minor", "Moderate", "Major"] as const;

function ReportWizard() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [severity, setSeverity] = useState<(typeof severities)[number]>("Moderate");
  const [size, setSize] = useState(40);
  const [desc, setDesc] = useState("");
  const [pin, setPin] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const timestamp = new Date().toLocaleString("en-GB");

  const addPoints = useAuthStore((s) => s.addPoints);

  useEffect(() => {
    if (step !== 2) return;
    let stream: MediaStream | undefined;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        setCameraOn(true);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCameraOn(false));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [step]);

  const next = () => {
    if (step === 5) {
      // Submit report & award 80 GP
      addPoints(80, `Report: ${type ?? "Dumping Hazard"}`, "🚩");
    }
    setStep((s) => Math.min(6, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="mt-5">
      {step < 6 && (
        <>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Step {step} of 5
          </p>
        </>
      )}

      {step === 1 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold">What are you reporting?</p>
          {reportTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setType(t.label);
                next();
              }}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition active:scale-[0.98] ${typeTone[t.tone]}`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-sm font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Capture live photo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gallery uploads are disabled — evidence must be captured in the moment.
          </p>
          <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-xl bg-primary-dark">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${cameraOn ? "" : "hidden"}`}
            />
            {!cameraOn && <div className="absolute inset-0 hero-gradient" />}
            {captured && (
              <div className="absolute inset-0 grid place-items-center bg-[oklch(0.21_0.04_265/0.5)]">
                <Check className="size-12 text-primary-foreground" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 space-y-1 text-[11px] font-medium text-primary-foreground">
              <p className="flex items-center gap-1">
                <MapPin className="size-3" /> 24.8607° N, 67.0011° E
              </p>
              <p className="flex items-center gap-1">
                <Clock className="size-3" /> {timestamp}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              aria-label="Capture photo"
              onClick={() => setCaptured(true)}
              className="size-16 rounded-full bg-primary ring-4 ring-border transition active:scale-95"
            />
          </div>
          <StepNav onBack={back} onNext={next} nextDisabled={!captured} />
        </div>
      )}

      {step === 3 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Confirm location</p>
          <p className="mt-1 text-xs text-muted-foreground">Drag the pin to fine-tune the spot.</p>
          <div
            className="relative mt-3 h-56 overflow-hidden rounded-xl"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPin({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
          >
            <div className="absolute inset-0 hero-gradient" />
            <span
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <MapPin className="size-8 text-primary" fill="currentColor" />
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Clifton Block 2, Karachi · accuracy ±8 m
          </p>
          <StepNav onBack={back} onNext={next} />
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-sm font-semibold">Severity</p>
            <div className="mt-2 flex gap-2">
              {severities.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`h-9 flex-1 rounded-full text-xs font-semibold transition ${
                    severity === s
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Approximate size · {size} m²</p>
            <input
              type="range"
              min={1}
              max={200}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">Description</p>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Describe what you see…"
              className="mt-2 w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <StepNav onBack={back} onNext={next} />
        </div>
      )}

      {step === 5 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Evidence checklist</p>
          <ul className="mt-3 space-y-2">
            {[
              { label: `Live photo captured`, icon: Camera },
              { label: `GPS location locked`, icon: MapPin },
              { label: `Timestamp ${timestamp}`, icon: Clock },
              { label: `AI pre-classification: ${type ?? "issue"}`, icon: Sparkles },
            ].map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded-lg border border-primary/30 bg-accent px-3 py-3"
              >
                <c.icon className="size-4 text-primary" />
                <span className="flex-1 text-sm font-medium text-accent-foreground">{c.label}</span>
                <Check className="size-4 text-primary" />
              </li>
            ))}
          </ul>
          <StepNav onBack={back} onNext={next} nextLabel="Submit report" />
        </div>
      )}

      {step === 6 && (
        <div className="relative mt-10 overflow-hidden text-center">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="confetti absolute top-0 size-2 rounded-sm"
              style={{
                left: `${(i * 5.5) % 100}%`,
                backgroundColor: ["var(--primary)", "var(--amber)", "var(--info)"][i % 3],
                animationDelay: `${(i % 6) * 120}ms`,
              }}
            />
          ))}
          <div className="mx-auto grid size-20 animate-[gp-pop_400ms_ease-out] place-items-center rounded-full bg-primary">
            <Check className="size-10 text-primary-foreground" />
          </div>
          <p className="mt-5 text-lg font-bold">Report submitted</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {type} · pending NGO verification. You&apos;ll earn 80 GP once verified.
          </p>
          <button
            onClick={() => {
              setStep(1);
              setCaptured(false);
              setType(null);
              setDesc("");
            }}
            className="mt-6 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            File another report
          </button>
        </div>
      )}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onBack}
        className="h-11 flex-1 rounded-lg border border-border text-sm font-semibold transition active:scale-[0.97]"
      >
        Back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition active:scale-[0.97] disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}
