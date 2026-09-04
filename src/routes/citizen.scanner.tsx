import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Share2, RotateCcw, MapPin } from "lucide-react";
import { toast } from "sonner";
import { CitizenBottomNav } from "@/components/gp/CitizenShell";
import { nearbyBins, scanResult } from "@/lib/citizen-data";

export const Route = createFileRoute("/citizen/scanner")({
  head: () => ({
    meta: [
      { title: "AI Waste Scanner — GreenPulse" },
      {
        name: "description",
        content:
          "Point, scan and classify waste in seconds with on-device AI, then get bin-level disposal guidance.",
      },
      { property: "og:title", content: "AI Waste Scanner — GreenPulse" },
      { property: "og:description", content: "Classify waste in 1.2s and find the nearest bin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScannerPage,
});

type Phase = "idle" | "analyzing" | "result";

function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"info" | "bin">("info");
  const [phase, setPhase] = useState<Phase>("idle");
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (phase !== "analyzing") return;
    const t = setTimeout(() => setPhase("result"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  const shareScan = async () => {
    const text = `GreenPulse scan: ${scanResult.item} is ${scanResult.category.toLowerCase()} (${scanResult.confidence}% confidence).`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "GreenPulse scan result", text });
        toast.success("Scan result shared.");
        return;
      }
      await navigator.clipboard?.writeText(text);
      toast.success("Scan result copied to your clipboard.");
    } catch {
      toast.info("Sharing was cancelled.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-dark">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${cameraOn ? "" : "hidden"}`}
      />
      {!cameraOn && <div className="absolute inset-0 hero-gradient" />}
      <div className="absolute inset-0 bg-[oklch(0.21_0.04_265/0.45)]" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 pb-32 pt-6">
        <p className="text-center text-sm font-semibold text-primary-foreground">
          AI Waste Scanner
        </p>
        <p className="mt-1 text-center text-xs text-primary-foreground/70">
          {cameraOn ? "Camera live" : "Camera preview unavailable — demo frame"}
        </p>

        <div className="mt-10 flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-64">
            <span className="absolute left-0 top-0 size-10 rounded-tl-lg border-l-[3px] border-t-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute right-0 top-0 size-10 rounded-tr-lg border-r-[3px] border-t-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute bottom-0 left-0 size-10 rounded-bl-lg border-b-[3px] border-l-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute bottom-0 right-0 size-10 rounded-br-lg border-b-[3px] border-r-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="scan-line absolute inset-x-2 h-0.5" />
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setMode("info")}
            className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
              mode === "info"
                ? "bg-card text-foreground"
                : "bg-[oklch(1_0_0/0.15)] text-primary-foreground"
            }`}
          >
            ℹ️ Info Mode
          </button>
          <button
            onClick={() => setMode("bin")}
            className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
              mode === "bin"
                ? "bg-card text-foreground"
                : "bg-[oklch(1_0_0/0.15)] text-primary-foreground"
            }`}
          >
            🎯 Smart Bin Mode
          </button>
        </div>

        <div className="flex justify-center">
          <button
            aria-label="Capture"
            onClick={() => setPhase("analyzing")}
            className="size-16 rounded-full bg-primary ring-4 ring-[oklch(1_0_0/0.9)] transition active:scale-95"
          />
        </div>
      </div>

      {phase !== "idle" && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[80vh] max-w-md animate-[gp-sheet_320ms_ease-out] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-6 pb-24">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
          {phase === "analyzing" ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold">Analyzing…</p>
              <div className="mt-4 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2.5 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold">
                {scanResult.emoji} {scanResult.item}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  ♻️ {scanResult.category}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {scanResult.confidence}% confidence
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                  0 Pts (Educational Scan)
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-info/30 bg-info/10 p-4">
                <p className="text-sm font-medium text-foreground">{scanResult.advice}</p>
                <p className="mt-2 border-t border-info/20 pt-2 text-xs text-muted-foreground">
                  💡 <strong>Disposal Guidance:</strong> Scanning educates on proper sorting. To earn reward points, dispose at a Digital Smart Bin or complete Eco-Challenges!
                </p>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Nearby bins
              </p>
              <ul className="mt-2 space-y-2">
                {nearbyBins.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="size-4 text-primary" /> Bin #{b.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {b.distance} away · {b.type}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Tips
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {scanResult.tips.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPhase("idle")}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition active:scale-[0.97]"
                >
                  <RotateCcw className="size-4" /> Scan Again
                </button>
                <button
                  onClick={() => void shareScan()}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold transition active:scale-[0.97]"
                >
                  <Share2 className="size-4" /> Share
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <CitizenBottomNav />
    </div>
  );
}
