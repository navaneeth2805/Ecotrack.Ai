import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const ic = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <Link to="/" className="flex items-center gap-2 font-display font-bold">
      <span className={`${ic} grid place-items-center rounded-lg gradient-bg glow shrink-0`}>
        <Leaf className="h-3/5 w-3/5 text-primary-foreground" />
      </span>
      <span className={`${s} tracking-tight`}>
        EcoTrack <span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}
