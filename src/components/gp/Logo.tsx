import { Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
        <Globe className="size-4 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          "text-[17px] font-bold tracking-tight",
          inverted ? "text-primary-foreground" : "text-foreground",
        )}
      >
        Eco<span className="text-primary font-extrabold">Sphere</span>
      </span>
    </Link>
  );
}

