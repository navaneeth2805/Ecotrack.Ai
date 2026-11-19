import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Droplets, Flame, Wind, Waves, MapPin } from "lucide-react";
import { riskWidgets } from "@/lib/mock";

export const Route = createFileRoute("/app/risk")({ component: Risk });

const icons: Record<string, any> = { "Flood Risk": Waves, "Heatwave Risk": Flame, "Air Pollution Index": Wind, "Water Scarcity": Droplets };

const hotspots = [
  { city: "Mumbai", aqi: 168, top: "32%", left: "62%" },
  { city: "São Paulo", aqi: 84, top: "60%", left: "32%" },
  { city: "London", aqi: 47, top: "26%", left: "46%" },
  { city: "Beijing", aqi: 192, top: "30%", left: "74%" },
  { city: "Los Angeles", aqi: 124, top: "38%", left: "14%" },
  { city: "Lagos", aqi: 96, top: "50%", left: "48%" },
];

function Risk() {
  return (
    <AppShell title="Climate Risk Center" subtitle="Real-time environmental risks for your region">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {riskWidgets.map((w) => {
          const Icon = icons[w.name] || AlertTriangle;
          return (
            <Card key={w.name} className="glass p-5">
              <div className="flex items-center justify-between"><span className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `${w.color}30` }}><Icon className="h-5 w-5" style={{ color: w.color }} /></span><Badge variant="outline">{w.level}</Badge></div>
              <div className="mt-3 text-xs uppercase text-muted-foreground tracking-wider">{w.name}</div>
              <div className="font-display text-3xl font-bold mt-1">{w.value}</div>
              <Progress value={Math.min(100, w.value)} className="mt-2 h-1.5" />
            </Card>
          );
        })}
      </div>

      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Global risk map</h3><Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">Live</Badge></div>
        <div className="relative aspect-[2/1] rounded-xl overflow-hidden grid-bg border border-white/5 bg-gradient-to-br from-secondary/10 to-primary/5">
          {/* simplified world silhouette */}
          <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <path d="M5 25 Q15 15 25 22 T45 20 T70 18 T95 25 L95 35 Q70 38 50 36 T25 38 T5 35 Z" fill="#00C853" />
          </svg>
          {hotspots.map(h => (
            <div key={h.city} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: h.top, left: h.left }}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: h.aqi > 150 ? "#EF5350" : h.aqi > 100 ? "#FFCA28" : "#00C853", opacity: 0.4 }} />
                <div className="relative h-3 w-3 rounded-full" style={{ background: h.aqi > 150 ? "#EF5350" : h.aqi > 100 ? "#FFCA28" : "#00C853" }} />
              </div>
              <div className="mt-1 text-[10px] font-mono whitespace-nowrap glass px-1.5 py-0.5 rounded">{h.city} · {h.aqi}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card className="glass p-6"><h3 className="font-display font-semibold">Local alerts</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3 p-3 rounded-lg glass"><Flame className="h-5 w-5 text-orange-400 shrink-0" /><div><div className="font-semibold">Heatwave watch</div><div className="text-muted-foreground text-xs">Temperatures expected to exceed 40°C through Friday.</div></div></li>
            <li className="flex gap-3 p-3 rounded-lg glass"><Wind className="h-5 w-5 text-red-400 shrink-0" /><div><div className="font-semibold">AQI alert</div><div className="text-muted-foreground text-xs">Sensitive groups should limit outdoor activity today.</div></div></li>
          </ul>
        </Card>
        <Card className="glass p-6"><h3 className="font-display font-semibold">Adaptation tips</h3>
          <ul className="mt-3 space-y-2 text-sm list-disc pl-5 text-muted-foreground">
            <li>Stay hydrated and limit afternoon exposure.</li>
            <li>Use HEPA air purifiers indoors when AQI &gt; 150.</li>
            <li>Pre-cool your home in early morning to reduce AC peaks.</li>
            <li>Sign up for local flood early-warning systems.</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
