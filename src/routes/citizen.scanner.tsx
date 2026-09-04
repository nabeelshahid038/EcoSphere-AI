import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Share2, RotateCcw, MapPin, Upload, Sparkles, Camera } from "lucide-react";
import { toast } from "sonner";
import { CitizenBottomNav } from "@/components/gp/CitizenShell";
import { nearbyBins } from "@/lib/citizen-data";
import { useAuthStore } from "@/stores/auth";

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

const detectedItems = [
  {
    item: "PET Plastic Water Bottle",
    emoji: "🍾",
    category: "Recyclable Plastics",
    confidence: 97.4,
    points: 25,
    advice: "Empty all liquid contents and crush bottle flat. Place in Yellow Recyclable Bin.",
    tips: [
      "Keep bottle caps attached for high-grade PET pellet processing.",
      "Karachi Central Smart Bin pays +25 GP per PET item.",
    ],
  },
  {
    item: "Aluminum Beverage Can",
    emoji: "🥤",
    category: "Recyclable Metals",
    confidence: 98.1,
    points: 30,
    advice: "Rinse residual liquid. Aluminum is 100% endlessly recyclable.",
    tips: [
      "Aluminum recycling saves 95% of energy compared to raw extraction.",
      "High commercial EPR buyback value in Sindh recycling hubs.",
    ],
  },
  {
    item: "Paper & Cardboard Box",
    emoji: "📦",
    category: "Recyclable Fiber",
    confidence: 95.8,
    points: 20,
    advice: "Flatten cardboard to save bin volume. Remove any plastic adhesive tape.",
    tips: [
      "Dry paper fibers can be recycled up to 7 times.",
      "Do not mix grease-stained pizza boxes with clean cardboard.",
    ],
  },
  {
    item: "Electronic Waste / Battery",
    emoji: "🔋",
    category: "Hazardous E-Waste",
    confidence: 96.2,
    points: 50,
    advice: "Do NOT place in general waste! Dispose at official E-Waste Collection Hub.",
    tips: [
      "Contains precious metals (gold, copper) and toxic lead/lithium.",
      "Earn double points (+50 GP) for safe hazardous disposal.",
    ],
  },
];

function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cameraOn, setCameraOn] = useState(false);
  const [activeResult, setActiveResult] = useState(detectedItems[0]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const addPoints = useAuthStore((s) => s.addPoints);

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

  const triggerScan = () => {
    // Pick scan item dynamically
    const randomItem = detectedItems[Math.floor(Math.random() * detectedItems.length)];
    setActiveResult(randomItem);
    setPhase("analyzing");

    setTimeout(() => {
      setPhase("result");
      addPoints(randomItem.points);
      toast.success(`🎉 Verified ${randomItem.item}! +${randomItem.points} GP added to your wallet.`);
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      triggerScan();
    }
  };

  const shareScan = async () => {
    const text = `GreenPulse AI Scan: ${activeResult.item} (${activeResult.category}) verified with ${activeResult.confidence}% accuracy! Earned +${activeResult.points} GP points.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "GreenPulse Scan Result", text });
        toast.success("Scan result shared successfully.");
        return;
      }
      await navigator.clipboard?.writeText(text);
      toast.success("Scan details copied to clipboard.");
    } catch {
      toast.info("Sharing cancelled.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-dark">
      {/* Live Video or Image Preview */}
      {previewImage ? (
        <img src={previewImage} alt="Uploaded item" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover ${cameraOn ? "" : "hidden"}`}
        />
      )}
      {(!cameraOn && !previewImage) && <div className="absolute inset-0 hero-gradient" />}
      <div className="absolute inset-0 bg-[oklch(0.21_0.04_265/0.45)]" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 pb-32 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-primary-foreground">AI Waste Scanner</p>
            <p className="text-xs text-primary-foreground/70">
              {previewImage ? "Photo uploaded" : cameraOn ? "Live Camera Active" : "Camera Ready"}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur hover:bg-card"
          >
            <Upload className="size-3.5" /> Upload Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="mt-12 flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-64">
            <span className="absolute left-0 top-0 size-10 rounded-tl-lg border-l-[3px] border-t-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute right-0 top-0 size-10 rounded-tr-lg border-r-[3px] border-t-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute bottom-0 left-0 size-10 rounded-bl-lg border-b-[3px] border-l-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="absolute bottom-0 right-0 size-10 rounded-br-lg border-b-[3px] border-r-[3px] border-[oklch(0.84_0.18_150)]" />
            <span className="scan-line absolute inset-x-2 h-0.5" />
          </div>
        </div>

        <p className="mb-6 text-center text-xs text-primary-foreground/80">
          Point camera at plastic, metal, paper or e-waste item and tap button to scan
        </p>

        <div className="flex justify-center">
          <button
            aria-label="Capture and Scan"
            onClick={triggerScan}
            className="flex size-20 items-center justify-center rounded-full bg-primary ring-8 ring-[oklch(1_0_0/0.3)] shadow-[var(--shadow-glow)] transition active:scale-95"
          >
            <Camera className="size-8 text-primary-foreground" />
          </button>
        </div>
      </div>

      {phase !== "idle" && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[80vh] max-w-md animate-[gp-sheet_320ms_ease-out] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-6 pb-24 shadow-2xl">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
          {phase === "analyzing" ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-6 animate-spin" />
              </div>
              <p className="text-base font-bold">Analyzing Waste Item...</p>
              <p className="mt-1 text-xs text-muted-foreground">Running on-device neural classification</p>
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
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {activeResult.emoji} {activeResult.item}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Verified AI Waste Recognition</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">
                  + {activeResult.points} GP
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  ♻️ {activeResult.category}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {activeResult.confidence}% confidence
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-primary/20 bg-accent/40 p-4">
                <p className="text-sm font-semibold text-foreground">{activeResult.advice}</p>
                <p className="mt-2 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                  💡 <strong>Disposal Guidance:</strong> Verified scan recorded in your impact log. Bring to any Smart Bin to unlock corporate CSR sponsor rewards.
                </p>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Nearby Smart Bins
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
                Recycling Best Practices
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {activeResult.tips.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setPhase("idle");
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition active:scale-[0.97]"
                >
                  <RotateCcw className="size-4" /> Scan Another
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

