import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Leaf, ShieldCheck, TrendingDown, Users } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col justify-between p-12 grid-bg overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative"><Logo size="lg" /></div>
        <div className="relative space-y-6 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Join 92,000+ people <span className="gradient-text">measurably greener</span>.
          </h2>
          <div className="space-y-3">
            {[
              { icon: Leaf, t: "Track every kg of CO₂ across your life" },
              { icon: TrendingDown, t: "Reduce your footprint 20–40% in months" },
              { icon: Users, t: "Compete in green challenges with your community" },
              { icon: ShieldCheck, t: "Bank-grade privacy. Your data is yours." },
            ].map((b) => (
              <div key={b.t} className="flex items-start gap-3 text-sm">
                <span className="h-8 w-8 rounded-lg grid place-items-center gradient-bg shrink-0"><b.icon className="h-4 w-4 text-primary-foreground" /></span>
                <span className="pt-1.5">{b.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} EcoTrack AI</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md"><div className="lg:hidden mb-6"><Logo /></div><Outlet /></div>
      </div>
    </div>
  );
}
