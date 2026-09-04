import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/gp/Logo";
import { DemoModeDialog } from "@/components/gp/DemoMode";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo Mode — Explore GreenPulse as any stakeholder" },
      {
        name: "description",
        content:
          "Switch between citizen, NGO, corporate and municipal views of GreenPulse using the Karachi pilot dataset.",
      },
      { property: "og:title", content: "GreenPulse Demo Mode" },
      {
        property: "og:description",
        content: "Explore every GreenPulse role with realistic Karachi pilot data.",
      },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const [open, setOpen] = useState(true);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-5 text-center">
      <Logo />
      <div>
        <h1 className="text-3xl font-bold">Demo Mode</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Pick a stakeholder to load the Karachi Plastic Recovery pilot dataset and jump straight
          into their workspace.
        </p>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.97]"
      >
        Choose a role
      </button>
      <DemoModeDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}
